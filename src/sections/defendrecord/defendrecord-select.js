import { useCallback, useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
  TextField,
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { collection, getDocs, where, query } from "firebase/firestore"; 
import { firestore } from 'src/pages/firebase'; // 確保路徑與您的配置文件相匹配

export const DefendSelect = ({ onConfirm }) => {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [teams, setTeams] = useState([]); // 新增狀態變量來存儲球隊列表

  const [checkboxStates, setCheckboxStates] = useState([
    { label: '好球數', checked: false },
    { label: '壞球數', checked: false },
    { label: 'ERA', checked: false },
    { label: '先發', checked: false },
    { label: '出賽', checked: false },
    { label: '局數', checked: false },
    { label: '安打', checked: false },
    { label: '失分', checked: false },
    { label: '球數', checked: false },
    { label: '四壞', checked: false },
    { label: '奪三振', checked: false },
    { label: 'WHIP', checked: false },
    { label: '好壞球比', checked: false },
    { label: '每局耗球', checked: false },
    { label: 'K/9', checked: false },
    { label: 'BB/9', checked: false },
    { label: 'H/9', checked: false },
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
    const selectedColumns = checkboxStates
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.label);
    console.log('選擇的團隊是：', selectedTeam); // 添加日志
    onConfirm(selectedColumns, selectedTeam); // 傳遞選擇的團隊
  };

  const handleTeamChange = (event) => {
    console.log('團隊選擇已更改為：', event.target.value); // 添加日志
    setSelectedTeam(event.target.value);
  };

  useEffect(() => {
    const fetchTeams = async () => {
      // 從 localStorage 中獲取 userTeam
      const userTeamCodes = localStorage.getItem("userTeam")?.split(',') || [];
      const teamsCollectionRef = collection(firestore, "team");
      if (userTeamCodes.length > 0) {
        // 創建一個查詢，根據userTeamCodes中的codeName來過濾隊伍
        const teamsQuery = query(teamsCollectionRef, where("codeName", "in", userTeamCodes));
        try {
          const querySnapshot = await getDocs(teamsQuery);
          const teamsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setTeams(teamsData);
          
          // 如果有預選隊伍，設置選中的隊伍
          if (teamsData.length > 0) {
            setSelectedTeam(teamsData[0].id); // 或其他邏輯來選擇特定隊伍
          }
        } catch (error) {
          console.error("提取團隊數據時發生錯誤：", error);
        }
      }
    };
    fetchTeams();
  }, []);


  return (
    <Card>
      <CardContent sx={{ pt: 2 }}>
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
          <TextField
              fullWidth
              label="球隊"
              name="team"
              onChange={handleTeamChange}
              select
              SelectProps={{ native: true }}
              value={selectedTeam}
            >
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.Name}
                </option>
              ))}
            </TextField>
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Typography variant="h6">
              比賽性質
            </Typography>
            <Grid container spacing={1}>
              {['友誼賽', '大專盃', '梅花盃'].map((label, index) => (
                <Grid item xs={4} key={index}>
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label={label}
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
                <Grid item xs={4} key={index}>
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
