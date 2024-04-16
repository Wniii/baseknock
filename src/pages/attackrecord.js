import Head from 'next/head';
import { useState, useEffect } from 'react'; // Import useState and useEffect
import { Box, Container, Stack, Typography, Button, CardActions, List, ListItem, ListItemText, ListItemAvatar } from '@mui/material';
import { HitTable } from 'src/sections/hit/hittable';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import HitDetail from 'src/sections/hit/hitdetail';
import BaseSituation from 'src/sections/hit/basesituation';
import BallLandingPoint from 'src/sections/hit/balllandingpoint';
import { useRouter } from 'next/router'; // 导入 Next.js 的路由
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from './firebase';
import YourComponent from '../sections/hit/batterdetail';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import {
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  Unstable_Grid2 as Grid,
  Paper
} from '@mui/material';
import { useCallback } from 'react';
// Import YourComponent
import { useLocation } from 'react-router-dom';

const Page = () => {
  const router = useRouter(); // 正确使用 useRouter
  const attackData = router.query.attack; // 使用 router.query 获取查询参数
  const [players, setPlayers] = useState([]); // Define players state

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const playerCollection = collection(firestore, 'team',"4DllBDaCXJOxbZRaRPCM", 'games');
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

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
    },
    []
  );


  const HitDetail = () => {
    const handleSubmit = useCallback(
      (event) => {
        event.preventDefault();
      },
      []
    );
  }

  const BaseSituation = () => {
    const handleSubmit = useCallback(
      (event) => {
        event.preventDefault();
      },
      []
    );
  }


  return (
    <>
      <Head>
        <title>
          新增打席
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
            <div style={{ marginTop: '20px' }}>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  xs={12}
                  sm={6}
                  item
                >
                  <form onSubmit={handleSubmit}>
                    <Card>
                      <CardContent>
                        <div style={{ display: 'flex', width: '100%' }}>
                          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <Divider style={{ flex: '1', marginRight: '10px' }} />
                            <Typography variant="body2">
                              目前局勢
                            </Typography>
                            <Divider style={{ flex: '1', marginLeft: '10px' }} />
                          </div>

                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                            <Paper
                              variant='outlined'
                              sx={{
                                width: 150,
                                height: 50,
                                padding: '8px',
                                borderRadius: 5,
                                bgcolor: 'info.main',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                              }}
                            >
                              {attackData}
                            </Paper>
                            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '100px' }}>
                              <Typography variant='h5'>
                                B
                              </Typography>
                              <div style={{ marginLeft: '22px' }}>
                                <FormControlLabel
                                  control={<Checkbox defaultChecked={false} />} // 將 checked 改為 defaultChecked
                                  label=""
                                />
                              </div>
                              <div style={{ marginLeft: '5px' }}>
                                <FormControlLabel
                                  control={<Checkbox defaultChecked={false} />}
                                  label=""
                                />
                              </div>
                              <div style={{ marginLeft: '5px' }}>
                                <FormControlLabel
                                  control={<Checkbox defaultChecked={false} />}
                                  label=""
                                />
                              </div>

                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginTop: '30px', marginLeft: '250px' }}>
                            <Typography variant='h5'>
                              S
                            </Typography>
                            <div style={{ marginLeft: '22px' }}>
                              <FormControlLabel
                                control={<Checkbox defaultChecked={false} />}
                                label=""
                              />
                            </div>
                            <div style={{ marginLeft: '5px' }}>
                              <FormControlLabel
                                control={<Checkbox defaultChecked={false} />}
                                label=""
                              />
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginTop: '40px', marginLeft: '250px' }}>
                            <Typography variant='h5'>
                              O
                            </Typography>
                            <div style={{ marginLeft: '18px' }}>
                              <FormControlLabel
                                control={<Checkbox defaultChecked={false} />}
                                label=""
                              />
                            </div>
                            <div style={{ marginLeft: '5px' }}>
                              <FormControlLabel
                                control={<Checkbox defaultChecked={false} />}
                                label=""
                              />
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginTop: '40px', marginLeft: '20px' }}>
                            <Typography variant='body1'>
                              1
                            </Typography>
                            <ArrowDropUpIcon />
                            <Typography variant='body1'>
                              輪到第＿棒
                            </Typography>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px', marginLeft: '20px' }}>
                            <Typography variant='body1'>
                              P:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;pitches
                            </Typography>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </form>
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
                  <form onSubmit={handleSubmit}>
                    <Card>
                      <CardContent>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <Divider style={{ flex: '1', marginRight: '10px' }} />
                          <Typography variant="body2">
                            打擊內容＆打點
                          </Typography>
                          <Divider style={{ flex: '1', marginLeft: '10px' }} />
                        </div>
                        <div style={{ display: 'flex', marginLeft: '30px', marginBottom: '10px', marginTop: '10px' }}>
                          <div style={{ width: '100px', textAlign: 'center' }}>
                            <Button
                              variant='outlined'
                              borderRadius={5}
                              padding={1}
                              color='success'
                              type='checkbox'
                            >
                              一安
                            </Button>
                          </div>
                          <div style={{ width: '100px', textAlign: 'center' }}>
                            <Button
                              variant='outlined'
                              borderRadius={5}
                              padding={1}
                              color='success'
                              type='checkbox'
                            >
                              二安
                            </Button>
                          </div>
                          <div style={{ width: '100px', textAlign: 'center' }}>
                            <Button
                              variant='outlined'
                              borderRadius={5}
                              padding={1}
                              color='success'
                            >
                              三安
                            </Button>
                          </div>
                          <div style={{ width: '100px', textAlign: 'center' }}>
                            <Button
                              variant='outlined'
                              borderRadius={5}
                              padding={1}
                              color='success'
                            >
                              全打
                            </Button>
                          </div>
                          <div style={{ width: '100px', textAlign: 'center' }}>
                            <Button
                              variant='outlined'
                              borderRadius={5}
                              padding={1}
                            >
                              一分
                            </Button>
                          </div>
                        </div>
                        <div style={{ display: 'flex', marginLeft: '30px', marginBottom: '10px' }}>
                          <div style={{ width: '100px', textAlign: 'center' }}>
                            <Button
                              variant='outlined'
                              borderRadius={5}
                              padding={1}
                              color='error'
                            >
                              三振
                            </Button>
                          </div>
                          <div style={{ width: '100px', textAlign: 'center' }}>
                            <Button
                              variant='outlined'
                              borderRadius={5}
                              padding={1}
                              color='error'
                            >
                              飛球
                            </Button>
                          </div>
                          <div style={{ width: '100px', textAlign: 'center' }}>
                            <Button
                              variant='outlined'
                              borderRadius={5}
                              padding={1}
                              color='error'
                            >
                              滾地
                            </Button>
                          </div>
                          <div style={{ width: '100px', textAlign: 'center' }}>
                            <Button
                              variant='outlined'
                              borderRadius={5}
                              padding={1}
                              color='error'
                            >
                              失誤
                            </Button>
                          </div>
                          <div style={{ width: '100px', textAlign: 'center' }}>
                            <Button
                              variant='outlined'
                              borderRadius={5}
                              padding={1}
                            >
                              兩分
                            </Button>
                          </div>
                        </div>
                        <div style={{ display: 'flex', marginLeft: '30px', marginBottom: '10px' }}>
                          <div style={{ width: '100px', textAlign: 'center' }}>
                            <Button
                              variant='outlined'
                              borderRadius={5}
                              padding={1}
                              color='error'
                            >
                              野選
                            </Button>
                          </div>
                          <div style={{ width: '100px', textAlign: 'center' }}>
                            <Button
                              variant='outlined'
                              borderRadius={5}
                              padding={1}
                              color='error'
                            >
                              雙殺
                            </Button>
                          </div>

                          <div style={{ width: '100px', textAlign: 'center' }}>
                            <Button
                              variant='outlined'
                              borderRadius={5}
                              padding={1}
                              color='error'
                            >
                              違規
                            </Button>
                          </div>
                          <div style={{ width: '100px', textAlign: 'center' }}>
                            <Button
                              variant='outlined'
                              borderRadius={5}
                              padding={1}
                              color='inherit'
                            >
                              不知
                            </Button>
                          </div>
                          <div style={{ width: '100px', textAlign: 'center' }}>
                            <Button
                              variant='outlined'
                              borderRadius={5}
                              padding={1}
                            >
                              三分
                            </Button>
                          </div>
                        </div>
                        <div style={{ display: 'flex', marginLeft: '30px', marginBottom: '10px' }}>
                          <div style={{ width: '100px', textAlign: 'center' }}>
                            <Button
                              variant='outlined'
                              borderRadius={5}
                              padding={1}
                              color='info'
                            >
                              四壞
                            </Button>
                          </div>
                          <div style={{ width: '100px', textAlign: 'center' }}>
                            <Button
                              variant='outlined'
                              borderRadius={5}
                              padding={1}
                              color='info'
                            >
                              犧飛
                            </Button>
                          </div>
                          <div style={{ width: '100px', textAlign: 'center' }}>
                            <Button
                              variant='outlined'
                              borderRadius={5}
                              padding={1}
                              color='info'
                            >
                              犧觸
                            </Button>
                          </div>
                          <div style={{ width: '100px', textAlign: 'center' }}>
                            <Button
                              variant='outlined'
                              borderRadius={5}
                              padding={1}
                              color='info'
                            >
                              觸身
                            </Button>
                          </div>
                          <div style={{ width: '100px', textAlign: 'center' }}>
                            <Button
                              variant='outlined'
                              borderRadius={5}
                              padding={1}
                            >
                              四分
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </form>
                </Grid>
                <Grid
                  xs={12}
                  sm={6}
                  item
                >
                  <form onSubmit={handleSubmit}>
                    <Card>
                      <CardContent>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <Divider style={{ flex: '1', marginRight: '10px' }} />
                          <Typography variant="body2">
                            壘上情況
                          </Typography>
                          <Divider style={{ flex: '1', marginLeft: '10px' }} />
                        </div>
                        <div style={{ marginLeft: '150px', marginTop: '10px' }}>
                          <FormControlLabel
                            control={<Checkbox defaultChecked={false} />}
                            label="一壘"
                          />

                          <FormControlLabel
                            control={<Checkbox defaultChecked={false} />}
                            label="二壘"
                          />
                          <FormControlLabel
                            control={<Checkbox />}
                            label="三壘"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </form>
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
