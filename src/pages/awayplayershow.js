import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { collection, getDocs, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from 'src/firebase';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { Box, Button, Card, CardHeader, List, ListItem, ListItemText, Grid, Typography, Container } from '@mui/material';
import { useRouter } from 'next/router';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggablePlayer from '../components/DraggablePlayer'; // 导入组件

const ALLPlayerPage = () => {
  const router = useRouter();
  const [players, setPlayers] = useState({});
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const { timestamp, codeName, teamId, hcodeName } = router.query;
  const [teamname, setTeamName] = useState('');

  useEffect(() => {
    const fetchTeamGames = async () => {
      try {
        const teamCollectionRef = collection(firestore, 'team');
        const teamSnapshot = await getDocs(teamCollectionRef);

        for (const doc of teamSnapshot.docs) {
          const teamData = doc.data();
          const gamesCollectionRef = collection(doc.ref, 'games');
          const gamesSnapshot = await getDocs(gamesCollectionRef);

          const gameDoc = gamesSnapshot.docs.find(gameDoc => gameDoc.id === timestamp);

          if (teamData.codeName === hcodeName && gameDoc) {
            setTeamName(teamData.Name || '');
            setPlayers(teamData.players || {});
            return;
          }
        }
      } catch (error) {
        console.error('Error fetching team games:', error);
      }
    };

    fetchTeamGames();
  }, [codeName, timestamp, hcodeName]);

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

  const handleClearPlayers = () => {
    setSelectedPlayers([]);
    setPlayers({ ...players, ...Object.fromEntries(selectedPlayers.map(key => [key, true])) });
  };

  const handleReturnClick = () => {
    router.push('/schedule');
  };

  const addAttackListToGame = async (teamCollectionRef, codeName, timestamp, selectedPlayers) => {
    const teamsQuerySnapshot = await getDocs(teamCollectionRef);
    for (const teamDoc of teamsQuerySnapshot.docs) {
      const teamData = teamDoc.data();
      if (teamData.codeName === codeName) {
        const gameDocRef = doc(teamDoc.ref, "games", timestamp);
        const gameDocSnapshot = await getDoc(gameDocRef);
        const gameData = {
          awayattacklist: [
            { "第一棒": [selectedPlayers[0]] },
            { "第二棒": [selectedPlayers[1]] },
            { "第三棒": [selectedPlayers[2]] },
            { "第四棒": [selectedPlayers[3]] },
            { "第五棒": [selectedPlayers[4]] },
            { "第六棒": [selectedPlayers[5]] },
            { "第七棒": [selectedPlayers[6]] },
            { "第八棒": [selectedPlayers[7]] },
            { "第九棒": [selectedPlayers[8]] },
          ]
        };
        if (gameDocSnapshot.exists()) {
          await updateDoc(gameDocRef, gameData);
        } else {
          await setDoc(gameDocRef, gameData);
        }
      }
    }
  };

  const handleSaveAndNavigate = async () => {
    if (selectedPlayers.length !== 9) {
      alert("請選擇九位球員！");
      return;
    }

    try {
      const teamsCollectionRef = collection(firestore, "team");
      await addAttackListToGame(teamsCollectionRef, codeName, timestamp, selectedPlayers);
      await addAttackListToGame(teamsCollectionRef, hcodeName, timestamp, selectedPlayers);
      navigatetodefence(timestamp, codeName);
      setSelectedPlayers([]);
    } catch (error) {
      console.error('Error updating game document or navigating to defence:', error);
    }
  };

  const navigatetodefence = (gameId, codeName) => {
    router.push({
      pathname: "/awaydefencePlacePage",
      query: { gameId, hcodeName, teamId, codeName, timestamp }
    });
  };

  const movePlayer = (fromIndex, toIndex) => {
    setSelectedPlayers(prevSelectedPlayers => {
      const updatedPlayers = [...prevSelectedPlayers];
      const [movedPlayer] = updatedPlayers.splice(fromIndex, 1);
      updatedPlayers.splice(toIndex, 0, movedPlayer);
      return updatedPlayers;
    });
  };

  return (
    <>
      <Head>
        <title>大專棒球隊 | Devias Kit | Attack Place</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Container maxWidth="xl">
          <div style={{ textAlign: 'center' }}>
            <Typography variant="h4" mb={4}>
              {teamname}&nbsp;先發打序
            </Typography>
          </div>
          <Grid container spacing={1} justifyContent="center">
            <Grid item xs={4}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardHeader title="所有球員" />
                <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
                  <List>
                    {Object.keys(players).map((playerKey) => (
                      !selectedPlayers.includes(playerKey) && (
                        <ListItem
                          key={playerKey}
                          divider
                          button
                          onClick={() => handleAddToSelectedPlayers(playerKey)}
                        >
                          <ListItemText
                            primary={` ${playerKey}`}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      )
                    ))}
                  </List>
                </div>
              </Card>
            </Grid>
            <Grid item xs={10} md={3} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ marginBottom: '10px' }}>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ width: '200px', height: '50px' }}
                  onClick={handleClearPlayers}
                >
                  清除先發
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
                  onClick={handleSaveAndNavigate}
                  style={{ width: '100px', height: '50px' }}
                >
                  儲存
                </Button>
              </div>
            </Grid>
            <Grid item xs={4}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardHeader title="先發球員" />
                <DndProvider backend={HTML5Backend}>
                  <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
                    <List>
                      {selectedPlayers.map((playerKey, index) => (
                        <DraggablePlayer
                          key={playerKey}
                          playerKey={playerKey}
                          index={index}
                          movePlayer={movePlayer}
                          removePlayer={handleRemoveFromSelectedPlayers} // 传递 removePlayer 函数
                        />
                      ))}
                    </List>
                  </div>
                </DndProvider>
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
