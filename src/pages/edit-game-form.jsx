import React, { useState, useEffect } from "react";
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
import { firestore } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { parseISO } from 'date-fns';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(firestore, "games", g_id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const gameData = docSnap.data();
          setValues((prevState) => ({
            ...prevState,
            GDate: gameData.GDate ? parseISO(gameData.GDate) : null, // 使用 parseISO 转换日期
            GTime: gameData.GTime,
            hometeam: gameData.hometeam || "",
            awayteam: gameData.awayteam || "",
            gName: gameData.gName || "",
            coach: gameData.coach || "",
            recorder: gameData.recorder || "",
            label: gameData.label || "",
            remark: gameData.remark || "",
          }));
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
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

  const handleTimeChange = (time) => {
    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
    const seconds = time.getSeconds().toString().padStart(2, "0");
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    setValues((prevState) => ({
      ...prevState,
      GTime: formattedTime || new Date().toLocaleTimeString("en-US"), // 如果 formattedTime 为空则默认为当前时间
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await updateDoc(doc(firestore, "games", g_id), values);
      alert("Game information updated successfully!");
    } catch (error) {
      console.error("Error updating game information:", error);
      alert("An error occurred while updating game information.");
    }
  };

  return (
    <div>
      <form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={5}>
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
                <Grid item xs={12} md={5}>
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
                <Grid item xs={12} md={2} align="center">
                  <Typography variant="body1" component="div" sx={{ paddingTop: "15px" }}>
                    V.S
                  </Typography>
                </Grid>
                <Grid item xs={12} md={5}>
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
                <Grid item xs={12} md={5}>
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
        <Button type="submit" variant="contained" color="primary">
          確認編輯
        </Button>
      </form>
    </div>
  );
};
