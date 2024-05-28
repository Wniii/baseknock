import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
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
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { firestore } from 'src/firebase';
import { collection, getDocs } from 'firebase/firestore';

  const Bdata = forwardRef(({ selectedTeam, selectedPlayer}, ref) => {
  const [playerGames, setPlayerGames] = useState([]);
  useEffect(() => {
    const fetchPlayerGames = async () => {
      if (selectedPlayer && selectedPlayer.id && selectedTeam && selectedTeam.id) {
        const gamesRef = collection(firestore, "team", selectedTeam.id, "games");
        const gamesSnapshot = await getDocs(gamesRef);
        const gamesData = gamesSnapshot.docs.map(doc => {
          const game = doc.data();
          const isPlayerInMain = game.ordermain?.some(order => order.p_name === selectedPlayer.id);
          const isPlayerInOppo = game.orderoppo?.some(order => order.o_p_name === selectedPlayer.id);

          if (!isPlayerInMain && !isPlayerInOppo) return null; // 球員沒有參與該場比賽

          // 初始化統計數據
          const stats = {
            player_name: selectedPlayer.id,
            game_date: format(game.GDate.toDate(), "dd/MM/yyyy"),
            plate_appearances: 0,
            at_bats: 0,
            hits: 0,
            total_bases: 0,
            rbi: 0,
            single_hits: 0,
            double_hits: 0,
            triple_hits: 0,
            home_runs: 0,
            double_plays: 0,
            walks: 0,
            sac_fly: 0,
            sac_bunt: 0,
            hit_by_pitch: 0,
            batting_average: 0,
            on_base_percentage: 0,
            slugging_percentage: 0,
            ops: 0
          };

         // 計算打席次數
        if (Array.isArray(game.ordermain)) {
          game.ordermain.forEach(order => {
            if (order.p_name === selectedPlayer.id) {
              stats.plate_appearances += 1;
              countPlayerStats(order.content, stats, { rbi: order.rbi || 0 });
            }
          });
        }

        if (Array.isArray(game.orderoppo)) {
          game.orderoppo.forEach(order => {
            if (order.o_p_name === selectedPlayer.id) {
              stats.plate_appearances += 1;
              countPlayerStats(order.o_content, stats, { rbi: order.o_rbi || 0 });
            }
          });
        }

          // 計算打數
          stats.at_bats = stats.plate_appearances - (stats.walks + stats.sac_fly + stats.sac_bunt + stats.hit_by_pitch);
          // 計算率數據
          stats.batting_average = calculateBattingAverage(stats.hits, stats.at_bats);
          stats.on_base_percentage = calculateOnBasePercentage(stats.hits, stats.walks, stats.hit_by_pitch, stats.at_bats);
          stats.slugging_percentage = calculateSluggingPercentage(stats.total_bases, stats.at_bats);
          stats.ops = calculateOPS(stats.on_base_percentage, stats.slugging_percentage);

          return {
            player_name: selectedPlayer.name,
            game_date: format(game.GDate.toDate(), "dd/MM/yyyy"),
            ...stats
          };
        }).filter(game => game != null);

        setPlayerGames(gamesData);
      }
    };

    fetchPlayerGames();
  }, [selectedPlayer, selectedTeam]);

  const countPlayerStats = (content, stats, additionalStats = {}) => {
    // 將事件拆分成列表，以逗號或其他分隔符號分隔
    const events = content.split(',');

    events.forEach(event => {
      switch (event.trim()) {
        case '一安':
          stats.hits += 1;
          stats.single_hits += 1;
          stats.total_bases += 1;
          break;
        case '二安':
          stats.hits += 1;
          stats.double_hits += 1;
          stats.total_bases += 2;
          break;
        case '三安':
          stats.hits += 1;
          stats.triple_hits += 1;
          stats.total_bases += 3;
          break;
        case '全打':
          stats.hits += 1;
          stats.home_runs += 1;
          stats.total_bases += 4;
          break;
        case '雙殺':
          stats.double_plays += 1;
          break;
        case '四壞':
          stats.walks += 1;
          break;
        case '觸身':
          stats.hit_by_pitch += 1;
          break;
        case '犧飛':
          stats.sac_fly += 1;
          break;
        case '犧觸':
          stats.sac_bunt += 1;
          break;
      }
    });

    if (additionalStats.rbi) {
      stats.rbi += additionalStats.rbi;
    }
  };

  const calculateBattingAverage = (hits, at_bats) => {
    return at_bats > 0 ? (hits / at_bats).toFixed(3) : '.000';
  };

  const calculateOnBasePercentage = (hits, walks, hitByPitch, at_bats) => {
    const totalChances = at_bats + walks + hitByPitch;
    return totalChances > 0 ? ((hits + walks + hitByPitch) / totalChances).toFixed(3) : '.000';
  };

  const calculateSluggingPercentage = (totalBases, at_bats) => {
    return at_bats > 0 ? (totalBases / at_bats).toFixed(3) : '.000';
  };

  const calculateOPS = (onBasePct, sluggingPct) => {
    return (parseFloat(onBasePct) + parseFloat(sluggingPct)).toFixed(3);
  };

  useImperativeHandle(ref, () => ({
    getPlayerGames: () => playerGames,
    getTotals: () => totals
  }));

  const totals = playerGames.reduce((acc, game) => ({
    plate_appearances: acc.plate_appearances + game.plate_appearances,
    at_bats: acc.at_bats + game.at_bats,
    hits: acc.hits + game.hits,
    total_bases: acc.total_bases + game.total_bases,
    rbi: acc.rbi + game.rbi,
    single_hits: acc.single_hits + game.single_hits,
    double_hits: acc.double_hits + game.double_hits,
    triple_hits: acc.triple_hits + game.triple_hits,
    home_runs: acc.home_runs + game.home_runs,
    double_plays: acc.double_plays + game.double_plays,
    walks: acc.walks + game.walks,
    sac_fly: acc.sac_fly + game.sac_fly,
    sac_bunt: acc.sac_bunt + game.sac_bunt,
    hit_by_pitch: acc.hit_by_pitch + game.hit_by_pitch
  }), {
    plate_appearances: 0,
    at_bats: 0,
    hits: 0,
    total_bases: 0,
    rbi: 0,
    single_hits: 0,
    double_hits: 0,
    triple_hits: 0,
    home_runs: 0,
    double_plays: 0,
    walks: 0,
    sac_fly: 0,
    sac_bunt: 0,
    hit_by_pitch: 0
  });

  totals.batting_average = calculateBattingAverage(totals.hits, totals.at_bats);
  totals.on_base_percentage = calculateOnBasePercentage(totals.hits, totals.walks, totals.hit_by_pitch, totals.at_bats);
  totals.slugging_percentage = calculateSluggingPercentage(totals.total_bases, totals.at_bats);
  totals.ops = calculateOPS(totals.on_base_percentage, totals.slugging_percentage);

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 1500 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ position: 'sticky' }}>比賽日期</TableCell>
                <TableCell>打席</TableCell>
                <TableCell>打數</TableCell>
                <TableCell>安打</TableCell>
                <TableCell>壘打數</TableCell>
                <TableCell>打點</TableCell>
                <TableCell>一安</TableCell>
                <TableCell>二安</TableCell>
                <TableCell>三安</TableCell>
                <TableCell>全壘打</TableCell>
                <TableCell>雙殺</TableCell>
                <TableCell>四壞</TableCell>
                <TableCell>犧飛</TableCell>
                <TableCell>犧觸</TableCell>
                <TableCell>觸身</TableCell>
                <TableCell>打擊率</TableCell>
                <TableCell>上壘率</TableCell>
                <TableCell>長打率</TableCell>
                <TableCell>OPS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {playerGames.length > 0 ? playerGames.map((game) => (
                <TableRow hover key={game.id}>
                  <TableCell>{game.game_date}</TableCell>
                  <TableCell>{game.plate_appearances}</TableCell>
                  <TableCell>{game.at_bats}</TableCell>
                  <TableCell>{game.hits}</TableCell>
                  <TableCell>{game.total_bases}</TableCell>
                  <TableCell>{game.rbi}</TableCell>
                  <TableCell>{game.single_hits}</TableCell>
                  <TableCell>{game.double_hits}</TableCell>
                  <TableCell>{game.triple_hits}</TableCell>
                  <TableCell>{game.home_runs}</TableCell>
                  <TableCell>{game.double_plays}</TableCell>
                  <TableCell>{game.walks}</TableCell>
                  <TableCell>{game.sac_fly}</TableCell>
                  <TableCell>{game.sac_bunt}</TableCell>
                  <TableCell>{game.hit_by_pitch}</TableCell>
                  <TableCell>{calculateBattingAverage(game.hits, game.at_bats)}</TableCell>
                  <TableCell>{calculateOnBasePercentage(game.hits, game.walks, game.hit_by_pitch, game.at_bats)}</TableCell>
                  <TableCell>{calculateSluggingPercentage(game.total_bases, game.at_bats)}</TableCell>
                  <TableCell>{calculateOPS(calculateOnBasePercentage(game.hits, game.walks, game.hit_by_pitch, game.at_bats), calculateSluggingPercentage(game.total_bases, game.at_bats))}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={19}>該球員還沒有比賽數據</TableCell>
                </TableRow>
              )}

              {playerGames.length > 0 && (
                <TableRow>
                  <TableCell>成績總和</TableCell>
                  <TableCell>{totals.plate_appearances}</TableCell>
                  <TableCell>{totals.at_bats}</TableCell>
                  <TableCell>{totals.hits}</TableCell>
                  <TableCell>{totals.total_bases}</TableCell>
                  <TableCell>{totals.rbi}</TableCell>
                  <TableCell>{totals.single_hits}</TableCell>
                  <TableCell>{totals.double_hits}</TableCell>
                  <TableCell>{totals.triple_hits}</TableCell>
                  <TableCell>{totals.home_runs}</TableCell>
                  <TableCell>{totals.double_plays}</TableCell>
                  <TableCell>{totals.walks}</TableCell>
                  <TableCell>{totals.sac_fly}</TableCell>
                  <TableCell>{totals.sac_bunt}</TableCell>
                  <TableCell>{totals.hit_by_pitch}</TableCell>
                  <TableCell>{calculateBattingAverage(totals.hits, totals.at_bats)}</TableCell>
                  <TableCell>{calculateOnBasePercentage(totals.hits, totals.walks, totals.hit_by_pitch, totals.at_bats)}</TableCell>
                  <TableCell>{calculateSluggingPercentage(totals.total_bases, totals.at_bats)}</TableCell>
                  <TableCell>{calculateOPS(calculateOnBasePercentage(totals.hits, totals.walks, totals.hit_by_pitch, totals.at_bats), calculateSluggingPercentage(totals.total_bases, totals.at_bats))}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
    </Card>
  );
});

Bdata.propTypes = {
  count: PropTypes.number,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selectedPlayer: PropTypes.object,
  selectedTeam: PropTypes.object,
  ordermain: PropTypes.array.isRequired, // 確保傳入的 ordermain 是數組類型
  orderoppo: PropTypes.array.isRequired, // 確保傳入的 orderoppo 也是數組類型
};

export default Bdata;
