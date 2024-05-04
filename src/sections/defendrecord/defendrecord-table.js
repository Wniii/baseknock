import React, { useState, useEffect, useRef } from "react";
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
    // 其他總和數據
  });

  let totalGamesCount = 0;

  const calculateHits = (gamesData, playerNames) => {
    const statsByPitcher = playerNames.reduce((acc, name) => {
        acc[name] = {
            hits: 0,
            walks: 0,
            hitByPitches: 0,  // 新增觸身球數據
            homeRuns: 0,  // 新增全壘打數據
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
                        if (content.includes("一安") || content.includes("二安") || 
                            content.includes("三安") || content.includes("全壘打")) {
                            pitcherStats.hits += 1;
                        }
                        if (content.includes("四壞")) {
                            pitcherStats.walks += 1;
                        }
                        if (content.includes("觸身")) {
                            pitcherStats.hitByPitches += 1;  // 計算觸身球
                        }
                        if (content.includes("奪三振")) {
                            pitcherStats.strikeouts += 1;
                        }
                        if (content.includes("全壘打")) {
                          pitcherStats.homeRuns += 1;
                        }
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
            const innout = parseInt(order.innout, 10) || 0;
            if (pitcherName && inningsByPitcher.hasOwnProperty(pitcherName)) {
              inningsByPitcher[pitcherName] += innout;
            }
          });
        }
      });
    });
  
    // 计算整数局数和余数
    Object.keys(inningsByPitcher).forEach(pitcher => {
      const totalOuts = inningsByPitcher[pitcher];
      const innings = Math.floor(totalOuts / 3);
      const extraOuts = totalOuts % 3;
      inningsByPitcher[pitcher] = innings + (extraOuts * 0.1);
    });
  
    return inningsByPitcher;
  };

  // 计算 WHIP
const calculateWHIP = (statsByPitcher, inningsByPitcher) => {
  const whipByPitcher = {};
  Object.keys(statsByPitcher).forEach(pitcher => {
      const { hits, walks, hitByPitches } = statsByPitcher[pitcher];
      const innings = inningsByPitcher[pitcher];
      whipByPitcher[pitcher] = innings > 0 ? ((hits + walks + hitByPitches) / innings) : 0;
  });
  return whipByPitcher;
};

const calculateRates = (statsByPitcher, inningsByPitcher) => {
  const ratesByPitcher = {};
  Object.keys(statsByPitcher).forEach(pitcher => {
    const { hits, strikeouts, walks } = statsByPitcher[pitcher];
    const innings = inningsByPitcher[pitcher];
    ratesByPitcher[pitcher] = {
      H9: innings > 0 ? (hits * 9 / innings).toFixed(2) : 0,
      K9: innings > 0 ? (strikeouts * 9 / innings).toFixed(2) : 0,
      BB9: innings > 0 ? (walks * 9 / innings).toFixed(2) : 0
    };
  });
  return ratesByPitcher;
};

const calculateERA = (statsByPitcher, inningsByPitcher) => {
  const eraByPitcher = {};
  Object.keys(statsByPitcher).forEach(pitcher => {
    const { walks, hitByPitches, homeRuns, strikeouts } = statsByPitcher[pitcher];
    const innings = inningsByPitcher[pitcher];
    // 確保我們有有效的局數來避免除以零的錯誤
    eraByPitcher[pitcher] = innings > 0 
      ? (3 + (3 * (walks + hitByPitches) + 13 * homeRuns - 2 * strikeouts) / innings).toFixed(2)
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
      const allGameData = gamesQuerySnapshot.docs.map(doc => doc.data());

      const inningsByPitcher = calculateInningsPitched(allGameData, playerNames);
      const statsByPitcher = calculateHits(allGameData, playerNames);
      const whipByPitcher = calculateWHIP(statsByPitcher, inningsByPitcher); // Calculate WHIP here
      const ratesByPitcher = calculateRates(statsByPitcher, inningsByPitcher);  // Calculate H/9, K/9, BB/9 here
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
        ["ordermain", "orderoppo"].forEach((orderKey) => {
          (gameData[orderKey] || []).forEach((order, index) => {
            const pitcherName = order.pitcher?.name;
            if (pitcherName && playerNames.includes(pitcherName)) {
              hitsByPitcher[pitcherName].gamesPlayed++;
              if (index === 0) {
                // 假設第一位投手是先發
                hitsByPitcher[pitcherName].gamesStarted++;
              }
              const content = order.content || order.o_content;
              const hasHit = ["一安", "二安", "三安", "全壘打"].some((hitType) =>
                content.includes(hitType)
              );
              const hasWalk = content.includes("四壞");
              const hasStrikeout = content.includes("奪三振");
              if (hasHit) hitsByPitcher[pitcherName].hits++;
              if (hasWalk) hitsByPitcher[pitcherName].walks++;
              if (hasStrikeout) hitsByPitcher[pitcherName].strikeouts++;
              const balls = Number(order.pitcher?.ball) || 0;
              const strikes = Number(order.pitcher?.strike) || 0;
              hitsByPitcher[pitcherName].totalBalls += balls;
              hitsByPitcher[pitcherName].totalStrikes += strikes;
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
    });

    totals.strikeBallRatio =
      totals.totalBalls > 0 ? (totals.totalStrikes / totals.totalBalls).toFixed(2) : 0; //好壞球比

    setTeamTotals(totals);
  }, [playersData]);

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
                    textAlign: "center", // 水平置中
                    display: "flex", // 使用flex布局
                    alignItems: "center", // 垂直置中
                    justifyContent: "center", // 水平置中
                    background: "white", // 確保背景不透明，避免內容互相覆蓋時看到下面的文本
                  }}
                >
                  球員
                </TableCell>
                {selectedColumns.includes("好球數") && (
                  <TableCell style={{ fontSize: "1.0em" }}>好球數</TableCell>
                )}
                {selectedColumns.includes("壞球數") && (
                  <TableCell style={{ fontSize: "1.0em" }}>壞球數</TableCell>
                )}
                {selectedColumns.includes("ERA") && (
                  <TableCell style={{ fontSize: "1.0em" }}>ERA</TableCell>
                )}
                {selectedColumns.includes("先發") && (
                  <TableCell style={{ fontSize: "1.0em" }}>先發</TableCell>
                )}
                {selectedColumns.includes("出賽") && (
                  <TableCell style={{ fontSize: "1.0em" }}>出賽</TableCell>
                )}
                {selectedColumns.includes("局數") && (
                  <TableCell style={{ fontSize: "1.0em" }}>局數</TableCell>
                )}
                {selectedColumns.includes("安打") && (
                  <TableCell style={{ fontSize: "1.0em" }}>安打</TableCell>
                )}
                {selectedColumns.includes("失分") && (
                  <TableCell style={{ fontSize: "1.0em" }}>失分</TableCell>
                )}
                {selectedColumns.includes("四壞") && (
                  <TableCell style={{ fontSize: "1.0em" }}>四壞</TableCell>
                )}
                {selectedColumns.includes("奪三振") && (
                  <TableCell style={{ fontSize: "1.0em" }}>奪三振</TableCell>
                )}
                {selectedColumns.includes("WHIP") && (
                  <TableCell style={{ fontSize: "1.0em" }}>WHIP</TableCell>
                )}
                {selectedColumns.includes("好壞球比") && (
                  <TableCell style={{ fontSize: "1.0em" }}>好壞球比</TableCell>
                )}
                {selectedColumns.includes("K/9") && (
                  <TableCell style={{ fontSize: "1.0em" }}>K/9</TableCell>
                )}
                {selectedColumns.includes("BB/9") && (
                  <TableCell style={{ fontSize: "1.0em" }}>BB/9</TableCell>
                )}
                {selectedColumns.includes("H/9") && (
                  <TableCell style={{ fontSize: "1.0em" }}>H/9</TableCell>
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

                {selectedColumns.includes("好球數") && (
                  <TableCell style={{ fontSize: "1.0em" }}>{teamTotals.totalStrikes}</TableCell>
                )}
                {selectedColumns.includes("壞球數") && (
                  <TableCell style={{ fontSize: "1.0em" }}>{teamTotals.totalBalls}</TableCell>
                )}
                {selectedColumns.includes("ERA") && (
                  <TableCell style={{ fontSize: "1.0em" }}></TableCell>
                )}
                {selectedColumns.includes("先發") && (
                  <TableCell style={{ fontSize: "1.0em" }}>
                    {teamTotals.totalGamesStarted}
                  </TableCell>
                )}
                {selectedColumns.includes("出賽") && (
                  <TableCell style={{ fontSize: "1.0em" }}>{teamTotals.totalGamesPlayed}</TableCell>
                )}
                {selectedColumns.includes("局數") && (
                  <TableCell style={{ fontSize: "1.0em" }}></TableCell>
                )}
                {selectedColumns.includes("安打") && (
                  <TableCell style={{ fontSize: "1.0em" }}>{teamTotals.totalHits}</TableCell>
                )}
                {selectedColumns.includes("失分") && (
                  <TableCell style={{ fontSize: "1.0em" }}>
                    {teamTotals.totalRunsBattedIn}
                  </TableCell>
                )}
                {selectedColumns.includes("四壞") && (
                  <TableCell style={{ fontSize: "1.0em" }}>{teamTotals.totalWalks}</TableCell>
                )}
                {selectedColumns.includes("奪三振") && (
                  <TableCell style={{ fontSize: "1.0em" }}>{teamTotals.totalStrikeouts}</TableCell>
                )}
                {selectedColumns.includes("WHIP") && (
                  <TableCell style={{ fontSize: "1.0em" }}></TableCell>
                )}
                {selectedColumns.includes("好壞球比") && (
                  <TableCell style={{ fontSize: "1.0em" }}>{teamTotals.strikeBallRatio}</TableCell>
                )}
                {selectedColumns.includes("K/9") && (
                  <TableCell style={{ fontSize: "1.0em" }}></TableCell>
                )}
                {selectedColumns.includes("BB/9") && (
                  <TableCell style={{ fontSize: "1.0em" }}></TableCell>
                )}
                {selectedColumns.includes("H/9") && (
                  <TableCell style={{ fontSize: "1.0em" }}></TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {playersData.map((player) => (
                <TableRow hover key={player.name}>
                  <TableCell
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
                    {player.name}
                  </TableCell>
                  {selectedColumns.includes("好球數") && (
                    <TableCell>{player.totalStrikes}</TableCell>
                  )}
                  {selectedColumns.includes("壞球數") && <TableCell>{player.totalBalls}</TableCell>}
                  {selectedColumns.includes("ERA") && <TableCell>{player.era || "N/A"}</TableCell>}
                  {selectedColumns.includes("先發") && <TableCell>{player.gamesStarted}</TableCell>}
                  {selectedColumns.includes("出賽") && <TableCell>{player.gamesPlayed}</TableCell>}
                  {selectedColumns.includes("局數") && (
                     <TableCell>{player.inningsPitched.toFixed(1)}</TableCell> 
                  )}
                  {selectedColumns.includes("安打") && <TableCell>{player.totalHits}</TableCell>}
                  {selectedColumns.includes("失分") && <TableCell>{player.runsBattedIn}</TableCell>}
                  {selectedColumns.includes("球數") && <TableCell></TableCell>}
                  {selectedColumns.includes("四壞") && <TableCell>{player.totalWalks}</TableCell>}
                  {selectedColumns.includes("奪三振") && (
                    <TableCell>{player.totalStrikeouts}</TableCell>
                  )}
                  {selectedColumns.includes("WHIP") && <TableCell>{player.whip.toFixed(2)}</TableCell>}
                  {selectedColumns.includes("好壞球比") && (
                    <TableCell>{player.strikeBallRatio}</TableCell>
                  )}
                  {selectedColumns.includes("每局耗球") && <TableCell></TableCell>}
                  {selectedColumns.includes("K/9") && <TableCell>{Number(player.K9).toFixed(2)}</TableCell>}
                  {selectedColumns.includes("BB/9") && <TableCell>{Number(player.BB9).toFixed(2)}</TableCell>}
                  {selectedColumns.includes("H/9") && <TableCell>{Number(player.H9).toFixed(2)}</TableCell>}
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
