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
  const { codeName } = router.query;
  const { teamId } = router.query;

  useEffect(() => {
    const fetchTeamGames = async () => {
      try {
        const teamCollection = collection(firestore, 'team');
        const teamSnapshot = await getDocs(teamCollection);
  
        for (const doc of teamSnapshot.docs) {
          const teamData = doc.data();
  
          if (teamData.codeName === codeName && teamData.games && teamData.games[timestamp]) {
            setPlayers(teamData.players || {});
            return;
          }
        }
      } catch (error) {
        console.error('Error fetching team games:', error);
      }
    };
  
    fetchTeamGames();
  }, [codeName, timestamp]);
  

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
  console.log(codeName)
  const handleSaveAndNavigate = async (codeName) => {
    console.log('handleSaveAndNavigate function called');

    try {
        console.log('timestamp', timestamp);
        console.log('codeName',codeName)
        // 查找匹配的团队文档
        const teamCollection = collection(firestore, 'team');
        const querySnapshot = await getDocs(teamCollection);

        let gamesCollectionRef;

        for (const doc of querySnapshot.docs) {
            const teamData = doc.data();
          console.log('teamData.codeName',teamData.codeName)
            if (teamData.codeName === codeName) {
                console.log('Match found for codeName:', codeName);
                gamesCollectionRef = collection(doc.ref, 'games');
                // 找到匹配的团队后就停止遍歷
                break;
            }
        }

        if (!gamesCollectionRef) {
            console.error('No team found with codeName:', codeName);
            return;
        }

        console.log('gamesCollectionRef:', gamesCollectionRef);

        // 在這裡處理 timestamp 的文檔
        const promises = [];

        querySnapshot.forEach((doc) => {
            const gameId = doc.id;

            if (gameId === timestamp) {
                console.log('Match found for timestamp:', timestamp);
                const updatedAttackList = [...selectedPlayers];
                console.log('updatedAttackList:', updatedAttackList);
                const promise = setDoc(doc.ref, { attacklist: updatedAttackList });
                promises.push(promise);

                navigatetodefence(gameId, codeName);
            }
        });

        console.log('Promises:', promises);

        await Promise.all(promises);
        console.log('All promises resolved');

        navigatetodefence(timestamp, codeName);
        console.log('Navigated to defence');

        setSelectedPlayers([]);
        console.log('Selected players cleared');
    } catch (error) {
        console.error('Error adding selected players to game document:', error);
    }
};


  
const navigatetodefence = (gameId, codeName) => {
  console.log("adadad", codeName);
  router.push({
    pathname: "/DefencePlacePage",
    query: { 
      gameId: gameId,
      codeName: codeName, // 将codeName作为查询参数传递
      teamId: teamId // 将teamId作为查询参数传递
    }
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
                onClick={() => handleSaveAndNavigate(codeName)}
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
                    {selectedPlayers.map((playerKey, index) => (
                      <ListItem key={playerKey} divider button onClick={() => handleRemoveFromSelectedPlayers(playerKey)}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ marginRight: '16px' }}>{index + 1}</div> {/* 显示序列 */}
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
                      </div>
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
