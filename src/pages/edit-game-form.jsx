import React, { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/router"; // 引入 useRouter
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { firestore } from "./firebase"; // 引入您的 Firebase 初始化程式碼

export const EditGameForm = () => {
  const router = useRouter(); // 使用 useRouter

  const [values, setValues] = useState({
    gameID: "",
    date: "",
    opponent: "",
    court: "",
    name: "",
    recorder: "",
    homeAway: "",
    label: "",
  });
  const [gId, setGId] = useState('');

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const gameId = router.query.g_id;
        if (gameId) {
          const gameDoc = await firestore.collection("games").doc(gameId).get();
          if (gameDoc.exists) {
            const gameData = gameDoc.data();
            setValues((prevState) => ({
              ...prevState,
              gameID: gameId,
              date: gameData.date || "",
              opponent: gameData.opponent || "",
              court: gameData.court || "",
              name: gameData.name || "",
              recorder: gameData.recorder || "",
              homeAway: gameData.homeAway || "",
              label: gameData.label || "",
            }));
            setGId(gameId);
          }
        }
      } catch (error) {
        console.error("Error fetching game details:", error);
      }
    };

    fetchGameDetails();
  }, [router.query.g_id]);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      try {
        // 將表單資料存儲到 Firebase Firestore 中的 "games" 集合中
        await firestore.collection("games").doc().set(values);

        alert("Game information saved successfully!");
      } catch (error) {
        console.error("Error saving game information:", error);
        alert("An error occurred while saving game information.");
      }
    },
    [values]
  );

  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="The information can be edited" title="賽後資訊" />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <FormLabel>勝敗</FormLabel>
                <RadioGroup row name="homeAway" value={values.homeAway} onChange={handleChange}>
                  <FormControlLabel value="win" control={<Radio />} label="勝" />
                  <FormControlLabel value="lose" control={<Radio />} label="敗" />
                  <FormControlLabel value="tie" control={<Radio />} label="平" />
                  <FormControlLabel value="We abstain" control={<Radio />} label="我方棄權" />
                  <FormControlLabel
                    value="Opponent abstains"
                    control={<Radio />}
                    label="對手棄權"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="賽後簡報"
                name="label"
                onChange={handleChange}
                value={values.label}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="YouTube Video Link"
                name="recorder"
                onChange={handleChange}
                value={values.recorder}
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardHeader subheader="The information can be edited" title="賽前資訊" />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                                  fullWidth
                                  label="比賽日期"
                                  name="date"
                                  onChange={handleChange}
                                  value={values.date}
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <TextField
                                  fullWidth
                                  label="比賽時間"
                                  name="time"
                                  onChange={handleChange}
                                  value={values.time}
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <TextField
                                  fullWidth
                                  label="使用隊名"
                                  name="teamName"
                                  onChange={handleChange}
                                  value={values.teamName}
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <TextField
                                  fullWidth
                                  label="對手"
                                  name="opponent"
                                  onChange={handleChange}
                                  value={values.opponent}
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                  <InputLabel id="gameType-label">比賽性質</InputLabel>
                                  <Select
                                    labelId="gameType-label"
                                    id="gameType"
                                    name="gameType"
                                    value={values.gameType}
                                    onChange={handleChange}
                                  >
                                    <MenuItem value="season">季賽</MenuItem>
                                    <MenuItem value="playoff">季後賽</MenuItem>
                                    <MenuItem value="cup">盃賽</MenuItem>
                                    <MenuItem value="friendly">友誼賽</MenuItem>
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
                              <Grid item xs={12} md={6}>
                                <TextField
                                  fullWidth
                                  label="標籤"
                                  name="tag"
                                  onChange={handleChange}
                                  value={values.label}
                                />
                              </Grid>
                            </Grid>
                          </Box>
                        </CardContent>
                        <Divider />
                        <CardActions sx={{ justifyContent: "flex-end" }}>
                          <Button type="submit" variant="contained">
                            Save details
                          </Button>
                        </CardActions>
                      </Card>
                    </form>
                  );
                };
                
                 
