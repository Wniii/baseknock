import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from 'src/pages/firebase';

// import React from 'react';

import { useState, useEffect } from 'react';
import 'react-calendar/dist/Calendar.css';

import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { Typography } from '@mui/material';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

import Link from '@mui/material/Link';

const preventDefault = (event) => event.preventDefault();


const style = {
  py: 0,
  width: '100%',
  maxWidth: 360,
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  backgroundColor: 'background.paper',
};
const todayCardSx = {
  backgroundColor: '#d3d3d3',
  padding: '4px',
  //borderRadius: '4px',
  height: '100px',
  width: 'auto',
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center', // 垂直置中
  textAlign: 'center', // 文字水平置中
};
const contentCardSx = {
  backgroundColor: '#d3d3d3',
  padding: '4px',
  //borderRadius: '4px',
  width: 'auto',
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center', // 垂直置中
  textAlign: 'center', // 文字水平置中
};
const sx = {
  backgroundColor: '#d3d3d3',
  padding: '4px',
  borderRadius: '4px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center', // 垂直置中
  textAlign: 'center', // 文字水平置中
  position: 'relative'
};
const addSx = {
  backgroundColor: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center', // 垂直置中
  textAlign: 'right', // 文字水平置中
  ml: 'auto',
  position: 'absolute',
  top: 160,
  right: 30,
};
const ytCardSx = {
  backgroundColor: '#d3d3d3',
  padding: '4px',
  //borderRadius: '4px',
  width: 'auto',
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center', // 垂直置中
  textAlign: 'center', // 文字水平置中
};





export const OverviewLatestOrders = () => {

  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  const formattedDate = `${year}/${month}/${day}`;



  const [games, setGames] = useState([]);
  const [futureGames, setFutureGames] = useState([]);
  console.log(futureGames)
  console.log(games)

  const userTeam = localStorage.getItem('userTeam') ? localStorage.getItem('userTeam').split(',') : [];



  useEffect(() => {
    const fetchGames = async () => {
      try {
        const teamsQuerySnapshot = await getDocs(collection(firestore, 'team'));
        
        const teams = teamsQuerySnapshot.docs.map(doc => doc.data());
        let filteredGames = [];
        let futureGames = [];
        let gameIds = new Set(); // 用來存儲已經加入的 g_id
        
  
        for (const teamDoc of teamsQuerySnapshot.docs) {
          const teamData = teamDoc.data();
          const teamId = teamDoc.id;
  
          const teamGamesQuerySnapshot = await getDocs(collection(firestore, 'team', teamId, 'games'));
          for (const doc of teamGamesQuerySnapshot.docs) {
            const gameData = doc.data();
            if (!gameData.GDate || gameIds.has(doc.id)) { // 檢查是否已經處理過這個 g_id
              continue;
            }
            gameIds.add(doc.id); // 添加 g_id 到 Set 中以避免重複
            const gameDateTimestamp = gameData.GDate;
            const gameDate = new Date(gameDateTimestamp.seconds * 1000);
            const formattedGameDate = `${gameDate.getFullYear()}/${(gameDate.getMonth() + 1).toString().padStart(2, '0')}/${gameDate.getDate().toString().padStart(2, '0')}`;
            console.log(formattedGameDate);
            const today = new Date();
            const formattedToday = `${today.getFullYear()}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}`;
            const currentDate = new Date();
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 6);

            
  
            if (formattedGameDate === formattedToday) {
              filteredGames.push({
                id: doc.id,
                hometeam: gameData.hometeam,
                awayteam: gameData.awayteam,
                ...gameData
              });
            } else if (gameDate > currentDate && gameDate < futureDate) {
              futureGames.push({
                GDate: gameDate,
                id: doc.id,
                hometeam: gameData.hometeam,
                awayteam: gameData.awayteam,
                ...gameData
              });
            }
          }
        }
        setGames(filteredGames);
        futureGames.sort((a, b) => a.GDate - b.GDate);
        setFutureGames(futureGames);
        console.log(futureGames);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };
  
    fetchGames();
  }, []);
  

  const isTeamInUserTeams = (hometeam, awayteam) => {
    return userTeam.includes(hometeam) && userTeam.includes(awayteam);
  };


  // 检查日期是否在未来五天内但不包括今天的辅助函数

  const formatDate = (timestamp) => {
    const date = timestamp.toDate(); // 将 Firestore Timestamp 转换为 JavaScript Date 对象
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}/${month}/${day}`;
  };







  return (

    <div>
      <div style={{ textAlign: 'center', padding: '8px' }}>
        <Typography variant="h5" fontWeight="bold">{formattedDate}</Typography>
      </div>
      <Card sx={{ backgroundColor: '#d3d3d3', padding: '4px', width: 'auto', margin: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
        <List sx={{ backgroundColor: '#d3d3d3', padding: '4px', borderRadius: '4px', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', position: 'relative' }}>
          {(() => {
            const filteredGames = games.filter(game => isTeamInUserTeams(game.hometeam, game.awayteam));
            if (filteredGames.length === 0) {
              return (
                <ListItem>
                  <ListItemText primary={<Typography align="center" fontSize={20} fontWeight="bold">今日尚無比賽</Typography>} />
                </ListItem>
              );
            } else {
              return filteredGames.map((game, index) => (
                <ListItem key={index}>
                  <ListItemText primary={<Typography align="center" fontSize={20} fontWeight="bold" >{`${game.hometeam} vs ${game.awayteam}`}</Typography>} />
                </ListItem>
              ));
            }
          })()}
        </List>
      </Card>
      <br></br>

      <div style={{ textAlign: 'left', padding: '8px', marginLeft: '25px' }}>
        <Typography variant="h6">coming up...</Typography>
      </div>

      <Card sx={contentCardSx}>
        <List sx={sx}>
          {(() => {
            // Sort games by date first
            const sortedAndFilteredFutureGames = futureGames
              .sort((a, b) => new Date(a.GDate) - new Date(b.GDate)) // Ensure GDate is in a format that can be parsed by Date constructor
              .filter(game => isTeamInUserTeams(game.hometeam, game.awayteam));

            if (sortedAndFilteredFutureGames.length === 0) {
              return (
                <ListItem>
                  <ListItemText primary={<Typography align="center" fontSize={20} fontWeight='500'>近一週尚無比賽</Typography>} />
                </ListItem>
              );
            } else {
              return sortedAndFilteredFutureGames.map((game, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <ListItem style={{ alignItems: 'flex-start' }}>
                    <ListItemText primary={<Typography align="center" fontWeight='500'>{`${formatDate(game.GDate)}`}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{`${game.hometeam} vs ${game.awayteam}`}</Typography>} />
                  </ListItem>
                </div>

              ));
            }
          })()}
        </List>
      </Card>




      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Box
          sx={{
            typography: 'body1',
            '& > :not(style) ~ :not(style)': {
              ml: 2,
            },
          }}
          onClick={preventDefault}
        >
          <Link href="/schedule">
            <Button
              color="inherit"
              endIcon={(
                <SvgIcon fontSize="small">
                  <ArrowRightIcon />
                </SvgIcon>
              )}
              size="small"
              variant="text"
            >
              View more
            </Button>
          </Link>

        </Box>
      </CardActions>

      <div style={{ textAlign: 'left', padding: '8px', marginLeft: '25px' }}>
        <Typography variant="h6">YouTube Links</Typography>
      </div>

      <Card sx={ytCardSx}>
        <List sx={sx}>
          <Scrollbar sx={{ flexGrow: 1 }}>
            <ImageList sx={{ height: 450, width: 1150 }} cols={3}>
              <ImageListItem key="Subheader" cols={3}>
              </ImageListItem>
              {itemData.map((item) => (
                <ImageListItem key={item.img} cols={1}>
                  <img
                    srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    src={`${item.img}?w=248&fit=crop&auto=format`}
                    //alt={item.title}
                    loading="lazy"
                    align="center"
                  />
                  <ImageListItemBar
                    title={item.title}
                    // subtitle={<span>by: {item.author}</span>}
                    position="below"
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Scrollbar>
        </List>
      </Card>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          endIcon={(
            <SvgIcon fontSize="small">
              <ArrowRightIcon />
            </SvgIcon>
          )}
          size="small"
          variant="text"
        >
          View more
        </Button>
      </CardActions>
    </div>
  );
};
const itemData = [
  {
    img: 'https://www.japantimes.co.jp/uploads/imported_images/uploads/2023/06/np_file_232569.jpeg',
    title: '230930|練習賽|v.s卡皮巴拉',
    rows: 1,
    cols: 3,
    featured: true,
  },
  {
    img: 'https://media.newyorker.com/photos/650c81455e099cd38ea4d9d3/master/w_2560%2Cc_limit/thomas-shohei%2520ohtani.jpg',
    title: '231002|練習賽|v.s卡皮巴拉',

  },
  {
    img: 'https://i.cbc.ca/1.7050798.1701907110!/fileImage/httpImage/image.JPG_gen/derivatives/16x9_780/ohtani-v-jays.JPG',
    title: '231003|練習賽|v.s卡皮巴拉',
    featured: true,
  },]

// OverviewLatestOrders.prototype = {
//   orders: PropTypes.array,
//   sx: PropTypes.object
// };
