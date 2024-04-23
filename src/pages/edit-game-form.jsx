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
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { deleteDoc } from "firebase/firestore";
import { CircularProgress } from "@mui/material";
import { runTransaction } from "firebase/firestore";

// const hometeamOptions = [
//   { value: "fju", label: "輔仁大學" },
//   { value: "kpbl", label: "卡皮巴拉" },
// ];

// const awayteamOptions = [
//   { value: "fju", label: "輔仁大學" },
//   { value: "kpbl", label: "卡皮巴拉" },
// ];

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

export const EditGame = ({ g_id }) => {
  const [teamOptions, setTeamOptions] = useState([]);
  const router = useRouter();
  const [values, setValues] = useState({
    GDate: null,
    GTime: null,
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
    { value: 'loadingHome', label: '加载主队数据...' }
  ]);
  const [awayteamOptions, setAwayteamOptions] = useState([
    { value: 'loadingAway', label: '加载客队数据...' }
  ]);
  
  useEffect(() => {
    const userTeamsString = localStorage.getItem("userTeam");
    let initialHomeTeams = [];
    let initialAwayTeams = [];
  
    if (userTeamsString) {
      const userTeams = userTeamsString.split(",");
      initialHomeTeams = userTeams.map(team => ({ value: team, label: team }));
      initialAwayTeams = userTeams.map(team => ({ value: team, label: team }));
    } else {
      initialHomeTeams = [{ value: 'noHome', label: '无可选主队' }];
      initialAwayTeams = [{ value: 'noAway', label: '无可选客队' }];
    }
  
    setHometeamOptions(initialHomeTeams);
    setAwayteamOptions(initialAwayTeams);
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const docRef = doc(firestore, "team", "111", "games", g_id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const gameData = docSnap.data();
          setValues({
            result: gameData.result || "",
            youtubelink: gameData.youtubelink || "",
            GDate: gameData.GDate ? gameData.GDate.toDate() : null,
            GTime: gameData.GTime,
            hometeam: gameData.hometeam || "",
            awayteam: gameData.awayteam || "",
            gName: gameData.gName || "",
            coach: gameData.coach || "",
            recorder: gameData.recorder || "",
            label: gameData.label || "",
            remark: gameData.remark || "",
          });
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [g_id]);

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
      await updateDoc(doc(firestore, "team", "111", "games", g_id), values);
      alert("Game information updated successfully!");
      router.push("/schedule");
    } catch (error) {
      console.error("Error updating game information:", error);
      alert("An error occurred while updating game information.");
    }
  };

  const handleDelete = async () => {
    handleClose(); // 关闭对话框
    try {
      await runTransaction(firestore, async (transaction) => {
        const gameDocRef = doc(firestore, "team", "111", "games", g_id);
        const teamDocRef = doc(firestore, "team", "111");

        // 先读取 team 文档
        const teamDoc = await transaction.get(teamDocRef);
        if (!teamDoc.exists()) {
          throw new Error("Document does not exist!");
        }

        // 处理 team 文档数据
        const teamData = teamDoc.data();
        const gamesData = teamData.games || {};
        if (gamesData[g_id]) {
          delete gamesData[g_id];
          // 在所有读取之后进行写入操作
          transaction.update(teamDocRef, { games: gamesData });
        }

        // 删除游戏记录
        transaction.delete(gameDocRef);
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
                <Typography variant="h6">賽後資訊</Typography>
                <Stack></Stack>
              </Stack>
              <Stack spacing={1}>
                <Typography variant="h9">卡皮巴拉</Typography>
                <Stack>
                  <div>
                    <TextField
                      label="1"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="2"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="3"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="4"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="5"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="6"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="7"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="8"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="9"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                  </div>
                </Stack>
              </Stack>
              <Stack spacing={1}>
                <Typography variant="h9">輔仁大學</Typography>
                <Stack>
                  <div>
                    <TextField
                      label="1"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="2"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="3"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="4"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="5"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="6"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="7"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="8"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="9"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                  </div>
                </Stack>
                <Stack spacing={1}>
                  <Typography variant="h9">失誤</Typography>
                  <Stack>
                    <div>
                      <TextField
                        label="1"
                        id="standard-size-normal"
                        defaultValue="0"
                        size="normal"
                        variant="standard"
                        sx={{ width: "50px" }}
                      />
                      <TextField
                        label="2"
                        id="standard-size-normal"
                        defaultValue="0"
                        size="normal"
                        variant="standard"
                        sx={{ width: "50px" }}
                      />
                      <TextField
                        label="3"
                        id="standard-size-normal"
                        defaultValue="0"
                        size="normal"
                        variant="standard"
                        sx={{ width: "50px" }}
                      />
                      <TextField
                        label="4"
                        id="standard-size-normal"
                        defaultValue="0"
                        size="normal"
                        variant="standard"
                        sx={{ width: "50px" }}
                      />
                      <TextField
                        label="5"
                        id="standard-size-normal"
                        defaultValue="0"
                        size="normal"
                        variant="standard"
                        sx={{ width: "50px" }}
                      />
                      <TextField
                        label="6"
                        id="standard-size-normal"
                        defaultValue="0"
                        size="normal"
                        variant="standard"
                        sx={{ width: "50px" }}
                      />
                      <TextField
                        label="7"
                        id="standard-size-normal"
                        defaultValue="0"
                        size="normal"
                        variant="standard"
                        sx={{ width: "50px" }}
                      />
                      <TextField
                        label="8"
                        id="standard-size-normal"
                        defaultValue="0"
                        size="normal"
                        variant="standard"
                        sx={{ width: "50px" }}
                      />
                      <TextField
                        label="9"
                        id="standard-size-normal"
                        defaultValue="0"
                        size="normal"
                        variant="standard"
                        sx={{ width: "50px" }}
                      />
                    </div>
                  </Stack>
                </Stack>
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
                  <FormControlLabel value="win" control={<Radio />} label="勝" />
                  <FormControlLabel value="lose" control={<Radio />} label="敗" />
                  <FormControlLabel value="draw" control={<Radio />} label="平" />
                  <FormControlLabel value="We abstain" control={<Radio />} label="我方棄權" />
                  <FormControlLabel value="opponent abstain" control={<Radio />} label="對方棄權" />
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
                <Typography variant="h6">賽前資訊</Typography>
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
