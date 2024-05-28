import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import { format } from "date-fns";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { firestore } from 'src/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const Pdata = ({ count = 0, onPageChange, onRowsPerPageChange, page = 0, rowsPerPage = 0, selectedTeam, selectedPlayer }) => {
  const [playerGames, setPlayerGames] = useState([]);

  const calculateEra = (runs, inningsPitched) => {
    return inningsPitched > 0 ? ((runs * 9) / inningsPitched).toFixed(2) : 'N/A';
  };

  const calculateWhip = (hits, walks, inningsPitched) => {
    return inningsPitched > 0 ? ((hits + walks) / inningsPitched).toFixed(2) : 'N/A';
  };

  const calculateRate = (count, inningsPitched) => {
    return inningsPitched > 0 ? ((count * 9) / inningsPitched).toFixed(2) : 'N/A';
  };

  useEffect(() => {
    const fetchPlayerGames = async () => {
      if (selectedTeam?.id && selectedPlayer?.id) {
        const gamesRef = collection(firestore, "team", selectedTeam.id, "games");

        try {
          const gamesSnapshot = await getDocs(gamesRef);

          const playerGamesData = gamesSnapshot.docs
            .map(doc => ({ ...doc.data(), id: doc.id }))
            .filter(game =>
              (game.ordermain && game.ordermain.some(order => order.pitcher && order.pitcher.name === selectedPlayer.id)) ||
              (game.orderoppo && game.orderoppo.some(order => order.pitcher && order.pitcher.name === selectedPlayer.id))
            )
            .map(game => {
              let totalBalls = 0;
              let totalStrikes = 0;
              let hits = 0;
              let walks = 0;
              let strikeouts = 0;
              let rbi = 0;  // 初始化计数器统计打点
              let outs = 0;
              let totalPitches = 0;

              ['ordermain', 'orderoppo'].forEach((orderKey) => {
                const orders = game[orderKey];
                if (Array.isArray(orders)) {
                  orders.forEach((order) => {
                    const pitcherName = order.pitcher?.name;
                    if (pitcherName === selectedPlayer.id) {
                      const content = order.content || order.o_content;

                      // Check if the content indicates a hit, walk, or strikeout
                      const hasHit = ['一安', '二安', '三安', '全打'].some(hitType => content && content.includes(hitType));
                      const hasWalk = content && content.includes('四壞');
                      const hasStrikeout = content && content.includes('三振');

                      // Update the counts for hits, walks, and strikeouts
                      if (hasHit) {
                        hits++;
                      }
                      if (hasWalk) {
                        walks++;
                      }
                      if (hasStrikeout) {
                        strikeouts++;
                      }

                      // Add counts for balls and strikes
                      totalBalls += Number(order.pitcher?.ball) || 0;
                      totalStrikes += Number(order.pitcher?.strike) || 0;
                      outs += Number(order.innouts) || 0; // 計算局數
                      totalPitches += Number(order.pitcher?.total) || 0;
                      // 累加打点
                      rbi += Number(order.rbi) || 0;  // 假设 RBI 数据位于 order 对象上
                      rbi += Number(order.o_rbi) || 0;  // 假设 RBI 数据位于 order 对象上

                    }
                  });
                }
              });

              // Calculate the innings pitched
              const inningsPitched = Math.floor(outs / 3) + (outs % 3) * 0.1;
              const era = calculateEra(rbi, inningsPitched);
              const whip = calculateWhip(hits, walks, inningsPitched);
              const strikeBallRatio = totalBalls > 0 ? (totalStrikes / totalBalls).toFixed(2) : 'N/A';
              const k9 = calculateRate(strikeouts, inningsPitched);
              const bb9 = calculateRate(walks, inningsPitched);
              const h9 = calculateRate(hits, inningsPitched);

              return {
                id: game.id,
                GDate: game.GDate ? format(game.GDate.toDate(), "dd/MM/yyyy") : '未知',
                totalStrikes,
                totalBalls,
                totalPitches,
                hits,
                walks,
                strikeouts,
                rbi,
                inningsPitched,
                era,
                whip,
                strikeBallRatio,
                k9,
                bb9,
                h9
              };
            });

          setPlayerGames(playerGamesData);
        } catch (error) {
          console.error("Error fetching player games data:", error);
        }
      }
    };

    fetchPlayerGames();
  }, [selectedTeam, selectedPlayer]);


  const totals = playerGames.reduce((acc, game) => ({
    totalStrikes: acc.totalStrikes + game.totalStrikes,
    totalBalls: acc.totalBalls + game.totalBalls,
    totalPitches: acc.totalPitches + game.totalPitches,
    hits: acc.hits + game.hits,
    walks: acc.walks + game.walks,
    strikeouts: acc.strikeouts + game.strikeouts,
    rbi: acc.rbi + game.rbi,
    inningsPitched: acc.inningsPitched + game.inningsPitched
  }), {
    totalStrikes: 0,
    totalBalls: 0,
    totalPitches: 0,
    hits: 0,
    walks: 0,
    strikeouts: 0,
    rbi: 0,
    inningsPitched: 0
  });

  const calculatedTotals = {
    ...totals,
    era: calculateEra(totals.rbi, totals.inningsPitched),  // 重新計算 ERA
    whip: calculateWhip(totals.hits, totals.walks, totals.inningsPitched),  // 重新計算 WHIP
    strikeBallRatio: totals.totalBalls > 0 ? (totals.totalStrikes / totals.totalBalls).toFixed(2) : 'N/A',  // 好壞球比
    k9: calculateRate(totals.strikeouts, totals.inningsPitched),  // 重新計算 K/9
    bb9: calculateRate(totals.walks, totals.inningsPitched),  // 重新計算 BB/9
    h9: calculateRate(totals.hits, totals.inningsPitched)  // 重新計算 H/9
  };

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>比賽日期</TableCell>
                <TableCell>好球數</TableCell>
                <TableCell>壞球數</TableCell>
                <TableCell>耗球數</TableCell>
                <TableCell>ERA</TableCell>
                <TableCell>局數</TableCell>
                <TableCell>安打</TableCell>
                <TableCell>失分</TableCell>
                <TableCell>四壞</TableCell>
                <TableCell>奪三振</TableCell>
                <TableCell>WHIP</TableCell>
                <TableCell>好壞球比</TableCell>
                <TableCell>K/9</TableCell>
                <TableCell>BB/9</TableCell>
                <TableCell>H/9</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {playerGames.length > 0 ? playerGames.map((game) => (
                <TableRow hover key={game.id}>
                  <TableCell>{game.GDate}</TableCell>
                  <TableCell>{game.totalStrikes}</TableCell>
                  <TableCell>{game.totalBalls}</TableCell>
                  <TableCell>{game.totalPitches}</TableCell>
                  <TableCell>{game.era}</TableCell>
                  <TableCell>{Number(game.inningsPitched).toFixed(1)}</TableCell>
                  <TableCell>{game.hits}</TableCell>
                  <TableCell>{game.rbi}</TableCell>
                  <TableCell>{game.walks}</TableCell>
                  <TableCell>{game.strikeouts}</TableCell>
                  <TableCell>{game.whip}</TableCell>
                  <TableCell>{game.strikeBallRatio}</TableCell>
                  <TableCell>{game.k9}</TableCell>
                  <TableCell>{game.bb9}</TableCell>
                  <TableCell>{game.h9}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={14}>該球員還沒有比賽數據</TableCell>
                </TableRow>
              )}

              {playerGames.length > 0 && (
                <TableRow>
                  <TableCell>成績總和</TableCell>
                  <TableCell>{calculatedTotals.totalStrikes}</TableCell>
                  <TableCell>{calculatedTotals.totalBalls}</TableCell>
                  <TableCell>{calculatedTotals.totalPitches}</TableCell>
                  <TableCell>{calculatedTotals.era}</TableCell>
                  <TableCell>{calculatedTotals.inningsPitched.toFixed(1)}</TableCell>
                  <TableCell>{calculatedTotals.hits}</TableCell>
                  <TableCell>{calculatedTotals.rbi}</TableCell>
                  <TableCell>{calculatedTotals.walks}</TableCell>
                  <TableCell>{calculatedTotals.strikeouts}</TableCell>
                  <TableCell>{calculatedTotals.whip}</TableCell>
                  <TableCell>{calculatedTotals.strikeBallRatio}</TableCell>
                  <TableCell>{calculatedTotals.k9}</TableCell>
                  <TableCell>{calculatedTotals.bb9}</TableCell>
                  <TableCell>{calculatedTotals.h9}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      {/* <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      /> */}
    </Card>
  );
};

Pdata.propTypes = {
  count: PropTypes.number,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selectedTeam: PropTypes.object.isRequired,
  selectedPlayer: PropTypes.object.isRequired,
};
