import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { collection, doc, getDoc,updateDoc } from 'firebase/firestore';
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
        if (!gameId || !codeName) return;

        const gamesCollectionRef = collection(firestore, 'team', codeName, 'games');
        const gameDocRef = doc(gamesCollectionRef, gameId);
        const gameDocSnapshot = await getDoc(gameDocRef);

        if (gameDocSnapshot.exists()) {
          const gameData = gameDocSnapshot.data();
          const attackList = gameData.attacklist;
          setAttackList(attackList);

          const teamDocRef = doc(firestore, 'team', codeName);
          const teamDocSnapshot = await getDoc(teamDocRef);

          if (teamDocSnapshot.exists()) {
            const teamData = teamDocSnapshot.data();
            const playersField = teamData.players;

            if (playersField && typeof playersField === 'object') {
              const playerKeysInAttackList = attackList.filter(playerId => playerId in playersField);
              setPlayerKeys(playerKeysInAttackList);

              const playersData = {};
              playerKeysInAttackList.forEach(playerId => {
                playersData[playerId] = playersField[playerId];
              });
              setPlayers(playersData);

              const originalIndexes = {};
              playerKeysInAttackList.forEach((playerId, index) => {
                originalIndexes[playerId] = index;
              });
              setOriginalPlayerIndexes(originalIndexes);
              const initialIndexesData = {};
              playerKeysInAttackList.forEach((playerId, index) => {
                initialIndexesData[playerId] = index + 1;
              });
              setInitialIndexes(initialIndexesData);
            } else {
              console.log('团队文档中的players字段不是对象');
            }
          } else {
            console.log('团队文档不存在');
          }
        } else {
          console.log('游戏文档不存在');
        }
      } catch (error) {
        console.error('Error fetching game data:', error);
      }
    };

    console.log('觸發 useEffect');
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
  const savePositionData = async () => {
    try {
        // 獲取團隊文檔的引用
        const teamDocRef = doc(firestore, 'team', '4DllBDaCXJOxbZRaRPCM');
        const teamDocSnapshot = await getDoc(teamDocRef);

        // 確認團隊文檔存在
        if (teamDocSnapshot.exists()) {
            const teamData = teamDocSnapshot.data();
            console.log('teamData:', teamData);

            // 檢查遊戲是否存在
            if (gameId in teamData.games) {
                console.log('找到與路由器傳遞的 gameId 相符的遊戲文檔');
                const gameIdFromRouter = gameId;

                // 獲取遊戲文檔的引用
                const gameIdDocRef = doc(firestore, 'team', '4DllBDaCXJOxbZRaRPCM', 'games', gameIdFromRouter);
                const gameIdDocSnapshot = await getDoc(gameIdDocRef);

                // 確認遊戲文檔存在
                if (gameIdDocSnapshot.exists()) {
                    // 初始化所有守備位置
                    const positionData = {};
                    Object.values(positionNames).forEach(positionName => {
                        positionData[positionName] = ''; // 初始值設為空
                    });

                    // 更新有玩家的守備位置
                    Object.entries(positions).forEach(([position, playerId]) => {
                        const positionName = positionNames[position] || 'Unknown Position';
                        if (playerId && playerId in players) {
                            const playerName = playerId || 'Unknown Player';
                            positionData[positionName] = playerName;
                        }
                    });

                    console.log('positionData:', positionData);

                    // 更新資料庫中的位置信息
                    await updateDoc(gameIdDocRef, { position: positionData });
                    console.log('位置信息已保存到資料庫');
                } else {
                    console.log('找不到與遊戲 ID 相對應的文檔');
                }
            } else {
                console.log('找不到與路由器傳遞的 gameId 相符的遊戲文檔');
            }
        } else {
            console.log('找不到團隊文檔');
        }
    } catch (error) {
        console.error('保存位置信息時出錯:', error);
    }
    console.log('無法保存位置信息，導航到 /schedule 頁面');
    router.push('/schedule');
};


  

  
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" mb={4} textAlign="center">
        防守位
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <div 
            style={{
              position: 'relative', 
              width: '100%', 
              paddingTop: '100%', 
              overflow: 'hidden'
            }}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Baseball_positions.svg/600px-Baseball_positions.svg.png"
              alt="baseball_positions"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            />
            {Object.keys(positions).map(pos => (
              <div
                key={pos}
                style={{
                  position: 'absolute',
                  top: `${getPositionTop(pos)}%`,
                  left: `${getPositionLeft(pos)}%`,
                  transform: 'translate(-50%, -50%)',
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
                      <ListItemAvatar>
                        <Box component="img" src={players[playerKey]?.image} sx={{ borderRadius: 1, height: 48, width: 48 }} />
                      </ListItemAvatar>
                      <ListItemText primary={`Name: ${playerKey}`} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </div>
          )}
        </Grid>
      </Grid>
      <Button onClick={savePositionData} variant="contained" color="primary">保存位置信息</Button>

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

