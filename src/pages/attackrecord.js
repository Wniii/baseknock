import Head from 'next/head';
import { useState, useEffect } from 'react'; // Import useState and useEffect
import { Box, Container, Stack, Typography, Button, Grid, CardActions, List, ListItem, ListItemText, ListItemAvatar } from '@mui/material';
import { HitTable } from 'src/sections/hit/hittable';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import HitDetail from 'src/sections/hit/hitdetail';
import BaseSituation from 'src/sections/hit/basesituation';
import BallLandingPoint from 'src/sections/hit/balllandingpoint';
import { useRouter } from 'next/router'; // 导入 Next.js 的路由
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from './firebase';
import YourComponent from '../sections/hit/batterdetail'; // Import YourComponent

const Page = () => {
  const router = useRouter(); 

  const [players, setPlayers] = useState([]); // Define players state

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

  const handleSave = () => {
    router.push('/test');
  };

  return (
    <>
      <Head>
        <title>
          Settings | Devias Kit
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Typography variant="h3">
                新增打席
              </Typography>
            </div>
            
            <YourComponent /> {/* 導入 YourComponent 組件 */}
            <div style={{marginTop: '20px'}}>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  xs={12}
                  sm={6}
                  item
                >
                  <HitTable />
                </Grid>

                <Grid
                  xs={12}
                  sm={6}
                  item
                >
                  <BallLandingPoint />
                </Grid> 

                <Grid
                  xs={12}
                  sm={6}
                  item
                >
                  <HitDetail />
                </Grid>
                <Grid
                  xs={12}
                  sm={6}
                  item
                >
                  <BaseSituation />
                </Grid>
              </Grid>
            </div>          
          </Stack>
          <CardActions sx={{ justifyContent: 'center' }}>
            <Button 
              variant="contained"
              onClick={handleSave} // 点击按钮时执行 handleSave 函数
            >
              儲存
            </Button>
          </CardActions>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
