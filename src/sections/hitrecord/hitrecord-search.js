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
  Unstable_Grid2 as Grid
} from '@mui/material';
import { collection, getDocs } from "firebase/firestore"; 
import { firestore } from 'src/pages/firebase'; // 確保路徑與你的配置文件相匹配


export const HitrecordSearch = ({ onConfirm }) => {


  const [selectedTeam, setSelectedTeam] = useState('');
  const [teams, setTeams] = useState([]); // 新增狀態變量來存儲球隊列表
 
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
    { label: '三圍', checked: false },
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
    console.log('Selected Team before onConfirm:', selectedTeam); // Added log
    onConfirm(selectedColumns, selectedTeam); // Passing selected team
  };

  const handleTeamChange = (event) => {
    console.log('Selected Team changed:', event.target.value); // Added log
    setSelectedTeam(event.target.value);
  };

  useEffect(() => {
    const fetchTeams = async () => {
      // 假設 'teams' 是您儲存團隊的集合名稱
      const teamsCollectionRef = collection(firestore, "team");
      
      try {
        const querySnapshot = await getDocs(teamsCollectionRef);
        const teamsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTeams(teamsData);
      } catch (error) {
        console.error("提取團隊數據時發生錯誤：", error);
        // 相應地處理錯誤
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
              {[
                '季賽',
                '季後賽',
                '盃賽',
                '友誼賽',
              ].map((label, index) => (
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

