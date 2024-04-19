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
  const { codeName, timestamp, teamId } = router.query;
  
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
  const [outs, setOuts] = useState([0]); // 初始化为含一個空陣列的陣列

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

            const gameRef = doc(firestore, 'team', teamId, 'games', timestamp); // 使用具體的遊戲 ID
            const gameSnap = await getDoc(gameRef);
            if (gameSnap.exists()) {
              console.log("2222", gameSnap)
              const gameData = gameSnap.data();
              if (gameData.pitcher) {
                setInitialBalls(gameData.pitcher.ball || 0); // 確保沒有數據時返回 0
                setInitialStrikes(gameData.pitcher.strike || 0);
                console.log('Initial balls:', gameData.pitcher.ball || 0);
                console.log('Initial strikes:', gameData.pitcher.strike || 0);
              }
              if (gameData.outs && Array.isArray(gameData.outs)) {
                const maxIndex = gameData.outs.length - 1; // 获取数组中最大的索引值
                const maxOuts = gameData.outs[maxIndex]; // 获取数组中最大索引处的值
                setOuts([maxOuts]); // 设置最大索引处的值作为 outs 状态
                console.log([maxOuts]);


              } else {
                console.log('No outs data available or not in expected format:', gameData.latestOuts);
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
    const gameRef = doc(firestore, 'team', teamId, 'games', timestamp);
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
        'outs': outs // 使用数组 outs，不再转换为字符串

      });
      console.log('Document successfully updated!');
      alert('Document successfully updated!');
      router.push({
        pathname: '/test',
        query: {
          timestamp: timestamp,
          codeName: codeName,
          teamId: teamId
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


  const handleOutsChange = () => {
    setOuts((prevOuts) => {
      if (prevOuts.length === 0) {
        prevOuts = [0];  // 如果原始陣列是空的，初始化它
      }
      const newOuts = [...prevOuts];
      const currentInningIndex = newOuts.length - 1;
      if (newOuts[currentInningIndex] < 3) {
        newOuts[currentInningIndex] += 1;
      } else {
        newOuts.push(1);
      }
      return newOuts;
    });
};


  const handleStrikeout = (hitType) => {
    setOuts((prevOuts) => {
      const newOuts = [...prevOuts];
      const currentInningIndex = newOuts.length - 1;
  
      // 增加指定出局類型的出局數
      if (newOuts[currentInningIndex] < 3) {
        newOuts[currentInningIndex] += 1;
      } else {
        // 如果當前局數已有三個出局，則新增一個空的局數並將出局數初始化為 1
        newOuts.push(1);
      }
  
      // 在此處將 checkbox 的值傳遞到資料庫
  
      return newOuts;
    });
  
    // 在此處將 checkbox 的值傳遞到資料庫，這裡的 `outs` 已經是最新的狀態
  };

  const renderOutsCheckboxes = () => {
    const lastInningOuts = outs[outs.length - 1]; // 获取最新一局的出局数
    return [...Array(3)].map((_, index) => (
      <FormControlLabel
        key={index}
        control={
          <Checkbox
            checked={index < lastInningOuts}
            onChange={handleOutsChange}
            color="primary"
            readOnly
          />
        }
        label=""
      />
    ));
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
                            {renderOutsCheckboxes()}
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
                              onClick={() => {
                                handleCheckboxChange('三振');
                                handleStrikeout();
                              }
                            }
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
                              onClick={() => {
                                handleCheckboxChange('飛球')
                                handleStrikeout();
                              }
                              }
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
                              onClick={() => {
                                handleCheckboxChange('滾地')
                                handleStrikeout();
                              }
                              }
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
                              onClick={() => handleCheckboxChange('野選')
                                             
                            
                            }
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

