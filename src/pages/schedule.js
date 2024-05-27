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
  CircularProgress,
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
import { firestore } from "src/firebase";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const SchedulePage = () => {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null); // 修改这里
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter(); // 使用路由器
  const [loading, setLoading] = useState(true);
  const [codeName, setcodeName] = useState(null); // 修改这里
  const [teamId, setteamId] = useState(null); // 修改这里
  const timeZone = "Asia/Taipei";
  const [values, setValues] = useState({
    hometeam: "",
    awayteam: "",
  });
  const userTeam = localStorage.getItem('userTeam') ? localStorage.getItem('userTeam').split(',') : [];
  
  const fetchGames = async () => {
    try {
      const teamCollection = collection(firestore, "team");
      const teamSnapshot = await getDocs(teamCollection);

      const teamsData = await getDocs(collection(firestore, "team"));
      const teamIdMap = new Map();
      const teamNameMap = new Map();
      const teamphotoMap = new Map();
      teamsData.forEach(doc => {
        const data = doc.data();
        teamIdMap.set(data.codeName, doc.id);
        teamNameMap.set(data.codeName, data.Name);
        teamphotoMap.set(data.codeName, data.photo);
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
              const gameData = docSnap.data();

              if (!gameData.hometeam || !gameData.awayteam) {
                console.log(gameData.hometeam, gameData.awayteam);
                console.error("Game data is missing team information");
                continue;
              }

              const hteam = teamIdMap.get(gameData.hometeam);
              const ateam = teamIdMap.get(gameData.awayteam);
              const hphoto = teamphotoMap.get(gameData.hometeam);
              const aphoto = teamphotoMap.get(gameData.awayteam);
              const homeTeamName = teamNameMap.get(gameData.hometeam);
              const awayTeamName = teamNameMap.get(gameData.awayteam);
              const titleElement = (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center', margin: '0 10px' }}>
                    <img src={aphoto} alt={`Logo of ${awayTeamName}`} style={{ width: '40px', height: '40px' }} />
                    <div style={{ fontWeight: 'bold', fontSize: '10px', color: 'black' }}>{awayTeamName}</div>
                  </div>
                  <span style={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>v.s.</span>
                  <div style={{ textAlign: 'center', margin: '0 10px' }}>
                    <img src={hphoto} alt={`Logo of ${homeTeamName}`} style={{ width: '40px', height: '40px' }} />
                    <div style={{ fontWeight: 'bold', fontSize: '10px', color: 'black' }}>{homeTeamName}</div>
                  </div>
                </div>
              );

              if (!userTeam.includes(gameData.hometeam) || !userTeam.includes(gameData.awayteam)) {
                continue;
              }

              if (!hteam || !ateam) {
                console.error("未找到相应的主队或客队");
                continue;
              }

              if (!addedTimestamps.has(timestamp)) {
                gamesData.push({
                  id: timestamp,
                  title: titleElement,
                  codeName: gameData.hometeam,
                  start: moment(game.toDate()).format('YYYY-MM-DD HH:mm:ss'),
                  end: moment(game.toDate()).format('YYYY-MM-DD HH:mm:ss'),
                  timestamp: timestamp,
                  teamId: teamId,
                  hometeamId: hteam,
                  awayteamId: ateam,
                  hcodeName: gameData.hometeam,
                  acodeName: gameData.awayteam,
                  selectedTeam: gameData.awayteam,
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
    setLoading(false);
  };

  useEffect(() => {
    fetchGames();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const handleGameClick = (game) => {
    setSelectedGame(game);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const playerattack = (action) => {
    console.log(`Action "${action}" selected for game:`, selectedGame);
    setDialogOpen(false);
        
    const selectedGameData = games.find(game => game.timestamp === selectedGame.timestamp);
    const hcodeName = selectedGameData ? selectedGameData.hcodeName : null;
    const hometeamId = selectedGameData ? selectedGameData.hometeamId : null;
    const codeName = selectedGameData ? selectedGameData.acodeName : null;
    
    router.push({
      pathname: "/playershow",
      query: { 
        timestamp: selectedGame.timestamp,
        hcodeName: hcodeName,
        teamId: hometeamId,
        codeName: codeName,
      }
    });
  };

  const playerdefence = (action) => {
    console.log(`Action "${action}" selected for game:`, selectedGame);
    setDialogOpen(false);
        
    const selectedGameData = games.find(game => game.timestamp === selectedGame.timestamp);
    const hcodeName = selectedGameData ? selectedGameData.hcodeName : null;
    const hometeamId = selectedGameData ? selectedGameData.hometeamId : null;
    const codeName = selectedGameData ? selectedGameData.acodeName : null;
    
    router.push({
      pathname: "/playershow",
      query: { 
        timestamp: selectedGame.timestamp,
        hcodeName: hcodeName,
        teamId: hometeamId,
        codeName: codeName,
      }
    });
  };
  const awayplayerattack = (action) => {
    console.log(`Action "${action}" selected for game:`, selectedGame);
    setDialogOpen(false);
        
    const selectedGameData = games.find(game => game.timestamp === selectedGame.timestamp);
    const codeName = selectedGameData ? selectedGameData.acodeName : null;
    const hcodeName = selectedGameData ? selectedGameData.hcodeName : null;
    const teamId = selectedGameData ? selectedGameData.teamId : null;
    
    router.push({
      pathname: "/awayplayershow",
      query: { 
        timestamp: selectedGame.timestamp,
        codeName: codeName,
        teamId: teamId,
        hcodeName: hcodeName,
      }
    });
  };
  const awayplayerdefence = (action) => {
    console.log(`Action "${action}" selected for game:`, selectedGame);
    setDialogOpen(false);
        
    const selectedGameData = games.find(game => game.timestamp === selectedGame.timestamp);
    const codeName = selectedGameData ? selectedGameData.acodeName : null;
    const hcodeName = selectedGameData ? selectedGameData.hcodeName : null;
    const teamId = selectedGameData ? selectedGameData.teamId : null;
    
    router.push({
      pathname: "/awayplayershow",
      query: { 
        timestamp: selectedGame.timestamp,
        codeName: codeName,
        teamId: teamId,
        hcodeName: hcodeName,
      }
    });
  };

  const recordattack = (action) => {
    console.log(`Action "${action}" selected for game:`, selectedGame);
    setDialogOpen(false);

    const selectedGameData = games.find(game => game.timestamp === selectedGame.timestamp);
    const codeName = selectedGameData ? selectedGameData.codeName : null;
    const acodeName = selectedGameData ? selectedGameData.acodeName : null;
    const teamId = selectedGameData ? selectedGameData.teamId : null;

    router.push({
      pathname: "/test",
      query: {
        timestamp: selectedGame.timestamp,
        codeName: codeName,
        teamId: teamId,
        acodeName: acodeName,
      }
    });
  };

  const handleEditGame = (action) => {
    console.log(`Action "${action}" selected for game:`, selectedGame);
    setDialogOpen(false);

    const selectedGameData = games.find(game => game.timestamp === selectedGame.timestamp);
    const codeName = selectedGameData ? selectedGameData.codeName : null;
    const teamId = selectedGameData ? selectedGameData.teamId : null;

    setDialogOpen(false);
    router.push({
      pathname: "/edit-game",
      query: {
        timestamp: selectedGame.timestamp,
        codeName: codeName,
      }
    });
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    const overlappingEvents = games.filter(
      (e) => 
        (moment(start).isSame(e.start, 'day') && moment(end).isSame(e.end, 'day')) &&
        (moment(e.start).isSameOrBefore(end) && moment(e.end).isSameOrAfter(start))
    );
  
    const baseHeight = 600; // 基礎高度
    const additionalHeight = (overlappingEvents.length - 1) * 300; // 每多一場比賽增加的高度
    const totalHeight = baseHeight + additionalHeight;
  
    const style = {
      backgroundColor: 'lightblue',
      borderRadius: '5px',
      opacity: 0.8,
      color: 'black',
      border: '0px',
      display: 'block',
      padding: '2px 10px',
      height: `20px`,
      overflow: 'hidden'
    };
  
    return {
      style: style,
      className: "game-event",
      g_id: event.g_id,
    };
  };
  const calculateCalendarHeight = (events) => {
    const eventsByDate = {};
  
    events.forEach(event => {
      const date = moment(event.start).format('YYYY-MM-DD');
      if (!eventsByDate[date]) {
        eventsByDate[date] = [];
      }
      eventsByDate[date].push(event);
    });
  
    let maxHeight = 600; // 初始高度為600px
  
    Object.values(eventsByDate).forEach(eventsOnDate => {
      if (eventsOnDate.length > 1) {
        maxHeight = Math.max(maxHeight, 600 + (eventsOnDate.length - 1) * 300);
      }
    });
  
    return maxHeight;
  };
  

  return (
    <>
      <Head>
        {/* <title>賽程表</title> */}
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
              {/* <Typography variant="h4" sx={{ whiteSpace: 'normal' }}>賽程表</Typography> */}
            </div>
            <Divider />
            <div>
              <Grid container spacing={3}>
                <Grid item xs={20} md={20} lg={12}>
                <Calendar
  localizer={localizer}
  events={games}
  startAccessor="start"
  endAccessor="end"
  style={{ height: calculateCalendarHeight(games), width: '100%' }} // 動態計算高度
  eventPropGetter={(event, start, end, isSelected) => {
    return {
      style: { backgroundColor: 'transparent', padding: '5px' },
      className: "game-event",
      g_id: event.g_id,
    };
  }}
  onSelectEvent={handleGameClick}
/>
                </Grid>
              </Grid>
            </div>
          </Stack>
        </Container>
      </Box>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogActions>
          <Button onClick={() => recordattack("記錄打擊")} color="primary">
            記錄打擊
          </Button>
          <Button onClick={() => playerattack("排主隊打擊棒次")} color="primary">
            主隊打擊與守備位置
          </Button>
          <Button onClick={() => awayplayerattack("排客隊打擊棒次")} color="primary">
            客隊打擊與守備位置
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
