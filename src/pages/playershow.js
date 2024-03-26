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

  // 生成随机的 glist_id
  const generateRandomBlistId = () => {
    // 生成一个随机的字符串作为 glist_id，可以根据您的需求自定义长度和字符集
    return Math.random().toString(36).substr(2, 9);
  };

  const [blist_id, setBlistId] = useState(generateRandomBlistId()); // 添加状态变量来存储blist_id

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const playerCollection = collection(firestore, 'player');
        const playerSnapshot = await getDocs(playerCollection);
        const playerData = playerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPlayers(playerData);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };

    fetchPlayers();
  }, []);

  useEffect(() => {
    // 从路由参数中获取g_id
    const { query } = router;
    if (query && query.g_id) {
      setGId(query.g_id);
    }
  }, [router.query]);

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

  const handleAddToSelectedPlayers = (player) => {
    setSelectedPlayers([...selectedPlayers, player]);
    setPlayers(players.filter(p => p.id !== player.id));
  };

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
        {players.map(player => (
          <ListItem key={player.id} divider onClick={() => handleAddToSelectedPlayers(player)}>
            <ListItemAvatar>
              <Box
                component="img"
                src={player.image}
                sx={{
                  borderRadius: 1,
                  height: 48,
                  width: 48
                }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={player.p_name}
              primaryTypographyProps={{ variant: 'subtitle1' }}
              secondary={player.updatedAt ? `Updated ${formatDistanceToNow(player.updatedAt)} ago` : 'Updated time unknown'}
              secondaryTypographyProps={{ variant: 'body2' }}
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
                          src={player.image}
                          sx={{
                            borderRadius: 1,
                            height: 48,
                            width: 48
                          }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={player.p_name}
                        primaryTypographyProps={{ variant: 'subtitle1' }}
                        secondary={player.updatedAt ? `Updated ${formatDistanceToNow(player.updatedAt)} ago` : 'Updated time unknown'}
                       
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