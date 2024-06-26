import React, { useCallback, useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import { firestore } from "src/firebase";
import { setDoc, doc, collection } from "firebase/firestore";
import { query, where, getDocs, orderBy } from "firebase/firestore";
import { format } from "date-fns";
import { getDoc } from "firebase/firestore";
import { useRouter } from "next/router";

const gName = [
  { value: "friendly", label: "友誼賽" },
  { value: "ubl", label: "大專盃" },
  { value: "mei", label: "梅花旗" },
  { value: "tao", label: "桃園盃" },
  { value: "spring", label: "春季聯賽" },
  { value: "beer", label: "台啤盃" },
];

const labelOptions = [
  { value: "pre", label: "預賽" },
  { value: "re", label: "複賽" },
  { value: "final", label: "決賽" },
  { value: "others", label: "其他" },
];

export const AddGame = () => {
  const router = useRouter();
  const [values, setValues] = useState({
    GDate: null,
    hometeam: "",
    awayteam: "",
    gName: "",
    coach: "",
    recorder: "",
    label: "",
    remark: "",
  });

  const [hometeamOptions, setHometeamOptions] = useState([
    { value: "loadingHome", label: "加载主队数据..." },
  ]);
  const [awayteamOptions, setAwayteamOptions] = useState([
    { value: "loadingAway", label: "加载客队数据..." },
  ]);

  useEffect(() => {
    // 定義一個異步函數來獲取所有隊伍的名稱和代碼
    const fetchTeams = async () => {
      const teamsData = await getDocs(collection(firestore, "team"));
      const teamNameCodeMap = {};
      teamsData.forEach((doc) => {
        const data = doc.data();
        teamNameCodeMap[data.codeName] = data.Name;
      });
  
      // 解析LocalStorage中的userTeam數據
      const userTeamsString = localStorage.getItem("userTeam");
      let initialHomeTeams = [];
      let initialAwayTeams = [];
  
      if (userTeamsString) {
        const userTeams = userTeamsString.split(",");
        initialHomeTeams = userTeams.map((teamCode) => ({
          value: teamCode,
          // 使用codeName獲取隊伍的全名
          label: teamNameCodeMap[teamCode] || "隊伍名稱未找到",
        }));
        initialAwayTeams = [...initialHomeTeams]; // 如果主隊和客隊選項是相同的
      } else {
        initialHomeTeams = [{ value: "noHome", label: "无可选主队" }];
        initialAwayTeams = [{ value: "noAway", label: "无可选客队" }];
      }
  
      setHometeamOptions(initialHomeTeams);
      setAwayteamOptions(initialAwayTeams);
    };
  
    fetchTeams(); // 調用函數以獲取數據和更新狀態
  }, []);
  

  const AddGameSx = {
    backgroundColor: "#d3d3d3",
    padding: "8px",
    height: "auto",
    width: "auto",
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    textAlign: "center",
  };

  const handleChange = useCallback((event) => {
    if (event.target && event.target.name) {
      const { name, value } = event.target;
      console.log("Name:", name);
      console.log("Value:", value);
      setValues((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  }, []);

  const generateGameId = async () => {
    try {
      // 获取当前时间的毫秒级时间戳
      const timestamp = new Date().getTime();

      // 生成随机数（取值范围为0到9999）
      const random = Math.floor(Math.random() * 10000);

      // 构建新的游戏 ID
      const newGameId = `${timestamp}-${random}`;
      return newGameId;
    } catch (error) {
      console.error("Error generating game ID:", error);
      alert("An error occurred while generating game ID.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!values.GDate) {
        alert("日期不能為空，請輸入日期！");
        return;
    }
  
    try {
      const g_id = await generateGameId();
      const { GDate, ...otherValues } = values; // 分离日期和时间
  
      // 查询主队ID
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
      
      if (hteam === ateam) {
        alert("主對和客隊不能相同，請重新選擇！");
        return; // 如果主队和客队相同，中止操作并提示用户
      }
  
      // 创建主队和客队的游戏文档
      await Promise.all([
        setDoc(doc(firestore, "team", hteam, "games", g_id), {
          g_id: g_id, // 将 g_id 作为文档的一个字段
          GDate: values.GDate, // 仅存储日期部分
          hometeam: values.hometeam,
          awayteam: values.awayteam,
          gName: values.gName,
          coach: values.coach,
          recorder: values.recorder,
          label: values.label,
          remark: values.remark,
        }),
        setDoc(doc(firestore, "team", ateam, "games", g_id), {
          g_id: g_id, // 将 g_id 作为文档的一个字段
          GDate: values.GDate, // 仅存储日期部分
          hometeam: values.hometeam,
          awayteam: values.awayteam,
          gName: values.gName,
          coach: values.coach,
          recorder: values.recorder,
          label: values.label,
          remark: values.remark,
        })
      ]);
  
      // 更新主队的games字段
      await updateGamesField(hteam, g_id, GDate);
  
      // 更新客队的games字段
      await updateGamesField(ateam, g_id, GDate);
  
      console.log("New game document created with g_id:", g_id);
      alert("新增成功！");
      router.push("/schedule");
    } catch (error) {
      console.error("Error creating game document:", error);
      alert("An error occurred while creating game document.");
    }
  };

  
  async function updateGamesField(teamId, g_id, GDate) {
    const teamDocRef = doc(firestore, "team", teamId);
    const teamDocSnapshot = await getDoc(teamDocRef);
    if (!teamDocSnapshot.exists()) {
      console.log("Team document not found or does not exist.");
      return;
    }
  
    const teamData = teamDocSnapshot.data();
    const gamesData = teamData.games || {}; // 如果 games 字段不存在，则初始化为空对象
    gamesData[g_id] = GDate; // 将新游戏的 g_id 和 GDate 添加到 games 字段中
  
    await setDoc(teamDocRef, { games: gamesData }, { merge: true });
    console.log("Team document exists. Games data updated:", gamesData);
  }
  
  return (
    <div>
      <form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth required>
                    <MobileDateTimePicker
                      defaultValue={values.GDate}
                      label="比賽日期"
                      name="GDate"
                      onChange={(date) => {
                        console.log("Selected date:", date);
                        handleChange({ target: { name: "GDate", value: date } });
                      }}
                      required
                      value={values.GDate}
                      fullWidth
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth required>
                    <InputLabel>主隊</InputLabel>
                    <Select value={values.hometeam} onChange={handleChange} name="hometeam">
                      {hometeamOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {/* <Grid item xs={12} md={1} align="center">
                <Typography variant="body1" component="div" sx={{ paddingTop: "15px" }}>
                  V.S
                </Typography>
              </Grid> */}
                <Grid item xs={12} md={4}>
                 

                  <FormControl fullWidth required>
                    <InputLabel>客隊</InputLabel>
                    <Select value={values.awayteam} onChange={handleChange} name="awayteam">
                      {awayteamOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={12}>
                

                  <FormControl fullWidth required>
                    <InputLabel>比賽性質</InputLabel>
                    <Select value={values.gName} onChange={handleChange} name="gName">
                      {gName.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={15} md={6}>
                  <FormControl fullWidth required>
                    <TextField
                      fullWidth
                      label="教練"
                      name="coach"
                      onChange={handleChange}
                      value={values.coach}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="記錄員"
                    name="recorder"
                    onChange={handleChange}
                    value={values.recorder}
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <FormControl fullWidth required>
                    <InputLabel>標籤</InputLabel>
                    <Select value={values.label} onChange={handleChange} name="label">
                      {labelOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={12}>
                  <TextField
                    fullWidth
                    label="備註"
                    name="remark"
                    onChange={handleChange}
                    value={values.remark}
                  />
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        &nbsp;
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button type="submit" variant="contained" color="primary">
            確認新增
          </Button>
        </div>
      </form>
    </div>
  );
};
