import { useCallback, useState, useEffect } from "react";
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
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "src/pages/firebase"; // 確保路徑與你的配置文件相匹配

export const HitrecordSearch = ({ onConfirm }) => {
  const [selectedTeam, setSelectedTeam] = useState("");
  const [teams, setTeams] = useState([]); // 新增狀態變量來存儲球隊列表

  const [gameTypes, setGameTypes] = useState([
    { name: "友誼賽", checked: true, dbName: "friendly" },
    { name: "大專盃", checked: true, dbName: "ubl" },
    { name: "梅花旗", checked: true, dbName: "mei" },
  ]);

  const [checkboxStates, setCheckboxStates] = useState([
    { label: "打席", checked: true },
    { label: "打數", checked: true },
    { label: "安打", checked: true },
    { label: "壘打數", checked: true },
    { label: "上壘數", checked: true },
    { label: "打點", checked: true },
    { label: "一安", checked: true },
    { label: "二安", checked: true },
    { label: "三安", checked: true },
    { label: "全壘打", checked: true },
    { label: "雙殺", checked: true },
    { label: "四壞", checked: true },
    { label: "犧飛", checked: true },
    { label: "犧觸", checked: true },
    { label: "觸身", checked: true },
    { label: "打擊率", checked: true },
    { label: "上壘率", checked: true },
    { label: "長打率", checked: true },
    { label: "OPS", checked: true },
  ]);

  const isAllSelected = checkboxStates.every((checkbox) => checkbox.checked);

  const handleSelectAllChange = (event) => {
    const isChecked = event.target.checked;
    const updatedCheckboxStates = checkboxStates.map((checkbox) => ({
      ...checkbox,
      checked: isChecked,
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
    const selectedGameTypes = gameTypes.filter((gt) => gt.checked).map((gt) => gt.dbName);

    if (selectedGameTypes.length === 0) {
      alert("請至少選擇一個比賽類型！");
      return; // 如果没有选择任何比赛类型，则不执行任何操作
    }
    if (selectedColumns.length === 0) {
      alert("請至少選擇一個欄位！");
      return; // 如果没有选择任何比赛类型，则不执行任何操作
    }

    // 调用 onConfirm 函数传递选中的列、球队和比赛类型
    onConfirm(selectedColumns, selectedTeam, selectedGameTypes);
  };

  const handleTeamChange = (event) => {
    console.log("Selected Team changed:", event.target.value); // Added log
    setSelectedTeam(event.target.value);
  };

  useEffect(() => {
    let isActive = true;
    handleConfirm();
    const fetchTeams = async () => {
      const userTeamCodes = localStorage.getItem("userTeam")?.split(",") || [];
      if (userTeamCodes.length > 0) {
        const teamsCollectionRef = collection(firestore, "team");
        const teamsQuery = query(teamsCollectionRef, where("codeName", "in", userTeamCodes));
        try {
          const querySnapshot = await getDocs(teamsQuery);
          const teamsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

          if (isActive) {
            setTeams(teamsData);
            if (teamsData.length > 0) {
              setSelectedTeam(teamsData[0].id);
            }
          }
        } catch (error) {
          console.error("Error fetching team data:", error);
        }
      }
    };

    fetchTeams();

    return () => {
      isActive = false;
    };
  }, []);

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
              <Select value={selectedTeam} label="球隊" onChange={handleTeamChange}>
                {teams.map((team) => (
                  <MenuItem key={team.id} value={team.id}>
                    {team.Name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Typography variant="h6">比賽性質</Typography>
            <Grid container spacing={1}>
              {gameTypes.map((gt, index) => (
                <Grid item xs={4} key={index}>
                  <FormControlLabel
                    control={
                      <Checkbox checked={gt.checked} onChange={handleGameTypeChange(index)} />
                    }
                    label={gt.name}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">顯示欄位</Typography>
            <Grid container spacing={1}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isAllSelected}
                    onChange={handleSelectAllChange}
                    color="primary"
                  />
                }
                label="全選"
              />
              {checkboxStates.map((checkbox, index) => (
                <Grid item xs={4} key={index}>
                  <FormControlLabel
                    control={
                      <Checkbox checked={checkbox.checked} onChange={handleCheckboxChange(index)} />
                    }
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
