import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { collection, doc, getDoc, query, where, getDocs } from 'firebase/firestore';
import { Box, Container, Grid, Typography, Card, CardHeader, List, ListItem, ListItemAvatar, ListItemText, Button } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { firestore } from './firebase';
import { useDrag, DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const DefencePlacePage = () => {
  const router = useRouter();
  const [gameId, setGameId] = useState(null);
  const [attackList, setAttackList] = useState([]);

  useEffect(() => {
    const { query } = router;
    if (query && query.gameId) {
      setGameId(query.gameId);
    }
  }, [router.query.gameId]);

  useEffect(() => {
    const fetchAttackList = async () => {
      try {
        const gamesCollectionRef = collection(firestore, 'team', '4DllBDaCXJOxbZRaRPCM', 'games');
        const gameDocRef = doc(gamesCollectionRef, gameId);
        const gameDocSnapshot = await getDoc(gameDocRef);

        if (gameDocSnapshot.exists()) {
          const gameData = gameDocSnapshot.data();
          const attackList = gameData.attacklist;
          setAttackList(attackList);
        } else {
          console.log('游戏文档不存在');
        }
      } catch (error) {
        console.error('Error fetching game data:', error);
      }
    };

    fetchAttackList();
  }, [gameId]);

  const handleReturnClick = () => {
    router.push('/playershow');
  };

  const handleSaveClick = () => {
    // 处理保存逻辑
  };

  return (
    <DndProvider backend={HTML5Backend}>
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
                  {attackList.map((player, index) => (
                    <DraggablePlayer key={index} player={player} />
                  ))}
                </List>
              </div>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <DropTargetImage />
            <div style={{ marginTop: '30px' }}>
              <Button variant="contained" color="primary" onClick={handleReturnClick}>
                返回
              </Button>
              <Button variant="contained" color="primary" onClick={handleSaveClick} style={{ marginLeft: '8px' }}>
                储存
              </Button>
            </div>
          </Grid>
        </Grid>
      </Container>
    </DndProvider>
  );
};

// 可拖拽的球员组件
const DraggablePlayer = ({ player }) => {
  const [{ isDragging }, drag] = useDrag({
    item: { type: 'player', name: player }, // 这里确保 type 属性被正确设置
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <ListItem>
        <ListItemText
          primary={player}
          primaryTypographyProps={{ variant: 'subtitle1' }}
          secondaryTypographyProps={{ variant: 'body2' }}
        />
      </ListItem>
    </div>
  );
};


// 拖放目标的图片组件
const DropTargetImage = () => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: 'player',
    drop: (item) => {
      console.log(item);
      // 处理球员放置到图片上的逻辑
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = canDrop && isOver;

  return (
    <div ref={drop}>
      <img
        src='https://elly-bio.com/baseball/wp-content/uploads/2023/01/440px-Baseball_positions_Traditional_Chinese.png'
        width={400}
        alt='棒球向量图'
        style={{ cursor: 'pointer', borderRadius: '20px', border: isActive ? '2px solid green' : 'none' }}
      />
      {isActive ? <div>Release to drop</div> : null}
    </div>
  );
};

DefencePlacePage.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default DefencePlacePage;
