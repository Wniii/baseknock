import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Box, Container, Grid, Typography, Card, CardHeader, List, ListItem, ListItemAvatar, ListItemText, Button } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import BallparkImagePage from './BallparkImagePage';
import {  getDocs, query, collection, where } from 'firebase/firestore'; // 导入 query
import { firestore } from './firebase';
import { formatDistanceToNow } from 'date-fns'; // 导入日期格式化函数

const DefencePlacePage = () => {
  const router = useRouter();
  const [blist_id, setBlistId] = useState(null); // 添加状态变量来存储 blist_id
  const [playersData, setPlayersData] = useState([]);

  useEffect(() => {
    // 从路由参数中获取 blist_id
    const { query } = router;
    if (query && query.blist_id) {
      setBlistId(query.blist_id);
    }
  }, [router.query.blist_id]); // 监听 blist_id 参数的变化

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        if (blist_id) {
          console.log('Fetching players for blist_id:', blist_id);
  
          const blistCollectionRef = collection(firestore, 'blist');
          const blistQuery = query(blistCollectionRef, where('blist_id', '==', blist_id));
          const blistSnapshot = await getDocs(blistQuery);
  
          if (!blistSnapshot.empty) {
            const blistDoc = blistSnapshot.docs[0];
            const g_id = blistDoc.data().g_id;
            console.log('Fetching players for g_id:', g_id);

            const gamesQuery = query(collection(firestore, 'games'), where('g_id', '==', g_id));
            const gamesSnapshot = await getDocs(gamesQuery);
            console.log('Fetching players for g_id:', g_id);

            if (!gamesSnapshot.empty) {
              const gamesDoc = gamesSnapshot.docs[0];
              const t_id = gamesDoc.data().t_id;
              console.log('Fetching team for t_id:', t_id);

              const playerQuery = query(collection(firestore, 'player'), where('t_id', '==', t_id));
              const playerSnapshot = await getDocs(playerQuery);
  
              if (!playerSnapshot.empty) {
                const playersData = [];
                const homeArray = blistDoc.data().home; // 获取 home 数组
                playerSnapshot.forEach(playerDoc => {
                    const playerData = playerDoc.data();
                    if (homeArray.includes(playerData.p_name)) { // 检查 p_name 是否在 home 数组中
                        playersData.push(playerData);
                    }
                });
                setBlistData(playersData); // 更新 blistData 状态变量
            }
            } else {
              console.log('No documents found with the specified g_id.');
            }
          } else {
            console.log('No documents found with the specified blist_id.');
          }
        }
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };
  
    fetchPlayers();
  }, [blist_id]);
  
  
  
  // 在此處定義 blistData 狀態
  const [blistData, setBlistData] = useState([]);
  

  // 当 g_id 参数发生变化时执行 useEffect 中的逻辑

  const handleReturnClick = () => {
    router.push('/playershow'); // 导航到另一个页面的路径
  };

  const handleSaveClick = () => {
    // 在保存按钮点击事件中执行保存逻辑
    // 此处略去相关逻辑
  };

  return (
    <Container maxWidth="xl">
      <div style={{ textAlign: 'center' }}>
        <Typography variant="h4" mb={4}>
          防守位
        </Typography>
      </div>
      <Grid container spacing={3} direction="row" alignItems="center" justifyContent="center">
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <CardHeader title="先發球员" />
            <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
            <List>
            {/* 渲染 blistData 中的球员列表 */}
            {blistData.map((player, index) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Box
                    component="img"
                    src={player.image} // 假设 blistData 中每个球员对象都有一个名为 image 的属性，用于存储球员图片的 URL
                    sx={{
                      borderRadius: 1,
                      height: 48,
                      width: 48
                    }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={player.p_name} // 假设 blistData 中每个球员对象都有一个名为 p_name 的属性，用于存储球员名字
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
        <Grid item xs={12} md={6} lg={4}>
          {/* 将 BallparkImagePage 放在这里 */}
          <img
          src='https://media.istockphoto.com/id/1269757192/zh/%E5%90%91%E9%87%8F/%E6%A3%92%E7%90%83%E5%A0%B4%E5%9C%96%E7%A4%BA%E6%A3%92%E7%90%83%E5%A0%B4%E5%90%91%E9%87%8F%E8%A8%AD%E8%A8%88%E7%9A%84%E5%B9%B3%E9%9D%A2%E5%9C%96%E8%A7%A3%E9%A0%82%E8%A6%96%E5%9C%96-web.jpg?s=612x612&w=0&k=20&c=Zt85Kr6EksFKBmYQmgs138zfLRp3eoIzKeQLS2mirLU='
          width={500} // 不需要使用字符串
          alt='棒球向量图' // 中文翻译
          style={{ cursor: 'pointer' }}
        />
        <div style={{ position: 'absolute', top: '440px', left: '680px', width: '100px', height: '60px',borderRadius: '10%', border: '2px solid red',background: 'rgba(255, 255, 255, 0.7)' }}>
        <span style={{ fontSize: '30px', color: ' red', position: 'relative', top: '0px', left: '10px' }}>1</span>
        <span style={{ fontSize: '35px', color: ' red', position: 'relative', top: '0px', left: '23px' }}>/</span>
        <span style={{ fontSize: '30px', color: ' red', position: 'relative', top: '0px', left: '36px' }}>R</span>


        </div>
          <div style={{ marginTop: '30px' }}>
            <Button va  riant="contained" color="primary" onClick={handleReturnClick}>
              返回
            </Button>
            <Button variant="contained" color="primary" onClick={handleSaveClick} style={{ marginLeft: '8px' }}>
              储存
            </Button>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};

// 定义 getLayout 方法
DefencePlacePage.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default DefencePlacePage;
