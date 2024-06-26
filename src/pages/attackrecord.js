import Head from 'next/head';
import { useState, useEffect } from 'react'; // Import useState and useEffect
import {
  Box, Container, Stack, Typography, Button, CardActions, Snackbar,
  Alert, Dialog, DialogTitle, DialogContent, DialogActions, FormControl,
  MenuItem, InputLabel, Select, TextField
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useRouter } from 'next/router';
import { collection, getDocs, query, where, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { firestore } from 'src/firebase';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
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

const Page = () => {
  const router = useRouter();
  const attackData = router.query.attack;
  const { codeName, timestamp, teamId, acodeName } = router.query;
  const [openDialog, setOpenDialog] = useState(false);
  const [teamDocId, setTeamDocId] = useState(null);
  const [gameDocIds, setGameDocIds] = useState([]);
  const [pitcherNames, setpitcherNames] = useState('');// 儲存投手名稱
  const [players, setPlayers] = useState([]);
  const [ordermain, setordermain] = useState([]);
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
    三振: false,
    飛球: false,
    滾地: false,
    失誤: false,
    野選: false,
    雙殺: false,
    違規: false,
    不知: false,
    四壞: false,
    犧飛: false,
    犧觸: false,
    觸身: false,
    一分: false,
    兩分: false,    
    三分: false,
    四分: false,
  });
  const [balls, setBalls] = useState([false, false, false]);
  const [strikes, setStrikes] = useState([false, false]);
  const [outs, setOuts] = useState(0);
  const [currentInning, setCurrentInning] = useState(0);
  const [currentBattingOrder, setCurrentBattingOrder] = useState(1);
  const [values, setValues] = useState({ hometeam: '', awayteam: '' });
  const [innOuts, setInnOuts] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [previousOuts, setPreviousOuts] = useState(0);
  const [lastHitType, setLastHitType] = useState(null);
  const [isStrikeout, setIsStrikeout] = useState(false);
  const [Active, setActive] = useState(false);
  const [selectedHitType, setSelectedHitType] = useState("");
  const [lastBaseOuts, setLastBaseOuts] = useState(0); // 初始化 lastBaseOuts 狀態
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState({ x: '', y: '' });
  const [originalLocation, setOriginalLocation] = useState(null); // 存储通过 updateLocations 设置的位置
  const [totalPitches, setTotalPitches] = useState(0);


  // 全局範圍內定義 fetchGameData 函數
  async function fetchGameData() {
    if (!codeName || !timestamp || !firestore || (gameDocIds.length > 0 && currentInning > 0)) {
      return null; // 確保當不應該執行時，返回 null
    }

    try {
      const teamQuerySnapshot = await getDocs(
        query(collection(firestore, 'team'), where('codeName', '==', codeName))
      );

      if (teamQuerySnapshot.empty) {
        console.log('No team document found with codeName:', codeName);
        setTeamDocId(null);
        setGameDocIds([]);
        return null;
      }

      const teamDocSnapshot = teamQuerySnapshot.docs[0];
      const teamId = teamDocSnapshot.id;
      setTeamDocId(teamId);

      const gamesCollectionRef = collection(teamDocSnapshot.ref, 'games');
      const gameDocRef = doc(gamesCollectionRef, timestamp);
      const gameDocSnapshot = await getDoc(gameDocRef);

      if (!gameDocSnapshot.exists()) {
        console.log("No matching game document with ID:", timestamp);
        setGameDocIds([]);
        return null;
      }

      return gameDocSnapshot.data();  // 返回數據供進一步處理
    } catch (error) {
      console.error('Error fetching documents:', error);
      return null;
    }
  }

  useEffect(() => {
    const fetchInitialData = async () => {
      const gameData = await fetchGameData(); // 獲取數據
      if (gameData) {
        const { ordermain, attacklist } = gameData;
        setValues(prevValues => ({
          ...prevValues,
          hometeam: gameData.hometeam || "",
          awayteam: gameData.awayteam || ""
        }));
        setOuts(gameData.outs || 0);
        setordermain(gameData.ordermain || []);
        setCurrentBattingOrder(gameData.ordermain ? (gameData.ordermain.length % 9 + 1) : 1);
        const inningsCompleted = Math.floor((gameData.outs || 0) / 6) + 1;
        setCurrentInning(inningsCompleted);

        const pitcherNames = gameData.awayposition.P;

        setpitcherNames(pitcherNames);


        // 使用 router.query 的數據處理 ordermain 和 attacklist
        if (router.query.column && router.query.row) {
          const inning = parseInt(router.query.column, 10);
          const playerIndex = parseInt(router.query.row, 10);

          const filteredOrderMain = ordermain.filter(item => item.inn === inning);
          const playerName = attacklist[playerIndex];
          const matchingPlayers = filteredOrderMain.filter(item => item.p_name === playerName);

          console.log("Matching players:", matchingPlayers);



          if (matchingPlayers.length > 0) {
            const pitcherData = matchingPlayers[0].pitcher;
            updatePitchCounts(pitcherData);
            updateLocations(matchingPlayers); // 呼叫 updateLocations 函數來處理位置資訊

            // console.log('Pitcher Data:', pitcherData)
          }
          updateOut(filteredOrderMain);


        }
      }
    };

    fetchInitialData();
  }, [codeName, timestamp, firestore, gameDocIds.length, currentInning, router.query.column, router.query.row]); // 這裡列出所有 fetchInitialData 依賴的變數






  const handleSubmit = useCallback((event) => {
    event.preventDefault();
  }, []);

  useEffect(() => {
    const fetchPlayers = async () => {
      if (!acodeName || !firestore) {
        return;
      }

      try {
        const teamQuerySnapshot = await getDocs(
          query(collection(firestore, 'team'), where('codeName', '==', acodeName))

        );

        if (!teamQuerySnapshot.empty) {
          const teamDocSnapshot = teamQuerySnapshot.docs[0];
          const teamId = teamDocSnapshot.id;
          const teamRef = doc(firestore, 'team', teamId);
          const gameData = await fetchGameData(); // 獲取數據
          const teamSnap = await getDoc(teamRef);
          const teamData = teamDocSnapshot.data();
          const awayAttackList = gameData.awayattacklist
          const awayposition = gameData.awayposition
          console.log("dddd", teamData.players)
          console.log("ddd", ordermain)
          if (teamData && teamData.players) {
            // 過濾出符合條件的球員鍵
            const pitcherNamesInOrderMain = Array.isArray(ordermain) && ordermain.length > 0
              ? [...new Set(ordermain.filter(item => item.pitcher && item.pitcher.name).map(item => item.pitcher.name))]
              : [];

            console.log("主隊已出現的投手名字：", pitcherNamesInOrderMain);

            const playerKeys = Object.keys(teamData.players)
              .filter(key => {
                const player = teamData.players[key];
                // 判断球员的位置是否为 'P'，且不在 awayAttackList 中，且不等于 awayposition.P，
                // 且没有出现在 ordermain 的任何一个 pitcher 的名字中
                return player.position === 'P' &&
                  !awayAttackList.includes(key) &&
                  key !== awayposition.P &&
                  !pitcherNamesInOrderMain.includes(player.name);
              });


            if (pitcherNames && !playerKeys.includes(pitcherNames)) {
              playerKeys.unshift(pitcherNames); // 將當前投手添加到列表開頭
            }

            setPlayers(playerKeys); // 更新玩家鍵的狀態
            // 更新玩家鍵的狀態
            console.log('Home team player keys after processing:', playerKeys);
          } else {
            console.log('No players data found for team:', teamId);
          }
        } else {
          console.log('No team document found with codeName:', codeName);
        }
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };

    fetchPlayers();
  }, [codeName, firestore]);



  const saveData = async () => {

    const hitContents = [
      '一安', '二安', '三安', '全打',
      '三振', '飛球', '滾地', '失誤',
      '野選', '雙殺', '違規', '不知',
      '四壞', '犧飛', '犧觸', '觸身', 
      '一分', '兩分', '三分', '四分'];

    const baseStatuses = ['一壘', '二壘', '三壘'];
    const selectedBases = baseStatuses.filter(base => selectedHits[base]);
    const baseOuts = ['0', '1', '2', '3'];

    const selectedContent = Object.entries(selectedHits)
      .filter(([key, value]) => value && hitContents.includes(key))
      .map(([key, _]) => key)
      .join(', ');

    let bases = baseStatuses.filter((base) => selectedHits[base]).join(',');
    const hquerySnapshot = await getDocs(
      query(collection(firestore, "team"), where("codeName", "==", values.hometeam))
    );
    let hteam = hquerySnapshot.docs[0]?.id; // 假设只有一个匹配的文档

    // 查询客队ID
    const aquerySnapshot = await getDocs(
      query(collection(firestore, "team"), where("codeName", "==", values.awayteam))
    );
    let ateam = aquerySnapshot.docs[0]?.id; // 假设只有一个匹配的文档

    if (!hteam || !ateam) {
      console.error("未找到相应的主队或客队");
      alert("未找到相应的主队或客队");
      return; // 如果没有找到队伍，就中止操作
    }
    const HgameRef = doc(firestore, 'team', hteam, 'games', timestamp);
    const AgameRef = doc(firestore, 'team', ateam, 'games', timestamp);

    // Calculate RBIs from selected run scoring hits
    let rbiCount = 0;
    if (selectedHits['一分']) rbiCount += 1;
    if (selectedHits['兩分']) rbiCount += 2;
    if (selectedHits['三分']) rbiCount += 3;
    if (selectedHits['四分']) rbiCount += 4;

    const locationData = {
      x: location.x || '',
      y: location.y || ''
    };

    try {
      await updateDoc(HgameRef, {
        'ordermain': arrayUnion({
          'content': selectedContent,
          'inn': currentInning,
          'onbase': bases,
          'p_name': attackData,
          'rbi': rbiCount,
          'location': locationData,
          'pitcher': {
            name: pitcherNames,
            ball: balls.filter(Boolean).length,
            strike: strikes.filter(Boolean).length,
            total: parseInt(totalPitches),
          },
          'innouts': innOuts
        }),
        'outs': outs,
        'awayposition': {
          P: pitcherNames,
        }
      });


      setOpenDialog(false);
      setAlertInfo({ open: true, severity: 'success', message: 'Document successfully updated!' });
    } catch (error) {
      console.error('Error updating document:', error);
      alert('Error updating document: ' + error.message);
    }
    console.log("ddd", pitcherNames)

    try {
      await updateDoc(AgameRef, {
        'ordermain': arrayUnion({
          'content': selectedContent,
          'inn': currentInning,
          'onbase': bases,
          'p_name': attackData,
          'rbi': rbiCount,
          'location': location,
          'pitcher': {
            ball: balls.filter(Boolean).length,
            strike: strikes.filter(Boolean).length,
            name: pitcherNames,
            total: parseInt(totalPitches),
          },
          'innouts': innOuts
        }),
        'outs': outs,
        'awayposition': {
          P: pitcherNames,
        }
      });
      console.log('Document successfully updated!');
      router.push({
        pathname: '/test',
        query: {
          acodeName: acodeName,
          timestamp: timestamp,
          codeName: codeName,
          teamId: teamId
        },
      });
      setOpenDialog(false);
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
    setLastHitType(hitType);
    setSelectedHits((prev) => ({
      ...prev,
      [hitType]: !prev[hitType],
    }));
  };

  const handleToggle = (hitType) => {
    console.log('hitType', hitType);
    setIsActive(!isActive); // 切換激活狀態
    if (!isActive) {
      console.log("激活操作");
      // 激活時執行的函數
      handleCheckboxChange(hitType);
      handleOutChange(hitType, 1);

      if (hitType === '三振') {
        handleBallTypeChange(strikes, 'strike', '三振');
      }
    } else {
      console.log("取消操作", previousOuts);
      undoChange();
    }
  };


  const undoChange = () => {
    setOuts(previousOuts); // 將 outs 重置為撤銷前的值
    if (lastHitType === '三振') {
      // 如果上次操作是三振，重置到兩個勾選
      setStrikes([true, true]);
    }
    if (lastHitType !== null) {
      setSelectedHits(prev => ({
        ...prev,
        [lastHitType]: false // 显式地将最后一次更改的 hitType 设置为 false
      }));
    }
    setInnOuts(0);
  };




  const handleBallTypeChange = (index, type, hitType) => {
    console.log('hitType:', hitType); // 输出 hitType 的值

    if (hitType === '四壞') {
      console.log('进入四壞情况'); // 输出进入四壞情况
      // 四壞情况，直接设置四个壞球
      setBalls([true, true, true, true]);

    } else if (hitType === '三振') {
      console.log('進入三振情況'); // 输出进入三振情況
      // 三振情况，直接设置三个好球
      setStrikes([true, true, true]);
      setIsStrikeout(true);
    } else {
      console.log('普通情況'); // 輸出普通情況

      if (type === 'ball') {
        // 如果是好球，则将指定索引位置的壞球置为true
        setBalls(balls => balls.map((item, idx) => idx === index ? !item : item));
      } else if (type === 'strike') {
        // 如果是好球，则将指定索引位置的好球置为true
        setStrikes(strikes => strikes.map((item, idx) => idx === index ? !item : item));
      }
    }
    const currentBallsCount = balls.filter(Boolean).length;
    const currentStrikesCount = strikes.filter(Boolean).length;
  }

  const updatePitchCounts = (pitcherData) => {
    // 從資料庫數據中讀取好球與壞球數量
    const { ball, strike, name } = pitcherData;

    // 創建更新後的好球與壞球陣列
    const updatedBalls = Array.from({ length: 4 }, (_, index) => index < ball);
    const updatedStrikes = Array.from({ length: 3 }, (_, index) => index < strike);

    // 更新狀態
    setBalls(updatedBalls);
    setStrikes(updatedStrikes);
    setPitcher(name);
  };



  const updateLocations = (matchingPlayers) => {
    const newLocation = matchingPlayers.map(player => {
      const { x, y } = player.location; // 從 player 的 location 對象解構 x 和 y
      return { x, y }; // 返回一個新的對象包含 x 和 y
    })[0]; // 假設只處理第一個匹配的玩家

    setLocation(newLocation); // 更新狀態
    setOriginalLocation(newLocation); // 保存原始位置

  };

  const handleToggle4 = (hitType) => {
    console.log('hitType', hitType);
    setActive(!Active); // 切換激活狀態
    if (!Active) {
      console.log("激活操作");
      // 激活時執行的函數
      handleCheckboxChange(hitType);
      handleBallTypeChange(balls, 'ball', '四壞');

    } else {
      console.log("取消操作");
      undoChange4();
    }
  };


  const undoChange4 = () => {
    if (lastHitType === '四壞') {
      // 如果上次操作是三振，重置到兩個勾選
      setBalls([true, true, true]);
    }
    if (lastHitType !== null) {
      setSelectedHits(prev => ({
        ...prev,
        [lastHitType]: false // 显式地将最后一次更改的 hitType 设置为 false
      }));
    }
    console.log("undoChange4 function executed.");
  };


  const updateOut = (filteredOrderMain) => {
    // 累加所有的 'innouts'
    const totalOuts = filteredOrderMain.reduce((sum, item) => sum + item.innouts, 0);
    setOuts(totalOuts);  // 更新 outs 狀態
    console.log('Total outs:', totalOuts);  // 輸出總出局數到控制台
  };

  const handleOutChange = (hitType = null, baseOuts) => {
    console.log("hitytype", hitType)
    let additionalOuts = 1; // 預設增加一個出局
    if (hitType === "雙殺") {
      additionalOuts = 1; // 如果是雙殺，增加兩個出局
      baseOuts = 1
    }
    else {
      additionalOuts = 1;
    }
    console.log("baseouts", baseOuts)
    const increment = baseOuts - lastBaseOuts;
    console.log('Increment:', increment);

    setOuts(prevOuts => {
      setPreviousOuts(prevOuts); // 保存當前的outs值
      const newOuts = prevOuts + additionalOuts;
      console.log('Current outs before update11111:', prevOuts);
      console.log('Updating outs to:', newOuts);
      return newOuts;

    });
    setInnOuts(prevInnOuts => {
      const newOuts = prevInnOuts + increment;
      console.log('Current outs before update33333:', prevInnOuts);
      console.log('Updating outs to:', newOuts);
      return newOuts;
    });
  };

  const renderOutsCheckboxes = () => {
    // 過濾出當前局的所有紀錄
    let remainder = 0; // 默認餘數為 0

    if (outs > 0) {
      remainder = outs % 3; // 計算 outs 除以 3 的餘數
      if (remainder === 0) {
        remainder = 0; // 如果 outs 不是 0 但能被 3 整除，將 remainder 設為 3 以全選
      }
    }
    return [...Array(2)].map((_, index) => (
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


  const handleInnOutsChange = (selectedHitType, baseOuts) => {
    console.log('hitType1111:', selectedHitType, 'baseOuts:', baseOuts);
    let additionalOuts = 1; // 預設增加一個出局
    if (baseOuts === 0) {
      additionalOuts = 0;
    }
    if (baseOuts === 2) {
      additionalOuts = 2;
    }
    if (baseOuts === 3) {
      additionalOuts = 3;
    }
    else {
      additionalOuts = 1;
    }
    // 如果是雙殺，baseOuts 直接設為2
    if (selectedHitType === '雙殺') {
      baseOuts = 2;
    }

    // 計算增量：新選擇的 baseOuts 減去上次保存的 baseOuts
    const increment = baseOuts - lastBaseOuts;
    console.log('Increment:', increment);

    setOuts(prevOuts => {
      setPreviousOuts(prevOuts); // 保存當前的outs值
      const newOuts = prevOuts + increment;
      console.log('Current outs before updateout:', prevOuts);
      console.log('Updating outs toout:', newOuts);
      return newOuts;

    });
    // 更新 inning outs
    setInnOuts(prevOuts => {
      const newOuts = prevOuts + increment;
      console.log('Current outs before update222224444:', prevOuts);
      console.log('Updating outs to:', newOuts);
      return newOuts;
    });

    // 更新 lastBaseOuts 為當前選擇的 baseOuts
    setLastBaseOuts(baseOuts);
  };





  const [clickCoordinates, setClickCoordinates] = useState({ x: 0, y: 0 });


  //落點

  const handleImageClick = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    setClickCoordinates({ x: offsetX, y: offsetY });
    setLocation({ x: offsetX.toString(), y: offsetY.toString() });
  };


  //

  const handleClearMarker = () => {
    setLocation({ x: '', y: '' });  // 清除標記
  };

  const handleTotalPitchesChange = (event) => {
    setTotalPitches(event.target.value);
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
          overflowY: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            {/* <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Typography variant="h3">
                新增打席
              </Typography>
            </div> */}

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
                            <Typography variant='body1'>
                              第{currentBattingOrder}棒
                            </Typography>
                            &nbsp;&nbsp;&nbsp;
                            <Paper
                              variant='outlined'
                              sx={{
                                width: 150,
                                height: 50,
                                padding: '8px',
                                borderRadius: 2,
                                borderColor: '#8E8E8E', // 設定邊框顏色
                                borderWidth: '3px', // 設定邊框寬度
                                borderStyle: 'solid', // 設定邊框樣式
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                              }}
                            >
                              {attackData}
                            </Paper>
                            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '92px' }}>
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
                          <div style={{ display: 'flex', alignItems: 'center', marginTop: '30px' }}>
                            <FormControl sx={{ mt: 1, minWidth: 120 }}>
                              <InputLabel id="pitcher-label" style={{ alignContent: 'flex-start', justifyContent: 'flex-start' }}>投手</InputLabel>
                              <Select
                                sx={{ width: "200px", marginLeft: "12px", height: "50px" }}
                                labelId="pitcher-label"
                                id="pitcher-select"
                                value={pitcherNames} // 使用 state 中的值
                                label="投手"
                                onChange={(e) => setpitcherNames(e.target.value)}
                              >
                                <MenuItem value={pitcherNames}>{pitcherNames}</MenuItem>
                                {players.map((playerKey, index) => (
                                  <MenuItem key={index} value={playerKey}>{playerKey}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <Box
                              noValidate
                              component="form"
                            >
                              <div style={{ display: 'flex', alignItems: 'center', marginLeft: '85px' }}>
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
                            </Box>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginTop: '40px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant='body3' style={{ marginLeft: '20px', fontSize: '1.5rem', fontWeight: 'bold' }} >
                                {currentInning}
                              </Typography>
                              <ArrowDropDownIcon style={{ fontSize: '2rem' }} />
                            </div>
                            <TextField
                              label="總投球數"
                              name="totalPitches"
                              type="text"
                              onChange={handleTotalPitchesChange}
                              required
                              value={totalPitches}
                              style={{ width: '100px', marginLeft: '45px', marginRight: '75px' }} // 設置具體寬度和間距
                            />
                            <Typography variant='h5' style={{ marginLeft: '10px' }}>O</Typography>
                            {renderOutsCheckboxes()}
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
                        {location.x && location.y && (
                          <div
                            style={{
                              position: 'absolute',
                              top: `${location.y}px`,
                              left: `${location.x}px`,
                              transform: 'translate(-50%, -50%)'
                            }}
                          >
                            <img
                              src="baseball-16-32.png"
                              alt="棒球"
                              style={{ width: '21px', height: '21px' }}
                            />
                          </div>
                        )}
                      </div>
                      <Button onClick={handleClearMarker} color="secondary">
                        清除標記
                      </Button>

                    </CardContent>
                  </Card>
                </Grid>

                <Grid
                  xs={12}
                  sm={6}
                  item
                  style={{ marginTop: '-120px' }}

                >
                  <form onSubmit={handleSubmit}>
                    <Card>
                      <CardContent>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <Divider style={{ flex: '1', marginRight: '10px', marginTop: '20px', marginBottom: '20px' }} />
                          <Typography variant="body2">
                            打擊內容＆打點
                          </Typography>
                          <Divider style={{ flex: '1', marginLeft: '10px' }} />
                        </div>
                        <div style={{ display: 'flex', marginLeft: '30px', marginBottom: '10px', marginTop: '0px' }}>
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
                                handleToggle('三振')
                                setSelectedHitType('三振');  // 存储击球类型，待后续使用

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
                              onClick={() => handleToggle('飛球')
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
                                handleToggle('滾地')
                              }
                              }
                            >
                              滾地
                            </Button>
                          </div>
                          <div style={{ width: '100px', textAlign: 'center' }}>
                            <Button
                              variant={selectedHits['失誤'] ? 'contained' : 'outlined'}
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
                              onClick={() => {
                                handleToggle('雙殺')
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
                              onClick={() => handleToggle('違規')}
                            >
                              妨礙
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
                              onClick={() => handleToggle4('四壞')}
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
                                handleToggle('犧飛')
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
                                handleToggle('犧觸')
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
                          <Select
                            autoFocus
                            onChange={(event) => {
                              const baseOuts = parseInt(event.target.value);
                              handleInnOutsChange(selectedHitType, baseOuts); // 新增的打席造成的出局數處理

                            }}
                          >
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
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button onClick={() => {
                          saveData();
                        }}>
                          儲存
                        </Button>
                      </div>

                    </DialogActions>
                  </Dialog>
                </CardContent>

              </Grid>
            </div>
          </Stack>
          <CardActions sx={{ justifyContent: 'flex-end', marginTop: "-110px" }}>
            <Button
              variant="contained"
              onClick={handleSaveToFirebase}
            >
              儲存
            </Button>
            <Snackbar>
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


