import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { collection, getDocs, addDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { firestore } from './firebase';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { formatDistanceToNow } from 'date-fns';
import { Box, Button, Card, CardActions, CardHeader, List, ListItem, ListItemAvatar, ListItemText, IconButton, Grid, Typography, Container } from '@mui/material';
import { useRouter } from 'next/router'; // 导入路由器

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const ALLPlayerPage = () => {
  const router = useRouter(); // 使用路由器

  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [g_id, setGId] = useState(null); // 添加状态变量来存储g_id
  const { timestamp } = router.query;

  useEffect(() => {
    console.log('Timestamp:', timestamp);
    // 在这里执行与timestamp参数相关的任何操作
  }, [timestamp]);
  // 生成随机的 glist_id

  useEffect(() => {
    const fetchTeamGames = async () => {
      try {
        const teamCollection = collection(firestore, 'team');
        const teamSnapshot = await getDocs(teamCollection);
        
        for (const doc of teamSnapshot.docs) {
          const teamData = doc.data();
          console.log('Team data:', teamData); // 输出当前文档的数据
  
          // 检查当前文档是否包含 games 字段
          if (teamData.games) {
            console.log('Games field found in document:', doc.id); // 输出找到 games 字段的文档 ID
  
            // 检查当前文档的 games 字段是否包含与传递的 timestamp 匹配的键名
            if (teamData.games[timestamp]) {
              console.log('Timestamp key found in games field:', timestamp); // 输出找到的 timestamp 键名
  
              // 如果找到匹配的键名，则获取该键名对应的文档
              const gameDoc = teamData;
              console.log('team document:', gameDoc); // 输出找到的游戏文档
  
              // 检查文档是否包含 players 字段
              if (teamData.players) {
                console.log('Players field found in game document:', teamData.players); // 输出找到 players 字段的值
                // 在这里执行与 players 字段相关的任何操作
                // 停止搜索，因为找到了 players 数组
                setPlayers(teamData.players);
                console.log(teamData.players)
                return;
              } else {
                console.log('No players field found in game document:', gameDoc); // 输出未找到 players 字段的信息
              }
            } else {
              console.log('Timestamp key not found in games field:', timestamp); // 输出未找到 timestamp 键名的信息
            }
          } else {
            console.log('No games field found in document:', doc.id); // 输出未找到 games 字段的文档 ID
          }
        }
      } catch (error) {
        console.error('Error fetching team games:', error);
      }
    };
  
    fetchTeamGames();
  }, [timestamp]);
  
  
  
  
  



  const addPlayerToFirestore = async () => {
    try {
      const newPlayerData = {
        p_name: 'New Player', // 根据需要更改默认值
        // 其他字段...
      };

      // 在 Firestore 中创建新球员文档
      await addDoc(collection(firestore, 'player'), newPlayerData);
      console.log('New player document created successfully!');
    } catch (error) {
      console.error('Error creating new player document:', error);
    }
  };

  const handleDropPlayer = (index) => {
    return (e) => {
      e.preventDefault();
      const draggedPlayer = selectedPlayers[index];
      const newPlayers = [...selectedPlayers];
      newPlayers.splice(index, 1);
      const dropIndex = getIndexForDrop(e.clientY, index);
      console.log("Drop Index:", dropIndex);
      newPlayers.splice(dropIndex, 0, draggedPlayer);
      setSelectedPlayers(newPlayers);
    };
  };

  const getIndexForDrop = (clientY, currentIndex) => {
    const listItemHeight = 56; // ListItem 的默认高度
    const offset = clientY - (currentIndex * listItemHeight);
    const newIndex = Math.round(offset / listItemHeight);
    return Math.max(0, Math.min(selectedPlayers.length, currentIndex + newIndex));
  };

  const handleDragStart = (e, player) => {
    e.dataTransfer.setData('playerId', player.id);
  };

  // 修改 handleAddToSelectedPlayers 函数，将选定的球员从所有球员列表移动到先发球员列表
  const handleAddToSelectedPlayers = (playerKey) => {
    // 从所有球员列表中移除选定的球员
    const selectedPlayer = players[playerKey];
    const updatedPlayers = { ...players };
    delete updatedPlayers[playerKey];
    setPlayers(updatedPlayers);
    
    // 将选定的球员添加到先发球员列表
    setSelectedPlayers([...selectedPlayers, selectedPlayer]);

    // 打印更新后的 players 和 selectedPlayers
    console.log('Updated Players:', updatedPlayers);
    console.log('Selected Players:', selectedPlayers);
  };
// 添加拖拽事件处理函数，允许用户拖动球员到先发球员列表

  // 生成随机的 glist_id
  

  const saveSelectedPlayers = async () => {
    try {
        // 在 Firestore 中获取 'blist' 集合的引用，并指定文档 ID
        const blistDocRef = doc(firestore, 'blist', blist_id);

        const playerData = {};
        // 创建包含选择的球员名字的对象
        const homePlayers = [];
        for (let i = 0; i <= 9; i++) { // 修改循环起始索引为 1，终止条件为 i <= 10
            homePlayers.push(selectedPlayers[i]?.p_name || ''); // 将球员名字添加到 homePlayers 数组中
        }
        playerData['home'] = homePlayers; // 将 homePlayers 数组存储到 playerData 中

        // 创建包含 1 到 9 的数组作为 away


        playerData['blist_id'] = blist_id; // 添加随机生成的 blist_id
        playerData['g_id'] = g_id; // 使用传递过来的 g_id     

        // 将 playerData 添加到 'blist' 集合中的特定文档中
        await setDoc(blistDocRef, playerData);

        console.log('Selected players added to blist successfully!');
        setSelectedPlayers([]); // 保存后清空选择的球员列表
    } catch (error) {
        console.error('Error adding selected players to blist:', error);
    }
}

  

  const handleReturnClick = () => {
    router.push('/your-other-page');
  };

  const handleSaveAndNavigate = async () => {
    try {
      await saveSelectedPlayers(); // 等待保存函数执行完成
      // 使用router.push将g_id传递到另一个页面
      router.push({
        pathname: '/DefencePlacePage',
        query: {
          g_id: g_id, // 使用之前传递过来的 g_id
          blist_id: blist_id // 使用当前页面的 blist_id
        }
      });
      console.log('blist_id:', blist_id);
    } catch (error) {
      console.error('Error saving selected players:', error);
    }
  };

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
            <Grid item>
              {/* Dropdown Menu 1 */}
              <FormControl variant="outlined" style={{ minWidth: '150px' }}>
                <InputLabel id="dropdown-label-1">查詢期間</InputLabel>
                <Select
                  labelId="dropdown-label-1"
                  label="選項1"
                  // Add onChange and value props as needed
                >
                  {/* Add MenuItem components with options */}
                  <MenuItem value={1}>選項1.1</MenuItem>
                  <MenuItem value={2}>選項1.2</MenuItem>
                  {/* Add more options as needed */}
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              {/* Dropdown Menu 2 */}
              <FormControl variant="outlined" style={{ minWidth: '150px' }}>
                <InputLabel id="dropdown-label-2">排序</InputLabel>
                <Select
                  labelId="dropdown-label-2"
                  label="選項2"
                  // Add onChange and value props as needed
                >
                  {/* Add MenuItem components with options */}
                  <MenuItem value={1}>選項2.1</MenuItem>
                  <MenuItem value={2}>選項2.2</MenuItem>
                  {/* Add more options as needed */}
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              {/* Dropdown Menu 3 */}
              <FormControl variant="outlined" style={{ minWidth: '150px' }}>
                <InputLabel id="dropdown-label-3">最近打席</InputLabel>
                <Select
                  labelId="dropdown-label-3"
                  label="選項3"
                  // Add onChange and value props as needed
                >
                  {/* Add MenuItem components with options */}
                  <MenuItem value={1}>選項3.1</MenuItem>
                  <MenuItem value={2}>選項3.2</MenuItem>
                  {/* Add more options as needed */}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={2} style={{ flexWrap: 'nowrap' }}>
            {/* 左侧所有球员列表 */}
            <Grid item xs={4}>
            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
  <CardHeader title="所有球员" />
  <CardActions>
    <Button variant="contained" onClick={addPlayerToFirestore}>
      新增球员
    </Button>
  </CardActions>
  <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
  <List>
  {Object.keys(players).map(playerKey => ( 
    <ListItem key={playerKey} divider onClick={() => handleAddToSelectedPlayers(players[playerKey])}>
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
         primary={`Name: ${playerKey}`} // 使用子对象名称作为主要文本
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
                <Button variant="contained" color="primary" style={{ width: '200px', height: '50px' }}>
                  清除先发
                </Button>
              </div>
              <div>
                <Button variant="contained" color="primary" onClick={handleReturnClick} style={{ marginRight: '8px', width: '100px', height: '50px' }}>
                  返回
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveAndNavigate}
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
                <List onDragOver={(e) => e.preventDefault()}>
                  {selectedPlayers.map((player, index) => (
                    <ListItem key={index} divider draggable onDragStart={(e) => handleDragStart(e, player)} onDragOver={(e) => e.preventDefault()} onDrop={handleDropPlayer(index)}>
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
                        primary=''
                        primaryTypographyProps={{ variant: 'subtitle1' }}
                       
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