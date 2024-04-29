import { useCallback, useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from 'src/pages/firebase'; // 確保路徑與你的配置文件相匹配


export const HitrecordSearch = ({ onConfirm }) => {


  const [selectedTeam, setSelectedTeam] = useState('');
  const [teams, setTeams] = useState([]); // 新增狀態變量來存儲球隊列表

  const [gameTypes, setGameTypes] = useState([
    { name: '友誼賽', checked: true, dbName: 'friendly' },
    { name: '大專盃', checked: true, dbName: 'ubl' },
    { name: '梅花旗', checked: true, dbName: 'mei' }
  ]);  

  const [checkboxStates, setCheckboxStates] = useState([
    { label: '打席', checked: false },
    { label: '打數', checked: false },
    { label: '安打', checked: false },
    { label: '壘打數', checked: false },
    { label: '上壘數', checked: false },
    { label: '打點', checked: false },
    { label: '一安', checked: false },
    { label: '二安', checked: false },
    { label: '三安', checked: false },
    { label: '全壘打', checked: false },
    { label: '雙殺', checked: false },
    { label: '四壞', checked: false },
    { label: '犧飛', checked: false },
    { label: '犧觸', checked: false },
    { label: '觸身', checked: false },
    { label: '打擊率', checked: false },
    { label: '上壘率', checked: false },
    { label: '長打率', checked: false },
    { label: 'OPS', checked: false },
  ]);



  const handleSelectAllChange = (event) => {
    const isChecked = event.target.checked;
    const updatedCheckboxStates = checkboxStates.map((checkbox) => ({
      ...checkbox,
      checked: isChecked
    }));
    setCheckboxStates(updatedCheckboxStates);
  };


  const handleCheckboxChange = (index) => (event) => {
    const { checked } = event.target;
    const updatedCheckboxStates = [...checkboxStates];
    updatedCheckboxStates[index] = { ...updatedCheckboxStates[index], checked };
    setCheckboxStates(updatedCheckboxStates);
  };

  const handleConfirm = () => {
    const selectedColumns = checkboxStates.filter(checkbox => checkbox.checked).map(checkbox => checkbox.label);
    const selectedGameTypes = gameTypes.filter(gt => gt.checked).map(gt => gt.dbName);

    if (selectedGameTypes.length === 0) {
        alert('請至少選擇一個比賽類型！');
        return;  // 如果没有选择任何比赛类型，则不执行任何操作
    }
    if (selectedColumns.length === 0) {
      alert('請至少選擇一個欄位！');
      return;  // 如果没有选择任何比赛类型，则不执行任何操作
  }

    // 执行游戏数据的获取
    fetchGames(selectedTeam, selectedGameTypes);

    // 调用 onConfirm 函数传递选中的列、球队和比赛类型
    onConfirm(selectedColumns, selectedTeam, selectedGameTypes);
};


  const handleTeamChange = (event) => {
    console.log('Selected Team changed:', event.target.value); // Added log
    setSelectedTeam(event.target.value);
  };

  useEffect(() => {
    const fetchTeams = async () => {
      // 從 localStorage 中獲取 userTeam
      const userTeamCodes = localStorage.getItem("userTeam")?.split(',') || [];
      console.log('User team codes:', userTeamCodes); // 檢查 userTeamCodes
      const teamsCollectionRef = collection(firestore, "team");
      if (userTeamCodes.length > 0) {
        // 創建一個查詢，根據userTeamCodes中的codeName來過濾隊伍
        const teamsQuery = query(teamsCollectionRef, where("codeName", "in", userTeamCodes));
        try {
          const querySnapshot = await getDocs(teamsQuery);
          console.log('Query Snapshot:', querySnapshot); // 檢查查詢快照
          const teamsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          console.log('Teams data:', teamsData); // 檢查團隊數據
          setTeams(teamsData);
          
          // 如果有預選隊伍，設置選中的隊伍
          if (teamsData.length > 0) {
            setSelectedTeam(teamsData[0].id); // 或其他邏輯來選擇特定隊伍
            console.log('Selected team set to:', teamsData[0].id); // 檢查已選擇的隊伍
          }
        } catch (error) {
          console.error("提取團隊數據時發生錯誤：", error);
        }
      }
    };
    fetchTeams();
  }, []);
  

  const fetchGames = async (teamId, gameTypes) => {
    if (gameTypes.length === 0) {
        console.error('没有选中的比赛类型进行查询');
        alert('请至少选择一个比赛类型进行查询。');  // 给用户显示一个弹窗提示
        return;
    }

    const gamesCollectionRef = collection(firestore, `team/${teamId}/games`);
    const gamesQuery = query(gamesCollectionRef, where("gName", "in", gameTypes));

    try {
        const querySnapshot = await getDocs(gamesQuery);
        const gamesData = querySnapshot.docs.map(doc => doc.data().gName);
        console.log('Games data:', gamesData);
    } catch (error) {
        console.error("提取比赛数据时发生错误：", error);
    }
};


  
  const handleGameTypeChange = (index) => (event) => {
    const updatedGameTypes = [...gameTypes];
    updatedGameTypes[index] = {
      ...updatedGameTypes[index],
      checked: event.target.checked,
    };
    setGameTypes(updatedGameTypes);
  };
  




  return (
    <Card>
      <CardContent sx={{ pt: 2 }}>
        <Grid container spacing={5}>
        <Grid item xs={12} md={4}>
        <FormControl fullWidth>
          <InputLabel>球隊</InputLabel>
          <Select
            value={selectedTeam}
            label="球隊"
            onChange={handleTeamChange}
          >
            {teams.map((team) => (
              <MenuItem key={team.id} value={team.id}>{team.Name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
        </Grid>
        <br />
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Typography variant="h6">
              比賽性質
            </Typography>
            <Grid container spacing={1}>
              {gameTypes.map((gt, index) => (
                <Grid item xs={4} key={index}>
                  <FormControlLabel
                    control={<Checkbox checked={gt.checked} onChange={handleGameTypeChange(index)} />}
                    label={gt.name}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">
              選示欄位
            </Typography>
            <Grid container spacing={1}>
              <FormControlLabel
                control={<Checkbox onChange={handleSelectAllChange} />}
                label="全選"
              />
              {checkboxStates.map((checkbox, index) => (
                <Grid item xs={4} key={index} >
                  <FormControlLabel
                    control={<Checkbox checked={checkbox.checked} onChange={handleCheckboxChange(index)} />}
                    label={checkbox.label}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
      <CardActions>
        <Button onClick={handleConfirm}>確認</Button>
      </CardActions>
    </Card>
  );
};

