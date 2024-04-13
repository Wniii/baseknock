import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { firestore } from './firebase';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { Box, Button, Card, CardHeader, List, ListItem, ListItemAvatar, ListItemText, Grid, Typography, Container } from '@mui/material';
import { useRouter } from 'next/router';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const ALLPlayerPage = () => {
  const router = useRouter();

  const [players, setPlayers] = useState({});
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const { timestamp } = router.query;

  useEffect(() => {
    const fetchTeamGames = async () => {
      try {
        const teamCollection = collection(firestore, 'team');
        const teamSnapshot = await getDocs(teamCollection);

        for (const doc of teamSnapshot.docs) {
          const teamData = doc.data();

          if (teamData.games && teamData.games[timestamp]) {
            setPlayers(teamData.players || {});
            return;
          }
        }
      } catch (error) {
        console.error('Error fetching team games:', error);
      }
    };

    fetchTeamGames();
  }, [timestamp]);

  const handleAddToSelectedPlayers = (playerKey) => {
    const updatedPlayers = { ...players };
    delete updatedPlayers[playerKey];
    setPlayers(updatedPlayers);

    setSelectedPlayers([...selectedPlayers, playerKey]);
  };

  const handleRemoveFromSelectedPlayers = (playerKey) => {
    const updatedSelectedPlayers = selectedPlayers.filter((selectedPlayer) => selectedPlayer !== playerKey);
    setSelectedPlayers(updatedSelectedPlayers);

    const updatedPlayers = { ...players, [playerKey]: true };
    setPlayers(updatedPlayers);
  };

  const handleReturnClick = () => {
    router.push('/your-other-page');
  };

  const handleSaveAndNavigate = async (teamId) => {
    console.log('handleSaveAndNavigate function called'); // 检查函数是否被调用

    try {
        const timestamp = router.query.timestamp;
        console.log('timestamp', timestamp); // 检查时间戳是否正确获取

        // 获取 teams 集合中指定团队的 games 子集合的引用
        const gamesCollectionRef = collection(firestore, 'team','4DllBDaCXJOxbZRaRPCM', 'games');
        console.log('gamesCollectionRef', gamesCollectionRef); // 检查 gamesCollectionRef 是否正确创建

        // 获取 games 子集合中的所有文档
        const querySnapshot = await getDocs(gamesCollectionRef);
        console.log('querySnapshot', querySnapshot); // 检查获取的文档快照

        const promises = [];

        querySnapshot.forEach((doc) => {
            const gameId = doc.id;
            console.log('gameId', gameId); // 检查获取的游戏ID

            // 检查当前文档的ID是否与给定的时间戳相匹配
            if (gameId === timestamp) {
                const updatedAttackList = [...selectedPlayers];
                console.log('updatedAttackList', updatedAttackList); // 检查更新后的攻击列表

                // 设置文档中的攻击列表
                const promise = setDoc(doc.ref, { attacklist: updatedAttackList });
                promises.push(promise);
                navigatetodefence(gameId);
            }
        });

        // 等待所有更新操作完成
        // 清空选定的球员列表
        setSelectedPlayers([]);
    } catch (error) {
        console.error('Error adding selected players to game document:', error);
    }
};
const navigatetodefence = (gameId) => {
  router.push({
    pathname: "/DefencePlacePage",
    query: { gameId: gameId },
  });
};


  
  // 在需要的地方调用函数并传递团队文档的名称
  
  
  

  return (
    <>
      <Head>
        <title>大專棒球隊 | Devias Kit | Attack Place</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <div style={{ textAlign: 'center' }}>
            <Typography variant="h4" mb={4}>
              攻擊位
            </Typography>
          </div>
          <Grid container spacing={3} justifyContent="center">
            {/* 左侧所有球员列表 */}
            <Grid item xs={4}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardHeader title="所有球员" />
                <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
                  <List>
                    {Object.keys(players).map((playerKey) => (
                      <ListItem
                        key={playerKey}
                        divider
                        button
                        onClick={() => handleAddToSelectedPlayers(playerKey)}
                      >
                        <ListItemAvatar>
                          <Box
                            component="img"
                            src={players[playerKey].image}
                            sx={{
                              borderRadius: 1,
                              height: 48,
                              width: 48
                            }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={`Name: ${playerKey}`}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </div>
              </Card>
            </Grid>

            {/* 中间的按钮 */}
            <Grid item xs={12} md={6} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ marginBottom: '10px' }}>
                <Button variant="contained" color="primary" style={{ width: '200px', height: '50px' }}>
                  自動填滿
                </Button>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ width: '200px', height: '50px' }}
                  onClick={() => setSelectedPlayers([])} // Clear selected players
                >
                  清除先发
                </Button>
              </div>
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleReturnClick}
                  style={{ marginRight: '8px', width: '100px', height: '50px' }}
                >
                  返回
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    handleSaveAndNavigate();
                    navigatetodefence();
                  }}
                  style={{ width: '100px', height: '50px' }}
                >
                  储存
                </Button>

              </div>
            </Grid>

            {/* 右侧先发球员列表 */}
            <Grid item xs={4}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardHeader title="先发球员" />
                <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
                  <List>
                    {selectedPlayers.map((playerKey) => (
                      <ListItem key={playerKey} divider button onClick={() => handleRemoveFromSelectedPlayers(playerKey)}>
                        <ListItemAvatar>
                          <Box
                            component="img"
                            src=''
                            sx={{
                              borderRadius: 1,
                              height: 48,
                              width: 48
                            }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={`Name: ${playerKey}`}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </div>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

ALLPlayerPage.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default ALLPlayerPage;
