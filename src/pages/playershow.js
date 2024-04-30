import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { collection, getDocs, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
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
  const { hcodeName } = router.query;
  const [teamname, setteamname] = useState('');

  useEffect(() => {
    // 恢复本地存储中的选定的球员列表


    const fetchTeamGames = async () => {
      try {
          // 获取团队集合的引用
          const teamCollectionRef = collection(firestore, 'team');
          console.log("Team collection reference:", teamCollectionRef);
  
          // 获取团队文档的快照
          const teamSnapshot = await getDocs(teamCollectionRef);
          console.log("Team snapshot:", teamSnapshot);
  
          // 遍历团队文档
          for (const doc of teamSnapshot.docs) {
              const teamData = doc.data();
              console.log("Team data:", teamData);
  
              // 检查团队文档的 codeName 字段是否与给定的 codeName 变量匹配，
              // 并且检查团队文档是否包含 games 子集合以及该子集合中是否存在与给定时间戳相匹配的文档
              const gamesCollectionRef = collection(doc.ref, 'games');
              const gamesSnapshot = await getDocs(gamesCollectionRef);
  
              const gameDoc = gamesSnapshot.docs.find(gameDoc => gameDoc.id === timestamp);
              console.log('dsd',gameDoc)
              if (teamData.codeName === hcodeName && gameDoc) {
                  // 找到了符合条件的团队文档和游戏文档
                  console.log("Game document found:", gameDoc.data());
                  setteamname(teamData.Name || {});
                  // 更新玩家状态
                  setPlayers(teamData.players || '');
                  console.log("Players set to:", teamData.players);
                  
                  // 更新选定的球员列表并保存到本地存储
                  
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
  
    // 将选定的球员列表保存到本地存储
  };
  const handleRemoveFromSelectedPlayers = (playerKey) => {
    const updatedSelectedPlayers = selectedPlayers.filter((selectedPlayer) => selectedPlayer !== playerKey);
    setSelectedPlayers(updatedSelectedPlayers);
  
    const updatedPlayers = { ...players, [playerKey]: true };
    setPlayers(updatedPlayers);
  
    // 更新本地存储中的选定的球员列表
  };


  const handleReturnClick = () => {
    router.push('/schedule');
  };
  console.log(codeName)


  const addAttackListToGame = async (teamCollectionRef, codeName, timestamp, selectedPlayers) => {
    console.log('Adding attack list to game for codeName:', codeName);

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

            // 获取游戏文档
            const gameDocSnapshot = await getDoc(gameDocRef);

            // 设置游戏文档的数据
            const gameData = {
                // 这里根据需要设置游戏文档的字段
                attacklist: selectedPlayers,
                // 其他字段...
            };

            // 添加游戏文档到团队文档的游戏子集合
            if (gameDocSnapshot.exists()) {
                console.log("Game document found with ID:", timestamp);
                console.log("Game data:", gameDocSnapshot.data());

                // 更新游戏文档，保留其他字段的值
                await updateDoc(gameDocRef, gameData);
            } else {
                console.log("No matching game document found with ID:", timestamp);
                await setDoc(gameDocRef, gameData);
            }
        } else {
            console.log("CodeName does not match:", teamData.codeName);
        }
    }
};

const handleSaveAndNavigate = async () => {
    console.log('handleSaveAndNavigate function called');

    try {
        if (selectedPlayers.length < 9) {
            alert("请选择九个球员才能保存！");
            return;
        }
        
        console.log('timestamp:', timestamp);
        console.log('codeName:', codeName);

        // 获取所有团队文档的引用
        const teamsCollectionRef = collection(firestore, "team");
        console.log("Teams collection reference:", teamsCollectionRef);

        // 在 codeName 相匹配的团队集合中添加攻击列表到游戏子集合
        await addAttackListToGame(teamsCollectionRef, codeName, timestamp, selectedPlayers);

        // 在 hcodeName 相匹配的团队集合中添加攻击列表到游戏子集合
        await addAttackListToGame(teamsCollectionRef, hcodeName, timestamp, selectedPlayers);

        // 导航到防守页面
        navigatetodefence(timestamp, codeName);
        console.log('Navigated to defence');

        // 清空选定的球员列表
        setSelectedPlayers([]);
        console.log('Selected players cleared');
    } catch (error) {
        console.error('Error updating game document or navigating to defence:', error);
    }
};



  
const navigatetodefence = (gameId, codeName) => {
  console.log("adadad", codeName);
  router.push({
    pathname: "/DefencePlacePage",
    query: { 
      gameId: gameId,
      hcodeName: hcodeName, // 将codeName作为查询参数传递
      teamId: teamId, // 将teamId作为查询参数传递
      codeName: codeName,
      timestamp: timestamp
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
            {teamname}
            先發打序
          </Typography>
          </div>
          <Grid container spacing={1} justifyContent="center">
            {/* 左侧所有球员列表 */}
            <Grid item xs={4}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardHeader title="所有球員" />
                <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
                  <List>
                    {Object.keys(players).map((playerKey) => (
                    // 检查当前球员是否已经在选定的球员列表中，如果是则不渲染
                    !selectedPlayers.includes(playerKey) && (
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
                    )
                  ))}

                  </List>
                </div>
              </Card>
            </Grid>
  
            {/* 中间的按钮 */}
            <Grid item xs={10} md={3} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ marginBottom: '10px' }}>
                
              </div>
              <div style={{ marginBottom: '10px' }}>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ width: '200px', height: '50px' }}
                  onClick={() => setSelectedPlayers([])} // Clear selected players
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
                  onClick={() => handleSaveAndNavigate(codeName)}
                  style={{ width: '100px', height: '50px' }}
                >
                  儲存
                </Button>
              </div>
            </Grid>
  
            {/* 右侧先发球员列表 */}
            <Grid item xs={4}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardHeader title="先發球員" />
                <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
                  <List>
  {selectedPlayers.map((playerKey, index) => (
    <ListItem key={playerKey} divider button onClick={() => handleRemoveFromSelectedPlayers(playerKey)} style={{ whiteSpace: 'nowrap' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ marginRight: '16px' }}>{index + 1}</div>
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
