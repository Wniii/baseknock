import React, { useCallback, useState, useEffect } from 'react';
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
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { firestore } from "./firebase"; 
import { useRouter } from 'next/router';
import { doc, getDoc, updateDoc } from "firebase/firestore"; 

const hometeamOptions = [
  { value: 'fju', label: '輔仁大學' },
  { value: 'kpbl', label: '卡皮巴拉' }
];

const awayteamOptions = [
  { value: 'fju', label: '輔仁大學' },
  { value: 'kpbl', label: '卡皮巴拉' }
];

const gNameOptions = [
  { value: 'friendly', label: '友誼賽' },
  { value: 'ubl', label: '大專盃' },
  { value: 'mei', label: '梅花旗' }
];

const labelOptions = [
  { value: 'top8', label: '八強賽' },
  { value: 'top4', label: '四強賽' },
  { value: 'champ', label: '冠亞賽' },
  { value: 'others', label: '其他' }
];

export const EditGame = ({ g_id }) => {
  const router = useRouter(); // 使用路由器
  const [values, setValues] = useState({
    GDate: null,
    GTime: null,
    hometeam: '',
    awayteam: '',
    gName: '',
    coach: '',
    recorder: '',
    label: '',
    remark: '',
  });

  useEffect(() => {
    const { query } = router;
  
    // 从路由参数中获取 g_id
    if (query && query.g_id) {
      setValues((prevState) => ({
        ...prevState,
        g_id: query.g_id
      }));
    }

  }, [router.query]);

  useEffect(() => {
    console.log('Received g_id:', g_id);
    const fetchGameDetails = async () => {
      try {
        const gameDoc = await getDoc(doc(firestore, "games", g_id));
        if (gameDoc.exists()) {
          const gameData = gameDoc.data();
          setValues(gameData);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching game details:", error);
      }
    };

    fetchGameDetails();
  }, [g_id]);

  const handleChange = useCallback((event) => {
    if (event.target && event.target.name) {
      const { name, value } = event.target;
      setValues((prevState) => ({
        ...prevState,
        [name]: value
      }));
    }
  }, []);

  const handleDateChange = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    setValues((prevState) => ({
      ...prevState,
      GDate: formattedDate
    }));
  };

  const handleTimeChange = (time) => {
    setValues((prevState) => ({
      ...prevState,
      GTime: time
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
            <Grid container spacing={4}>
              <DatePicker
                label="比賽日期"
                name="GDate"
                onChange={handleDateChange}
                required
                value={values.GDate}
                fullWidth
              />
              <Grid item xs={12} md={5}>
                <TimePicker
                  label="比賽時間"
                  name="GTime"
                  onChange={handleTimeChange}
                  required
                  value={values.GTime}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <FormControl fullWidth required>
                  <InputLabel>主隊</InputLabel>
                  <Select
                    value={values.hometeam}
                    onChange={handleChange}
                    name="hometeam"
                  >
                    {hometeamOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2} align="center">
                <Typography variant="body1" component="div" sx={{ paddingTop: '15px' }}>V.S</Typography>
              </Grid>
              <Grid item xs={12} md={5}>
                <FormControl fullWidth required>
                  <InputLabel>客隊</InputLabel>
                  <Select
                    value={values.awayteam}
                    onChange={handleChange}
                    name="awayteam"
                  >
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
                  <Select
                    value={values.gName}
                    onChange={handleChange}
                    name="gName"
                  >
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
                  <Select
                    value={values.label}
                    onChange={handleChange}
                    name="label"
                  >
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
          </CardContent>
        </Card>
        <Button type="submit" variant="contained" color="primary">
          確認編輯
        </Button>
      </form>
    </div>
  );
};
