import PropTypes from "prop-types";
import { format } from "date-fns";
import {
  Box,
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import React, { useState, useEffect } from 'react';
import { firestore } from 'src/pages/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const Bdata = ({ count = 0, onPageChange, onRowsPerPageChange, page = 0, rowsPerPage = 0, selectedPlayer, ordermain, orderoppo,selectedTeam }) => {
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
            plate_appearances: 0,
            at_bats: 0,
            hits: 0,
            total_bases: 0,
            runs: 0,
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
          };
  
          // 計算打席次數
          game.ordermain.forEach(order => {
            if (order.p_name === selectedPlayer.id) {
              stats.plate_appearances += 1;
              countPlayerStats(order.content, stats, { rbi: order.rbi || 0 });
            }
          });
  
          game.orderoppo.forEach(order => {
            if (order.o_p_name === selectedPlayer.id) {
              stats.plate_appearances += 1;
              countPlayerStats(order.o_content, stats, { rbi: order.o_rbi || 0 });
            }
          });
  
          // 計算打數
          stats.at_bats = stats.plate_appearances - (stats.walks + stats.sac_fly + stats.sac_bunt + stats.hit_by_pitch);
  
          return {
            ...stats,
            formattedDate: format(game.GDate.toDate(), "dd/MM/yyyy")
          };
        }).filter(game => game != null);
  
        setPlayerGames(gamesData);
      }
    };
  
    fetchPlayerGames();
  }, [selectedPlayer, selectedTeam]);
  
  const countPlayerStats = (content, stats, additionalStats = {}) => {
    // content 可以是 'single', 'double', 'triple', 'home_run', 'walk', 'hit_by_pitch' 等
    switch(content) {
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
      case '全壘打':
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
    if (additionalStats.rbi) {
      stats.rbi += additionalStats.rbi;
    }
  };
  
  const calculateBattingAverage = (hits, plate_appearances) => {
    return plate_appearances > 0 ? (hits / plate_appearances).toFixed(3) : '.000';
  };
  
  const calculateOnBasePercentage = (hits, walks, hitByPitch, plate_appearances) => {
    const totalChances = plate_appearances + walks + hitByPitch;
    return totalChances > 0 ? ((hits + walks + hitByPitch) / totalChances).toFixed(3) : '.000';
  };
  
  const calculateSluggingPercentage = (totalBases, plate_appearances) => {
    return plate_appearances > 0 ? (totalBases / plate_appearances).toFixed(3) : '.000';
  };
  
  const calculateOPS = (onBasePct, sluggingPct) => {
    return (parseFloat(onBasePct) + parseFloat(sluggingPct)).toFixed(3);
  };
  
  
  
  
  useEffect(() => {
    console.log('更新後的遊戲數據:', playerGames);
  }, [playerGames]);

  useEffect(() => {
    console.log('Bdata 組件收到的球員信息:', selectedPlayer);
  }, [selectedPlayer]);


  useEffect(() => {
    console.log('ordermain:', ordermain);
    console.log('orderoppo:', orderoppo);
  }, [ordermain, orderoppo]);

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ position: 'sticky'}}>比賽日期</TableCell>
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
      <TableCell>{game.formattedDate}</TableCell>
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
      <TableCell>{calculateBattingAverage(game.hits, game.plate_appearances)}</TableCell>
      <TableCell>{calculateOnBasePercentage(game.hits, game.walks, game.hit_by_pitch, game.plate_appearances)}</TableCell>
      <TableCell>{calculateSluggingPercentage(game.total_bases, game.plate_appearances)}</TableCell>
      <TableCell>{calculateOPS(calculateOnBasePercentage(game.hits, game.walks, game.hit_by_pitch, game.plate_appearances), calculateSluggingPercentage(game.total_bases, game.at_bat))}</TableCell>
    </TableRow>
  )) : (
    <TableRow>
      <TableCell colSpan={19}>該球員還沒有比賽數據</TableCell>
    </TableRow>
  )}
</TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

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
