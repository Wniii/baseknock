import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { collection, doc, getDoc, getDocs, query, where, updateDoc,setDoc } from 'firebase/firestore';
import { Box, Grid, Card, CardHeader, List, ListItem, ListItemAvatar, ListItemText, Typography, Container, Button, Paper } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { firestore } from './firebase';

const DefencePlacePage = () => {
  const router = useRouter();
  const [gameId, setGameID] = useState(null);
  const [attackList, setAttackList] = useState([]);
  const [playerKeys, setPlayerKeys] = useState([]);
  const [players, setPlayers] = useState({});
  const [defencePlayers, setDefencePlayers] = useState([]);
  const [originalPlayerIndexes, setOriginalPlayerIndexes] = useState({});
  const [initialIndexes, setInitialIndexes] = useState({});
  const [showPlayerList, setShowPlayerList] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const { codeName } = router.query;
  const { teamId } = router.query;
  const { hcodeName } = router.query;
  const { timestamp } = router.query;

  const [positions, setPositions] = useState({
    1: null, 2: null, 3: null,
    4: null, 5: null, 6: null,
    7: null, 8: null, 9: null
  });  
  const positionNames = {
    1: "P", 2: "C", 3: "1B",
    4: "2B", 5: "3B", 6: "SS",
    7: "LF", 8: "CF", 9: "RF"
  };
  
  useEffect(() => {
    const { query } = router;
    if (query && query.gameId) {
      setGameID(query.gameId);
    }
  }, [router.query.gameId]);

  useEffect(() => {
    const fetchAttackList = async () => {
        try {
            if (!gameId || !codeName) {
                console.log('gameId 或 codeName 不存在');
                return;
            }
            console.log("codeName",codeName)
            console.log("gameId",gameId)
            const teamsCollectionRef = collection(firestore, 'team');
            const querySnapshot = await getDocs(query(teamsCollectionRef, where('codeName', '==', hcodeName)));

            if (!querySnapshot.empty) {
                // 获取第一个匹配到的文档（假设每个 codeName 只对应一个文档）
                const teamDocSnapshot = querySnapshot.docs[0];
                console.log('团队文档存在', teamDocSnapshot.id);

                // 获取游戏文档的引用
                const gamesCollectionRef = collection(teamDocSnapshot.ref, 'games');
                const gameDocRef = doc(gamesCollectionRef, gameId);
                const gameDocSnapshot = await getDoc(gameDocRef);

                if (gameDocSnapshot.exists()) {
                    console.log('游戏文档存在');

                    const gameData = gameDocSnapshot.data();
                    const attackList = gameData.attacklist;
                    setAttackList(attackList);

                    if (teamDocSnapshot.exists()) {
                        console.log('团队文档存在');

                        const teamData = teamDocSnapshot.data();
                        const playersField = teamData.players;

                        if (playersField && typeof playersField === 'object') {
                            console.log('players 字段是对象');

                            const playerKeysInAttackList = attackList.filter(playerId => playerId in playersField);
                            setPlayerKeys(playerKeysInAttackList);

                            const playersData = {};
                            playerKeysInAttackList.forEach(playerId => {
                                playersData[playerId] = playersField[playerId];
                            });
                            setPlayers(playersData);

                            console.log('设置玩家数据');

                            const originalIndexes = {};
                            playerKeysInAttackList.forEach((playerId, index) => {
                                originalIndexes[playerId] = index;
                            });
                            setOriginalPlayerIndexes(originalIndexes);

                            console.log('设置初始索引');

                            const initialIndexesData = {};
                            playerKeysInAttackList.forEach((playerId, index) => {
                                initialIndexesData[playerId] = index + 1;
                            });
                            setInitialIndexes(initialIndexesData);

                            console.log('完成设置');
                        } else {
                            console.log('团队文档中的players字段不是对象');
                        }
                    } else {
                        console.log('团队文档不存在');
                    }
                } else {
                    console.log('游戏文档不存在');
                }
            } else {
                console.log('找不到匹配的团队文档');
            }
        } catch (error) {
            console.error('Error fetching game data:', error);
        }
    };

    console.log('触发 useEffect');
    fetchAttackList();
}, [gameId, codeName]);



  const handlePositionClick = (position) => {
    setSelectedPosition(position);
  };
  
  const handleClosePopup = () => {
    setSelectedPosition(null);
  };
  const handleBackgroundClick = () => {
    setSelectedPosition(null);
  };

  const assignPlayerToPosition = (playerKey) => {
    // Check if the player is already assigned to another position
    const assignedPosition = Object.keys(positions).find(pos => positions[pos] === playerKey);
    if (assignedPosition) {
      setPositions(prevPositions => ({
        ...prevPositions,
        [assignedPosition]: null // Clear the position previously assigned to the player
      }));
    }
    setPositions(prevPositions => ({
      ...prevPositions,
      [selectedPosition]: playerKey
    }));
    setSelectedPosition(null);
  };


  const addPositionToGame = async (teamCollectionRef, codeName, timestamp, positionData) => {
    console.log('Adding position data to game for codeName:', codeName);

    try {
        // 获取团队文档数据
        const teamsQuerySnapshot = await getDocs(teamCollectionRef);

        // 遍历团队文档
        for (const teamDoc of teamsQuerySnapshot.docs) {
            const teamData = teamDoc.data();
            console.log("Team data:", teamData);

            // 检查团队文档中的 codeName 字段是否与传入的 codeName 值匹配
            if (teamData.codeName === codeName) {
                console.log("CodeName matches:", codeName);

                // 创建游戏文档的引用
                const gameDocRef = doc(teamDoc.ref, "games", timestamp);
                console.log("Game document reference:", gameDocRef);

                // 获取游戏文档快照
                const gameDocSnapshot = await getDoc(gameDocRef);

                // 根据位置名称构建包含玩家键名的对象
                const positionDataWithKeys = {};
                Object.entries(positionData).forEach(([positionNumber, playerId]) => {
                    const positionName = positionNames[positionNumber] || 'Unknown Position';
                    positionDataWithKeys[positionName] = playerId;
                });

                // 添加守备位置数据到游戏文档
                if (gameDocSnapshot.exists()) {
                    console.log("Game document found with ID:", timestamp);
                    console.log("Game data:", gameDocSnapshot.data());

                    // 更新游戏文档，保留其他字段的值
                    await updateDoc(gameDocRef, { position: positionDataWithKeys }, { merge: true });
                } else {
                    console.log("No matching game document found with ID:", timestamp);
                    // 创建游戏文档并添加守备位置数据，保留其他字段的值
                    await setDoc(gameDocRef, { position: positionDataWithKeys }, { merge: true });
                }
            } else {
                console.log("CodeName does not match:", teamData.codeName);
            }
        }
    } catch (error) {
        console.error('Error adding position data to game:', error);
    }
};


const handleSaveAndNavigate = async () => {
  console.log('handleSaveAndNavigate function called');

  try {
    
      console.log('timestamp:', timestamp);
      console.log('codeName:', codeName);

      // 获取所有团队文档的引用
      const teamsCollectionRef = collection(firestore, "team");
      console.log("Teams collection reference:", teamsCollectionRef);

      // 同时在 codeName 和 hcodeName 相匹配的团队集合中添加守备位置数据到游戏子集合
      await Promise.all([
          addPositionToGame(teamsCollectionRef, codeName, timestamp, positions),
          addPositionToGame(teamsCollectionRef, hcodeName, timestamp, positions)
      ]);
     
      // 导航到防守页面
      navigateschedule(timestamp, codeName);
      console.log('Navigated to defence');

      // 清空选定的球员列表
      console.log('Selected players cleared');
  } catch (error) {
      console.error('Error updating game document or navigating to defence:', error);
  }
};


const navigateschedule = (gameId, codeName) => {
  console.log("adadad", codeName);
  router.push({
    pathname: "/schedule",
  });
};

  
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" mb={4} textAlign="center">
        守備位置
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
        <div
            style={{
            position: 'relative',
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
              <div style={{ position: 'absolute', left: 'calc(45% - 32%)', top: 0 }}> {/* 使用left属性调整左偏移量 */}

            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Baseball_positions.svg/600px-Baseball_positions.svg.png"
              alt="baseball_positions"
              style={{ width: '100%' }} // 设置图像的宽度为50%
            />
            {Object.keys(positions).map(pos => (
              <div
                key={pos}
                style={{
                  position: 'absolute',
                  top: `${getPositionTop(pos)}%`,
                  left: `${getPositionLeft(pos)}%`,
                  transform: 'translate(-50%, -50%)',
                  margin: 'auto', // 让图片水平和垂直居中
                  width: '10%',
                  height: '10%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: positions[pos] ? 999 : 'auto',
                  backgroundColor: positions[pos] ? '#3f51b5' : 'rgba(255, 255, 255, 0.5)',
                }}
                onClick={() => handlePositionClick(pos)}
              >
                <div
                  style={{
                    border: `2px solid ${positions[pos] ? '#ffffff' : 'transparent'}`,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: positions[pos] ? '#ffffff' : 'inherit',
                    cursor: positions[pos] ? 'pointer' : 'default',
                    position: 'relative'
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Typography variant="h6">{positionNames[pos]}</Typography>
                    <Typography variant="body1">{positions[pos] || 'Empty'}</Typography>
                  </div>
                </div>
              </div>
              
            ))}
          </div>
          </div>
          {selectedPosition && (
            <div className="popup"
            onClick={handleBackgroundClick}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 9998,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Paper elevation={3} sx={{ p: 2, position: 'relative' }}>
                <Typography variant="h6">{positionNames[selectedPosition]}</Typography>
                <Typography variant="body1">{positions[selectedPosition] || 'Empty'}</Typography>
                <Button onClick={handleClosePopup} sx={{ position: 'absolute', top: 0, right: 0 }}>Close</Button>
                <List>
                  {playerKeys.map(playerKey => (
                    <ListItem 
                      key={playerKey} 
                      divider 
                      onClick={() => assignPlayerToPosition(playerKey)}
                      style={{ 
                        backgroundColor: 
                        Object.values(positions).includes(playerKey) ? '#3f51b5' : 'transparent',
                      borderRadius: '16px', // 圓角化
                      color: Object.values(positions).includes(playerKey) ? '#ffffff' : 'inherit' // 已選球員文字顏色設置為白色

                      }}
                    >
                      {/* <ListItemAvatar>
                        <Box component="img" src={players[playerKey]?.image} sx={{ borderRadius: 1, height: 48, width: 48 }} />
                      </ListItemAvatar> */}
                      <ListItemText primary={`${playerKey}`} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </div>
          )}
        </Grid>
      </Grid>
      <Grid container justifyContent="center" style={{ marginTop: '10px' }}>
    <Button
      onClick={handleSaveAndNavigate}
      variant="contained"
      color="primary"
      sx={{
        display: 'block',
        margin: '0 auto' // 设置左右外边距为auto，实现水平居中
      }}
    >
      儲存守備位置
    </Button>
  </Grid>
    </Container>
  );
}

DefencePlacePage.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default DefencePlacePage;

// 计算位置的左侧距离
const getPositionLeft = (pos) => {
  switch (pos) {
    case '1':
      return 50;
    case '2':
      return 50;
    case '3':
      return 70;
    case '4':
      return 63;
    case '5':
      return 30;
    case '6':
      return 37;
    case '7':
      return 15;
    case '8':
      return 50;
    case '9':
      return 85;
    default:
      return 0;
  }
};

// 计算位置的顶部距离
const getPositionTop = (pos) => {
  switch (pos) {
    case '1':
      return 70;
    case '2':
      return 93;
    case '3':
      return 67;
    case '4':
      return 48;
    case '5':
      return 66;
    case '6':
      return 48;
    case '7':
      return 28;
    case '8':
      return 15;
    case '9':
      return 28;
    default:
      return 0;
  }
};

