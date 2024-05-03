import React, { useState, useEffect } from "react";
import {
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from "@mui/material";

import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import { firestore } from "./firebase";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { deleteDoc } from "firebase/firestore";
import { CircularProgress } from "@mui/material";
import { runTransaction } from "firebase/firestore";
import { parseISO } from "date-fns";

const gNameOptions = [
  { value: "friendly", label: "友誼賽" },
  { value: "ubl", label: "大專盃" },
  { value: "mei", label: "梅花旗" },
];

const labelOptions = [
  { value: "top8", label: "八強賽" },
  { value: "top4", label: "四強賽" },
  { value: "champ", label: "冠亞賽" },
  { value: "others", label: "其他" },
];

export const EditGame = () => {
  const router = useRouter();
  const g_id = router.query.timestamp; // 从 URL 获取 g_id
  const codeName = router.query.codeName;
  const [teamId, setTeamId] = useState("");

  const [values, setValues] = useState({
    GDate: null,
    hometeam: "",
    awayteam: "",
    gName: "",
    coach: "",
    recorder: "",
    label: "",
    remark: "",
    result: "", // 添加用于存储比赛结果的状态
    youtubelink: "", // 添加用于存储YouTube链接的状态
  });

  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false); // 控制对话框显示

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [hometeamOptions, setHometeamOptions] = useState([
    { value: "loadingHome", label: "加载主队数据..." },
  ]);
  const [awayteamOptions, setAwayteamOptions] = useState([
    { value: "loadingAway", label: "加载客队数据..." },
  ]);

  useEffect(() => {
    if (codeName) {
      const fetchTeamId = async () => {
        const teamsQuery = query(collection(firestore, "team"), where("codeName", "==", codeName));
        const querySnapshot = await getDocs(teamsQuery);
        if (!querySnapshot.empty) {
          setTeamId(querySnapshot.docs[0].id);
        } else {
          console.log("No team found with the given codeName");
        }
      };

      fetchTeamId();
    }
  }, [codeName]);

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

  // 在組件外部定義初始 prevhteam 和 prevateam 狀態
  const [prevhteam, setPrevHteam] = useState("");
  const [prevateam, setPrevAteam] = useState("");
  const [prevhteamname, setPrevHteamName] = useState("");
  const [prevateamname, setPrevAteamName] = useState("");

  useEffect(() => {
    const fetchTeamNames = async () => {
      const teamsData = await getDocs(collection(firestore, "team"));
      const teamNameMap = {};
      teamsData.forEach((doc) => {
        const data = doc.data();
        teamNameMap[data.codeName] = data.Name;
      });

      // 檢查是否存在prevhteam和prevateam對應的隊伍名稱
      if (prevhteam && teamNameMap[prevhteam]) {
        setPrevHteamName(teamNameMap[prevhteam]);
      }

      if (prevateam && teamNameMap[prevateam]) {
        setPrevAteamName(teamNameMap[prevateam]);
      }
    };

    fetchTeamNames();
  }, [prevhteam, prevateam]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching data with teamId:", teamId, "and g_id:", g_id); // Debug log
      if (teamId && g_id) {
        setLoading(true);
        try {
          const docRef = doc(firestore, "team", teamId, "games", g_id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            console.log("Document data:", docSnap.data()); // Debug log
            const gameData = docSnap.data();
            // 在這裡設置 prevhteam 和 prevateam 的值
            setPrevHteam(gameData.hometeam || "");
            setPrevAteam(gameData.awayteam || "");
            setValues({
              result: gameData.result || "",
              youtubelink: gameData.youtubelink || "",
              GDate: gameData.GDate ? parseISO(gameData.GDate.toDate().toISOString()) : null,
              hometeam: gameData.hometeam || "",
              awayteam: gameData.awayteam || "",
              gName: gameData.gName || "",
              coach: gameData.coach || "",
              recorder: gameData.recorder || "",
              label: gameData.label || "",
              remark: gameData.remark || "",
            });
          } else {
            console.log("No such document!"); // Debug log
          }
        } catch (error) {
          console.error("Error fetching document:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (teamId && g_id) {
      fetchData();
    }
  }, [teamId, g_id, firestore]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setValues((prevState) => ({
      ...prevState,
      GDate: date,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // 查询主队ID
      const hquerySnapshot = await getDocs(
        query(collection(firestore, "team"), where("codeName", "==", values.hometeam))
      );
      let hteam = hquerySnapshot.docs[0]?.id;

      // 查询客队ID
      const aquerySnapshot = await getDocs(
        query(collection(firestore, "team"), where("codeName", "==", values.awayteam))
      );
      let ateam = aquerySnapshot.docs[0]?.id;

      if (!hteam || !ateam) {
        console.error("未找到相应的主队或客队");
        alert("未找到相应的主队或客队");
        return;
      }

      if (hteam === ateam) {
        alert("主隊和客隊不能相同，請重新選擇！");
        return;
      }
      const prevhquerySnapshot = await getDocs(
        query(collection(firestore, "team"), where("codeName", "==", prevhteam))
      );
      let phteam = prevhquerySnapshot.docs[0]?.id; // 假设只有一个匹配的文档

      // 查询客队ID
      const prevaquerySnapshot = await getDocs(
        query(collection(firestore, "team"), where("codeName", "==", prevateam))
      );
      let pateam = prevaquerySnapshot.docs[0]?.id; // 假设只有一个匹配的文档

      if (!phteam || !pateam) {
        console.error("未找到相应的主队或客队");
        alert("未找到相应的主队或客队");
        return; // 如果没有找到队伍，就中止操作
      }

      // 獲取比賽信息
      const gameRef = doc(firestore, "team", phteam, "games", g_id); // 需要正确的路径
      const gameSnap = await getDoc(gameRef);
      const gameData = gameSnap.data();

      // 检查 orderoppo 或 ordermain 是否存在
      const hasOrderOppo = gameData && gameData.orderoppo && Object.keys(gameData.orderoppo).length > 0;
      const hasOrderMain = gameData && gameData.ordermain && Object.keys(gameData.ordermain).length > 0;

      if ((hteam !== phteam || ateam !== pateam) && (hasOrderOppo || hasOrderMain)) {
        alert("該場比賽已有紀錄，請勿更改主/客隊");
        return;
      }

      // 如果主队或客队有更改，并且没有orderoppo或ordermain
      if (hteam !== phteam || ateam !== pateam) {
        // 删除原有主队和客队的比赛数据
        await deleteDoc(doc(firestore, "team", phteam, "games", g_id));
        await deleteGamesField(phteam, g_id);
        await deleteDoc(doc(firestore, "team",pateam, "games", g_id));
        await deleteGamesField(pateam, g_id);
      }

      // 更新或新增新主队的比赛数据和比赛日期
      await setDoc(doc(firestore, "team", hteam, "games", g_id), values);
      await updateGamesField(hteam, g_id, values.GDate);
      // 更新或新增新客队的比赛数据和比赛日期
      await setDoc(doc(firestore, "team", ateam, "games", g_id), values);
      await updateGamesField(ateam, g_id, values.GDate);

      alert("比賽資料更新成功！");
      router.push("/schedule");
    } catch (error) {
      console.error("更新比賽資料時發生錯誤:", error);
      alert("更新比賽資料時發生錯誤。");
    }
};


  async function deleteGamesField(tId, g_id) {
    const teamDocRef = doc(firestore, "team", tId);
    const teamDocSnapshot = await getDoc(teamDocRef);
    if (!teamDocSnapshot.exists()) {
      console.log("找不到或不存在球队文件。");
      return;
    }

    const teamData = teamDocSnapshot.data();
    console.log("原始 games 数据:", teamData.games);

    const gamesData = teamData.games || {};
    delete gamesData[g_id];
    console.log("删除后的 games 数据:", gamesData);

    await updateDoc(teamDocRef, { games: gamesData }, { merge: true });
    console.log("球队文件已更新，刪除了比赛数据:", tId, g_id);

    // 重新获取文档来确认删除
    const updatedTeamDocSnapshot = await getDoc(teamDocRef);
    console.log("更新后的 games 数据:", updatedTeamDocSnapshot.data().games);
  }

  async function updateGamesField(tId, g_id, GDate) {
    const teamDocRef = doc(firestore, "team", tId);
    const teamDocSnapshot = await getDoc(teamDocRef);
    if (!teamDocSnapshot.exists()) {
      console.log("找不到或不存在球隊文件。");
      return;
    }

    const teamData = teamDocSnapshot.data();
    const gamesData = teamData.games || {}; // 如果 games 字段不存在，则初始化为空对象

    // 更新或添加新游戏的 g_id 和 GDate
    gamesData[g_id] = GDate;

    await setDoc(teamDocRef, { games: gamesData }, { merge: true });
    console.log("球隊文件已更新，包含新的比賽資料:", gamesData);
  }

  const handleDelete = async () => {
    handleClose(); // 关闭对话框
    try {
      await runTransaction(firestore, async (transaction) => {
        // 获取主队ID
        const prevhquerySnapshot = await getDocs(
          query(collection(firestore, "team"), where("codeName", "==", prevhteam))
        );
        let phteam = prevhquerySnapshot.docs[0]?.id; // 假设只有一个匹配的文档

        // 获取客队ID
        const prevaquerySnapshot = await getDocs(
          query(collection(firestore, "team"), where("codeName", "==", prevateam))
        );
        let pateam = prevaquerySnapshot.docs[0]?.id; // 假设只有一个匹配的文档

        if (!phteam || !pateam) {
          console.error("未找到相应的主队或客队");
          alert("未找到相应的主队或客队");
          return; // 如果没有找到队伍，就中止操作
        }

        // 获取主队和客队的文档引用
        const phTeamDocRef = doc(firestore, "team", phteam);
        const paTeamDocRef = doc(firestore, "team", pateam);

        // 获取主队和客队的文档数据
        const phTeamDoc = await transaction.get(phTeamDocRef);
        const paTeamDoc = await transaction.get(paTeamDocRef);

        if (!phTeamDoc.exists() || !paTeamDoc.exists()) {
          throw new Error("主队或客队文件不存在!");
        }

        // 处理主队文档数据
        const phTeamData = phTeamDoc.data();
        if (phTeamData.games && phTeamData.games[g_id]) {
          delete phTeamData.games[g_id];
          transaction.update(phTeamDocRef, { games: phTeamData.games });
        }

        // 处理客队文档数据
        const paTeamData = paTeamDoc.data();
        if (paTeamData.games && paTeamData.games[g_id]) {
          delete paTeamData.games[g_id];
          transaction.update(paTeamDocRef, { games: paTeamData.games });
        }

        // 删除主队和客队的游戏记录
        const phgameDocRef = doc(firestore, "team", phteam, "games", g_id);
        const pagameDocRef = doc(firestore, "team", pateam, "games", g_id);
        transaction.delete(phgameDocRef);
        transaction.delete(pagameDocRef);
      });

      router.push("/schedule");
      alert("比賽已刪除!");
    } catch (error) {
      console.error("發生錯誤:", error);
      alert("刪除失敗!");
    }
  };

  return (
    <div>
      <form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Card>
          <CardContent>
            <Grid item xs={12} md={4}>
              <Stack spacing={1}>
                <Typography variant="h5">賽後資訊</Typography>
                <Stack></Stack>
              </Stack>
            </Grid>
            <Stack spacing={4}>
              <Typography variant="h6"></Typography>
              <Stack></Stack>
            </Stack>
            <Grid item xs={12} md={4}>
              <FormControl component="fieldset">
                <FormLabel component="legend">勝敗</FormLabel>
                <RadioGroup
                  row
                  aria-label="result"
                  name="result"
                  value={values.result}
                  onChange={handleChange}
                >
                  <FormControlLabel value="hometeam win" control={<Radio />} label="主隊勝" />
                  <FormControlLabel value="awayteam win" control={<Radio />} label="客隊勝" />
                  <FormControlLabel value="draw" control={<Radio />} label="平手" />
                  <FormControlLabel value="hometeam abstain" control={<Radio />} label="主隊棄權" />
                  <FormControlLabel value="awayteam abstain" control={<Radio />} label="客隊棄權" />
                </RadioGroup>
              </FormControl>
              <Stack spacing={4}>
                <Typography variant="h6"></Typography>
                <Stack></Stack>
              </Stack>
              <Grid item xs={12} md={12}>
                <TextField
                  fullWidth
                  label="YouTube Video Link"
                  name="youtubelink"
                  onChange={handleChange}
                  value={values.youtubelink}
                />
              </Grid>
              <Stack spacing={4}>
                <Typography variant="h6"></Typography>
                <Stack></Stack>
              </Stack>
              <Stack spacing={1}>
                <Typography variant="h5">賽前資訊</Typography>
                <Stack></Stack>
              </Stack>
              <Stack spacing={4}>
                <Typography variant="h6"></Typography>
                <Stack></Stack>
              </Stack>
            </Grid>
            <Grid container spacing={2}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth required>
                    <MobileDateTimePicker
                      label="比賽日期"
                      name="GDate"
                      onChange={handleDateChange}
                      value={values.GDate || ""}
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

                {/* <Grid item xs={12} md={2} align="center">
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
                      {gNameOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="教練"
                    name="coach"
                    onChange={handleChange}
                    value={values.coach}
                  />
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
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <Button type="submit" variant="contained" color="primary">
            確認編輯
          </Button>
          <Button
            type="button"
            sx={{
              color: "white",
              backgroundColor: "red",
              "&:hover": {
                backgroundColor: "#b2102f", // 深红色
              },
            }}
            onClick={handleClickOpen}
          >
            刪除比賽
          </Button>
        </div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"確認刪除"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              確認要刪除這場比賽嗎?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              取消
            </Button>
            <Button onClick={handleDelete} color="primary" autoFocus>
              確認
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
};
