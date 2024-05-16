import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { collection, doc, getDoc, getDocs, query, where, updateDoc, setDoc } from 'firebase/firestore';
import { Box, Grid, Card, CardHeader, List, ListItem, ListItemAvatar, ListItemText, Typography, Container, Button, Paper } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { firestore } from 'src/firebase';
import CloseIcon from '@mui/icons-material/Close';


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
  const [pitcherKeys, setpitcherKeys] = useState([]);
  const [showPitchers, setShowPitchers] = useState(false);

  console.log("c", pitcherKeys)
  const { codeName } = router.query;
  const { teamId } = router.query;
  const { hcodeName } = router.query;
  const { timestamp } = router.query;

  const [positions, setPositions] = useState({
    1: null
  });
  const positionNames = {
    1: "P"
  };

  useEffect(() => {
    const { query } = router;
    if (query && query.gameId) {
      setGameID(query.gameId);
    }
  }, [router.query.gameId]);

  useEffect(() => {
    const fetchGameDataAndPlayers = async () => {
      if (!gameId || !codeName) {
        console.log('gameId 或 codeName 不存在');
        return;
      }

      try {
        const teamsCollectionRef = collection(firestore, 'team');
        const querySnapshot = await getDocs(query(teamsCollectionRef, where('codeName', '==', hcodeName)));

        if (!querySnapshot.empty) {
          const teamDocSnapshot = querySnapshot.docs[0];

          if (teamDocSnapshot.exists()) {
            const teamData = teamDocSnapshot.data();
            const playersField = teamData.players;

            if (playersField && typeof playersField === 'object') {
              console.log('players 字段是对象');

              // Fetch the game document
              const gamesCollectionRef = collection(teamDocSnapshot.ref, 'games');
              const gameDocRef = doc(gamesCollectionRef, gameId);
              const gameDocSnapshot = await getDoc(gameDocRef);

              if (gameDocSnapshot.exists()) {
                console.log('游戏文档存在');
                const gameData = gameDocSnapshot.data();
                let attackList = gameData.attacklist || [];
                setAttackList(attackList);

                // Filter players who are in the attack list
                const playerKeysInAttackList = attackList.filter(playerId => playerId in playersField);
                setPlayerKeys(playerKeysInAttackList);

                // Map players data and indices
                const playersData = {};
                const originalIndexes = {};
                const initialIndexesData = {};
                playerKeysInAttackList.forEach((playerId, index) => {
                  playersData[playerId] = playersField[playerId];
                  originalIndexes[playerId] = index;
                  initialIndexesData[playerId] = index + 1;
                });

                setPlayers(playersData);
                setOriginalPlayerIndexes(originalIndexes);
                setInitialIndexes(initialIndexesData);
                console.log('设置玩家数据');

                // Fetch pitcher keys
                const pitcherKeys = Object.keys(playersField).filter(key => {
                  // 检查球员的位置是否是 'P'，并且该球员不在 attackList 中
                  return playersField[key].position === 'P' && !attackList.includes(key);
                });

                console.log('Pitcher keys:', pitcherKeys);

                setpitcherKeys(pitcherKeys);
                console.log('Pitcher keys:', pitcherKeys);
              } else {
                console.log('游戏文档不存在');
              }
            } else {
              console.log('团队文档中的players字段不是对象');
            }
          } else {
            console.log('团队文档不存在');
          }
        } else {
          console.log('找不到匹配的团队文档');
        }
      } catch (error) {
        console.error('Error fetching game data:', error);
      }
    };

    console.log('触发 useEffect');
    fetchGameDataAndPlayers();
  }, [gameId, codeName]);




  const handlePositionClick = (position) => {
    setSelectedPosition(position);
    setShowPitchers(positionNames[position] === 'P'); // 當選擇的位置是投手時，showPitchers為true
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
    
    const isEveryPositionFilled = Object.values(positions).every(player => player !== null);

   

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
    <Container maxWidth="xl" style={{ overflow: 'hidden'}}>
      <Typography variant="h4" mb={4} textAlign="center">
        守備位置
      </Typography>
      <Grid container spacing={3} style={{ alignItems: 'center', marginLeft: '40px' }}>
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
            <div style={{ position: 'absolute', left: 'calc(45% - 32%)', top: 0 }}>

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
                <Button onClick={handleClosePopup} sx={{ position: 'absolute', top: 0, right: 0 }}><CloseIcon /></Button>
                <List>
                  {(selectedPosition === '1' ? pitcherKeys : playerKeys).map(key => (
                    <ListItem
                      key={key}
                      divider
                      onClick={() => assignPlayerToPosition(key)}
                      style={{
                        backgroundColor: Object.values(positions).includes(key) ? '#3f51b5' : 'transparent',
                        borderRadius: '16px', // 圓角化
                        color: Object.values(positions).includes(key) ? '#ffffff' : 'inherit' // 已選球員文字顏色設置為白色
                      }}
                    >
                      <ListItemText primary={`${players[key]?.name || key}`} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </div>
          )}

          {showPitchers && (
            <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
              <Typography variant="h6">投手列表</Typography>
              <List>
                {pitcherKeys.map(pitcherKey => (
                  <ListItem
                    key={pitcherKey}
                    divider
                    onClick={() => assignPlayerToPosition(pitcherKey)}
                  >
                    <ListItemText primary={`${players[pitcherKey]?.name || pitcherKey}`} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Grid>
      </Grid>
      <Grid container justifyContent="center" style={{ marginTop: '-230px' }}>
        <Button
          onClick={handleSaveAndNavigate}
          variant="contained"
          color="primary"
          sx={{
            display: 'block', // Ensure the button is a block element to center it
            margin: '0 auto' // Center the button horizontally
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
    
  }
};

// 计算位置的顶部距离
const getPositionTop = (pos) => {
  switch (pos) {
    case '1':
      return 70;
    
  }
};

