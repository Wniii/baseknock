import Head from 'next/head';
import { useState, useEffect } from 'react'; // Import useState and useEffect
import { Box, Container, Stack, Typography, Button, CardActions, Snackbar, Alert } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import BallLandingPoint from 'src/sections/hit/balllandingpoint';
import { useRouter } from 'next/router'; // Import Next.js router
import { collection, getDocs, query, where, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { firestore } from './firebase';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import {
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Paper
} from '@mui/material';
import { useCallback } from 'react';
// Import YourComponent

const Page = () => {
  const router = useRouter();
  const attackData = router.query.attack;
  const { codeName, timestamp } = router.query;
  const [teamDocId, setTeamDocId] = useState(null);
  const [gameDocIds, setGameDocIds] = useState([]);
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    severity: 'info',
    message: '',
  });
  const [selectedHits, setSelectedHits] = useState({
    一安: false,
    二安: false,
    三安: false,
    全打: false,
    一分: false,
    三振: false,
    飛球: false,
    滾地: false,
    失誤: false,
    兩分: false,
    野選: false,
    雙殺: false,
    違規: false,
    不知: false,
    三分: false,
    四壞: false,
    犧飛: false,
    犧觸: false,
    觸身: false,
    四分: false,
  });
  const [initialBalls, setInitialBalls] = useState(0);
  const [initialStrikes, setInitialStrikes] = useState(0);

  const [balls, setBalls] = useState([false, false, false]);
  const [strikes, setStrikes] = useState([false, false]);
  const [outs, setOuts] = useState([]);



  const handleBallTypeChange = (index, type) => {
    if (type === 'ball') {
      setBalls(balls => balls.map((item, idx) => idx === index ? !item : item));
    } else if (type === 'strike') {
      setStrikes(strikes => strikes.map((item, idx) => idx === index ? !item : item));
    }
  };

  useEffect(() => {
    const fetchGameDocument = async () => {
      if (!codeName || !timestamp) {
        return;
      }

      try {
        const teamQuerySnapshot = await getDocs(
          query(collection(firestore, 'team'), where('codeName', '==', codeName))
        );

        if (!teamQuerySnapshot.empty) {
          const teamDocSnapshot = teamQuerySnapshot.docs[0];
          const teamId = teamDocSnapshot.id;
          setTeamDocId(teamId);

          const gamesCollectionRef = collection(teamDocSnapshot.ref, 'games');
          const gamesQuerySnapshot = await getDocs(gamesCollectionRef);

          if (!gamesQuerySnapshot.empty) {
            const gameIds = gamesQuerySnapshot.docs.map(doc => doc.id);
            setGameDocIds(gameIds);
            console.log('Game document IDs found:', gameIds);

            const gameRef = doc(firestore, 'team', teamId, 'games', '12221'); // 使用具體的遊戲 ID
            const gameSnap = await getDoc(gameRef);
            if (gameSnap.exists()) {
              const gameData = gameSnap.data();
              if (gameData.pitcher) {
                setInitialBalls(gameData.pitcher.ball || 0); // 確保沒有數據時返回 0
                setInitialStrikes(gameData.pitcher.strike || 0);
                console.log('Initial balls:', gameData.pitcher.ball || 0);
                console.log('Initial strikes:', gameData.pitcher.strike || 0);
              }
              if (gameData.outs) {
                // 使用動態方式更新 outs 狀態
                const newOuts = [...outs]; // 先複製原有的 outs 狀態

                gameData.outs.forEach((outIndex) => {
                  // 檢查是否需要擴展 outs 陣列的長度
                  if (outIndex >= newOuts.length) {
                    // 如果 outIndex 超出了目前 outs 陣列的長度，則擴展陣列長度
                    const additionalLength = outIndex - newOuts.length + 1;
                    newOuts.push(...Array(additionalLength).fill(false));
                  }

                  // 根據 outIndex 標記出局
                  newOuts[outIndex] = true;
                });

                setOuts(newOuts);
              }
            }
          } else {
            console.log('No game documents found for team:', teamId);
            setGameDocIds([]);
          }
        } else {
          console.log('No team document found with codeName:', codeName);
          setTeamDocId(null);
          setGameDocIds([]);
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };

    fetchGameDocument();
  }, [codeName, timestamp, firestore]);



  const handleSave = () => {
    router.push({
      pathname: '/test',
      query: {
        timestamp: timestamp,
        codeName: codeName,
      },
    });
  };

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handleSaveToFirebase = async () => {
    const hitContents = ['一安', '二安', '三安', '全打', '一分',
      '三振', '飛球', '滾地', '失誤', '兩分',
      '野選', '雙殺', '違規', '不知', '三分',
      '四壞', '犧飛', '犧觸', '觸身', '四分'];

    const baseStatuses = ['一壘', '二壘', '三壘'];
    const selectedContent = Object.entries(selectedHits)
      .filter(([key, value]) => value && hitContents.includes(key))
      .map(([key, _]) => key)
      .join(', ');

    let bases = baseStatuses.filter((base) => selectedHits[base]).join(',');
    const gameRef = doc(firestore, 'team', '4DllBDaCXJOxbZRaRPCM', 'games', '12221');

    const outIndexes = outs.reduce((acc, currentValue, index) => {
      if (currentValue) {
        acc.push(index);
      }
      return acc;
    }, []);

    try {
      await updateDoc(gameRef, {
        'ordermain': arrayUnion({
          'content': selectedContent,
          'inn': '',
          'onbase': bases,
          'p_name': attackData,
          'plate': '',
          'rbi': '',
        }),
        pitcher: {
          ball: initialBalls + balls.filter(Boolean).length, // 更新球数为当前球数加上新选择的球数
          strike: initialStrikes + strikes.filter(Boolean).length // 更新好球数为当前好球数加上新选择的好球数
        },
        'outs': outs

      });
      console.log('Document successfully updated!');
      alert('Document successfully updated!');
      router.push({
        pathname: '/test',
        query: {
          timestamp: timestamp,
          codeName: codeName,
        },
      });
    } catch (error) {
      console.error('Error updating document:', error);
      alert('Error updating document: ' + error.message);
    }
  };

  const handleCloseSnackbar = () => {
    setAlertInfo({ ...alertInfo, open: false });
  };

  const handleCheckboxChange = (hitType) => {
    setSelectedHits((prev) => ({
      ...prev,
      [hitType]: !prev[hitType],
    }));
  };


  const handleOutsChange = (index) => {
    const newOuts = [...outs];
    const selectedIndex = newOuts.indexOf(index); // 檢查索引是否已經存在於陣列中
    if (selectedIndex === -1) {
      newOuts.push(index); // 如果索引不存在，則將其添加到陣列中
    } else {
      newOuts.splice(selectedIndex, 1); // 如果索引已存在，則從陣列中移除
    }
    setOuts(newOuts);
  };






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
                              <Typography variant='h5'>B</Typography>
                              {balls.map((ball, index) => (
                                <Checkbox
                                  key={index}
                                  checked={ball}
                                  onChange={() => handleBallTypeChange(index, 'ball')}
                                  color="primary"
                                  inputProps={{ 'aria-label': `壞球${index + 1}` }}
                                />
                              ))}
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginTop: '30px', marginLeft: '250px' }}>
                            <Typography variant='h5'>S</Typography>
                            {strikes.map((strike, index) => (
                              <Checkbox
                                key={index}
                                checked={strike}
                                onChange={() => handleBallTypeChange(index, 'strike')}
                                color="primary"
                                inputProps={{ 'aria-label': `好球${index + 1}` }}
                              />
                            ))}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginTop: '40px', marginLeft: '250px' }}>
                            <Typography variant='h5'>O</Typography>
                            <div style={{ marginLeft: '18px' }}>
                              <FormControlLabel
                                control={<Checkbox checked={outs.includes(0)} onChange={() => handleOutsChange(0)} />}
                                label=""
                              />
                            </div>
                            <div style={{ marginLeft: '5px' }}>
                              <FormControlLabel
                                control={<Checkbox checked={outs.includes(1)} onChange={() => handleOutsChange(1)} />}
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
                              variant={selectedHits['一安'] ? 'contained' : 'outlined'}
                              borderRadius={5}
                              padding={1}
                              color='success'
                              type='checkbox'
                              onClick={() => handleCheckboxChange('一安')}
                            >
                              一安
                            </Button>
                          </div>
                          <div style={{ width: '100px', textAlign: 'center' }}>
                            <Button
                              variant={selectedHits['二安'] ? 'contained' : 'outlined'}
                              borderRadius={5}
                              padding={1}
                              color='success'
                              type='checkbox'
                              onClick={() => handleCheckboxChange('二安')}
                            >
                              二安
                            </Button>
                          </div>
                          <div style={{ width: '100px', textAlign: 'center' }}>
                            <Button
                              variant={selectedHits['三安'] ? 'contained' : 'outlined'}
                              borderRadius={5}
                              padding={1}
                              color='success'
                              onClick={() => handleCheckboxChange('三安')}
                            >
                              三安
                            </Button>
                          </div>
                          <div style={{ width: '100px', textAlign: 'center' }}>
                            <Button
                              variant={selectedHits['全打'] ? 'contained' : 'outlined'}
                              borderRadius={5}
                              padding={1}
                              color='success'
                              onClick={() => handleCheckboxChange('全打')}
                            >
                              全打
                            </Button>
                          </div>
                          <div style={{ width: '100px', textAlign: 'center' }}>
                            <Button
                              variant={selectedHits['一分'] ? 'contained' : 'outlined'}
                              borderRadius={5}
                              padding={1}
                              onClick={() => handleCheckboxChange('一分')}
                            >
                              一分
                            </Button>
                          </div>
                        </div>
                        <div style={{ display: 'flex', marginLeft: '30px', marginBottom: '10px' }}>
                          <div style={{ width: '100px', textAlign: 'center' }}>
                            <Button
                              variant={selectedHits['三振'] ? 'contained' : 'outlined'}
                              borderRadius={5}
                              padding={1}
                              color='error'
                              onClick={() => handleCheckboxChange('三振')}
                            >
                              三振
                            </Button>
                          </div>
                          <div style={{ width: '100px', textAlign: 'center' }}>
                            <Button
                              variant={selectedHits['飛球'] ? 'contained' : 'outlined'}
                              borderRadius={5}
                              padding={1}
                              color='error'
                              onClick={() => handleCheckboxChange('飛球')}
                            >
                              飛球
                            </Button>
                          </div>
                          <div style={{ width: '100px', textAlign: 'center' }}>
                            <Button
                              variant={selectedHits['滾地'] ? 'contained' : 'outlined'}
                              borderRadius={5}
                              padding={1}
                              color='error'
                              onClick={() => handleCheckboxChange('滾地')}
                            >
                              滾地
                            </Button>
                          </div>
                          <div style={{ width: '100px', textAlign: 'center' }}>
                            <Button
                              variant={selectedHits[' 失誤'] ? 'contained' : 'outlined'}
                              borderRadius={5}
                              padding={1}
                              color='error'
                              onClick={() => handleCheckboxChange('失誤')}
                            >
                              失誤
                            </Button>
                          </div>
                          <div style={{ width: '100px', textAlign: 'center' }}>
                            <Button
                              variant={selectedHits['兩分'] ? 'contained' : 'outlined'}
                              borderRadius={5}
                              padding={1}
                              onClick={() => handleCheckboxChange('兩分')}
                            >
                              兩分
                            </Button>
                          </div>
                        </div>
                        <div style={{ display: 'flex', marginLeft: '30px', marginBottom: '10px' }}>
                          <div style={{ width: '100px', textAlign: 'center' }}>
                            <Button
                              variant={selectedHits['野選'] ? 'contained' : 'outlined'}
                              borderRadius={5}
                              padding={1}
                              color='error'
                              onClick={() => handleCheckboxChange('野選')}
                            >
                              野選
                            </Button>
                          </div>
                          <div style={{ width: '100px', textAlign: 'center' }}>
                            <Button
                              variant={selectedHits['雙殺'] ? 'contained' : 'outlined'}
                              borderRadius={5}
                              padding={1}
                              color='error'
                              onClick={() => handleCheckboxChange('雙殺')}
                            >
                              雙殺
                            </Button>
                          </div>

                          <div style={{ width: '100px', textAlign: 'center' }}>
                            <Button
                              variant={selectedHits['違規'] ? 'contained' : 'outlined'}
                              borderRadius={5}
                              padding={1}
                              color='error'
                              onClick={() => handleCheckboxChange('違規')}
                            >
                              違規
                            </Button>
                          </div>
                          <div style={{ width: '100px', textAlign: 'center' }}>
                            <Button
                              variant={selectedHits['不知'] ? 'contained' : 'outlined'}
                              borderRadius={5}
                              padding={1}
                              color='inherit'
                              onClick={() => handleCheckboxChange('不知')}
                            >
                              不知
                            </Button>
                          </div>
                          <div style={{ width: '100px', textAlign: 'center' }}>
                            <Button
                              variant={selectedHits['三分'] ? 'contained' : 'outlined'}
                              borderRadius={5}
                              padding={1}
                              onClick={() => handleCheckboxChange('三分')}
                            >
                              三分
                            </Button>
                          </div>
                        </div>
                        <div style={{ display: 'flex', marginLeft: '30px', marginBottom: '10px' }}>
                          <div style={{ width: '100px', textAlign: 'center' }}>
                            <Button
                              variant={selectedHits['四壞'] ? 'contained' : 'outlined'}
                              borderRadius={5}
                              padding={1}
                              color='info'
                              onClick={() => handleCheckboxChange('四壞')}
                            >
                              四壞
                            </Button>
                          </div>
                          <div style={{ width: '100px', textAlign: 'center' }}>
                            <Button
                              variant={selectedHits['犧飛'] ? 'contained' : 'outlined'}
                              borderRadius={5}
                              padding={1}
                              color='info'
                              onClick={() => handleCheckboxChange('犧飛')}
                            >
                              犧飛
                            </Button>
                          </div>
                          <div style={{ width: '100px', textAlign: 'center' }}>
                            <Button
                              variant={selectedHits['犧觸'] ? 'contained' : 'outlined'}
                              borderRadius={5}
                              padding={1}
                              color='info'
                              onClick={() => handleCheckboxChange('犧觸')}
                            >
                              犧觸
                            </Button>
                          </div>
                          <div style={{ width: '100px', textAlign: 'center' }}>
                            <Button
                              variant={selectedHits['觸身'] ? 'contained' : 'outlined'}
                              borderRadius={5}
                              padding={1}
                              color='info'
                              onClick={() => handleCheckboxChange('觸身')}
                            >
                              觸身
                            </Button>
                          </div>
                          <div style={{ width: '100px', textAlign: 'center' }}>
                            <Button
                              variant={selectedHits['四分'] ? 'contained' : 'outlined'}
                              borderRadius={5}
                              padding={1}
                              onClick={() => handleCheckboxChange('四分')}
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
                            control={<Checkbox checked={selectedHits['一壘']} onChange={() => handleCheckboxChange('一壘')} />}
                            label="一壘"
                          />

                          <FormControlLabel
                            control={<Checkbox checked={selectedHits['二壘']} onChange={() => handleCheckboxChange('二壘')} />}
                            label="二壘"
                          />
                          <FormControlLabel
                            control={<Checkbox checked={selectedHits['三壘']} onChange={() => handleCheckboxChange('三壘')} />}
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
              onClick={handleSaveToFirebase} // 点击按钮时执行 handleSave 函数
            >
              儲存
            </Button>
            <Snackbar open={alertInfo.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
              <Alert onClose={handleCloseSnackbar} severity={alertInfo.severity} sx={{ width: '100%' }}>
                {alertInfo.message}
              </Alert>
            </Snackbar>
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

