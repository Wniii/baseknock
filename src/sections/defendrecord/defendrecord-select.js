import { useCallback, useState, useEffect } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  TextField,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { collection, getDocs, where, query } from "firebase/firestore";
import { firestore } from "src/firebase"; // 確保路徑與您的配置文件相匹配

export const DefendSelect = ({ onConfirm }) => {
  const [selectedTeam, setSelectedTeam] = useState("");
  const [teams, setTeams] = useState([]); // 新增狀態變量來存儲球隊列表
  const [selectedGameType, setSelectedGameType] = useState(["friendly", "ubl", "mei", "tao", "spring", "beer"]);

  const [checkboxStates, setCheckboxStates] = useState([
    { label: "好球數", checked: true },
    { label: "壞球數", checked: true },
    { label: "耗球數", checked: true},
    { label: "ERA", checked: true },
    { label: "先發", checked: true },
    { label: "出賽", checked: true },
    { label: "局數", checked: true },
    { label: "安打", checked: true },
    { label: "失分", checked: true },
    { label: "四壞", checked: true },
    { label: "奪三振", checked: true },
    { label: "WHIP", checked: true },
    { label: "好壞球比", checked: true },
    { label: "K/9", checked: true },
    { label: "BB/9", checked: true },
    { label: "H/9", checked: true },
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

  // 這是一個新的對應對象，將UI上的比賽性質映射到Firebase中的gName
  const gameTypeToGNameMapping = {
    友誼賽: "friendly",
    大專盃: "ubl",
    梅花旗: "mei",
    桃園盃: "tao",
    春季聯賽: "spring",
    台啤盃: "beer",
  };

  const handleGameTypeChange = (gameType) => (event) => {
    const { checked } = event.target;
    const gName = gameTypeToGNameMapping[gameType]; // 從對應關係中獲取gName
    setSelectedGameType((prevSelectedGameType) => {
      if (checked) {

        return [...prevSelectedGameType, gName];
      } else {
        return prevSelectedGameType.filter((type) => type !== gName);
      }
    });
  };

  const handleCheckboxChange = (index) => (event) => {
    const { checked } = event.target;
    const updatedCheckboxStates = [...checkboxStates];
    updatedCheckboxStates[index] = { ...updatedCheckboxStates[index], checked };
    setCheckboxStates(updatedCheckboxStates);
  };

  // 更新handleConfirm函數
  const handleConfirm = () => {
    const selectedColumns = checkboxStates
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.label);
    const selectedGameTypes = selectedGameType;

    // 檢查是否至少選擇了一個比賽類型
    if (selectedGameTypes.length === 0) {
      alert("請至少選擇一個比賽類型！");
      return; // 如果没有选择任何比赛类型，则不执行任何操作
    }
    // 檢查是否至少選擇了一個欄位
    if (selectedColumns.length === 0) {
      alert("請至少選擇一個欄位！");
      return; // 如果没有选择任何列，则不执行任何操作
    }

    // 调用 onConfirm 函数传递选中的列、球队和比赛类型
    onConfirm(selectedColumns, selectedTeam, selectedGameTypes);
  };

  const handleTeamChange = (event) => {
    console.log("團隊選擇已更改為：", event.target.value); // 添加日志
    setSelectedTeam(event.target.value);
  };

  useEffect(() => {
    handleConfirm();
    const fetchTeams = async () => {
      // 從 localStorage 中獲取 userTeam
      const userTeamCodes = localStorage.getItem("userTeam")?.split(",") || [];
      const teamsCollectionRef = collection(firestore, "team");
      if (userTeamCodes.length > 0) {
        // 創建一個查詢，根據userTeamCodes中的codeName來過濾隊伍
        const teamsQuery = query(teamsCollectionRef, where("codeName", "in", userTeamCodes));
        try {
          const querySnapshot = await getDocs(teamsQuery);
          const teamsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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
            <FormControl fullWidth>
              <InputLabel id="team-select-label">球隊</InputLabel>
              <Select
                labelId="team-select-label"
                value={selectedTeam}
                label="球隊"
                onChange={handleTeamChange}
              >
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
              {["友誼賽", "大專盃", "梅花旗", "桃園盃", "春季聯賽", "台啤盃"].map((gameTypeName, index) => (
                <Grid item xs={4} key={index}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedGameType.includes(gameTypeToGNameMapping[gameTypeName])}
                        onChange={handleGameTypeChange(gameTypeName)}
                        name={gameTypeName}
                      />
                    }
                    label={gameTypeName}
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
