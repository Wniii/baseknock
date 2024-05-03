import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Box, Card, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { firestore } from "src/pages/firebase";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";

// 定義 DefendTable 組件
export const DefendTable = ({ selectedTeam, selectedColumns, selectedGameType }) => {
  const [open, setOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
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
    const hitsByPitcher = playerNames.reduce((acc, name) => {
      acc[name] = {
        hits: 0,
        walks: 0,
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
            if (pitcherName && hitsByPitcher.hasOwnProperty(pitcherName)) {
              const content = order.content || order.o_content;
              const pitcherData = hitsByPitcher[pitcherName];
              // 假設您的內容字符串中包含這些詞彙來表示發生的事件
              const hasHit = ["一安", "二安", "三安", "全壘打"].some(
                (hitType) => content && content.includes(hitType)
              );
              const hasWalk = content && content.includes("四壞");
              const hasStrikeout = content && content.includes("奪三振");

              // 更新安打、四壞球和奪三振的計數
              if (hasHit) {
                pitcherData.hits += 1;
              }
              if (hasWalk) {
                pitcherData.walks += 1;
              }
              if (hasStrikeout) {
                pitcherData.strikeouts += 1;
              }

              // 添加壞球和好球的計數
              const balls = Number(order.pitcher.ball) || 0;
              const strikes = Number(order.pitcher.strike) || 0;
              pitcherData.totalBalls += balls;
              pitcherData.totalStrikes += strikes;
            }
          });
        }
      });
    });

    return hitsByPitcher;
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
                {selectedColumns.includes("球數") && (
                  <TableCell style={{ fontSize: "1.0em" }}>球數</TableCell>
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
                {selectedColumns.includes("每局耗球") && (
                  <TableCell style={{ fontSize: "1.0em" }}>每局耗球</TableCell>
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
                {selectedColumns.includes("球數") && (
                  <TableCell style={{ fontSize: "1.0em" }}></TableCell>
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
                {selectedColumns.includes("每局耗球") && (
                  <TableCell style={{ fontSize: "1.0em" }}></TableCell>
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
                  {selectedColumns.includes("ERA") && <TableCell></TableCell>}
                  {selectedColumns.includes("先發") && <TableCell>{player.gamesStarted}</TableCell>}
                  {selectedColumns.includes("出賽") && <TableCell>{player.gamesPlayed}</TableCell>}
                  {selectedColumns.includes("局數") && (
                    <TableCell></TableCell> // 假設你有這個變數
                  )}
                  {selectedColumns.includes("安打") && <TableCell>{player.totalHits}</TableCell>}
                  {selectedColumns.includes("失分") && <TableCell>{player.runsBattedIn}</TableCell>}
                  {selectedColumns.includes("球數") && <TableCell></TableCell>}
                  {selectedColumns.includes("四壞") && <TableCell>{player.totalWalks}</TableCell>}
                  {selectedColumns.includes("奪三振") && (
                    <TableCell>{player.totalStrikeouts}</TableCell>
                  )}
                  {selectedColumns.includes("WHIP") && <TableCell></TableCell>}
                  {selectedColumns.includes("好壞球比") && (
                    <TableCell>{player.strikeBallRatio}</TableCell>
                  )}
                  {selectedColumns.includes("每局耗球") && <TableCell></TableCell>}
                  {selectedColumns.includes("K/9") && <TableCell></TableCell>}
                  {selectedColumns.includes("BB/9") && <TableCell></TableCell>}
                  {selectedColumns.includes("H/9") && <TableCell></TableCell>}
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
