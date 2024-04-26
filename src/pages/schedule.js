import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router"; // 導入路由器
import {
  Box,
  Container,
  Stack,
  Typography,
  Grid,
  Divider,
  Dialog,
  DialogActions,
  Button,
} from "@mui/material";

import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import {
  doc,
  getDoc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import { firestore } from "./firebase";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { title } from "process";

const localizer = momentLocalizer(moment);

const SchedulePage = () => {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null); // 修改这里
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter(); // 使用路由器
  const [codeName, setcodeName] = useState(null); // 修改这里
  const [teamId, setteamId] = useState(null); // 修改这里
  const timeZone = "Asia/Taipei";
  const [values, setValues] = useState({
    hometeam: "",
    awayteam: "",
  });
  const userTeam = localStorage.getItem('userTeam') ? localStorage.getItem('userTeam').split(',') : [];

  // useEffect(() => {
  //   const userTeamString = localStorage.getItem("userTeam");
  //   if (userTeamString) {
  //     setUserTeam(userTeamString.split(",")); // 将字符串解析为数组
  //   }
  // }, []);
  


  const fetchGames = async () => {
    try {
      const teamCollection = collection(firestore, "team");
      const teamSnapshot = await getDocs(teamCollection);

      // 獲取所有隊伍資料，以便進行 ID 和 名稱查找
      const teamsData = await getDocs(collection(firestore, "team"));
      const teamIdMap = new Map();
      const teamNameMap = new Map();
      teamsData.forEach(doc => {
        const data = doc.data();
        teamIdMap.set(data.codeName, doc.id);
        teamNameMap.set(data.codeName, data.Name);  // 保存 codeName 到 name 的映射
      });

      const gamesData = [];
      const addedTimestamps = new Set();

      for (const teamDoc of teamSnapshot.docs) {
        const teamId = teamDoc.id;
        const teamData = teamDoc.data();
        const teamGames = teamData.games;

        if (teamGames) {
          for (const timestamp of Object.keys(teamGames)) {
            const game = teamGames[timestamp];
            const docRef = doc(firestore, "team", teamId, "games", timestamp);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              console.log("Document data:", docSnap.data()); // Debug log
              const gameData = docSnap.data();

              if (!gameData.hometeam || !gameData.awayteam) {
                console.log(gameData.hometeam, gameData.awayteam);
                console.error("Game data is missing team information");
                continue; // Skip this game if team data is incomplete
              }

              const hteam = teamIdMap.get(gameData.hometeam);
              const ateam = teamIdMap.get(gameData.awayteam);
              const homeTeamName = teamNameMap.get(gameData.hometeam);
              const awayTeamName = teamNameMap.get(gameData.awayteam);
              //const title = `${homeTeamName} v.s. ${awayTeamName}`; //Name
              const title = `${gameData.hometeam} v.s. ${gameData.awayteam}`; //codeName

              if (!userTeam.includes(gameData.hometeam) || !userTeam.includes(gameData.awayteam)) {
                continue; // Skip to the next game if neither team matches
              }


              if (!hteam || !ateam) {
                console.error("未找到相应的主队或客队");
                continue;  // 如果没有找到队伍，就跳过这场比赛
              }

             
              if (!addedTimestamps.has(timestamp)) {
                gamesData.push({
                  id: timestamp,
                  title: title,
                  codeName: teamData.codeName,
                  start: moment(game.toDate()).format('YYYY-MM-DD HH:mm:ss'),
                  end: moment(game.toDate()).format('YYYY-MM-DD HH:mm:ss'),
                  timestamp: timestamp,
                  teamId: teamId,
                  hometeamId: hteam,
                  awayteamId: ateam,
                  hcodeName: gameData.hometeam,
                  acodeName: gameData.awayteam,
                  selectedTeam: gameData.awayteam
                });
                addedTimestamps.add(timestamp);
              }
            }
          }
        }
      }

      setGames(gamesData);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);






  // 其餘函數保持不變...



  console.log(games)
  // Handle click on a game event
  const handleGameClick = (game) => {
    setSelectedGame(game);
    setDialogOpen(true);
  };

  // Close the dialog
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  // Handle actions
  const playerattack = (action) => {
    console.log(`Action "${action}" selected for game:`, selectedGame);
    setDialogOpen(false); // Close the dialog after action

    // 获取选定游戏的团队数据
    const selectedGameData = games.find(game => game.timestamp === selectedGame.timestamp);

    // 从团队数据中提取codeName 和 hometeam
    const hcodeName = selectedGameData ? selectedGameData.hcodeName : null;
    const hometeamId = selectedGameData ? selectedGameData.hometeamId : null;


    // 获取选定游戏的团队ID
    const teamId = selectedGameData ? selectedGameData.teamId : null;

    // 导航到新页面，同时将codeName、hometeam和teamId添加到查询参数中
    router.push({
      pathname: "/playershow",
      query: {
        timestamp: selectedGame.timestamp,
        codeName: hcodeName, // Add codeName to the query
        teamId: hometeamId // Add teamId to the query
      }
    });
  };

  const playerdefence = (action) => {
    console.log(`Action "${action}" selected for game:`, selectedGame);
    setDialogOpen(false); // Close the dialog after action

    // 获取选定游戏的团队数据
    const selectedGameData = games.find(game => game.timestamp === selectedGame.timestamp);
    const hcodeName = selectedGameData ? selectedGameData.hcodeName : null;
    const hometeamId = selectedGameData ? selectedGameData.hometeamId : null;


    // 导航到新页面，同时将codeName和teamId添加到查询参数中
    router.push({
      pathname: "/playershow",
      query: {
        timestamp: selectedGame.timestamp,
        codeName: hcodeName, // Add codeName to the query
        teamId: hometeamId // Add teamId to the query
      }
    });
  };
  const awayplayerattack = (action) => {
    console.log(`Action "${action}" selected for game:`, selectedGame);
    setDialogOpen(false); // Close the dialog after action

    // 获取选定游戏的团队数据
    const selectedGameData = games.find(game => game.timestamp === selectedGame.timestamp);

    // 从团队数据中提取codeName
    const codeName = selectedGameData ? selectedGameData.codeName : null;

    // 获取选定游戏的团队ID
    const teamId = selectedGameData ? selectedGameData.teamId : null;

    // 导航到新页面，同时将codeName和teamId添加到查询参数中
    router.push({
      pathname: "/playershow",
      query: {
        timestamp: selectedGame.timestamp,
        codeName: codeName, // Add codeName to the query
        teamId: teamId // Add teamId to the query
      }
    });
  };
  const awayplayerdefence = (action) => {
    console.log(`Action "${action}" selected for game:`, selectedGame);
    setDialogOpen(false); // Close the dialog after action

    // 获取选定游戏的团队数据
    const selectedGameData = games.find(game => game.timestamp === selectedGame.timestamp);

    // 从团队数据中提取codeName
    const codeName = selectedGameData ? selectedGameData.codeName : null;

    // 获取选定游戏的团队ID
    const teamId = selectedGameData ? selectedGameData.teamId : null;

    // 导航到新页面，同时将codeName和teamId添加到查询参数中
    router.push({
      pathname: "/playershow",
      query: {
        timestamp: selectedGame.timestamp,
        codeName: codeName, // Add codeName to the query
        teamId: teamId // Add teamId to the query
      }
    });
  };


  const recordattack = (action) => {
    console.log(`Action "${action}" selected for game:`, selectedGame);
    setDialogOpen(false); // Close the dialog after action

    // 获取选定游戏的团队数据
    const selectedGameData = games.find(game => game.timestamp === selectedGame.timestamp);

    // 从团队数据中提取codeName
    const codeName = selectedGameData ? selectedGameData.codeName : null;

    const teamId = selectedGameData ? selectedGameData.teamId : null;


    // 导航到新页面，同时将codeName和teamId添加到查询参数中
    router.push({
      pathname: "/test",
      query: {
        timestamp: selectedGame.timestamp,
        codeName: codeName, // Add codeName to the query
        teamId: teamId // Add teamId to the query
      }
    });
  };





  const handleEditGame = (action) => {
    console.log(`Action "${action}" selected for game:`, selectedGame);
    setDialogOpen(false); // Close the dialog after action

    // 获取选定游戏的团队数据
    const selectedGameData = games.find(game => game.timestamp === selectedGame.timestamp);

    // 从团队数据中提取codeName
    const codeName = selectedGameData ? selectedGameData.codeName : null;

    const teamId = selectedGameData ? selectedGameData.teamId : null;

    setDialogOpen(false); // Close the dialog after action
    router.push({
      pathname: "/edit-game",
      query: {
        timestamp: selectedGame.timestamp,
        codeName: codeName, // Add codeName to the query
      }
    });
  };

  return (
    <>
      <Head>
        <title>賽程表</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 0,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">賽程表</Typography>
            </div>
            <Divider />
            <div>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={12}>
                  <Calendar
                    localizer={localizer}
                    events={games} // Pass the games data to the events property
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 700 }}
                    eventPropGetter={(event, start, end, isSelected) => {
                      return {
                        className: "game-event",
                        g_id: event.g_id,
                      };
                    }}
                    onSelectEvent={handleGameClick} // Handle click on a game event
                  />
                </Grid>
              </Grid>
            </div>
          </Stack>
        </Container>
      </Box>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogActions>
          {/* <Button onClick={() => recorddefence("記錄防守")} color="primary" autoFocus>
            記錄防守
          </Button> */}
          <Button onClick={() => recordattack("記錄打擊")} color="primary">
            記錄打擊
          </Button>
          <Button onClick={() => playerattack("排主隊打擊棒次")} color="primary">
            排主隊打擊棒次
          </Button>
          <Button onClick={() => playerdefence("排主隊守備位置")} color="primary">
            排主隊守備位置
          </Button>
          <Button onClick={() => awayplayerattack("排客隊打擊棒次")} color="primary">
            排客隊打擊棒次
          </Button>
          <Button onClick={() => awayplayerdefence("排客隊守備位置")} color="primary">
            排客隊守備位置
          </Button>
          <Button onClick={() => handleEditGame("編輯比賽資訊")} color="primary">
            編輯比賽資訊
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
SchedulePage.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);
export default SchedulePage;

