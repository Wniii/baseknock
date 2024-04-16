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
} from "@mui/material";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import { firestore } from "./firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { deleteDoc } from "firebase/firestore";
import { CircularProgress } from "@mui/material";
import { runTransaction } from "firebase/firestore";

const hometeamOptions = [
  { value: "fju", label: "輔仁大學" },
  { value: "kpbl", label: "卡皮巴拉" },
];

const awayteamOptions = [
  { value: "fju", label: "輔仁大學" },
  { value: "kpbl", label: "卡皮巴拉" },
];

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
  const router = useRouter();
  const [values, setValues] = useState({
    GDate: null, // 初始化为空字符串，而非 null
    GTime: null, // 初始化为空字符串，而非 null
    hometeam: "",
    awayteam: "",
    gName: "",
    coach: "",
    recorder: "",
    label: "",
    remark: "",
  });

  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false); // 控制对话框显示

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const docRef = doc(firestore, "team", "111", "games", g_id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const gameData = docSnap.data();
          setValues({
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
      router.push("/schedule");
      alert("Game information updated successfully!");
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
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <Button type="submit" variant="contained" color="primary">
            確認編輯
          </Button>
          <Button
            type="button"
            sx={{
              color: 'white',
              backgroundColor: 'red',
              '&:hover': {
                backgroundColor: '#b2102f', // 深红色
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
