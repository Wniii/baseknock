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
  width: '95%',
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center', // 垂直置中
  textAlign: 'center', // 文字水平置中
};
const contentCardSx = {
  backgroundColor: '#d3d3d3',
  padding: '4px',
  height: '100px',
  //borderRadius: '4px',
  width: '95%',
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
  width: '95%',
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center', // 垂直置中
  textAlign: 'center', // 文字水平置中
};





export const OverviewLatestOrders = () => {
  const [youtubeLinks, setYoutubeLinks] = useState([]);


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

  const [teamCodeNameToNameMap, setTeamCodeNameToNameMap] = useState(new Map());

  useEffect(() => {
    const fetchTeams = async () => {
      const teamsSnapshot = await getDocs(collection(firestore, 'team'));
      const codeNameToName = new Map();

      teamsSnapshot.forEach(doc => {
        const teamData = doc.data();
        codeNameToName.set(teamData.codeName, teamData.Name);
      });

      setTeamCodeNameToNameMap(codeNameToName);
    };

    fetchTeams();
  }, []);




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
                hometeam: teamCodeNameToNameMap.get(gameData.hometeam),
                awayteam: teamCodeNameToNameMap.get(gameData.awayteam),
                ...gameData
              });
            } else if (gameDate > currentDate && gameDate < futureDate) {
              futureGames.push({
                GDate: gameDate,
                id: doc.id,
                hometeam: teamCodeNameToNameMap.get(gameData.hometeam),
                awayteam: teamCodeNameToNameMap.get(gameData.awayteam),
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

  useEffect(() => {
    const fetchYouTubeLinks = async () => {
      const teamsSnapshot = await getDocs(collection(firestore, 'team'));
      let allGames = [];
      let processedGIds = new Set(); // Set to keep track of processed g_ids

      for (const teamDoc of teamsSnapshot.docs) {
        const teamId = teamDoc.id;
        const gamesSnapshot = await getDocs(collection(firestore, 'team', teamId, 'games'));

        for (const gameDoc of gamesSnapshot.docs) {
          const gameData = gameDoc.data();
          const g_id = gameDoc.id; // Assuming the document ID is the g_id
          const gameDateTimestamp = gameData.GDate;
          const gameDate = gameDateTimestamp ? new Date(gameDateTimestamp.seconds * 1000) : null;

          if (processedGIds.has(g_id)) {
            // Skip if we have already processed this g_id
            continue;
          }

          // Add game to allGames array with additional properties if it meets the conditions
          if (gameData.youtubelink && gameDate && gameDate <= new Date()) {
            allGames.push({
              ...gameData,
              g_id: g_id,
              gameDate: gameDate,
            });
            processedGIds.add(g_id); // Add g_id to the set to avoid processing it again
          }
        }
      }

      // Filter and sort logic remains the same
      const userTeam = localStorage.getItem('userTeam') ? localStorage.getItem('userTeam').split(',') : [];
      allGames = allGames
        .filter(game => userTeam.includes(game.hometeam) && userTeam.includes(game.awayteam))
        .sort((a, b) => b.gameDate - a.gameDate);

      // Map to an array of YouTube links
      let allYouTubeLinks = allGames.map(game => {
        const videoIdMatch = game.youtubelink.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i);
        return videoIdMatch && videoIdMatch[1] ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : null;
      }).filter(link => link !== null); // Filter out any null values

      setYoutubeLinks(allYouTubeLinks);
    };

    fetchYouTubeLinks();
  }, []);


  return (



    <div>
      <div style={{ textAlign: 'center', padding: '8px' }}>
        <Typography variant="h5" fontWeight="bold">{formattedDate}</Typography>
      </div>
      <Card sx={todayCardSx}>
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
              return filteredGames.map((game, index) => {
                // 使用映射将 codeName 转换为 Name
                const homeTeamName = teamCodeNameToNameMap.get(game.hometeam) || game.hometeam;
                const awayTeamName = teamCodeNameToNameMap.get(game.awayteam) || game.awayteam;

                return (
                  <ListItem key={index}>
                    <ListItemText primary={<Typography align="center" fontSize={20} fontWeight="bold" >{`${homeTeamName}`} &nbsp;&nbsp;&nbsp;vs &nbsp;&nbsp;&nbsp;{`${awayTeamName}`}</Typography>} />
                  </ListItem>
                );
              });
            }
          })()}
        </List>
      </Card>
      <br></br>

      <div style={{ textAlign: 'left', padding: '8px', marginLeft: '30px' }}>
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
              return sortedAndFilteredFutureGames.map((game, index) => {
                // 在这里也同样使用映射转换 codeName 为 Name
                const homeTeamName = teamCodeNameToNameMap.get(game.hometeam) || game.hometeam;
                const awayTeamName = teamCodeNameToNameMap.get(game.awayteam) || game.awayteam;

                return (
                  <div key={index} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <ListItem style={{ alignItems: 'flex-start' }}>
                      <ListItemText primary={
                        <Typography align="center" fontWeight='500'>
                          {`${formatDate(game.GDate)}`}&nbsp;&nbsp;&nbsp;
                          {`${homeTeamName}`}&nbsp;&nbsp;vs&nbsp;&nbsp;{`${awayTeamName}`}
                        </Typography>
                      } />
                    </ListItem>
                  </div>
                );
              });
            }
          })()}
        </List>
      </Card>




      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Box
          sx={{
            typography: 'body1',
            marginRight: '20px',
            '& > :not(style) ~ :not(style)': {
              ml: 2,
            },
          }}

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

      <div style={{ textAlign: 'left', padding: '8px', marginLeft: '30px' }}>
        <Typography variant="h6">YouTube Links</Typography>
      </div>

      <Card sx={{ ...ytCardSx, overflow: 'hidden' }}> {/* 確保滾動只發生在 X 軸 */}
        <div style={{ display: 'flex', flexDirection: 'row', overflowX: 'auto' }}>
          {youtubeLinks.map((link, index) => (
            <div key={index} style={{ flex: '0 0 auto', width: 'calc(50% - 10px)', margin: '5px' }}> {/* 確保每個元素只占一半寬度，並且不會伸縮 */}
              <iframe
                width="100%"
                height="350" // 或者您可以設定成任何固定高度
                src={link}
                title={`YouTube video player ${index}`}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ))}
        </div>
      </Card>




    </div>

  );
};


// OverviewLatestOrders.prototype = {
//   orders: PropTypes.array,
//   sx: PropTypes.object
// };
