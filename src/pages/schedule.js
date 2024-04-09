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
  const [selectedGame, setSelectedGame] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter(); // 使用路由器

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const gamesCollection = collection(firestore, "games");
        const gamesSnapshot = await getDocs(gamesCollection);
        const gamesData = gamesSnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().g_id,
          start: new Date(doc.data().GDate),
          end: new Date(doc.data().GDate),
          g_id: doc.data().g_id,
        }));
        setGames(gamesData);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchGames();
  }, []);

  const handleGameClick = (game) => {
    setSelectedGame(game);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDefence = (action) => {
    // Handle action based on selected game and action type
    console.log(`Action "${action}" selected for game:`, selectedGame);
    setDialogOpen(false); // Close the dialog after action

    // 導航到另一個頁面並將 g_id 傳遞作為查詢參數
    router.push({
      pathname: "/playershow",
      query: { g_id: selectedGame.g_id },
    });
  };
  const handleattack = (action) => {
    // Handle action based on selected game and action type
    console.log(`Action "${action}" selected for game:`, selectedGame);
    setDialogOpen(false); // Close the dialog after action

    // 導航到另一個頁面並將 g_id 傳遞作為查詢參數
    router.push({
      pathname: "/playershow",
      query: { g_id: selectedGame.g_id },
    });
  };
  const handleplayershow = (action) => {
    // Handle action based on selected game and action type
    console.log(`Action "${action}" selected for game:`, selectedGame);
    setDialogOpen(false); // Close the dialog after action

    // 導航到另一個頁面並將 g_id 傳遞作為查詢參數
    router.push({
      pathname: "/playershow",
      query: { g_id: selectedGame.g_id },
    });
  };
  const handledefenceplace = (action) => {
    // Handle action based on selected game and action type
    console.log(`Action "${action}" selected for game:`, selectedGame);
    setDialogOpen(false); // Close the dialog after action

    // 導航到另一個頁面並將 g_id 傳遞作為查詢參數
    router.push({
      pathname: "/playershow",
      query: { g_id: selectedGame.g_id },
    });
  };
  const handleEditGame = (action) => {
    // Handle action based on selected game and action type
    console.log(`Action "${action}" selected for game:`, selectedGame);
    setDialogOpen(false); // Close the dialog after action

    // 導航到另一個頁面並將 g_id 傳遞作為查詢參數
    router.push({
        pathname: "/edit-game",
        query: { g_id: selectedGame.g_id },
      });          
  };
  const handleAction = (action) => {
    // Handle action based on selected game and action type
    console.log(`Action "${action}" selected for game:`, selectedGame);
    setDialogOpen(false); // Close the dialog after action

    // 導航到另一個頁面並將 g_id 傳遞作為查詢參數
    router.push({
      pathname: "/playershow",
      query: { g_id: selectedGame.g_id },
    });
  };

  const CustomToolbar = ({ label, onNavigate }) => {
    const handlePrevYear = () => {
      const newDate = moment(label).subtract(1, "year");
      onNavigate("DATE", newDate.toDate());
    };

    const handleNextYear = () => {
      const newDate = moment(label).add(1, "year");
      onNavigate("DATE", newDate.toDate());
    };
    const handleattack = (action) => {
        // Handle action based on selected game and action type
        console.log(`Action "${action}" selected for game:`, selectedGame);
        setDialogOpen(false); // Close the dialog after action

        // 導航到另一個頁面並將 g_id 傳遞作為查詢參數
        router.push({
            pathname: '/test',
            query: { g_id: selectedGame.g_id }
        });
    };
    const handleplayershow = (action) => {
        // Handle action based on selected game and action type
        console.log(`Action "${action}" selected for game:`, selectedGame);
        setDialogOpen(false); // Close the dialog after action

        // 導航到另一個頁面並將 g_id 傳遞作為查詢參數
        router.push({
            pathname: '/playershow',
            query: { g_id: selectedGame.g_id }
        });
    };
    const handledefenceplace = (action) => {
        // Handle action based on selected game and action type
        console.log(`Action "${action}" selected for game:`, selectedGame);
        setDialogOpen(false); // Close the dialog after action

        // 導航到另一個頁面並將 g_id 傳遞作為查詢參數
        router.push({
            pathname: '/DefencePlacePage',
            query: { g_id: selectedGame.g_id }
        });
    };
    const handleAction = (action) => {
        // Handle action based on selected game and action type
        console.log(`Action "${action}" selected for game:`, selectedGame);
        setDialogOpen(false); // Close the dialog after action

        // 導航到另一個頁面並將 g_id 傳遞作為查詢參數
        router.push({
            pathname: '/playershow',
            query: { g_id: selectedGame.g_id }
        });
    };

    const CustomToolbar = ({ label, onNavigate }) => {
        const handlePrevYear = () => {
            const newDate = moment(label).subtract(1, 'year');
            onNavigate('DATE', newDate.toDate());
        };

        const handleNextYear = () => {
            const newDate = moment(label).add(1, 'year');
            onNavigate('DATE', newDate.toDate());
        };

        return (
            <div className="toolbar">
                <Typography variant="h6">{label}</Typography>
                <button onClick={() => onNavigate('TODAY')}>今天</button>
                <button onClick={() => onNavigate('PREV')}>上個月</button>
                <button onClick={() => onNavigate('NEXT')}>下個月</button>
                <button onClick={handlePrevYear}>上一年</button>
                <button onClick={handleNextYear}>下一年</button>
            </div>
        );
    };

    return (
      <div className="toolbar">
        <Typography variant="h6">{label}</Typography>
        <button onClick={() => onNavigate("TODAY")}>今天</button>
        <button onClick={() => onNavigate("PREV")}>上個月</button>
        <button onClick={() => onNavigate("NEXT")}>下個月</button>
        <button onClick={handlePrevYear}>上一年</button>
        <button onClick={handleNextYear}>下一年</button>
      </div>
    );
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
                    events={games}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 700 }}
                    eventPropGetter={(event, start, end, isSelected) => {
                      return {
                        className: "game-event",
                        g_id: event.g_id,
                      };
                    }}
                    components={{
                      toolbar: CustomToolbar,
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
          <Button onClick={() => handleDefence("記錄防守")} color="primary" autoFocus>
            記錄防守
          </Button>
          <Button onClick={() => handleattack("記錄打擊")} color="primary">
            記錄打擊
          </Button>
          <Button onClick={() => handleplayershow("排打擊棒次")} color="primary">
            排打擊棒次
          </Button>
          <Button onClick={() => handledefenceplace("排守備位置")} color="primary">
            排守備位置
          </Button>
          <Button onClick={() => handleEditGame("編輯比賽資訊")} color="primary">
            編輯比賽資訊
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

SchedulePage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default SchedulePage;
