import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import SearchIcon from '@mui/icons-material/Search';
import { firestore } from 'src/pages/firebase';
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

// 定義 HitrecordTable 組件
export const HitrecordTable = ({ selectedTeam, selectedColumns }) => {
  const [open, setOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playersData, setPlayersData] = useState([]);
  const [playerPlateAppearances, setPlayerPlateAppearances] = useState({});
  const [currentPlayerName, setCurrentPlayerName] = useState("");
  const [playerHits, setPlayerHits] = useState({});
  const [selectedLocation, setSelectedLocation] = useState([]); // Initialized as an array
  const updateLocations = (newLocation) => {
    setSelectedLocation([newLocation]); // 將單個對象包裹在數組中
  };

  // 計算球員統計數據的方法
  const calculateStats = (playerId, hits, plateAppearances) => {
    const hitData = hits[playerId] || {};
    const atBats = plateAppearances[playerId] || 0;

    // 計算總壘打數
    const totalBases =
      (hitData.single || 0) +
      (hitData.double || 0) * 2 +
      (hitData.triple || 0) * 3 +
      (hitData.homerun || 0) * 4;

    // 計算上壘次數
    const onBaseCount =
      (hitData.single || 0) +
      (hitData.double || 0) +
      (hitData.triple || 0) +
      (hitData.homerun || 0) +
      (hitData.bb || 0) +
      (hitData.touchball || 0);

    // 計算打擊率
    const battingAverage =
      atBats > 0
        ? ((hitData.single || 0) +
          (hitData.double || 0) +
          (hitData.triple || 0) +
          (hitData.homerun || 0)) / atBats
        : 0;


    // 計算上壘率
    const onBasePercentage =
      atBats > 0
        ? onBaseCount / (atBats + (hitData.bb || 0) + (hitData.sf || 0) + (hitData.touchball || 0))
        : 0;

    // 計算長打率
    const sluggingPercentage =
      atBats > 0
        ? totalBases / atBats
        : 0;

    return {
      totalBases,
      onBaseCount,
      battingAverage: battingAverage.toFixed(3),
      onBasePercentage: onBasePercentage.toFixed(3),
      sluggingPercentage: sluggingPercentage.toFixed(3),
    };
  };

  // 使用 useEffect 鉤子獲取球隊球員數據
  useEffect(() => {
    const fetchPlayers = async () => {
      if (!selectedTeam) return;

      const teamDocRef = doc(firestore, "team", selectedTeam);
      const teamDocSnap = await getDoc(teamDocRef);

      if (teamDocSnap.exists()) {
        const teamData = teamDocSnap.data();
        const playersList = Object.keys(teamData.players).map(key => ({
          p_id: key,
          ...teamData.players[key]
        }));
        setPlayersData(playersList);
        console.log('Player IDs:', playersList.map(player => player.p_id));
      } else {
        console.log("No such document!");
        setPlayersData([]);
      }
    };

    fetchPlayers();
  }, [selectedTeam]);



  const [teamTotals, setTeamTotals] = useState({
    plateAppearances: 0,
    atBats: 0,
    hits: 0,
    totalBases: 0,
    onBaseCount: 0,

    trbi: 0, //打點
    singles: 0, //一安
    doubles: 0, //二安
    triples: 0, //三安
    homeruns: 0, //全壘打
    doublePlays: 0, //雙殺
    walks: 0, //四壞
    sacrificeFlies: 0, //犧飛
    sacrificeHits: 0, //犧觸
    hitByPitch: 0, //觸身

    battingAverage: 0,
    onBasePercentage: 0,
    sluggingPercentage: 0,
    t_ops: 0,
  });



  // 使用 useEffect 鉤子獲取比賽數據和計算打席次數
  useEffect(() => {
    const fetchGamesAndCalculatePlateAppearances = async () => {
      if (!selectedTeam || !playersData.length) return;

      const gamesRef = collection(firestore, `team/${selectedTeam}/games`);
      try {
        const querySnapshot = await getDocs(gamesRef);
        let playersStats = {};

        if (querySnapshot.empty) {
          console.log('No games data found.');
          return;
        }

        querySnapshot.forEach((docSnapshot) => {
          const gameData = docSnapshot.data();
          console.log('Game Data:', gameData); // 查看每场游戏的数据

          // 处理 ordermain
          if (gameData.ordermain) {
            gameData.ordermain.forEach((playerStat) => {
              const playerEntry = playersData.find(player => player.p_id === playerStat.p_name);
              if (playerEntry) {
                console.log(`Processing main order for player ${playerStat.p_name}`);
                playersStats[playerEntry.p_id] = (playersStats[playerEntry.p_id] || 0) + 1;
              }
            });
          } else {
            console.log('No ordermain for this game:', docSnapshot.id);
          }

          // 处理 orderoppo
          if (gameData.orderoppo) {
            gameData.orderoppo.forEach((playerStat) => {
              const playerEntry = playersData.find(player => player.p_id === playerStat.o_p_name);
              if (playerEntry) {
                console.log(`Processing oppo order for player ${playerStat.o_p_name}`);
                playersStats[playerEntry.p_id] = (playersStats[playerEntry.p_id] || 0) + 1;
              }
            });
          } else {
            console.log('No orderoppo for this game:', docSnapshot.id);
          }
        });

        setPlayerPlateAppearances(playersStats);
        console.log('Player plate appearances calculated:', playersStats);
      } catch (error) {
        console.error("Error fetching games data: ", error);
      }
    };

    fetchGamesAndCalculatePlateAppearances();
  }, [selectedTeam, playersData]);

  useEffect(() => {
    const fetchGamesAndCalculateHits = async () => {
      if (!selectedTeam || !playersData.length) return;

      const gamesRef = collection(firestore, `team/${selectedTeam}/games`);
      try {
        const querySnapshot = await getDocs(gamesRef);
        let newPlayerHits = {}; // 使用一個新的變量來存儲計算結果

        querySnapshot.forEach((docSnapshot) => {
          const gameData = docSnapshot.data();

          // Process ordermain
          if (gameData.ordermain && Array.isArray(gameData.ordermain)) {
            gameData.ordermain.forEach(playerStat => {
              const playerEntry = playersData.find(player => player.p_id === playerStat.p_name);
              if (playerEntry) {
                if (!newPlayerHits[playerEntry.p_id]) {
                  newPlayerHits[playerEntry.p_id] = { single: 0, double: 0, triple: 0, homerun: 0, doubleplay: 0, bb: 0, sf: 0, bunt: 0, touchball: 0, rbi: 0 };
                }
                if (playerStat.rbi) {
                  const rbiValue = parseInt(playerStat.rbi, 10);
                  if (!isNaN(rbiValue)) {
                    newPlayerHits[playerEntry.p_id].rbi = (newPlayerHits[playerEntry.p_id].rbi || 0) + rbiValue;
                  }
                }
                if (playerStat.content && playerStat.content.includes("一安")) newPlayerHits[playerEntry.p_id].single += 1;
                if (playerStat.content && playerStat.content.includes("二安")) newPlayerHits[playerEntry.p_id].double += 1;
                if (playerStat.content && playerStat.content.includes("三安")) newPlayerHits[playerEntry.p_id].triple += 1;
                if (playerStat.content && playerStat.content.includes("全壘打")) newPlayerHits[playerEntry.p_id].homerun += 1;
                if (playerStat.content && playerStat.content.includes("雙殺")) newPlayerHits[playerEntry.p_id].doubleplay += 1;
                if (playerStat.content && playerStat.content.includes("四壞")) newPlayerHits[playerEntry.p_id].bb += 1;
                if (playerStat.content && playerStat.content.includes("犧飛")) newPlayerHits[playerEntry.p_id].sf += 1;
                if (playerStat.content && playerStat.content.includes("犧觸")) newPlayerHits[playerEntry.p_id].bunt += 1;
                if (playerStat.content && playerStat.content.includes("觸身")) newPlayerHits[playerEntry.p_id].touchball += 1;
              }

            });
          } else {
            console.log('No ordermain for this game:', docSnapshot.id);
          }

          // Process orderoppo and check for o_content
          if (gameData.orderoppo && Array.isArray(gameData.orderoppo)) {
            gameData.orderoppo.forEach(playerStat => {
              const playerEntry = playersData.find(player => player.p_id === playerStat.o_p_name);
              if (playerEntry) {
                if (!newPlayerHits[playerEntry.p_id]) {
                  newPlayerHits[playerEntry.p_id] = { single: 0, double: 0, triple: 0, homerun: 0, doubleplay: 0, bb: 0, sf: 0, bunt: 0, touchball: 0, rbi: 0 };
                }
                if (playerStat.o_rbi) {
                  const oRbiValue = parseInt(playerStat.o_rbi, 10);
                  if (!isNaN(oRbiValue)) {
                    newPlayerHits[playerEntry.p_id].rbi = (newPlayerHits[playerEntry.p_id].rbi || 0) + oRbiValue;
                  }
                }
                if (playerStat.o_content && playerStat.o_content.includes("一安")) newPlayerHits[playerEntry.p_id].single += 1;
                if (playerStat.o_content && playerStat.o_content.includes("二安")) newPlayerHits[playerEntry.p_id].double += 1;
                if (playerStat.o_content && playerStat.o_content.includes("三安")) newPlayerHits[playerEntry.p_id].triple += 1;
                if (playerStat.o_content && playerStat.o_content.includes("全壘打")) newPlayerHits[playerEntry.p_id].homerun += 1;
                if (playerStat.o_content && playerStat.o_content.includes("雙殺")) newPlayerHits[playerEntry.p_id].doubleplay += 1;
                if (playerStat.o_content && playerStat.o_content.includes("四壞")) newPlayerHits[playerEntry.p_id].bb += 1;
                if (playerStat.o_content && playerStat.o_content.includes("犧飛")) newPlayerHits[playerEntry.p_id].sf += 1;
                if (playerStat.o_content && playerStat.o_content.includes("犧觸")) newPlayerHits[playerEntry.p_id].bunt += 1;
              }

            });
          } else {
            console.log('No orderoppo for this game:', docSnapshot.id);
          }
        });

        // Update the state with the new hits
        setPlayerHits(newPlayerHits);
        console.log('Player hits:', newPlayerHits);
      } catch (error) {
        console.error("Error fetching games data: ", error);
      }
    };

    fetchGamesAndCalculateHits();
  }, [selectedTeam, playersData]);


  const fetchAndSetPlayerLocations = async (playerId) => {
    const gamesRef = collection(firestore, `team/${selectedTeam}/games`);
    try {
      const querySnapshot = await getDocs(gamesRef);
      const locations = [];

      querySnapshot.forEach((docSnapshot) => {
        const gameData = docSnapshot.data();

        // Check if ordermain exists and is an array before processing
        if (gameData.ordermain && Array.isArray(gameData.ordermain)) {
          gameData.ordermain.forEach((play) => {
            if (play.p_name === playerId && play.location) {
              locations.push(play.location);
            }
          });
        }

        // Check if orderoppo exists and is an array before processing
        if (gameData.orderoppo && Array.isArray(gameData.orderoppo)) {
          gameData.orderoppo.forEach((play) => {
            if (play.o_p_name === playerId && play.location) {
              locations.push(play.location);
            }
          });
        }
      });

      setSelectedLocation(locations); // Update state with all found locations
    } catch (error) {
      console.error("Error fetching player locations: ", error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      // 如果 selectedLocation 確實是一個數組，這樣應該可以工作：
      setSelectedLocation([...selectedLocation]);
      // 如果它不是一個數組，你可能想要基於一些其他狀態或屬性來重設它：
      // setSelectedLocation(someOtherStateOrProp);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [selectedLocation]); // 依賴數組應該包括 selectedLocation，如果它預計會隨時間變化

  useEffect(() => {
    console.log('Players Data:', playersData);
    console.log('Player Hits:', playerHits);
    console.log('Plate Appearances:', playerPlateAppearances);
  }, [playersData, playerHits, playerPlateAppearances]);

  // 打開對話框
  const handleOpen = (player) => {
    setSelectedPlayer(player);
    fetchAndSetPlayerLocations(player.p_id).catch(console.error); // Fetch and set locations asynchronously
    setOpen(true);
  };

  // 關閉對話框
  const handleClose = () => {
    setOpen(false);
  };


  useEffect(() => {
    const totals = {
      plateAppearances: 0, //打席
      atBats: 0, //打數
      hits: 0,  //安打
      totalBases: 0, //壘打數
      onBaseCount: 0, //上壘數

      trbi: 0, //打點
      singles: 0, //一安
      doubles: 0, //二安
      triples: 0, //三安
      homeruns: 0, //全壘打
      doublePlays: 0, //雙殺

      walks: 0, //四壞

      sacrificeFlies: 0, //犧飛
      sacrificeHits: 0, //犧觸
      hitByPitch: 0, //觸身
    };

    playersData.forEach(player => {
      const stats = calculateStats(player.p_id, playerHits, playerPlateAppearances);
      totals.plateAppearances += playerPlateAppearances[player.p_id] || 0;
      totals.atBats += playerPlateAppearances[player.p_id] - (playerHits[player.p_id]?.bb || 0) - (playerHits[player.p_id]?.touchball || 0) - (playerHits[player.p_id]?.sf || 0) - (playerHits[player.p_id]?.bunt || 0);
      totals.hits += playerHits[player.p_id]?.single + playerHits[player.p_id]?.double + playerHits[player.p_id]?.triple + playerHits[player.p_id]?.homerun || 0;
      totals.totalBases += stats.totalBases;
      totals.onBaseCount += stats.onBaseCount;

      totals.trbi += playerHits[player.p_id]?.rbi;
      totals.singles += playerHits[player.p_id]?.single;
      totals.doubles += playerHits[player.p_id]?.double;
      totals.triples += playerHits[player.p_id]?.triple;
      totals.homeruns += playerHits[player.p_id]?.homerun;
      totals.doublePlays += playerHits[player.p_id]?.doubleplay;

      totals.walks += playerHits[player.p_id]?.bb || 0;
      totals.sacrificeFlies += playerHits[player.p_id]?.sf || 0;
      totals.sacrificeHits += playerHits[player.p_id]?.bunt || 0;
      totals.hitByPitch += playerHits[player.p_id]?.touchball || 0;

    });

    // 以下是基於團隊總和數據計算的正確打擊率、上壘率和長打率
    totals.battingAverage = (totals.atBats > 0) ? (totals.hits / totals.atBats).toFixed(3) : '0.000';
    totals.onBasePercentage = (totals.plateAppearances > 0) ? ((totals.hits + totals.walks + totals.hitByPitch) / (totals.atBats + totals.walks + totals.hitByPitch + totals.sacrificeFlies)).toFixed(3) : '0.000';
    totals.sluggingPercentage = (totals.atBats > 0) ? (totals.totalBases / totals.atBats).toFixed(3) : '0.000';
    totals.t_ops = (parseFloat(totals.onBasePercentage) + parseFloat(totals.sluggingPercentage)).toFixed(3);

    setTeamTotals(totals);
  }, [playersData, playerHits, playerPlateAppearances]);


  // 渲染組件
  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 2500 }}>
          <Table>
            <TableHead>

              <TableRow>
                <TableCell size="small" style={{ position: 'sticky', left: 0, zIndex: 1, fontSize: '1.0em' }}>擊球落點</TableCell>
                <TableCell style={{ position: 'sticky', left: 0, zIndex: 1, fontSize: '1.0em' }}>球員</TableCell>
                {selectedColumns.includes('打席') && (
                  <TableCell style={{ fontSize: '1.0em' }}>打席</TableCell>
                )}
                {selectedColumns.includes('打數') && (
                  <TableCell style={{ fontSize: '1.0em' }}>打數</TableCell>
                )}
                {selectedColumns.includes('安打') && (
                  <TableCell style={{ fontSize: '1.0em' }}>安打</TableCell>
                )}
                {selectedColumns.includes('壘打數') && (
                  <TableCell style={{ fontSize: '1.0em' }}>壘打數</TableCell>
                )}
                {selectedColumns.includes('上壘數') && (
                  <TableCell style={{ fontSize: '1.0em' }}>上壘數</TableCell>
                )}
                {selectedColumns.includes('打點') && (
                  <TableCell style={{ fontSize: '1.0em' }}>打點</TableCell>
                )}
                {selectedColumns.includes('一安') && (
                  <TableCell style={{ fontSize: '1.0em' }}>一安</TableCell>
                )}
                {selectedColumns.includes('二安') && (
                  <TableCell style={{ fontSize: '1.0em' }}>二安</TableCell>
                )}
                {selectedColumns.includes('三安') && (
                  <TableCell style={{ fontSize: '1.0em' }}>三安</TableCell>
                )}
                {selectedColumns.includes('全壘打') && (
                  <TableCell style={{ fontSize: '1.0em' }}>全壘打</TableCell>
                )}
                {selectedColumns.includes('雙殺') && (
                  <TableCell style={{ fontSize: '1.0em' }}>雙殺</TableCell>
                )}
                {selectedColumns.includes('四壞') && (
                  <TableCell style={{ fontSize: '1.0em' }}>四壞</TableCell>
                )}
                {selectedColumns.includes('犧飛') && (
                  <TableCell style={{ fontSize: '1.0em' }}>犧飛</TableCell>
                )}
                {selectedColumns.includes('犧觸') && (
                  <TableCell style={{ fontSize: '1.0em' }}>犧觸</TableCell>
                )}
                {selectedColumns.includes('觸身') && (
                  <TableCell style={{ fontSize: '1.0em' }}>觸身</TableCell>
                )}
                {selectedColumns.includes('打擊率') && (
                  <TableCell style={{ fontSize: '1.0em' }}>打擊率</TableCell>
                )}
                {selectedColumns.includes('上壘率') && (
                  <TableCell style={{ fontSize: '1.0em' }}>上壘率</TableCell>
                )}
                {selectedColumns.includes('長打率') && (
                  <TableCell style={{ fontSize: '1.0em' }}>長打率</TableCell>
                )}
                {selectedColumns.includes('OPS') && (
                  <TableCell style={{ fontSize: '1.0em' }}>OPS</TableCell>
                )}
              </TableRow>


              <TableRow>
                {/* <TableCell colSpan={2} align='center' style={{ position: 'sticky',fontSize: '1.2em' }}>團隊成績</TableCell> */}

                <TableCell align='right' style={{ position: 'sticky', left: 0, zIndex: 1, fontSize: '1.0em' }}>團隊成績</TableCell>
                <TableCell></TableCell>
                {selectedColumns.includes('打席') && (
                  <TableCell style={{ fontSize: '1.0em' }}>
                    {teamTotals.plateAppearances}
                  </TableCell>
                )}
                {selectedColumns.includes('打數') && (
                  <TableCell style={{ fontSize: '1.0em' }}>
                    {teamTotals.atBats}
                  </TableCell>
                )}
                {selectedColumns.includes('安打') && (
                  <TableCell style={{ fontSize: '1.0em' }}>
                    {teamTotals.hits}
                  </TableCell>
                )}
                {selectedColumns.includes('壘打數') && (
                  <TableCell style={{ fontSize: '1.0em' }}>{teamTotals.totalBases}</TableCell>
                )}
                {selectedColumns.includes('上壘數') && (
                  <TableCell style={{ fontSize: '1.0em' }}>{teamTotals.onBaseCount}</TableCell>
                )}
                {selectedColumns.includes('打點') && (
                  <TableCell style={{ fontSize: '1.0em' }}>
                    {teamTotals.trbi}
                  </TableCell>
                )}

                {selectedColumns.includes('一安') && (
                  <TableCell style={{ fontSize: '1.0em' }}>{teamTotals.singles}</TableCell>
                )}
                {selectedColumns.includes('二安') && (
                  <TableCell style={{ fontSize: '1.0em' }}>{teamTotals.doubles}</TableCell>
                )}
                {selectedColumns.includes('三安') && (
                  <TableCell style={{ fontSize: '1.0em' }}>{teamTotals.triples}</TableCell>
                )}
                {selectedColumns.includes('全壘打') && (
                  <TableCell style={{ fontSize: '1.0em' }}>{teamTotals.homeruns}</TableCell>
                )}
                {selectedColumns.includes('雙殺') && (
                  <TableCell style={{ fontSize: '1.0em' }}>{teamTotals.doublePlays}</TableCell>
                )}
                {selectedColumns.includes('四壞') && (
                  <TableCell style={{ fontSize: '1.0em' }}>{teamTotals.walks}</TableCell>
                )}
                {selectedColumns.includes('犧飛') && (
                  <TableCell style={{ fontSize: '1.0em' }}>{teamTotals.sacrificeFlies}</TableCell>
                )}
                {selectedColumns.includes('犧觸') && (
                  <TableCell style={{ fontSize: '1.0em' }}>{teamTotals.sacrificeHits}</TableCell>
                )}
                {selectedColumns.includes('觸身') && (
                  <TableCell style={{ fontSize: '1.0em' }}>{teamTotals.hitByPitch}</TableCell>
                )}
                {selectedColumns.includes('打擊率') && (
                  <TableCell style={{ fontSize: '1.0em' }}>{teamTotals.battingAverage}</TableCell>
                )}
                {selectedColumns.includes('上壘率') && (
                  <TableCell style={{ fontSize: '1.0em' }}>{teamTotals.onBasePercentage}</TableCell>
                )}
                {selectedColumns.includes('長打率') && (
                  <TableCell style={{ fontSize: '1.0em' }}>{teamTotals.sluggingPercentage}</TableCell>
                )}
                {selectedColumns.includes('OPS') && (
                  <TableCell style={{ fontSize: '1.0em' }}>{teamTotals.t_ops}</TableCell>
                )}
              </TableRow>

            </TableHead>
            <TableBody>
              {playersData.map((player, index) => {
                const stats = calculateStats(player.p_id, playerHits, playerPlateAppearances);
                return (
                  <TableRow hover key={player.p_id}>
                    <TableCell>
                      <Button
                        size="small" style={{ position: 'sticky', left: 0, zIndex: 1 }}
                        onClick={() => handleOpen(player)}
                      >
                        查看
                      </Button>
                    </TableCell>
                    <TableCell style={{ position: 'sticky', left: 0, zIndex: 1, backgroundColor: 'rgba(255, 255, 255, 1)' }}>{player.p_id}</TableCell>
                    {selectedColumns.includes('打席') && (
                      <TableCell>
                        {playerPlateAppearances[player.p_id] || 'N/A'}
                      </TableCell>
                    )}
                    {selectedColumns.includes('打數') && (
                      <TableCell>
                        {playerHits[player.p_id] ? (
                          playerPlateAppearances[player.p_id] - (
                            (playerHits[player.p_id]?.bb || 0) +
                            (playerHits[player.p_id]?.touchball || 0) +
                            (playerHits[player.p_id]?.sf || 0) +
                            (playerHits[player.p_id]?.bunt || 0)
                          )) : 'N/A'}
                      </TableCell>
                    )}
                    {selectedColumns.includes('安打') && (
                      <TableCell>
                        {playerHits[player.p_id] ? (
                          playerHits[player.p_id].single +
                          playerHits[player.p_id].double +
                          playerHits[player.p_id].triple +
                          playerHits[player.p_id].homerun
                        ) : '0'}
                      </TableCell>
                    )}
                    {selectedColumns.includes('壘打數') && (
                      <TableCell>{stats.totalBases}</TableCell>
                    )}
                    {selectedColumns.includes('上壘數') && (
                      <TableCell>{stats.onBaseCount}</TableCell>
                    )}
                    {selectedColumns.includes('打點') && (
                      <TableCell>
                        {playerHits[player.p_id] ? playerHits[player.p_id].rbi : '0'}
                      </TableCell>
                    )}
                    {selectedColumns.includes('一安') && (
                      <TableCell>{playerHits[player.p_id]?.single || '0'}</TableCell>
                    )}
                    {selectedColumns.includes('二安') && (
                      <TableCell>{playerHits[player.p_id]?.double || '0'}</TableCell>
                    )}
                    {selectedColumns.includes('三安') && (
                      <TableCell>{playerHits[player.p_id]?.triple || '0'}</TableCell>
                    )}
                    {selectedColumns.includes('全壘打') && (
                      <TableCell>{playerHits[player.p_id]?.homerun || '0'}</TableCell>
                    )}
                    {selectedColumns.includes('雙殺') && (
                      <TableCell>{playerHits[player.p_id]?.doubleplay || '0'}</TableCell>
                    )}
                    {selectedColumns.includes('四壞') && (
                      <TableCell>{playerHits[player.p_id]?.bb || '0'}</TableCell>
                    )}
                    {selectedColumns.includes('犧飛') && (
                      <TableCell>{playerHits[player.p_id]?.sf || '0'}</TableCell>
                    )}
                    {selectedColumns.includes('犧觸') && (
                      <TableCell>{playerHits[player.p_id]?.bunt || '0'}</TableCell>
                    )}
                    {selectedColumns.includes('觸身') && (
                      <TableCell>{playerHits[player.p_id]?.touchball || '0'}</TableCell>
                    )}
                    {selectedColumns.includes('打擊率') && (
                      <TableCell>{stats.battingAverage}</TableCell>
                    )}
                    {selectedColumns.includes('上壘率') && (
                      <TableCell>{stats.onBasePercentage}</TableCell>
                    )}
                    {selectedColumns.includes('長打率') && (
                      <TableCell>{stats.sluggingPercentage}</TableCell>
                    )}
                    {selectedColumns.includes('OPS') && (
                      <TableCell>{(parseFloat(stats.onBasePercentage) + parseFloat(stats.sluggingPercentage)).toFixed(3)}</TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <PlayerDialog
        open={open}
        onClose={handleClose}
        player={selectedPlayer}
        locations={selectedLocation}
      />
    </Card>
  );
};


const PlayerDialog = ({ open, onClose, player, locations }) => {
  const imageContainerRef = React.useRef(null);
  const baseballFieldImage = 'https://media.istockphoto.com/id/1269757192/zh/%E5%90%91%E9%87%8F/%E6%A3%92%E7%90%83%E5%A0%B4%E5%9C%96%E7%A4%BA%E6%A3%92%E7%90%83%E5%A0%B4%E5%90%91%E9%87%8F%E8%A8%AD%E8%A8%88%E7%9A%84%E5%B9%B3%E9%9D%A2%E5%9C%96%E8%A7%A3%E9%A0%82%E8%A6%96%E5%9C%96-web.jpg?s=612x612&w=0&k=20&c=Zt85Kr6EksFKBmYQmgs138zfLRp3eoIzKeQLS2mirLU='
    ; // 用实际图片URL替换此处文本

  // 确保此函数正确计算位置百分比
  const convertLocationToPosition = (location) => {
    // 假设imageContainerRef是图片容器的引用
    const container = imageContainerRef.current;
    if (container) {
      const { width: displayWidth, height: displayHeight } = container.getBoundingClientRect();
      console.log(`Display Width: ${displayWidth}, Display Height: ${displayHeight}`); // 这将输出当前的宽度和高度
      const originalWidth = 400;
      const scaleFactor = displayWidth / originalWidth;

      return {
        left: `${(location.x * scaleFactor / displayWidth) * 100}%`,
        top: `${(location.y * scaleFactor / displayHeight) * 100}%`
      };
    }
    return { left: '0%', top: '0%' };
  };

  // 调试时，将位置记录到控制台
  console.log('Locations:', locations);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{player?.p_id || 'Unknown Player'}</DialogTitle>
      <DialogContent>
        <div
          ref={imageContainerRef} // 您需要在组件中创建此引用
          style={{ position: 'relative', width: '400px', height: 'auto' }}
        >
          <img
            src={baseballFieldImage}
            width={'100%'}
            height={'100%'}
            alt="Baseball Field"
          />
          {locations.map((location, index) => {
            const position = convertLocationToPosition(location);
            return (
              <div key={index} style={{
                position: 'absolute',
                left: position.left,
                top: position.top,
                // 自定义标记样式
                height: '10px',
                width: '10px',
                borderRadius: '50%',
                backgroundColor: 'blue',
                transform: 'translate(-50%, -50%)'
              }}></div>
            );
          })}
        </div>
        <img
          src='pic.png'
          width={'400px'}

        />
      </DialogContent>
    </Dialog>
  );
};

// 确保您有一个引用来获取容器的尺寸


// 定義 PlayerDialog 組件的 prop 類型
PlayerDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  player: PropTypes.string // 假設 player 是一個字符串
};

export default HitrecordTable;

