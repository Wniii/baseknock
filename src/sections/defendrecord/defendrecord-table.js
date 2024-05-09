import React, { useState, useEffect, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import { Box, Card, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { firestore } from "src/pages/firebase";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";

// 定義 DefendTable 組件
export const DefendTable = ({ selectedTeam, selectedColumns, selectedGameType }) => {
  // const [open, setOpen] = useState(false);
  // const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playersData, setPlayersData] = useState([]);

  const [teamTotals, setTeamTotals] = useState({
    totalStrikes: 0,
    totalBalls: 0,
    totalGamesPlayed: 0,
    totalGamesStarted: 0,
    totalHits: 0,
    totalWalks: 0,
    totalStrikeouts: 0,
    totalRunsBattedIn: 0,
    totalOuts: 0,
    totalEarnedRuns: 0, // 新增自責分總和
    totalHitByPitches: 0,
    teamK9: 0,
    teamBB9: 0,
    teamH9: 0,
  });

  let totalGamesCount = 0;

  const calculateHits = (gamesData, playerNames) => {
    const statsByPitcher = playerNames.reduce((acc, name) => {
      acc[name] = {
        hits: 0,
        walks: 0,
        hitByPitches: 0, // 新增觸身球數據
        homeRuns: 0, // 新增全壘打數據
        strikeouts: 0,
        totalBalls: 0,
        totalStrikes: 0,
        runsBattedIn: 0,
      };
      return acc;
    }, {});

    gamesData.forEach((gameData) => {
      ["ordermain", "orderoppo"].forEach((orderKey) => {
        const orders = gameData[orderKey];
        if (Array.isArray(orders)) {
          orders.forEach((order) => {
            const pitcherName = order.pitcher?.name;
            if (pitcherName && statsByPitcher.hasOwnProperty(pitcherName)) {
              const content = order.content || order.o_content;
              const pitcherStats = statsByPitcher[pitcherName];
              // 假設内容字符串包含這些事件
              if (
                content.includes("一安") ||
                content.includes("二安") ||
                content.includes("三安") ||
                content.includes("全壘打")
              ) {
                pitcherStats.hits += 1;
              }
              if (content.includes("四壞")) {
                pitcherStats.walks += 1;
              }
              if (content.includes("觸身")) {
                pitcherStats.hitByPitches += 1; // 計算觸身球
              }
              if (content.includes("三振")) {
                pitcherStats.strikeouts += 1;
              }
              if (content.includes("全打")) {
                pitcherStats.homeRuns += 1;
              }
              const orderRBI = Number(order.rbi) || 0;
              const orderORBI = Number(order.o_rbi) || 0;
              pitcherStats.runsBattedIn += orderRBI + orderORBI;
            }
          });
        }
      });
    });

    return statsByPitcher;
  };

  const calculateInningsPitched = (gamesData, playerNames) => {
    const inningsByPitcher = playerNames.reduce((acc, name) => {
      acc[name] = 0;
      return acc;
    }, {});

    gamesData.forEach((gameData) => {
      ["ordermain", "orderoppo"].forEach((orderKey) => {
        const orders = gameData[orderKey];
        if (Array.isArray(orders)) {
          orders.forEach((order) => {
            const pitcherName = order.pitcher?.name;
            const innout = parseInt(order.innouts, 10) || 0;
            if (pitcherName && inningsByPitcher.hasOwnProperty(pitcherName)) {
              inningsByPitcher[pitcherName] += innout;
            }
          });
        }
      });
    });

    // 计算整数局数和余数
    Object.keys(inningsByPitcher).forEach((pitcher) => {
      const totalOuts = inningsByPitcher[pitcher];
      const innings = Math.floor(totalOuts / 3);
      const extraOuts = totalOuts % 3;
      inningsByPitcher[pitcher] = innings + extraOuts * 0.1;
    });

    return inningsByPitcher;
  };

  // 计算 WHIP
  const calculateWHIP = (statsByPitcher, inningsByPitcher) => {
    const whipByPitcher = {};
    Object.keys(statsByPitcher).forEach((pitcher) => {
      const { hits, walks, hitByPitches } = statsByPitcher[pitcher];
      const innings = inningsByPitcher[pitcher];
      const aaa = hitByPitches
      console.log("ddddd",aaa)
      whipByPitcher[pitcher] = innings > 0 ? (hits + walks + hitByPitches) / innings : 0;
    });
    return whipByPitcher;
  };

  const calculateRates = (statsByPitcher, inningsByPitcher) => {
    const ratesByPitcher = {};
    Object.keys(statsByPitcher).forEach((pitcher) => {
      const { hits, strikeouts, walks } = statsByPitcher[pitcher];
      const innings = inningsByPitcher[pitcher];
      ratesByPitcher[pitcher] = {
        H9: innings > 0 ? ((hits * 9) / innings).toFixed(2) : 0,
        K9: innings > 0 ? ((strikeouts * 9) / innings).toFixed(2) : 0,
        BB9: innings > 0 ? ((walks * 9) / innings).toFixed(2) : 0,
      };
    });
    return ratesByPitcher;
  };

  const calculateERA = (statsByPitcher, inningsByPitcher) => {
    const eraByPitcher = {};
    Object.keys(statsByPitcher).forEach((pitcher) => {
      const { runsBattedIn } = statsByPitcher[pitcher];
      const innings = inningsByPitcher[pitcher];
      // 確保我們有有效的局數來避免除以零的錯誤
      eraByPitcher[pitcher] = innings > 0
        ? (9 * runsBattedIn / innings).toFixed(2)
        : "∞"; // 如果沒有投球局，就設定為無窮大或其他適當的預設值
    });
    return eraByPitcher;
  };

  // 使用 useEffect 钩子获取球队球员数据
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
      const playerNames = Object.keys(teamData.players);
      const pitchersInGames = new Set();

      let gamesQuery;
      if (selectedGameType && selectedGameType.length > 0) {
        gamesQuery = query(collection(teamDocRef, "games"), where("gName", "in", selectedGameType));
      } else {
        gamesQuery = query(collection(teamDocRef, "games"));
      }
      const gamesQuerySnapshot = await getDocs(gamesQuery);
      const allGameData = gamesQuerySnapshot.docs.map((doc) => doc.data());

      const inningsByPitcher = calculateInningsPitched(allGameData, playerNames);
      const statsByPitcher = calculateHits(allGameData, playerNames);
      const whipByPitcher = calculateWHIP(statsByPitcher, inningsByPitcher); // Calculate WHIP here
      const ratesByPitcher = calculateRates(statsByPitcher, inningsByPitcher); // Calculate H/9, K/9, BB/9 here
      const eraByPitcher = calculateERA(statsByPitcher, inningsByPitcher); // 計算 ERA

      gamesQuerySnapshot.docs.forEach((doc) => {
        const gameData = doc.data();
        ["ordermain", "orderoppo"].forEach((orderKey) => {
          (gameData[orderKey] || []).forEach((order) => {
            const pitcherName = order.pitcher?.name;
            if (pitcherName) {
              pitchersInGames.add(pitcherName);
            }
          });
        });
      });

      const hitsByPitcher = playerNames.reduce((acc, name) => {
        acc[name] = {
          hits: 0,
          walks: 0,
          hitByPitches: 0, // 新增觸身球數據
          strikeouts: 0,
          totalBalls: 0,
          totalStrikes: 0,
          runsBattedIn: 0, // 确保这里初始化为 0
          gamesPlayed: 0,
          gamesStarted: 0,
        };
        return acc;
      }, {});

      gamesQuerySnapshot.docs.forEach((doc) => {
        const gameData = doc.data();
        const gameId = doc.id; // 用比賽的文檔 ID 來唯一識別每場比賽

        // 使用一個 Map 來跟蹤每場比賽中已計算過的投手
        const countedPitchers = new Map();

        ["ordermain", "orderoppo"].forEach((orderKey) => {
          (gameData[orderKey] || []).forEach((order, index) => {
            const pitcherName = order.pitcher?.name;

            if (pitcherName && playerNames.includes(pitcherName)) {
              // 如果這場比賽中的這個投手還沒有被計算過
              if (!countedPitchers.has(pitcherName)) {
                hitsByPitcher[pitcherName].gamesPlayed++;
                countedPitchers.set(pitcherName, true);
              }

              // 計算該投手的其他統計數據
              if (index === 0) {
                // 假設第一位投手是先發
                hitsByPitcher[pitcherName].gamesStarted++;
              }
              const content = order.content || order.o_content;
              const hasHit = ["一安", "二安", "三安", "全打"].some((hitType) =>
                content.includes(hitType)
              );
              const hasWalk = content.includes("四壞");
              const hasStrikeout = content.includes("三振");
              const hashitByPitches = content.includes("觸身");

              if (hasHit) hitsByPitcher[pitcherName].hits++;
              if (hasWalk) hitsByPitcher[pitcherName].walks++;
              if (hasStrikeout) hitsByPitcher[pitcherName].strikeouts++;
              if (hashitByPitches) hitsByPitcher[pitcherName].hitByPitches++;
              const balls = Number(order.pitcher?.ball) || 0;
              const strikes = Number(order.pitcher?.strike) || 0;
              const  hitByPitches = Number(order.pitcher?. hitByPitches) || 0;
              hitsByPitcher[pitcherName].totalBalls += balls;
              hitsByPitcher[pitcherName].totalStrikes += strikes;
              hitsByPitcher[pitcherName].hitByPitches += hitByPitches;

              const orderRBI = Number(order.rbi) || 0;
              const orderORBI = Number(order.o_rbi) || 0;
              hitsByPitcher[pitcherName].runsBattedIn += orderRBI + orderORBI;
            }
          });
        });
      });

      const playersList = playerNames
        .filter((name) => pitchersInGames.has(name)) // 過濾掉沒有出現在 games 中的投手
        .map((name) => {
          const playerStats = hitsByPitcher[name];
          const playerInfo = teamData.players[name];
          // const whip = whipByPitcher[name] || 0; // 使用計算過的 WHIP
          return {
            name,
            PNum: playerInfo.PNum,
            habit: playerInfo.habit,
            position: playerInfo.position,
            totalHits: playerStats.hits,
            totalWalks: playerStats.walks,
            totalStrikeouts: playerStats.strikeouts,
            totalBalls: playerStats.totalBalls,
            totalStrikes: playerStats.totalStrikes,
            gamesPlayed: playerStats.gamesPlayed,
            gamesStarted: playerStats.gamesStarted,
            hitByPitches:  playerStats.hitByPitches,
            strikeBallRatio:
              playerStats.totalBalls > 0
                ? (playerStats.totalStrikes / playerStats.totalBalls).toFixed(2)
                : "0.00",
            runsBattedIn: playerStats.runsBattedIn,
            inningsPitched: inningsByPitcher[name] || 0,
            whip: whipByPitcher[name] || 0,
            H9: ratesByPitcher[name].H9,
            K9: ratesByPitcher[name].K9,
            BB9: ratesByPitcher[name].BB9,
            era: eraByPitcher[name], // 添加 ERA
            // ...其他您可能需要的統計數據...
          };
        });

      setPlayersData(playersList);
    };

    fetchPlayersAndGamesData();
  }, [selectedTeam, selectedGameType]);

  useEffect(() => {
    let totals = {
      totalStrikes: 0,
      totalBalls: 0,
      totalGamesPlayed: 0,
      totalGamesStarted: 0,
      totalHits: 0,
      totalWalks: 0,
      totalStrikeouts: 0,
      totalRunsBattedIn: 0,
      totalOuts: 0,
      totalEarnedRuns: 0, // 新增自責分總和
      totalHitByPitches: 0,
      teamK9: 0,
      teamBB9: 0,
      teamH9: 0,
    };

    playersData.forEach((player) => {
      totals.totalStrikes += player.totalStrikes; //好球數
      totals.totalBalls += player.totalBalls; //壞球數
      totals.totalGamesPlayed += player.gamesPlayed; //出賽
      totals.totalGamesStarted += player.gamesStarted; // 先發
      totals.totalHits += player.totalHits; //安打
      totals.totalWalks += player.totalWalks; //四壞
      totals.totalStrikeouts += player.totalStrikeouts; //奪三振
      totals.totalRunsBattedIn += player.runsBattedIn; //失分
      totals.totalOuts += Math.floor(player.inningsPitched) * 3 + (player.inningsPitched % 1) * 10;
      totals.totalEarnedRuns += (player.era * player.inningsPitched) / 9;
      totals.totalHitByPitches += player.hitByPitches;
      

    });
    const innings = Math.floor(totals.totalOuts / 3);
    const extraOuts = totals.totalOuts % 3;

    totals.totalInningsPitched = innings + extraOuts / 10; // 轉換成傳統記錄方式
    totals.strikeBallRatio =
      totals.totalBalls > 0 ? (totals.totalStrikes / totals.totalBalls).toFixed(2) : 0; //好壞球比
    totals.teamERA =
      totals.totalInningsPitched > 0
        ? ((totals.totalEarnedRuns * 9) / totals.totalInningsPitched).toFixed(2)
        : "∞"; //ERA
    totals.teamWHIP =
      totals.totalInningsPitched > 0
        ? ((totals.totalHits + totals.totalWalks+ totals.totalHitByPitches) / totals.totalInningsPitched).toFixed(2)
        : "∞"; //WHIP
        




    totals.teamK9 =
      totals.totalInningsPitched > 0
        ? ((totals.totalStrikeouts * 9) / totals.totalInningsPitched).toFixed(2)
        : 0;
    totals.teamBB9 =
      totals.totalInningsPitched > 0
        ? ((totals.totalWalks * 9) / totals.totalInningsPitched).toFixed(2)
        : 0;
    totals.teamH9 =
      totals.totalInningsPitched > 0
        ? ((totals.totalHits * 9) / totals.totalInningsPitched).toFixed(2)
        : 0;

    setTeamTotals(totals);
  }, [playersData]);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "descending" });
  const [sortedColumn, setSortedColumn] = useState(null);

  const onSortChange = (key) => {
    // 固定设置为降序
    setSortConfig({ key, direction: "descending" });
    setSortedColumn(key);
  };

  function getValueByKey(player, key) {
    switch (key) {
      case "好球數":
        return player.totalStrikes || 0;
      case "壞球數":
        return player.totalBalls || 0;
      case "ERA":
        return player.era || 0; // Assuming ERA can be a numeric value; use "N/A" if it should be a string
      case "先發":
        return player.gamesStarted || 0;
      case "出賽":
        return player.gamesPlayed || 0;
      case "局數":
        return player.inningsPitched || 0;
      case "安打":
        return player.totalHits || 0;
      case "失分":
        return player.runsBattedIn || 0;
      case "四壞":
        return player.totalWalks || 0;
      case "奪三振":
        return player.totalStrikeouts || 0;
      case "WHIP":
        return player.whip || 0; // Ensure this is calculated or parsed as a float where it's defined
      case "好壞球比":
        return player.strikeBallRatio || 0; // This should be calculated where player data is managed
      case "K/9":
        return parseFloat(player.K9) || 0;
      case "BB/9":
        return parseFloat(player.BB9) || 0;
      case "H/9":
        return parseFloat(player.H9) || 0;
      // Example case for "球數" if added later, ensure it has a valid numeric representation
      // case "球數":
      //   return player.totalPitches || 0;
      default:
        return 0; // Default return 0 to avoid undefined errors
    }
  }

  const sortedPlayers = useMemo(() => {
    let sortableItems = [...playersData];
    if (sortConfig && sortConfig.key) {
      sortableItems.sort((a, b) => {
        const valueA = getValueByKey(a, sortConfig.key);
        const valueB = getValueByKey(b, sortConfig.key);
        // Assuming descending sort for all, as mentioned earlier; reverse the comparisons for ascending
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      });
    }
    return sortableItems;
  }, [playersData, sortConfig]); // Removed playerHits, playerPlateAppearances if they're no longer relevant

  // 渲染組件
  return (
    <Card>
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
                    background: "#DCDCDC", // 確保背景不透明，避免內容互相覆蓋時看到下面的文本
                  }}
                >
                  <div>球員</div>
                  <div>排名</div>
                </TableCell>
                {selectedColumns.includes("好球數") && (
                  <TableCell
                    key="好球數"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "好球數" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("好球數")}
                  >
                    好球數
                  </TableCell>
                )}
                {selectedColumns.includes("壞球數") && (
                  <TableCell
                    key="壞球數"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "壞球數" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("壞球數")}
                  >
                    壞球數
                  </TableCell>
                )}
                {selectedColumns.includes("ERA") && (
                  <TableCell
                    key="ERA"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "ERA" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("ERA")}
                  >
                    ERA
                  </TableCell>
                )}
                {selectedColumns.includes("先發") && (
                  <TableCell
                    key="先發"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "先發" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("先發")}
                  >
                    先發
                  </TableCell>
                )}
                {selectedColumns.includes("出賽") && (
                  <TableCell
                    key="出賽"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "出賽" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("出賽")}
                  >
                    出賽
                  </TableCell>
                )}
                {selectedColumns.includes("局數") && (
                  <TableCell
                    key="局數"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "局數" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("局數")}
                  >
                    局數
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
                {selectedColumns.includes("失分") && (
                  <TableCell
                    key="失分"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "失分" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("失分")}
                  >
                    失分
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
                {selectedColumns.includes("奪三振") && (
                  <TableCell
                    key="奪三振"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "奪三振" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("奪三振")}
                  >
                    奪三振
                  </TableCell>
                )}
                {selectedColumns.includes("WHIP") && (
                  <TableCell
                    key="WHIP"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "WHIP" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("WHIP")}
                  >
                    WHIP
                  </TableCell>
                )}
                {selectedColumns.includes("好壞球比") && (
                  <TableCell
                    key="好壞球比"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "好壞球比" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("好壞球比")}
                  >
                    好壞球比
                  </TableCell>
                )}
                {selectedColumns.includes("K/9") && (
                  <TableCell
                    key="K/9"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "K/9" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("K/9")}
                  >
                    K/9
                  </TableCell>
                )}
                {selectedColumns.includes("BB/9") && (
                  <TableCell
                    key="BB/9"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "BB/9" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("BB/9")}
                  >
                    BB/9
                  </TableCell>
                )}
                {selectedColumns.includes("H/9") && (
                  <TableCell
                    key="H/9"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "H/9" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("H/9")}
                  >
                    H/9
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
                {selectedColumns.includes("好球數") && (
                  <TableCell
                    key="好球數"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "好球數" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("好球數")}
                  >
                    {teamTotals.totalStrikes}
                  </TableCell>
                )}
                {selectedColumns.includes("壞球數") && (
                  <TableCell
                    key="壞球數"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "壞球數" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("壞球數")}
                  >
                    {teamTotals.totalBalls}
                  </TableCell>
                )}
                {selectedColumns.includes("ERA") && (
                  <TableCell
                    key="ERA"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "ERA" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("ERA")}
                  >
                    {teamTotals.teamERA}
                  </TableCell>
                )}
                {selectedColumns.includes("先發") && (
                  <TableCell
                    key="先發"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "先發" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("先發")}
                  >
                    {teamTotals.totalGamesStarted}
                  </TableCell>
                )}
                {selectedColumns.includes("出賽") && (
                  <TableCell
                    key="出賽"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "出賽" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("出賽")}
                  >
                    {teamTotals.totalGamesPlayed}
                  </TableCell>
                )}
                {selectedColumns.includes("局數") && (
                  <TableCell
                    key="局數"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "局數" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("局數")}
                  >
                    {teamTotals.totalInningsPitched.toFixed(1)}
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
                    {teamTotals.totalHits}
                  </TableCell>
                )}
                {selectedColumns.includes("失分") && (
                  <TableCell
                    key="失分"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "失分" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("失分")}
                  >
                    {teamTotals.totalRunsBattedIn}
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
                    {teamTotals.totalWalks}
                  </TableCell>
                )}
                {selectedColumns.includes("奪三振") && (
                  <TableCell
                    key="奪三振"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "奪三振" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("奪三振")}
                  >
                    {teamTotals.totalStrikeouts}
                  </TableCell>
                )}
                {selectedColumns.includes("WHIP") && (
                  <TableCell
                    key="WHIP"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "WHIP" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("WHIP")}
                  >
                    {teamTotals.teamWHIP}
                  </TableCell>
                )}
                {selectedColumns.includes("好壞球比") && (
                  <TableCell
                    key="好壞球比"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "好壞球比" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("好壞球比")}
                  >
                    {teamTotals.strikeBallRatio}
                  </TableCell>
                )}
                {selectedColumns.includes("K/9") && (
                  <TableCell
                    key="K/9"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "K/9" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("K/9")}
                  >
                    {teamTotals.teamK9}
                  </TableCell>
                )}
                {selectedColumns.includes("BB/9") && (
                  <TableCell
                    key="BB/9"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "BB/9" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("BB/9")}
                  >
                    {teamTotals.teamBB9}
                  </TableCell>
                )}
                {selectedColumns.includes("H/9") && (
                  <TableCell
                    key="H/9"
                    style={{
                      fontSize: "1.0em",
                      cursor: "pointer",
                      color: sortedColumn === "H/9" ? "red" : "black",
                    }}
                    onClick={() => onSortChange("H/9")}
                  >
                    {teamTotals.teamH9}
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedPlayers.map((player, index) => (
                <TableRow hover key={player.name}>
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
                    <span>{player.name}</span>
                    {index + 1}
                  </TableCell>
                  {selectedColumns.includes("好球數") && (
                    <TableCell
                      style={{
                        fontSize: "1.0em",
                        color: sortedColumn === "好球數" ? "red" : "black",
                      }}
                    >
                      {player.totalStrikes}
                    </TableCell>
                  )}
                  {selectedColumns.includes("壞球數") && (
                    <TableCell
                      style={{
                        fontSize: "1.0em",
                        color: sortedColumn === "壞球數" ? "red" : "black",
                      }}
                    >
                      {player.totalBalls}
                    </TableCell>
                  )}
                  {selectedColumns.includes("ERA") && (
                    <TableCell
                      style={{
                        fontSize: "1.0em",
                        color: sortedColumn === "ERA" ? "red" : "black",
                      }}
                    >
                      {player.era || "N/A"}
                    </TableCell>
                  )}
                  {selectedColumns.includes("先發") && (
                    <TableCell
                      style={{
                        fontSize: "1.0em",
                        color: sortedColumn === "先發" ? "red" : "black",
                      }}
                    >
                      {player.gamesStarted}
                    </TableCell>
                  )}
                  {selectedColumns.includes("出賽") && (
                    <TableCell
                      style={{
                        fontSize: "1.0em",
                        color: sortedColumn === "出賽" ? "red" : "black",
                      }}
                    >
                      {player.gamesPlayed}
                    </TableCell>
                  )}
                  {selectedColumns.includes("局數") && (
                    <TableCell
                      style={{
                        fontSize: "1.0em",
                        color: sortedColumn === "局數" ? "red" : "black",
                      }}
                    >
                      {player.inningsPitched.toFixed(1)}
                    </TableCell>
                  )}
                  {selectedColumns.includes("安打") && (
                    <TableCell
                      style={{
                        fontSize: "1.0em",
                        color: sortedColumn === "安打" ? "red" : "black",
                      }}
                    >
                      {player.totalHits}
                    </TableCell>
                  )}
                  {selectedColumns.includes("失分") && (
                    <TableCell
                      style={{
                        fontSize: "1.0em",
                        color: sortedColumn === "失分" ? "red" : "black",
                      }}
                    >
                      {player.runsBattedIn}
                    </TableCell>
                  )}
                  {selectedColumns.includes("四壞") && (
                    <TableCell
                      style={{
                        fontSize: "1.0em",
                        color: sortedColumn === "四壞" ? "red" : "black",
                      }}
                    >
                      {player.totalWalks}
                    </TableCell>
                  )}
                  {selectedColumns.includes("奪三振") && (
                    <TableCell
                      style={{
                        fontSize: "1.0em",
                        color: sortedColumn === "奪三振" ? "red" : "black",
                      }}
                    >
                      {player.totalStrikeouts}
                    </TableCell>
                  )}
                  {selectedColumns.includes("WHIP") && (
                    <TableCell
                      style={{
                        fontSize: "1.0em",
                        color: sortedColumn === "WHIP" ? "red" : "black",
                      }}
                    >
                      {player.whip.toFixed(2)}
                    </TableCell>
                  )}
                  {selectedColumns.includes("好壞球比") && (
                    <TableCell
                      style={{
                        fontSize: "1.0em",
                        color: sortedColumn === "好壞球比" ? "red" : "black",
                      }}
                    >
                      {player.strikeBallRatio}
                    </TableCell>
                  )}
                  {selectedColumns.includes("K/9") && (
                    <TableCell
                      style={{
                        fontSize: "1.0em",
                        color: sortedColumn === "K/9" ? "red" : "black",
                      }}
                    >
                      {Number(player.K9).toFixed(2)}
                    </TableCell>
                  )}
                  {selectedColumns.includes("BB/9") && (
                    <TableCell
                      style={{
                        fontSize: "1.0em",
                        color: sortedColumn === "BB/9" ? "red" : "black",
                      }}
                    >
                      {Number(player.BB9).toFixed(2)}
                    </TableCell>
                  )}
                  {selectedColumns.includes("H/9") && (
                    <TableCell
                      style={{
                        fontSize: "1.0em",
                        color: sortedColumn === "H/9" ? "red" : "black",
                      }}
                    >
                      {Number(player.H9).toFixed(2)}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
    </Card>
  );
};

DefendTable.propTypes = {
  selectedTeam: PropTypes.string,
  selectedColumns: PropTypes.arrayOf(PropTypes.string),
};

export default DefendTable;
