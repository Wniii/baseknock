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
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "./firebase";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const SchedulePage = () => {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null); // 修改这里
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter(); // 使用路由器
  const [codeName, setcodeName] = useState(null); // 修改这里
  const [teamId, setteamId] = useState(null); // 修改这里
  const timeZone = "Asia/Taipei";

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const teamCollection = collection(firestore, "team");
        const teamSnapshot = await getDocs(teamCollection);
    
        const gamesData = [];
        teamSnapshot.forEach((doc) => {
          const teamData = doc.data();
          const teamId = doc.id; // 获取文档ID作为团队的唯一标识符
          const teamGames = teamData.games;
          const teamCodeName = teamData.codeName;
          console.log(teamId); // 打印团队ID
          console.log(teamCodeName);
          if (teamGames) {
            Object.keys(teamGames).forEach((timestamp) => {
              const gameData = {
                id: timestamp,
                title: teamCodeName,
                start: moment(teamGames[timestamp].toDate()).format('YYYY-MM-DD HH:mm:ss'),
                end: moment(teamGames[timestamp].toDate()).format('YYYY-MM-DD HH:mm:ss'),
                timestamp: timestamp,
                teamId: teamId // 将团队ID添加到游戏数据中
              };
              gamesData.push(gameData);
            });
          }
        });
    
        setGames(gamesData);
    
        // 设置codeName状态值
        const firstTeamCodeName = teamSnapshot.docs[0]?.data()?.codeName; // 从第一个团队中获取codeName
        if(firstTeamCodeName) {
          setcodeName(firstTeamCodeName);
        }
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };
    
  
    fetchGames();
  }, []);
  

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
    
    // 从团队数据中提取codeName
    const codeName = selectedGameData ? selectedGameData.title : null;
    
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
    const codeName = selectedGameData ? selectedGameData.title : null;

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
    router.push({
      pathname: "/edit-game",
      query: { g_id: selectedGame.timestamp },
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
          <Button onClick={() => playerattack("排打擊棒次")} color="primary">
            排打擊棒次
          </Button>
          <Button onClick={() => playerdefence("排守備位置")} color="primary">
            排守備位置
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

