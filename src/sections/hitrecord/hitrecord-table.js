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
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton } from "@mui/material";
import { firestore } from "src/pages/firebase";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";

// 定義 HitrecordTable 組件
export const HitrecordTable = ({ selectedTeam, selectedColumns, selectedGameTypes }) => {
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
            (hitData.homerun || 0)) /
          atBats
        : 0;

    // 計算上壘率
    const onBasePercentage =
      atBats > 0
        ? onBaseCount / (atBats + (hitData.bb || 0) + (hitData.sf || 0) + (hitData.touchball || 0))
        : 0;

    // 計算長打率
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
            // 確認這是一個數組
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
      // 確保 selectedGameTypes 不是 undefined 且有元素
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
          console.log("Game Data:", gameData);

          // 处理 ordermain 和 orderoppo
          if (gameData.ordermain) {
            gameData.ordermain.forEach((playerStat) => {
              const playerEntry = playersData.find((player) => player.p_id === playerStat.p_name);
              if (playerEntry) {
                console.log(`Processing main order for player ${playerStat.p_name}`);
                playersStats[playerEntry.p_id] = (playersStats[playerEntry.p_id] || 0) + 1;
              }
            });
          } else {
            console.log("No ordermain for this game:", docSnapshot.id);
          }

          if (gameData.orderoppo) {
            gameData.orderoppo.forEach((playerStat) => {
              const playerEntry = playersData.find((player) => player.p_id === playerStat.o_p_name);
              if (playerEntry) {
                console.log(`Processing oppo order for player ${playerStat.o_p_name}`);
                playersStats[playerEntry.p_id] = (playersStats[playerEntry.p_id] || 0) + 1;
              }
            });
          } else {
            console.log("No orderoppo for this game:", docSnapshot.id);
          }
        });

        setPlayerPlateAppearances(playersStats);
        console.log("Player plate appearances calculated:", playersStats);
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
        let newPlayerHits = {}; // 使用一個新的變量來存儲計算結果
        querySnapshot.forEach((docSnapshot) => {
          const gameData = docSnapshot.data();

          // Process ordermain
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
                if (playerStat.content && playerStat.content.includes("全壘打"))
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
          } else {
            console.log("No ordermain for this game:", docSnapshot.id);
          }

          // Process orderoppo and check for o_content
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
                if (playerStat.o_content && playerStat.o_content.includes("全壘打"))
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
          } else {
            console.log("No orderoppo for this game:", docSnapshot.id);
          }
        });

        // Update the state with the new hits
        setPlayerHits(newPlayerHits);
        console.log("Player hits:", newPlayerHits);
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
      // 調用API之前檢查 selectedTeam 和 selectedGameTypes
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
          // 處理每個游戲的數據，更新狀態等...
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

        // Check if ordermain exists and is an array before processing
        if (gameData.ordermain && Array.isArray(gameData.ordermain)) {
          gameData.ordermain.forEach((play) => {
            if (play.p_name === playerId && play.location) {
              // Ensure the location data is not undefined or null
              if (play.location.x !== undefined && play.location.y !== undefined) {
                // Include content in the location object
                locations.push({
                  x: play.location.x,
                  y: play.location.y,
                  content: play.content, // Add content to the location data
                });
              }
            }
          });
        }

        // Check if orderoppo exists and is an array before processing
        if (gameData.orderoppo && Array.isArray(gameData.orderoppo)) {
          gameData.orderoppo.forEach((play) => {
            if (play.o_p_name === playerId && play.location) {
              // Ensure the location data is not undefined or null
              if (play.location.x !== undefined && play.location.y !== undefined) {
                // Include o_content in the location object
                locations.push({
                  x: play.location.x,
                  y: play.location.y,
                  content: play.o_content, // Add o_content to the location data
                });
              }
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

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [selectedLocation]); // 依賴數組應該包括 selectedLocation，如果它預計會隨時間變化

  useEffect(() => {
    console.log("Players Data:", playersData);
    console.log("Player Hits:", playerHits);
    console.log("Plate Appearances:", playerPlateAppearances);
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
      hits: 0, //安打
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

    // 以下是基於團隊總和數據計算的正確打擊率、上壘率和長打率
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

  const onSortChange = (key) => {
    // 固定设置为降序
    setSortConfig({ key, direction: "descending" });
  };
  

function getValueByKey(player, key,) {
  const stats = calculateStats(player.p_id, playerHits, playerPlateAppearances);
  switch (key) {
    case '打席':
      return playerPlateAppearances[player.p_id] || 0;
    case '打數':
      return playerPlateAppearances[player.p_id] ?
        playerPlateAppearances[player.p_id] - (
          (playerHits[player.p_id]?.bb || 0) +
          (playerHits[player.p_id]?.touchball || 0) +
          (playerHits[player.p_id]?.sf || 0) +
          (playerHits[player.p_id]?.bunt || 0)
        ) : 0;
    case '安打':
      return playerHits[player.p_id] ?
        playerHits[player.p_id].single +
        playerHits[player.p_id].double +
        playerHits[player.p_id].triple +
        playerHits[player.p_id].homerun : 0;
    case '壘打數':
      return stats.totalBases || 0;
    case '上壘數':
      return stats.onBaseCount || 0;
    case '打點':
      return playerHits[player.p_id]?.rbi || 0;
    case '一安':
      return playerHits[player.p_id]?.single || 0;
    case '二安':
      return playerHits[player.p_id]?.double || 0;
    case '三安':
      return playerHits[player.p_id]?.triple || 0;
    case '全壘打':
      return playerHits[player.p_id]?.homerun || 0;
    case '雙殺':
      return playerHits[player.p_id]?.doubleplay || 0;
    case '四壞':
      return playerHits[player.p_id]?.bb || 0;
    case '犧飛':
      return playerHits[player.p_id]?.sf || 0;
    case '犧觸':
      return playerHits[player.p_id]?.bunt || 0;
    case '觸身':
      return playerHits[player.p_id]?.touchball || 0;
    case '打擊率':
      return parseFloat(stats.battingAverage || 0);
    case '上壘率':
      return parseFloat(stats.onBasePercentage || 0);
    case '長打率':
      return parseFloat(stats.sluggingPercentage || 0);
    case 'OPS':
      return parseFloat(stats.onBasePercentage || 0) + parseFloat(stats.sluggingPercentage || 0);
    default:
      return 0; // Default return 0 to avoid undefined errors
  }
}


  
const sortedPlayers = useMemo(() => {
  let sortableItems = [...playersData];
  sortableItems.sort((a, b) => {
    const valueA = getValueByKey(a, sortConfig.key, playerHits, playerPlateAppearances);
    const valueB = getValueByKey(b, sortConfig.key, playerHits, playerPlateAppearances);
    return valueA > valueB ? -1 : (valueA < valueB ? 1 : 0); 
  });

  return sortableItems;
}, [playersData, sortConfig, playerHits, playerPlateAppearances]);

  

  // 渲染組件
  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 2500 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  colSpan={2}
                  style={{
                    position: "sticky",
                    top: 0,
                    left: 0,
                    zIndex: 1,
                    fontSize: "1.0em",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "white", // 確保背景不透明，避免內容互相覆蓋時看到下面的文本
                  }}
                >
                  <div>落點</div>
                  <div>球員</div>
                  <div>排名</div>
                </TableCell>
                {selectedColumns.includes("打席") && (
                  <TableCell
                    key={"打席"}
                    style={{ fontSize: "1.0em", cursor: "pointer" }}
                    onClick={() => onSortChange("打席")}
                  >
                    打席
                  </TableCell>
                )}
                {selectedColumns.includes("打數") && (
                   <TableCell
                   key={"打數"}
                   style={{ fontSize: "1.0em", cursor: "pointer" }}
                   onClick={() => onSortChange("打數")}
                 >打數</TableCell>
                )}
                {selectedColumns.includes("安打") && (
                   <TableCell
                   key={"安打"}
                   style={{ fontSize: "1.0em", cursor: "pointer" }}
                   onClick={() => onSortChange("安打")}
                 >安打</TableCell>
                )}
                {selectedColumns.includes("壘打數") && (
                   <TableCell
                   key={"壘打數"}
                   style={{ fontSize: "1.0em", cursor: "pointer" }}
                   onClick={() => onSortChange("壘打數")}
                 >壘打數</TableCell>
                )}
                {selectedColumns.includes("上壘數") && (
                   <TableCell
                   key={"上壘數"}
                   style={{ fontSize: "1.0em", cursor: "pointer" }}
                   onClick={() => onSortChange("上壘數")}
                 >上壘數</TableCell>
                )}
                {selectedColumns.includes("打點") && (
                   <TableCell
                   key={"打點"}
                   style={{ fontSize: "1.0em", cursor: "pointer" }}
                   onClick={() => onSortChange("打點")}
                 >打點</TableCell>
                )}
                {selectedColumns.includes("一安") && (
                   <TableCell
                   key={"一安"}
                   style={{ fontSize: "1.0em", cursor: "pointer" }}
                   onClick={() => onSortChange("一安")}
                 >一安</TableCell>
                )}
                {selectedColumns.includes("二安") && (
                   <TableCell
                   key={"二安"}
                   style={{ fontSize: "1.0em", cursor: "pointer" }}
                   onClick={() => onSortChange("二安")}
                 >二安</TableCell>
                )}
                {selectedColumns.includes("三安") && (
                   <TableCell
                   key={"三安"}
                   style={{ fontSize: "1.0em", cursor: "pointer" }}
                   onClick={() => onSortChange("三安")}
                 >三安</TableCell>
                )}
                {selectedColumns.includes("全壘打") && (
                   <TableCell
                   key={"全壘打"}
                   style={{ fontSize: "1.0em", cursor: "pointer" }}
                   onClick={() => onSortChange("全壘打")}
                 >全壘打</TableCell>
                )}
                {selectedColumns.includes("雙殺") && (
                  <TableCell
                  key={"雙殺"}
                  style={{ fontSize: "1.0em", cursor: "pointer" }}
                  onClick={() => onSortChange("雙殺")}
                >雙殺</TableCell>
                )}
                {selectedColumns.includes("四壞") && (
                  <TableCell
                  key={"四壞"}
                  style={{ fontSize: "1.0em", cursor: "pointer" }}
                  onClick={() => onSortChange("四壞")}
                >四壞</TableCell>
                )}
                {selectedColumns.includes("犧飛") && (
                  <TableCell
                  key={"犧飛"}
                  style={{ fontSize: "1.0em", cursor: "pointer" }}
                  onClick={() => onSortChange("犧飛")}
                >犧飛</TableCell>
                )}
                {selectedColumns.includes("犧觸") && (
                  <TableCell
                  key={"犧觸"}
                  style={{ fontSize: "1.0em", cursor: "pointer" }}
                  onClick={() => onSortChange("犧觸")}
                >犧觸</TableCell>
                )}
                {selectedColumns.includes("觸身") && (
                  <TableCell
                  key={"觸身"}
                  style={{ fontSize: "1.0em", cursor: "pointer" }}
                  onClick={() => onSortChange("觸身")}
                >觸身</TableCell>
                )}
                {selectedColumns.includes("打擊率") && (
                  <TableCell
                  key={"打擊率"}
                  style={{ fontSize: "1.0em", cursor: "pointer" }}
                  onClick={() => onSortChange("打擊率")}
                >打擊率</TableCell>
                )}
                {selectedColumns.includes("上壘率") && (
                  <TableCell
                  key={"上壘率"}
                  style={{ fontSize: "1.0em", cursor: "pointer" }}
                  onClick={() => onSortChange("上壘率")}
                >上壘率</TableCell>
                )}
                {selectedColumns.includes("長打率") && (
                  <TableCell
                  key={"長打率"}
                  style={{ fontSize: "1.0em", cursor: "pointer" }}
                  onClick={() => onSortChange("長打率")}
                >長打率</TableCell>
                )}
                {selectedColumns.includes("OPS") && (
                  <TableCell
                  key={"OPS"}
                  style={{ fontSize: "1.0em", cursor: "pointer" }}
                  onClick={() => onSortChange("OPS")}
                >OPS</TableCell>
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
                    textAlign: "center", // 水平置中
                    display: "flex", // 使用flex布局
                    alignItems: "center", // 垂直置中
                    justifyContent: "center", // 水平置中
                    background: "white", // 設置背景顏色以覆蓋下層內容
                  }}
                >
                  團隊成績
                </TableCell>

                {selectedColumns.includes("打席") && (
                  <TableCell style={{ fontSize: "1.0em" }}>{teamTotals.plateAppearances}</TableCell>
                )}
                {selectedColumns.includes("打數") && (
                  <TableCell style={{ fontSize: "1.0em" }}>{teamTotals.atBats}</TableCell>
                )}
                {selectedColumns.includes("安打") && (
                  <TableCell style={{ fontSize: "1.0em" }}>{teamTotals.hits}</TableCell>
                )}
                {selectedColumns.includes("壘打數") && (
                  <TableCell style={{ fontSize: "1.0em" }}>{teamTotals.totalBases}</TableCell>
                )}
                {selectedColumns.includes("上壘數") && (
                  <TableCell style={{ fontSize: "1.0em" }}>{teamTotals.onBaseCount}</TableCell>
                )}
                {selectedColumns.includes("打點") && (
                  <TableCell style={{ fontSize: "1.0em" }}>{teamTotals.trbi}</TableCell>
                )}

                {selectedColumns.includes("一安") && (
                  <TableCell style={{ fontSize: "1.0em" }}>{teamTotals.singles}</TableCell>
                )}
                {selectedColumns.includes("二安") && (
                  <TableCell style={{ fontSize: "1.0em" }}>{teamTotals.doubles}</TableCell>
                )}
                {selectedColumns.includes("三安") && (
                  <TableCell style={{ fontSize: "1.0em" }}>{teamTotals.triples}</TableCell>
                )}
                {selectedColumns.includes("全壘打") && (
                  <TableCell style={{ fontSize: "1.0em" }}>{teamTotals.homeruns}</TableCell>
                )}
                {selectedColumns.includes("雙殺") && (
                  <TableCell style={{ fontSize: "1.0em" }}>{teamTotals.doublePlays}</TableCell>
                )}
                {selectedColumns.includes("四壞") && (
                  <TableCell style={{ fontSize: "1.0em" }}>{teamTotals.walks}</TableCell>
                )}
                {selectedColumns.includes("犧飛") && (
                  <TableCell style={{ fontSize: "1.0em" }}>{teamTotals.sacrificeFlies}</TableCell>
                )}
                {selectedColumns.includes("犧觸") && (
                  <TableCell style={{ fontSize: "1.0em" }}>{teamTotals.sacrificeHits}</TableCell>
                )}
                {selectedColumns.includes("觸身") && (
                  <TableCell style={{ fontSize: "1.0em" }}>{teamTotals.hitByPitch}</TableCell>
                )}
                {selectedColumns.includes("打擊率") && (
                  <TableCell style={{ fontSize: "1.0em" }}>{teamTotals.battingAverage}</TableCell>
                )}
                {selectedColumns.includes("上壘率") && (
                  <TableCell style={{ fontSize: "1.0em" }}>{teamTotals.onBasePercentage}</TableCell>
                )}
                {selectedColumns.includes("長打率") && (
                  <TableCell style={{ fontSize: "1.0em" }}>
                    {teamTotals.sluggingPercentage}
                  </TableCell>
                )}
                {selectedColumns.includes("OPS") && (
                  <TableCell style={{ fontSize: "1.0em" }}>{teamTotals.t_ops}</TableCell>
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
                        background: "white",
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
                      <TableCell>{playerPlateAppearances[player.p_id] || "N/A"}</TableCell>
                    )}
                    {selectedColumns.includes("打數") && (
                      <TableCell>
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
                      <TableCell>
                        {playerHits[player.p_id]
                          ? playerHits[player.p_id].single +
                            playerHits[player.p_id].double +
                            playerHits[player.p_id].triple +
                            playerHits[player.p_id].homerun
                          : "0"}
                      </TableCell>
                    )}
                    {selectedColumns.includes("壘打數") && (
                      <TableCell>{stats.totalBases}</TableCell>
                    )}
                    {selectedColumns.includes("上壘數") && (
                      <TableCell>{stats.onBaseCount}</TableCell>
                    )}
                    {selectedColumns.includes("打點") && (
                      <TableCell>
                        {playerHits[player.p_id] ? playerHits[player.p_id].rbi : "0"}
                      </TableCell>
                    )}
                    {selectedColumns.includes("一安") && (
                      <TableCell>{playerHits[player.p_id]?.single || "0"}</TableCell>
                    )}
                    {selectedColumns.includes("二安") && (
                      <TableCell>{playerHits[player.p_id]?.double || "0"}</TableCell>
                    )}
                    {selectedColumns.includes("三安") && (
                      <TableCell>{playerHits[player.p_id]?.triple || "0"}</TableCell>
                    )}
                    {selectedColumns.includes("全壘打") && (
                      <TableCell>{playerHits[player.p_id]?.homerun || "0"}</TableCell>
                    )}
                    {selectedColumns.includes("雙殺") && (
                      <TableCell>{playerHits[player.p_id]?.doubleplay || "0"}</TableCell>
                    )}
                    {selectedColumns.includes("四壞") && (
                      <TableCell>{playerHits[player.p_id]?.bb || "0"}</TableCell>
                    )}
                    {selectedColumns.includes("犧飛") && (
                      <TableCell>{playerHits[player.p_id]?.sf || "0"}</TableCell>
                    )}
                    {selectedColumns.includes("犧觸") && (
                      <TableCell>{playerHits[player.p_id]?.bunt || "0"}</TableCell>
                    )}
                    {selectedColumns.includes("觸身") && (
                      <TableCell>{playerHits[player.p_id]?.touchball || "0"}</TableCell>
                    )}
                    {selectedColumns.includes("打擊率") && (
                      <TableCell>{stats.battingAverage}</TableCell>
                    )}
                    {selectedColumns.includes("上壘率") && (
                      <TableCell>{stats.onBasePercentage}</TableCell>
                    )}
                    {selectedColumns.includes("長打率") && (
                      <TableCell>{stats.sluggingPercentage}</TableCell>
                    )}
                    {selectedColumns.includes("OPS") && (
                      <TableCell>
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

  // Zone 1: a, e, b, c
  if (
    inCircle(x, y, 201, 219.64, 175.64) &&
    onOrAboveLine(x, y, 209 / 65, -24719 / 65) &&
    outCircle(x, y, 200, 223.24, 83) &&
    onOrBelowLine(x, y, 1, 65.8)
  ) {
    return "zone1";
  }
  // Zone 2: b, c, j, g
  if (
    inCircle(x, y, 200, 223.24, 83) &&
    onOrBelowLine(x, y, 1, 65.8) &&
    onOrBelowLine(x, y, -17 / 8, 620) &&
    onOrAboveLine(x, y, 20 / 27, 70)
  ) {
    return "zone2";
  }
  // Zone 3: c, d, j, k, l
  if (
    onOrBelowLine(x, y, 1, 65.8) &&
    onOrBelowLine(x, y, -1, 465.7) &&
    onOrAboveLine(x, y, -17 / 8, 620) &&
    y >= 212 &&
    onOrAboveLine(x, y, 17 / 7, -298)
  ) {
    return "zone3";
  }
  // Zone 4: i, b, l, d
  if (
    onOrAboveLine(x, y, -20 / 27, 9178 / 25) &&
    inCircle(x, y, 200, 223.24, 83) &&
    onOrBelowLine(x, y, 17 / 7, -298) &&
    onOrBelowLine(x, y, -1, 465.7)
  ) {
    return "zone4";
  }
  // Zone 5: f, b, a, d
  if (
    onOrAboveLine(x, y, -209 / 60, 19323 / 20) &&
    outCircle(x, y, 200, 223.24, 83) &&
    inCircle(x, y, 201, 219.64, 175.64) &&
    onOrBelowLine(x, y, -1, 465.7)
  ) {
    return "zone5";
  }
  // Zone 6: a, e, b, f
  if (
    inCircle(x, y, 201, 219.64, 175.64) &&
    onOrBelowLine(x, y, 209 / 65, -24719 / 65) &&
    outCircle(x, y, 200, 223.24, 83) &&
    onOrBelowLine(x, y, -209 / 60, 19323 / 20)
  ) {
    return "zone6";
  }
  // Zone 7: b, g, h, k
  if (
    inCircle(x, y, 200, 223.24, 83) &&
    onOrBelowLine(x, y, 20 / 27, 70) &&
    onOrLeftOfVertical(x, y, 201) &&
    y <= 212
  ) {
    return "zone7";
  }
  // Zone 8: b, h, i, k
  if (
    inCircle(x, y, 200, 223.24, 83) &&
    onOrRightOfVertical(x, y, 201) &&
    y <= 212 &&
    onOrBelowLine(x, y, -20 / 27, 9178 / 25)
  ) {
    return "zone8";
  }

  return "unknown";
};

const isHit = (content) =>
  ["一安", "二安", "三安", "全壘打"].some((hit) => content && content.includes(hit));
const isOut = (content) =>
  ["飛球", "滾地", "失誤", "野選", "雙殺", "犧飛", "犧觸", "觸身"].some(
    (out) => content && content.includes(out)
  );

const PlayerDialog = ({ open, onClose, player, locations }) => {
  const imageContainerRef = React.useRef(null);
  const baseballFieldImage =
    "https://media.istockphoto.com/id/1269757192/zh/%E5%90%91%E9%87%8F/%E6%A3%92%E7%90%83%E5%A0%B4%E5%9C%96%E7%A4%BA%E6%A3%92%E7%90%83%E5%A0%B4%E5%90%91%E9%87%8F%E8%A8%AD%E8%A8%88%E7%9A%84%E5%B9%B3%E9%9D%A2%E5%9C%96%E8%A7%A3%E9%A0%82%E8%A6%96%E5%9C%96-web.jpg?s=612x612&w=0&k=20&c=Zt85Kr6EksFKBmYQmgs138zfLRp3eoIzKeQLS2mirLU="; // 用实际图片URL替换此处文本
  const picImage = "pic.png";

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
        left: `${((location.x * scaleFactor) / displayWidth) * 100}%`,
        top: `${((location.y * scaleFactor) / displayHeight) * 100}%`,
      };
    }
    return { left: "0%", top: "0%" };
  };

  // 调试时，将位置记录到控制台
  console.log("Locations:", locations);

  const zonePositions = {
    zone1: { left: "27%", top: "35%" },
    zone2: { left: "40%", top: "60%" },
    zone3: { left: "50%", top: "67%" },
    zone4: { left: "60%", top: "60%" },
    zone5: { left: "73%", top: "35%" },
    zone6: { left: "50%", top: "25%" },
    zone7: { left: "43%", top: "48%" },
    zone8: { left: "57%", top: "48%" },
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
            const pointColor = isHit(content) ? "blue" : isOut(content) ? "red" : "black";

            // 打印content或o_content
            console.log(`Location index ${index}: Content - ${content}`);

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
                color: "white", // 選擇合適的文字顏色
                backgroundColor: "rgba(0, 0, 0, 0.5)", // 背景色增加可讀性
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

// 确保您有一个引用来获取容器的尺寸

// 定義 PlayerDialog 組件的 prop 類型
PlayerDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  // player: PropTypes.string // 假設 player 是一個字符串
  player: PropTypes.object, // 確保 player 是對象類型
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
