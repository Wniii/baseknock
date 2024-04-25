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

export const Bdata = ({ count = 0, onPageChange, onRowsPerPageChange, page = 0, rowsPerPage = 0, selectedPlayer, ordermain, orderoppo }) => {
  const [playerGames, setPlayerGames] = useState([]);

  useEffect(() => {
    const fetchPlayerGames = async () => {
      if (selectedPlayer?.id) {
        // 從 Firestore 獲取 'games' 集合的引用
        const gamesRef = collection(firestore, "games");
        // 獲取所有遊戲記錄
        const gamesSnapshot = await getDocs(gamesRef);
        
        // 使用 .map() 和 .filter() 處理獲取的遊戲記錄
        const filteredGames = gamesSnapshot.docs
          .map(doc => {
            const data = doc.data();
            // 檢查 GDate 是否存在，並且是否是 Timestamp 物件
            const formattedDate = data.GDate && typeof data.GDate.toDate === 'function' 
                                  ? format(data.GDate.toDate(), "dd/MM/yyyy") 
                                  : "無日期";
            return {
              id: doc.id,
              ...data,
              formattedDate
            };
          })
          .filter(game => {
            // 確保 ordermain 和 orderoppo 都被定義並且是數組
            const isInOrderMain = Array.isArray(ordermain) && ordermain.some(order => order.p_name === selectedPlayer.id);
            const isInOrderOppo = Array.isArray(orderoppo) && orderoppo.some(order => order.o_p_name === selectedPlayer.id);
            return isInOrderMain || isInOrderOppo;
          });
        
        // 更新 state
        setPlayerGames(filteredGames);
      }
    };
  
    fetchPlayerGames();
  }, [selectedPlayer, ordermain, orderoppo]);
  
  useEffect(() => {
    console.log('更新後的遊戲數據:', playerGames);
  }, [playerGames]);

  useEffect(() => {
    console.log('Bdata 組件收到的球員信息:', selectedPlayer);
    // ...
  }, [selectedPlayer]);


  useEffect(() => {
    console.log('ordermain:', ordermain);
    console.log('orderoppo:', orderoppo);
    // ...
  }, [ordermain, orderoppo]);

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>比賽日期</TableCell>
                <TableCell>打席</TableCell>
                <TableCell>打數</TableCell>
                <TableCell>安打</TableCell>
                <TableCell>壘打數</TableCell>
                <TableCell>得分</TableCell>
                <TableCell>打點</TableCell>
                <TableCell>一安</TableCell>
                <TableCell>二安</TableCell>
                <TableCell>三安</TableCell>
                <TableCell>全壘打</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {playerGames.length > 0 ? playerGames.map((game) => (
                <TableRow hover key={game.id}>
      <TableCell>{game.formattedDate}</TableCell>
      <TableCell>{game.at_bat}</TableCell>
      <TableCell>{game.hits}</TableCell>
      <TableCell>{game.total_bases}</TableCell>
      <TableCell>{game.runs}</TableCell>
      <TableCell>{game.rbi}</TableCell>
      <TableCell>{game.single_hits}</TableCell>
      <TableCell>{game.double_hits}</TableCell>
      <TableCell>{game.triple_hits}</TableCell>
      <TableCell>{game.home_runs}</TableCell>
    </TableRow>
    )) : (
      <TableRow>
        <TableCell colSpan={10}>沒有找到數據</TableCell>
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
