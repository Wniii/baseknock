import React, { useState, useEffect, useRef, useMemo } from "react";
import PropTypes from "prop-types";
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
  IconButton,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import SearchIcon from "@mui/icons-material/Search";
import { firestore } from "src/firebase";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import * as XLSX from 'xlsx';

// 定義 HitrecordTable 組件
export const HitrecordTable = ({ selectedTeam, selectedColumns, selectedGameTypes }) => {
  const [open, setOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playersData, setPlayersData] = useState([]);
  const [teamData, setteamData] = useState([]);
  const [playerPlateAppearances, setPlayerPlateAppearances] = useState({});
  const [playerHits, setPlayerHits] = useState({});
  const [selectedLocation, setSelectedLocation] = useState([]);
  const updateLocations = (newLocation) => {
    setSelectedLocation([newLocation]);
  };

  // 計算球員統計數據的方法
  const calculateStats = (playerId, hits, plateAppearances) => {
    const hitData = hits[playerId] || {};
    const atBats = plateAppearances[playerId] || 0;
    const totalBases =
      (hitData.single || 0) +
      (hitData.double || 0) * 2 +
      (hitData.triple || 0) * 3 +
      (hitData.homerun || 0) * 4;
    const onBaseCount =
      (hitData.single || 0) +
      (hitData.double || 0) +
      (hitData.triple || 0) +
      (hitData.homerun || 0) +
      (hitData.bb || 0) +
      (hitData.touchball || 0);
    const battingAverage =
      atBats > 0
        ? ((hitData.single || 0) +
            (hitData.double || 0) +
            (hitData.triple || 0) +
            (hitData.homerun || 0)) /
          atBats
        : 0;
    const onBasePercentage =
      atBats > 0
        ? onBaseCount / (atBats + (hitData.bb || 0) + (hitData.sf || 0) + (hitData.touchball || 0))
        : 0;
    const sluggingPercentage = atBats > 0 ? totalBases / atBats : 0;

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
    const fetchPlayersAndGamesData = async () => {
      if (!selectedTeam) return;

      const teamDocRef = doc(firestore, "team", selectedTeam);
      const teamDocSnap = await getDoc(teamDocRef);

      if (!teamDocSnap.exists()) {
        console.log("No such team document!");
        setPlayersData([]);
        return;
      }

      const teamData = teamDocSnap.data();
      setteamData(teamData)
      const playersInGames = new Set();

      let gamesQuery;
      if (selectedGameTypes && selectedGameTypes.length > 0) {
        gamesQuery = query(
          collection(teamDocRef, "games"),
          where("gName", "in", selectedGameTypes)
        );
      } else {
        gamesQuery = query(collection(teamDocRef, "games"));
      }
      const gamesQuerySnapshot = await getDocs(gamesQuery);

      gamesQuerySnapshot.docs.forEach((doc) => {
        const gameData = doc.data();
        ["ordermain", "orderoppo"].forEach((orderKey) => {
          if (Array.isArray(gameData[orderKey])) {
            gameData[orderKey].forEach((order) => {
              if (order.p_name) {
                playersInGames.add(order.p_name);
              }
              if (order.o_p_name) {
                playersInGames.add(order.o_p_name);
              }
            });
          }
        });
      });

      const filteredPlayers = Object.keys(teamData.players)
        .filter((playerKey) => playersInGames.has(playerKey))
        .map((playerKey) => ({
          ...teamData.players[playerKey],
          p_id: playerKey,
        }));

      setPlayersData(filteredPlayers);
    };

    fetchPlayersAndGamesData();
  }, [selectedTeam, selectedGameTypes]);

  const [teamTotals, setTeamTotals] = useState({
    plateAppearances: 0,
    atBats: 0,
    hits: 0,
    totalBases: 0,
    onBaseCount: 0,
    trbi: 0,
    singles: 0,
    doubles: 0,
    triples: 0,
    homeruns: 0,
    doublePlays: 0,
    walks: 0,
    sacrificeFlies: 0,
    sacrificeHits: 0,
    hitByPitch: 0,
    battingAverage: 0,
    onBasePercentage: 0,
    sluggingPercentage: 0,
    t_ops: 0,
  });

  // 使用 useEffect 鉤子獲取比賽數據和計算打席次數
  useEffect(() => {
    const fetchGamesAndCalculatePlateAppearances = async () => {
      if (!selectedTeam || !playersData.length || !selectedGameTypes || !selectedGameTypes.length)
        return;

      const gamesRef = collection(firestore, `team/${selectedTeam}/games`);
      const gamesQuery = query(gamesRef, where("gName", "in", selectedGameTypes));

      try {
        const querySnapshot = await getDocs(gamesQuery);
        let playersStats = {};

        if (querySnapshot.empty) {
          console.log("No games data found.");
          return;
        }

        querySnapshot.forEach((docSnapshot) => {
          const gameData = docSnapshot.data();

          if (gameData.ordermain) {
            gameData.ordermain.forEach((playerStat) => {
              const playerEntry = playersData.find((player) => player.p_id === playerStat.p_name);
              if (playerEntry) {
                playersStats[playerEntry.p_id] = (playersStats[playerEntry.p_id] || 0) + 1;
              }
            });
          }

          if (gameData.orderoppo) {
            gameData.orderoppo.forEach((playerStat) => {
              const playerEntry = playersData.find((player) => player.p_id === playerStat.o_p_name);
              if (playerEntry) {
                playersStats[playerEntry.p_id] = (playersStats[playerEntry.p_id] || 0) + 1;
              }
            });
          }
        });

        setPlayerPlateAppearances(playersStats);
      } catch (error) {
        console.error("Error fetching games data: ", error);
      }
    };

    fetchGamesAndCalculatePlateAppearances();
  }, [selectedTeam, playersData, selectedGameTypes]);

  useEffect(() => {
    const fetchGamesAndCalculateHits = async () => {
      if (!selectedTeam || !playersData.length || !selectedGameTypes || !selectedGameTypes.length)
        return;

      const gamesRef = collection(firestore, `team/${selectedTeam}/games`);
      const gamesQuery = query(gamesRef, where("gName", "in", selectedGameTypes));
      try {
        const querySnapshot = await getDocs(gamesQuery);
        let newPlayerHits = {};
        querySnapshot.forEach((docSnapshot) => {
          const gameData = docSnapshot.data();

          if (gameData.ordermain && Array.isArray(gameData.ordermain)) {
            gameData.ordermain.forEach((playerStat) => {
              const playerEntry = playersData.find((player) => player.p_id === playerStat.p_name);
              if (playerEntry) {
                if (!newPlayerHits[playerEntry.p_id]) {
                  newPlayerHits[playerEntry.p_id] = {
                    single: 0,
                    double: 0,
                    triple: 0,
                    homerun: 0,
                    doubleplay: 0,
                    bb: 0,
                    sf: 0,
                    bunt: 0,
                    touchball: 0,
                    rbi: 0,
                  };
                }
                if (playerStat.rbi) {
                  const rbiValue = parseInt(playerStat.rbi, 10);
                  if (!isNaN(rbiValue)) {
                    newPlayerHits[playerEntry.p_id].rbi =
                      (newPlayerHits[playerEntry.p_id].rbi || 0) + rbiValue;
                  }
                }
                if (playerStat.content && playerStat.content.includes("一安"))
                  newPlayerHits[playerEntry.p_id].single += 1;
                if (playerStat.content && playerStat.content.includes("二安"))
                  newPlayerHits[playerEntry.p_id].double += 1;
                if (playerStat.content && playerStat.content.includes("三安"))
                  newPlayerHits[playerEntry.p_id].triple += 1;
                if (playerStat.content && playerStat.content.includes("全打"))
                  newPlayerHits[playerEntry.p_id].homerun += 1;
                if (playerStat.content && playerStat.content.includes("雙殺"))
                  newPlayerHits[playerEntry.p_id].doubleplay += 1;
                if (playerStat.content && playerStat.content.includes("四壞"))
                  newPlayerHits[playerEntry.p_id].bb += 1;
                if (playerStat.content && playerStat.content.includes("犧飛"))
                  newPlayerHits[playerEntry.p_id].sf += 1;
                if (playerStat.content && playerStat.content.includes("犧觸"))
                  newPlayerHits[playerEntry.p_id].bunt += 1;
                if (playerStat.content && playerStat.content.includes("觸身"))
                  newPlayerHits[playerEntry.p_id].touchball += 1;
              }
            });
          }

          if (gameData.orderoppo && Array.isArray(gameData.orderoppo)) {
            gameData.orderoppo.forEach((playerStat) => {
              const playerEntry = playersData.find((player) => player.p_id === playerStat.o_p_name);
              if (playerEntry) {
                if (!newPlayerHits[playerEntry.p_id]) {
                  newPlayerHits[playerEntry.p_id] = {
                    single: 0,
                    double: 0,
                    triple: 0,
                    homerun: 0,
                    doubleplay: 0,
                    bb: 0,
                    sf: 0,
                    bunt: 0,
                    touchball: 0,
                    rbi: 0,
                  };
                }
                if (playerStat.o_rbi) {
                  const oRbiValue = parseInt(playerStat.o_rbi, 10);
                  if (!isNaN(oRbiValue)) {
                    newPlayerHits[playerEntry.p_id].rbi =
                      (newPlayerHits[playerEntry.p_id].rbi || 0) + oRbiValue;
                  }
                }
                if (playerStat.o_content && playerStat.o_content.includes("一安"))
                  newPlayerHits[playerEntry.p_id].single += 1;
                if (playerStat.o_content && playerStat.o_content.includes("二安"))
                  newPlayerHits[playerEntry.p_id].double += 1;
                if (playerStat.o_content && playerStat.o_content.includes("三安"))
                  newPlayerHits[playerEntry.p_id].triple += 1;
                if (playerStat.o_content && playerStat.o_content.includes("全打"))
                  newPlayerHits[playerEntry.p_id].homerun += 1;
                if (playerStat.o_content && playerStat.o_content.includes("雙殺"))
                  newPlayerHits[playerEntry.p_id].doubleplay += 1;
                if (playerStat.o_content && playerStat.o_content.includes("四壞"))
                  newPlayerHits[playerEntry.p_id].bb += 1;
                if (playerStat.o_content && playerStat.o_content.includes("犧飛"))
                  newPlayerHits[playerEntry.p_id].sf += 1;
                if (playerStat.o_content && playerStat.o_content.includes("犧觸"))
                  newPlayerHits[playerEntry.p_id].bunt += 1;
              }
            });
          }
        });

        setPlayerHits(newPlayerHits);
      } catch (error) {
        console.error("Error fetching games data: ", error);
      }
    };

    fetchGamesAndCalculateHits();
  }, [selectedTeam, playersData, selectedGameTypes]);

  useEffect(() => {
    if (!selectedGameTypes || selectedGameTypes.length === 0) {
      console.error("selectedGameTypes is undefined or empty");
      return;
    }

    const fetchGamesAndCalculateStats = async () => {
      if (!selectedTeam) {
        console.error("selectedTeam is undefined");
        return;
      }

      const gamesRef = collection(firestore, `team/${selectedTeam}/games`);
      const gamesQuery = query(gamesRef, where("gName", "in", selectedGameTypes));

      try {
        const querySnapshot = await getDocs(gamesQuery);
        let playersStats = {};
        querySnapshot.forEach((doc) => {
          const gameData = doc.data();
        });
      } catch (error) {
        console.error("Error fetching games data: ", error);
      }
    };

    fetchGamesAndCalculateStats();
  }, [selectedTeam, selectedGameTypes]);

  const fetchAndSetPlayerLocations = async (playerId) => {
    const gamesRef = collection(firestore, `team/${selectedTeam}/games`);
    try {
      const querySnapshot = await getDocs(gamesRef);
      const locations = [];

      querySnapshot.forEach((docSnapshot) => {
        const gameData = docSnapshot.data();

        if (gameData.ordermain && Array.isArray(gameData.ordermain)) {
          gameData.ordermain.forEach((play) => {
            if (play.p_name === playerId && play.location) {
              const x = parseFloat(play.location.x);
              const y = parseFloat(play.location.y);
              if (!isNaN(x) && !isNaN(y) && x !== 0 && y !== 0) {
                locations.push({
                  x: x,
                  y: y,
                  content: play.content
                });
              }
            }
          });
        }

        if (gameData.orderoppo && Array.isArray(gameData.orderoppo)) {
          gameData.orderoppo.forEach((play) => {
            if (play.o_p_name === playerId && play.location) {
              const x = parseFloat(play.location.x);
              const y = parseFloat(play.location.y);
              if (!isNaN(x) && !isNaN(y) && x !== 0 && y !== 0) {
                locations.push({
                  x: x,
                  y: y,
                  content: play.o_content
                });
              }
            }
          });
        }
      });

      setSelectedLocation(locations);
    } catch (error) {
      console.error("Error fetching player locations: ", error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setSelectedLocation([...selectedLocation]);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [selectedLocation]);

  useEffect(() => {
    console.log("Players Data:", playersData);
    console.log("Player Hits:", playerHits);
    console.log("Plate Appearances:", playerPlateAppearances);
  }, [playersData, playerHits, playerPlateAppearances]);

  // 打開對話框
  const handleOpen = (player) => {
    setSelectedPlayer(player);
    fetchAndSetPlayerLocations(player.p_id).catch(console.error);
    setOpen(true);
  };

  // 關閉對話框
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const totals = {
      plateAppearances: 0,
      atBats: 0,
      hits: 0,
      totalBases: 0,
      onBaseCount: 0,
      trbi: 0,
      singles: 0,
      doubles: 0,
      triples: 0,
      homeruns: 0,
      doublePlays: 0,
      walks: 0,
      sacrificeFlies: 0,
      sacrificeHits: 0,
      hitByPitch: 0,
    };

    playersData.forEach((player) => {
      const stats = calculateStats(player.p_id, playerHits, playerPlateAppearances);
      totals.plateAppearances += playerPlateAppearances[player.p_id] || 0;
      totals.atBats +=
        playerPlateAppearances[player.p_id] -
        (playerHits[player.p_id]?.bb || 0) -
        (playerHits[player.p_id]?.touchball || 0) -
        (playerHits[player.p_id]?.sf || 0) -
        (playerHits[player.p_id]?.bunt || 0);
      totals.hits +=
        playerHits[player.p_id]?.single +
          playerHits[player.p_id]?.double +
          playerHits[player.p_id]?.triple +
          playerHits[player.p_id]?.homerun || 0;
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

    totals.battingAverage = totals.atBats > 0 ? (totals.hits / totals.atBats).toFixed(3) : "0.000";
    totals.onBasePercentage =
      totals.plateAppearances > 0
        ? (
            (totals.hits + totals.walks + totals.hitByPitch) /
            (totals.atBats + totals.walks + totals.hitByPitch + totals.sacrificeFlies)
          ).toFixed(3)
        : "0.000";
    totals.sluggingPercentage =
      totals.atBats > 0 ? (totals.totalBases / totals.atBats).toFixed(3) : "0.000";
    totals.t_ops = (
      parseFloat(totals.onBasePercentage) + parseFloat(totals.sluggingPercentage)
    ).toFixed(3);

    setTeamTotals(totals);
  }, [playersData, playerHits, playerPlateAppearances]);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "descending" });
  const [sortedColumn, setSortedColumn] = useState(null);

  const onSortChange = (key) => {
    setSortConfig({ key, direction: "descending" });
    setSortedColumn(key);
  };

  function getValueByKey(player, key) {
    const stats = calculateStats(player.p_id, playerHits, playerPlateAppearances);
    switch (key) {
      case "打席":
        return playerPlateAppearances[player.p_id] || 0;
      case "打數":
        return playerPlateAppearances[player.p_id]
          ? playerPlateAppearances[player.p_id] -
              ((playerHits[player.p_id]?.bb || 0) +
                (playerHits[player.p_id]?.touchball || 0) +
                (playerHits[player.p_id]?.sf || 0) +
                (playerHits[player.p_id]?.bunt || 0))
          : 0;
      case "安打":
        return playerHits[player.p_id]
          ? playerHits[player.p_id].single +
              playerHits[player.p_id].double +
              playerHits[player.p_id].triple +
              playerHits[player.p_id].homerun
          : 0;
      case "壘打數":
        return stats.totalBases || 0;
      case "上壘數":
        return stats.onBaseCount || 0;
      case "打點":
        return playerHits[player.p_id]?.rbi || 0;
      case "一安":
        return playerHits[player.p_id]?.single || 0;
      case "二安":
        return playerHits[player.p_id]?.double || 0;
      case "三安":
        return playerHits[player.p_id]?.triple || 0;
      case "全壘打":
        return playerHits[player.p_id]?.homerun || 0;
      case "雙殺":
        return playerHits[player.p_id]?.doubleplay || 0;
      case "四壞":
        return playerHits[player.p_id]?.bb || 0;
      case "犧飛":
        return playerHits[player.p_id]?.sf || 0;
      case "犧觸":
        return playerHits[player.p_id]?.bunt || 0;
      case "觸身":
        return playerHits[player.p_id]?.touchball || 0;
      case "打擊率":
        return parseFloat(stats.battingAverage || 0);
      case "上壘率":
        return parseFloat(stats.onBasePercentage || 0);
      case "長打率":
        return parseFloat(stats.sluggingPercentage || 0);
      case "OPS":
        return parseFloat(stats.onBasePercentage || 0) + parseFloat(stats.sluggingPercentage || 0);
      default:
        return 0;
    }
  }

  const sortedPlayers = useMemo(() => {
    let sortableItems = [...playersData];
    sortableItems.sort((a, b) => {
      const valueA = getValueByKey(a, sortConfig.key, playerHits, playerPlateAppearances);
      const valueB = getValueByKey(b, sortConfig.key, playerHits, playerPlateAppearances);
      return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
    });

    return sortableItems;
  }, [playersData, sortConfig, playerHits, playerPlateAppearances]);

  const exportToExcel = () => {
    const dataToExport = sortedPlayers.map((player) => {
      const stats = calculateStats(player.p_id, playerHits, playerPlateAppearances);
      const playerData = {
        球員: player.p_id,
        打席: playerPlateAppearances[player.p_id] || 0,
        打數: playerPlateAppearances[player.p_id]
          ? playerPlateAppearances[player.p_id] -
            ((playerHits[player.p_id]?.bb || 0) +
              (playerHits[player.p_id]?.touchball || 0) +
              (playerHits[player.p_id]?.sf || 0) +
              (playerHits[player.p_id]?.bunt || 0))
          : 0,
        安打: playerHits[player.p_id]
          ? playerHits[player.p_id].single +
            playerHits[player.p_id].double +
            playerHits[player.p_id].triple +
            playerHits[player.p_id].homerun
          : 0,
        壘打數: stats.totalBases || 0,
        上壘數: stats.onBaseCount || 0,
        打點: playerHits[player.p_id]?.rbi || 0,
        一安: playerHits[player.p_id]?.single || 0,
        二安: playerHits[player.p_id]?.double || 0,
        三安: playerHits[player.p_id]?.triple || 0,
        全壘打: playerHits[player.p_id]?.homerun || 0,
        雙殺: playerHits[player.p_id]?.doubleplay || 0,
        四壞: playerHits[player.p_id]?.bb || 0,
        犧飛: playerHits[player.p_id]?.sf || 0,
        犧觸: playerHits[player.p_id]?.bunt || 0,
        觸身: playerHits[player.p_id]?.touchball || 0,
        打擊率: stats.battingAverage || "0.000",
        上壘率: stats.onBasePercentage || "0.000",
        長打率: stats.sluggingPercentage || "0.000",
        OPS: (parseFloat(stats.onBasePercentage || 0) + parseFloat(stats.sluggingPercentage || 0)).toFixed(3),
      };
      return playerData;
    });
  
    // 添加團隊成績到數據
    const teamDatas = {
      球員: "團隊成績",
      打席: teamTotals.plateAppearances,
      打數: teamTotals.atBats,
      安打: teamTotals.hits,
      壘打數: teamTotals.totalBases,
      上壘數: teamTotals.onBaseCount,
      打點: teamTotals.trbi,
      一安: teamTotals.singles,
      二安: teamTotals.doubles,
      三安: teamTotals.triples,
      全壘打: teamTotals.homeruns,
      雙殺: teamTotals.doublePlays,
      四壞: teamTotals.walks,
      犧飛: teamTotals.sacrificeFlies,
      犧觸: teamTotals.sacrificeHits,
      觸身: teamTotals.hitByPitch,
      打擊率: teamTotals.battingAverage,
      上壘率: teamTotals.onBasePercentage,
      長打率: teamTotals.sluggingPercentage,
      OPS: teamTotals.t_ops,
    };
  
    dataToExport.unshift(teamDatas); // 將團隊成績添加到數據數組的開頭
  
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `${teamData.Name}打擊數據`);
    XLSX.writeFile(wb, `${teamData.Name}打擊數據.xlsx`);
  };
  

  // 渲染組件
  return (
    <Card>
       <Button onClick={exportToExcel} style={{ margin: "10px" }}>
        匯出Excel
      </Button>
      <Scrollbar>
        <Box sx={{ minWidth: 2500 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  style={{
                    position: "sticky",
                    top: 0,
                    left: 0,
                    zIndex: 1,
                    fontSize: "1.0em",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "#DCDCDC",
                  }}
                >
                  <div>落點</div>
                  <div>球員</div>
                  <div>排名</div>
                </TableCell>
                {selectedColumns.includes("打席") && (
                  <TableCell
                    key="打席"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "打席" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("打席")}
                  >
                    打席
                  </TableCell>
                )}
                {selectedColumns.includes("打數") && (
                  <TableCell
                    key="打數"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "打數" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("打數")}
                  >
                    打數
                  </TableCell>
                )}
                {selectedColumns.includes("安打") && (
                  <TableCell
                    key="安打"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "安打" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("安打")}
                  >
                    安打
                  </TableCell>
                )}
                {selectedColumns.includes("壘打數") && (
                  <TableCell
                    key="壘打數"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "壘打數" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("壘打數")}
                  >
                    壘打數
                  </TableCell>
                )}
                {selectedColumns.includes("上壘數") && (
                  <TableCell
                    key="上壘數"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "上壘數" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("上壘數")}
                  >
                    上壘數
                  </TableCell>
                )}
                {selectedColumns.includes("打點") && (
                  <TableCell
                    key="打點"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "打點" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("打點")}
                  >
                    打點
                  </TableCell>
                )}
                {selectedColumns.includes("一安") && (
                  <TableCell
                    key="一安"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "一安" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("一安")}
                  >
                    一安
                  </TableCell>
                )}
                {selectedColumns.includes("二安") && (
                  <TableCell
                    key="二安"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "二安" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("二安")}
                  >
                    二安
                  </TableCell>
                )}
                {selectedColumns.includes("三安") && (
                  <TableCell
                    key="三安"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "三安" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("三安")}
                  >
                    三安
                  </TableCell>
                )}
                {selectedColumns.includes("全壘打") && (
                  <TableCell
                    key="全壘打"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "全壘打" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("全壘打")}
                  >
                    全壘打
                  </TableCell>
                )}
                {selectedColumns.includes("雙殺") && (
                  <TableCell
                    key="雙殺"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "雙殺" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("雙殺")}
                  >
                    雙殺
                  </TableCell>
                )}
                {selectedColumns.includes("四壞") && (
                  <TableCell
                    key="四壞"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "四壞" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("四壞")}
                  >
                    四壞
                  </TableCell>
                )}
                {selectedColumns.includes("犧飛") && (
                  <TableCell
                    key="犧飛"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "犧飛" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("犧飛")}
                  >
                    犧飛
                  </TableCell>
                )}
                {selectedColumns.includes("犧觸") && (
                  <TableCell
                    key="犧觸"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "犧觸" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("犧觸")}
                  >
                    犧觸
                  </TableCell>
                )}
                {selectedColumns.includes("觸身") && (
                  <TableCell
                    key="觸身"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "觸身" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("觸身")}
                  >
                    觸身
                  </TableCell>
                )}
                {selectedColumns.includes("打擊率") && (
                  <TableCell
                    key="打擊率"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "打擊率" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("打擊率")}
                  >
                    打擊率
                  </TableCell>
                )}
                {selectedColumns.includes("上壘率") && (
                  <TableCell
                    key="上壘率"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "上壘率" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("上壘率")}
                  >
                    上壘率
                  </TableCell>
                )}
                {selectedColumns.includes("長打率") && (
                  <TableCell
                    key="長打率"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "長打率" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("長打率")}
                  >
                    長打率
                  </TableCell>
                )}
                {selectedColumns.includes("OPS") && (
                  <TableCell
                    key="OPS"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "OPS" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("OPS")}
                  >
                    OPS
                  </TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={2}
                  style={{
                    position: "sticky",
                    top: 0,
                    left: 0,
                    zIndex: 1,
                    fontSize: "1.0em",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#DCDCDC",
                  }}
                >
                  團隊成績
                </TableCell>
                {selectedColumns.includes("打席") && (
                  <TableCell
                    style={{
                      fontSize: "1.0em",
                      color: sortedColumn === "打席" ? "red" : "black",
                    }}
                  >
                    {teamTotals.plateAppearances}
                  </TableCell>
                )}
                {selectedColumns.includes("打數") && (
                  <TableCell
                    style={{
                      fontSize: "1.0em",
                      color: sortedColumn === "打數" ? "red" : "black",
                    }}
                  >
                    {teamTotals.atBats}
                  </TableCell>
                )}
                {selectedColumns.includes("安打") && (
                  <TableCell
                    style={{
                      fontSize: "1.0em",
                      color: sortedColumn === "安打" ? "red" : "black",
                    }}
                  >
                    {teamTotals.hits}
                  </TableCell>
                )}
                {selectedColumns.includes("壘打數") && (
                  <TableCell
                    style={{
                      fontSize: "1.0em",
                      color: sortedColumn === "壘打數" ? "red" : "black",
                    }}
                  >
                    {teamTotals.totalBases}
                  </TableCell>
                )}
                {selectedColumns.includes("上壘數") && (
                  <TableCell
                    style={{
                      fontSize: "1.0em",
                      color: sortedColumn === "上壘數" ? "red" : "black",
                    }}
                  >
                    {teamTotals.onBaseCount}
                  </TableCell>
                )}
                {selectedColumns.includes("打點") && (
                  <TableCell
                    style={{
                      fontSize: "1.0em",
                      color: sortedColumn === "打點" ? "red" : "black",
                    }}
                  >
                    {teamTotals.trbi}
                  </TableCell>
                )}
                {selectedColumns.includes("一安") && (
                  <TableCell
                    style={{
                      fontSize: "1.0em",
                      color: sortedColumn === "一安" ? "red" : "black",
                    }}
                  >
                    {teamTotals.singles}
                  </TableCell>
                )}
                {selectedColumns.includes("二安") && (
                  <TableCell
                    style={{
                      fontSize: "1.0em",
                      color: sortedColumn === "二安" ? "red" : "black",
                    }}
                  >
                    {teamTotals.doubles}
                  </TableCell>
                )}
                {selectedColumns.includes("三安") && (
                  <TableCell
                    style={{
                      fontSize: "1.0em",
                      color: sortedColumn === "三安" ? "red" : "black",
                    }}
                  >
                    {teamTotals.triples}
                  </TableCell>
                )}
                {selectedColumns.includes("全壘打") && (
                  <TableCell
                    style={{
                      fontSize: "1.0em",
                      color: sortedColumn === "全壘打" ? "red" : "black",
                    }}
                  >
                    {teamTotals.homeruns}
                  </TableCell>
                )}
                {selectedColumns.includes("雙殺") && (
                  <TableCell
                    style={{
                      fontSize: "1.0em",
                      color: sortedColumn === "雙殺" ? "red" : "black",
                    }}
                  >
                    {teamTotals.doublePlays}
                  </TableCell>
                )}
                {selectedColumns.includes("四壞") && (
                  <TableCell
                    style={{
                      fontSize: "1.0em",
                      color: sortedColumn === "四壞" ? "red" : "black",
                    }}
                  >
                    {teamTotals.walks}
                  </TableCell>
                )}
                {selectedColumns.includes("犧飛") && (
                  <TableCell
                    style={{
                      fontSize: "1.0em",
                      color: sortedColumn === "犧飛" ? "red" : "black",
                    }}
                  >
                    {teamTotals.sacrificeFlies}
                  </TableCell>
                )}
                {selectedColumns.includes("犧觸") && (
                  <TableCell
                    style={{
                      fontSize: "1.0em",
                      color: sortedColumn === "犧觸" ? "red" : "black",
                    }}
                  >
                    {teamTotals.sacrificeHits}
                  </TableCell>
                )}
                {selectedColumns.includes("觸身") && (
                  <TableCell
                    style={{
                      fontSize: "1.0em",
                      color: sortedColumn === "觸身" ? "red" : "black",
                    }}
                  >
                    {teamTotals.hitByPitch}
                  </TableCell>
                )}
                {selectedColumns.includes("打擊率") && (
                  <TableCell
                    style={{
                      fontSize: "1.0em",
                      color: sortedColumn === "打擊率" ? "red" : "black",
                    }}
                  >
                    {teamTotals.battingAverage}
                  </TableCell>
                )}
                {selectedColumns.includes("上壘率") && (
                  <TableCell
                    style={{
                      fontSize: "1.0em",
                      color: sortedColumn === "上壘率" ? "red" : "black",
                    }}
                  >
                    {teamTotals.onBasePercentage}
                  </TableCell>
                )}
                {selectedColumns.includes("長打率") && (
                  <TableCell
                    style={{
                      fontSize: "1.0em",
                      color: sortedColumn === "長打率" ? "red" : "black",
                    }}
                  >
                    {teamTotals.sluggingPercentage}
                  </TableCell>
                )}
                {selectedColumns.includes("OPS") && (
                  <TableCell
                    style={{
                      fontSize: "1.0em",
                      color: sortedColumn === "OPS" ? "red" : "black",
                    }}
                  >
                    {teamTotals.t_ops}
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedPlayers.map((player, index) => {
                const stats = calculateStats(player.p_id, playerHits, playerPlateAppearances);
                return (
                  <TableRow hover key={player.p_id}>
                    <TableCell
                      style={{
                        position: "sticky",
                        top: 0,
                        left: 0,
                        zIndex: 1,
                        fontSize: "1.0em",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: "#DCDCDC",
                        width: "100%",
                        paddingLeft: "16px",
                      }}
                    >
                      <IconButton
                        size="small"
                        style={{ marginRight: "auto" }}
                        onClick={() => handleOpen(player)}
                      >
                        <SearchIcon />
                      </IconButton>
                      <span style={{ flexGrow: 1, textAlign: "center" }}>{player.p_id}</span>
                      {index + 1}
                    </TableCell>
                    {selectedColumns.includes("打席") && (
                      <TableCell
                        style={{
                          fontSize: "1.0em",
                          color: sortedColumn === "打席" ? "red" : "black",
                        }}
                      >
                        {playerPlateAppearances[player.p_id] || "N/A"}
                      </TableCell>
                    )}
                    {selectedColumns.includes("打數") && (
                      <TableCell
                        style={{
                          fontSize: "1.0em",
                          color: sortedColumn === "打數" ? "red" : "black",
                        }}
                      >
                        {playerHits[player.p_id]
                          ? playerPlateAppearances[player.p_id] -
                            ((playerHits[player.p_id]?.bb || 0) +
                              (playerHits[player.p_id]?.touchball || 0) +
                              (playerHits[player.p_id]?.sf || 0) +
                              (playerHits[player.p_id]?.bunt || 0))
                          : "N/A"}
                      </TableCell>
                    )}
                    {selectedColumns.includes("安打") && (
                      <TableCell
                        style={{
                          fontSize: "1.0em",
                          color: sortedColumn === "安打" ? "red" : "black",
                        }}
                      >
                        {playerHits[player.p_id]
                          ? playerHits[player.p_id].single +
                            playerHits[player.p_id].double +
                            playerHits[player.p_id].triple +
                            playerHits[player.p_id].homerun
                          : "0"}
                      </TableCell>
                    )}
                    {selectedColumns.includes("壘打數") && (
                      <TableCell
                        style={{
                          fontSize: "1.0em",
                          color: sortedColumn === "壘打數" ? "red" : "black",
                        }}
                      >
                        {stats.totalBases}
                      </TableCell>
                    )}
                    {selectedColumns.includes("上壘數") && (
                      <TableCell
                        style={{
                          fontSize: "1.0em",
                          color: sortedColumn === "上壘數" ? "red" : "black",
                        }}
                      >
                        {stats.onBaseCount}
                      </TableCell>
                    )}
                    {selectedColumns.includes("打點") && (
                      <TableCell
                        style={{
                          fontSize: "1.0em",
                          color: sortedColumn === "打點" ? "red" : "black",
                        }}
                      >
                        {playerHits[player.p_id] ? playerHits[player.p_id].rbi : "0"}
                      </TableCell>
                    )}
                    {selectedColumns.includes("一安") && (
                      <TableCell
                        style={{
                          fontSize: "1.0em",
                          color: sortedColumn === "一安" ? "red" : "black",
                        }}
                      >
                        {playerHits[player.p_id]?.single || "0"}
                      </TableCell>
                    )}
                    {selectedColumns.includes("二安") && (
                      <TableCell
                        style={{
                          fontSize: "1.0em",
                          color: sortedColumn === "二安" ? "red" : "black",
                        }}
                      >
                        {playerHits[player.p_id]?.double || "0"}
                      </TableCell>
                    )}
                    {selectedColumns.includes("三安") && (
                      <TableCell
                        style={{
                          fontSize: "1.0em",
                          color: sortedColumn === "三安" ? "red" : "black",
                        }}
                      >
                        {playerHits[player.p_id]?.triple || "0"}
                      </TableCell>
                    )}
                    {selectedColumns.includes("全壘打") && (
                      <TableCell
                        style={{
                          fontSize: "1.0em",
                          color: sortedColumn === "全壘打" ? "red" : "black",
                        }}
                      >
                        {playerHits[player.p_id]?.homerun || "0"}
                      </TableCell>
                    )}
                    {selectedColumns.includes("雙殺") && (
                      <TableCell
                        style={{
                          fontSize: "1.0em",
                          color: sortedColumn === "雙殺" ? "red" : "black",
                        }}
                      >
                        {playerHits[player.p_id]?.doubleplay || "0"}
                      </TableCell>
                    )}
                    {selectedColumns.includes("四壞") && (
                      <TableCell
                        style={{
                          fontSize: "1.0em",
                          color: sortedColumn === "四壞" ? "red" : "black",
                        }}
                      >
                        {playerHits[player.p_id]?.bb || "0"}
                      </TableCell>
                    )}
                    {selectedColumns.includes("犧飛") && (
                      <TableCell
                        style={{
                          fontSize: "1.0em",
                          color: sortedColumn === "犧飛" ? "red" : "black",
                        }}
                      >
                        {playerHits[player.p_id]?.sf || "0"}
                      </TableCell>
                    )}
                    {selectedColumns.includes("犧觸") && (
                      <TableCell
                        style={{
                          fontSize: "1.0em",
                          color: sortedColumn === "犧觸" ? "red" : "black",
                        }}
                      >
                        {playerHits[player.p_id]?.bunt || "0"}
                      </TableCell>
                    )}
                    {selectedColumns.includes("觸身") && (
                      <TableCell
                        style={{
                          fontSize: "1.0em",
                          color: sortedColumn === "觸身" ? "red" : "black",
                        }}
                      >
                        {playerHits[player.p_id]?.touchball || "0"}
                      </TableCell>
                    )}
                    {selectedColumns.includes("打擊率") && (
                      <TableCell
                        style={{
                          fontSize: "1.0em",
                          color: sortedColumn === "打擊率" ? "red" : "black",
                        }}
                      >
                        {stats.battingAverage}
                      </TableCell>
                    )}
                    {selectedColumns.includes("上壘率") && (
                      <TableCell
                        style={{
                          fontSize: "1.0em",
                          color: sortedColumn === "上壘率" ? "red" : "black",
                        }}
                      >
                        {stats.onBasePercentage}
                      </TableCell>
                    )}
                    {selectedColumns.includes("長打率") && (
                      <TableCell
                        style={{
                          fontSize: "1.0em",
                          color: sortedColumn === "長打率" ? "red" : "black",
                        }}
                      >
                        {stats.sluggingPercentage}
                      </TableCell>
                    )}
                    {selectedColumns.includes("OPS") && (
                      <TableCell
                        style={{
                          fontSize: "1.0em",
                          color: sortedColumn === "OPS" ? "red" : "black",
                        }}
                      >
                        {(
                          parseFloat(stats.onBasePercentage) + parseFloat(stats.sluggingPercentage)
                        ).toFixed(3)}
                      </TableCell>
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

const parseLocationToZone = (x, y) => {
  const inCircle = (x, y, centerX, centerY, radius) =>
    Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2) <= Math.pow(radius, 2);
  const outCircle = (x, y, centerX, centerY, radius) =>
    Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2) > Math.pow(radius, 2);
  const onOrAboveLine = (x, y, slope, intercept) => y >= slope * x + intercept;
  const onOrBelowLine = (x, y, slope, intercept) => y <= slope * x + intercept;
  const onOrRightOfVertical = (x, y, lineX) => x >= lineX;
  const onOrLeftOfVertical = (x, y, lineX) => x <= lineX;

  if (
    inCircle(x, y, 201, 219.64, 175.64) &&
    onOrAboveLine(x, y, 209 / 65, -24719 / 65) &&
    outCircle(x, y, 200, 223.24, 83) &&
    onOrBelowLine(x, y, 1, 65.8)
  ) {
    return "zone1";
  }
  if (
    inCircle(x, y, 200, 223.24, 83) &&
    onOrBelowLine(x, y, 1, 65.8) &&
    onOrAboveLine(x, y, 2.18, -172.18)
  ) {
    return "zone2";
  }
  if (
    inCircle(x, y, 200, 223.24, 83) &&
    onOrAboveLine(x, y, -2.18, 704.18) &&
    onOrBelowLine(x, y, -1, 465.7)
  ) {
    return "zone3";
  }
  if (
    onOrAboveLine(x, y, -209 / 60, 19323 / 20) &&
    outCircle(x, y, 200, 223.24, 83) &&
    inCircle(x, y, 201, 219.64, 175.64) &&
    onOrBelowLine(x, y, -1, 465.7)
  ) {
    return "zone4";
  }
  if (
    inCircle(x, y, 201, 219.64, 175.64) &&
    onOrBelowLine(x, y, 209 / 65, -24719 / 65) &&
    outCircle(x, y, 200, 223.24, 83) &&
    onOrBelowLine(x, y, -209 / 60, 19323 / 20)
  ) {
    return "zone5";
  }
  if (
    inCircle(x, y, 200, 223.24, 83) &&
    onOrLeftOfVertical(x, y, 201) &&
    onOrBelowLine(x, y, 2.18, -172.18)
  ) {
    return "zone6";
  }
  if (
    inCircle(x, y, 200, 223.24, 83) &&
    onOrBelowLine(x, y, -2.18, 704.18) &&
    onOrRightOfVertical(x, y, 201)
  ) {
    return "zone7";
  }
  return "unknown";
};

const isHit = (content) =>
  ["一安", "二安", "三安"].some((hit) => content && content.includes(hit));
const isOut = (content) =>
  ["飛球", "滾地", "失誤", "野選", "雙殺", "犧飛", "犧觸", "觸身"].some(
    (out) => content && content.includes(out)
  );
const isHR = (content) => ["全打"].some((hr) => content && content.includes(hr));

const PlayerDialog = ({ open, onClose, player, locations }) => {
  const imageContainerRef = React.useRef(null);
  const baseballFieldImage =
    "https://media.istockphoto.com/id/1269757192/zh/%E5%90%91%E9%87%8F/%E6%A3%92%E7%90%83%E5%A0%B4%E5%9C%96%E7%A4%BA%E6%A3%92%E7%90%83%E5%A0%B4%E5%90%91%E9%87%8F%E8%A8%AD%E8%A8%88%E7%9A%84%E5%B9%B3%E9%9D%A2%E5%9C%96%E8%A7%A3%E9%A0%82%E8%A6%96%E5%9C%96-web.jpg?s=612x612&w=0&k=20&c=Zt85Kr6EksFKBmYQmgs138zfLRp3eoIzKeQLS2mirLU=";
  const picImage = "hi.png";

  const convertLocationToPosition = (location) => {
    const container = imageContainerRef.current;
    if (container) {
      const { width: displayWidth, height: displayHeight } = container.getBoundingClientRect();
      const originalWidth = 400;
      const scaleFactor = displayWidth / originalWidth;

      return {
        left: `${((location.x * scaleFactor) / displayWidth) * 100}%`,
        top: `${((location.y * scaleFactor) / displayHeight) * 100}%`,
      };
    }
    return { left: "0%", top: "0%" };
  };

  const zonePositions = {
    zone1: { left: "27%", top: "35%" },
    zone2: { left: "40%", top: "60%" },
    zone3: { left: "60%", top: "60%" },
    zone4: { left: "73%", top: "35%" },
    zone5: { left: "50%", top: "25%" },
    zone6: { left: "45%", top: "50%" },
    zone7: { left: "55%", top: "50%" },
  };

  const countZones = locations.reduce((acc, loc) => {
    const zone = parseLocationToZone(loc.x, loc.y);
    acc[zone] = (acc[zone] || 0) + 1;
    return acc;
  }, {});

  const totalLocations = locations.length;
  const zonePercentages = Object.keys(countZones).map((zone) => ({
    zone,
    percentage: ((countZones[zone] / totalLocations) * 100).toFixed(1) + "%",
    ...zonePositions[zone],
  }));

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{player?.p_id || "Unknown Player"}</DialogTitle>
      <DialogContent>
        <div
          ref={imageContainerRef}
          style={{ position: "relative", width: "450px", height: "auto" }}
        >
          <img src={baseballFieldImage} width="100%" height="100%" alt="Baseball Field" />
          {locations.map((location, index) => {
            const position = convertLocationToPosition(location);
            const content = location.content || location.o_content || "";
            const pointColor = isHit(content) ? "blue" : isOut(content) ? "red" : isHR(content) ? "#6495ED" : "black";

            return (
              <div
                key={index}
                style={{
                  position: "absolute",
                  left: position.left,
                  top: position.top,
                  height: "10px",
                  width: "10px",
                  borderRadius: "50%",
                  backgroundColor: pointColor,
                  transform: "translate(-50%, -50%)",
                }}
              />
            );
          })}
        </div>
        <div
          ref={imageContainerRef}
          style={{ position: "relative", width: "450px", height: "auto" }}
        >
          <img src={picImage} width={"100%"} height={"100%"} alt="Game Specific Field" />
          {zonePercentages.map(({ zone, percentage, left, top }) => (
            <Typography
              key={zone}
              style={{
                position: "absolute",
                left: left,
                top: top,
                color: "white",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                padding: "2px 4px",
                borderRadius: "4px",
                transform: "translate(-50%, -50%)",
                fontSize: "0.75rem",
              }}
            >
              {`${percentage}`}
            </Typography>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

PlayerDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  player: PropTypes.object,
  locations: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    })
  ),
};
HitrecordTable.propTypes = {
  selectedTeam: PropTypes.string,
  selectedColumns: PropTypes.arrayOf(PropTypes.string),
};

export default HitrecordTable;
