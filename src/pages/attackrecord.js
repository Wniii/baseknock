import Head from 'next/head';
import { useState, useEffect } from 'react'; // Import useState and useEffect
import {
  Box, Container, Stack, Typography, Button, CardActions, Snackbar,
  Alert, Dialog, DialogTitle, DialogContent, DialogActions, FormControl,
  MenuItem, InputLabel, Select
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
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
  const [openDialog, setOpenDialog] = useState(false);
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
  const [outs, setOuts] = useState(0);
  const [currentInning, setCurrentInning] = useState(0);
  const [currentBattingOrder, setCurrentBattingOrder] = useState(1);

  const handleBallTypeChange = (index, type) => {
    if (type === 'ball') {
      setBalls(balls => balls.map((item, idx) => idx === index ? !item : item));
    } else if (type === 'strike') {
      setStrikes(strikes => strikes.map((item, idx) => idx === index ? !item : item));
    }
  };

  useEffect(() => {
    const fetchGameDocument = async () => {
      if (!codeName || !timestamp || !firestore) {
        return;
      }
      if (gameDocIds.length > 0 && currentInning > 0) return;
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

            const gameRef = doc(firestore, 'team', teamId, 'games', timestamp); // 使用具體的遊戲 ID
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
                setOuts(gameData.outs || 0); // 直接設置 outs 的初始值
                console.log('Initial Outs:', gameData.outs || 0);
              }
              if (gameSnap.exists()) {
                const gameData = gameSnap.data();
                // 假設 gameData.ordermain 是一個包含打擊數據的數組
                setCurrentBattingOrder(gameData.ordermain.length % 9 + 1);
                // 計算局數和上下半局
                const outs = gameData.outs || 0;
                const inningsCompleted = Math.floor(outs / 3) + 1;
                setCurrentInning(inningsCompleted);

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
  }, [codeName, timestamp, firestore, gameDocIds.length, currentInning]);





  const handleSubmit = useCallback((event) => {
    event.preventDefault();
  }, []);


  const saveData = async () => {

    const hitContents = ['一安', '二安', '三安', '全打', '一分',
      '三振', '飛球', '滾地', '失誤', '兩分',
      '野選', '雙殺', '違規', '不知', '三分',
      '四壞', '犧飛', '犧觸', '觸身', '四分'];

    const baseStatuses = ['一壘', '二壘', '三壘'];
    const selectedBases = baseStatuses.filter(base => selectedHits[base]);
    const baseOuts = ['0','1', '2', '3'];
  


      const selectedContent = Object.entries(selectedHits)
        .filter(([key, value]) => value && hitContents.includes(key))
        .map(([key, _]) => key)
        .join(', ');

      let bases = baseStatuses.filter((base) => selectedHits[base]).join(',');
      const gameRef = doc(firestore, 'team', teamId, 'games', timestamp);

      // Calculate RBIs from selected run scoring hits
      let rbiCount = 0;
      if (selectedHits['一分']) rbiCount += 1;
      if (selectedHits['兩分']) rbiCount += 2;
      if (selectedHits['三分']) rbiCount += 3;
      if (selectedHits['四分']) rbiCount += 4;

      const markerData = {
        x: markers.x.toString(),
        y: markers.y.toString()
      };

      try {
        await updateDoc(gameRef, {
          'ordermain': arrayUnion({
            'content': selectedContent,
            'inn': currentInning,
            'onbase': bases,
            'p_name': attackData,
            'rbi': rbiCount,
            'markers': markers
          }),
          pitcher: {
            ball: initialBalls + balls.filter(Boolean).length,
            strike: initialStrikes + strikes.filter(Boolean).length
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
            teamId: teamId
          },
        });
        setOpenDialog(false);
        setAlertInfo({ open: true, severity: 'success', message: 'Document successfully updated!' });
      } catch (error) {
        console.error('Error updating document:', error);
        alert('Error updating document: ' + error.message);
      }
    
  };

  const handleSaveToFirebase = () => {
    if (selectedHits['一壘'] || selectedHits['二壘'] || selectedHits['三壘']) {
      setOpenDialog(true);
    } else {
      saveData();  // 如果没有基壘被选中，直接保存数据
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


  const handleOutChange = (baseOuts, hitType = null) => {
    const selectedValue = parseInt(event.target.value);
    let additionalOuts = 1; // 預設增加一個出局
    if (hitType === "雙殺") {
      additionalOuts = 2; // 如果是雙殺，增加兩個出局
    }
    else if(baseOuts === 0){
      additionalOuts = 0;
    }
    else if(baseOuts === 1){
      additionalOuts = 1;
    }
    else if(baseOuts === 2){
      additionalOuts = 2;
    }
    else if(baseOuts === 3){
      additionalOuts = 3;
    }
    setOuts(prevOuts => {
      console.log('Current outs before update:', prevOuts); // 正確的位置
      const newOuts = prevOuts + additionalOuts;
      console.log('Updating outs to:', newOuts);
      return newOuts;
    });
  };

  const renderOutsCheckboxes = () => {
    const remainder = outs % 3; // 計算 outs 除以 3 的餘數
    return [...Array(3)].map((_, index) => (
      <FormControlLabel
        key={index}
        control={
          <Checkbox
            checked={index < remainder} // 只有當 index 小於餘數時，checkbox 才會被打勾
            color="primary"
            readOnly // 保持 readOnly 屬性，因為這些 checkbox 不應該被用戶直接修改
          />
        }
        label="" // 沒有標籤
      />
    ));
  };

  //落點
  const [markers, setMarkers] = useState({ x: '', y: '' });
  const [clickCoordinates, setClickCoordinates] = useState({ x: 0, y: 0 });

  const handleImageClick = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    setClickCoordinates({ x: offsetX, y: offsetY });
    setMarkers({ x: offsetX.toString(), y: offsetY.toString() });
  };

  const handleDeleteLastMarker = () => {
    // 直接重置 markers 对象
    setMarkers({ x: '', y: '' });
  };

  //出局數彈跳視窗







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
                              {currentInning}
                            </Typography>
                            <ArrowDropUpIcon />

                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginTop: '23px', marginLeft: '20px', marginDown: '50px' }}>
                            <Typography variant='body1'>
                              第{currentBattingOrder}棒次
                            </Typography>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginTop: '38px', marginLeft: '20px' }}>
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
                  <Card>
                    <CardContent>
                      <div style={{ position: 'relative' }}>
                        <img
                          src='https://media.istockphoto.com/id/1269757192/zh/%E5%90%91%E9%87%8F/%E6%A3%92%E7%90%83%E5%A0%B4%E5%9C%96%E7%A4%BA%E6%A3%92%E7%90%83%E5%A0%B4%E5%90%91%E9%87%8F%E8%A8%AD%E8%A8%88%E7%9A%84%E5%B9%B3%E9%9D%A2%E5%9C%96%E8%A7%A3%E9%A0%82%E8%A6%96%E5%9C%96-web.jpg?s=612x612&w=0&k=20&c=Zt85Kr6EksFKBmYQmgs138zfLRp3eoIzKeQLS2mirLU='
                          width={'400px'}
                          alt='棒球場地'
                          onClick={handleImageClick}
                          style={{ cursor: 'pointer' }}
                        />
                        {/* 檢查是否有設置 markers */}
                        {markers.x && markers.y && (
                          <div
                            style={{
                              position: 'absolute',
                              top: `${markers.y}px`, // 添加 'px' 单位
                              left: `${markers.x}px`, // 添加 'px' 单位
                              width: '10px',
                              height: '10px',
                              backgroundColor: 'red',
                              transform: 'translate(-50%, -50%)',
                              borderRadius: '50%'
                            }}
                          />
                        )}
                      </div>
                      <Button onClick={handleDeleteLastMarker} color="secondary">
                        返回
                      </Button>
                    </CardContent>
                  </Card>
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
                                handleOutChange('三振');
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
                                handleOutChange('飛球');
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
                                handleOutChange('滾地');
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
                              onClick={() => {
                                handleCheckboxChange('雙殺')
                                handleOutChange('雙殺');
                              }
                              }
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
                              onClick={() => {
                                handleCheckboxChange('犧飛')
                                handleOutChange('犧飛');
                              }}
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
                              onClick={() => {
                                handleCheckboxChange('犧觸')
                                handleOutChange('犧觸');
                              }
                              }
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

                <CardContent>
                  <Dialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                  >
                    <DialogTitle>壘上出局數</DialogTitle>
                    <DialogContent>
                      <Box
                        noValidate
                        component="form"
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          m: 'auto',
                          width: 'fit-content',
                        }}
                      >
                        <FormControl sx={{ mt: 2, minWidth: 120 }}>
                          <Select autoFocus onChange={(event) => handleOutChange(parseInt(event.target.value))}>
                            <InputLabel>出局數</InputLabel>
                            <MenuItem value="0">0</MenuItem>
                            <MenuItem value="1">1</MenuItem>
                            <MenuItem value="2">2</MenuItem>
                            <MenuItem value="3">3</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => {
                        console.log('Save button clicked!');
                        saveData();
                      }}>
                        儲存
                      </Button>
                      <Snackbar open={alertInfo.open} autoHideDuration={6000} onClose={() => setAlertInfo({ ...alertInfo, open: false })}>
                      <Alert onClose={() => setAlertInfo({ ...alertInfo, open: false })} severity={alertInfo.severity} sx={{ width: '100%' }}>
                          {alertInfo.message}
                        </Alert>
                      </Snackbar>
                    </DialogActions>
                  </Dialog>
                </CardContent>

              </Grid>
            </div>
          </Stack>
          <CardActions sx={{ justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={handleSaveToFirebase} 
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

