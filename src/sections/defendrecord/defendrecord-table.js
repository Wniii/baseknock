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
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import SearchIcon from '@mui/icons-material/Search';
import { firestore } from 'src/pages/firebase';
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";

// 定義 DefendTable 組件
export const DefendTable = ({ selectedTeam, selectedColumns }) => {
  const [open, setOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playersData, setPlayersData] = useState([]);

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
      const playersKeys = Object.keys(teamData.players);
      console.log("Team Data:", teamData);
  
      const gamesCollectionRef = collection(teamDocRef, "games");
      const gamesQuerySnapshot = await getDocs(gamesCollectionRef);
  
      let gamesDataByPlayer = {};
  gamesQuerySnapshot.forEach((gameDocSnap) => {
    const gameData = gameDocSnap.data();

    ['ordermain', 'orderoppo'].forEach((orderKey) => {
      const orders = gameData[orderKey];
      if (Array.isArray(orders)) {
        orders.forEach((order) => {
          const pitcherName = order.pitcher?.name; // 從 pitcher 物件中獲取名字
          if (pitcherName && playersKeys.includes(pitcherName)) {
            const playerKey = pitcherName; // 使用 pitcher 的名字作為 playerKey
            if (!gamesDataByPlayer[playerKey]) {
              gamesDataByPlayer[playerKey] = { totalBalls: 0, totalStrikes: 0 };
            }
            console.log(`Before adding: Player - ${playerKey}, Balls - ${gamesDataByPlayer[playerKey].totalBalls}, Strikes - ${gamesDataByPlayer[playerKey].totalStrikes}`);
            const balls = Number(order.pitcher.ball) || 0;
            const strikes = Number(order.pitcher.strike) || 0;
    
            gamesDataByPlayer[playerKey].totalBalls += balls;
            gamesDataByPlayer[playerKey].totalStrikes += strikes;
            console.log(`After adding: Player - ${playerKey}, Balls - ${gamesDataByPlayer[playerKey].totalBalls}, Strikes - ${gamesDataByPlayer[playerKey].totalStrikes}`);
          }
        });
      }
    });
  })
  
      const playersList = playersKeys.map((playerKey) => {
        const player = teamData.players[playerKey];
        const stats = gamesDataByPlayer[playerKey] || { totalBalls: 0, totalStrikes: 0 };
  
        return {
          p_id: playerKey, // 使用 playerKey 作為唯一ID
          ...player,
          ...stats
        };
      });
  
      setPlayersData(playersList);
    };
  
    fetchPlayersAndGamesData();
  }, [selectedTeam]);

  // 渲染組件
  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 2500 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ position: 'sticky', left: 0, zIndex: 1 }}>球員</TableCell>
                {selectedColumns.includes('好球數') && (
                  <TableCell>好球數</TableCell>
                )}
                {selectedColumns.includes('壞球數') && (
                  <TableCell>壞球數</TableCell>
                )}
                {selectedColumns.includes('ERA') && (
                  <TableCell>ERA</TableCell>
                )}
                {selectedColumns.includes('出賽') && (
                  <TableCell>出賽</TableCell>
                )}
                {selectedColumns.includes('先發') && (
                  <TableCell>先發</TableCell>
                )}
                {selectedColumns.includes('局數') && (
                  <TableCell>局數</TableCell>
                )}
                {selectedColumns.includes('安打') && (
                  <TableCell>安打</TableCell>
                )}
                {selectedColumns.includes('失分') && (
                  <TableCell>失分</TableCell>
                )}
                {selectedColumns.includes('球數') && (
                  <TableCell>球數</TableCell>
                )}
                {selectedColumns.includes('四壞') && (
                  <TableCell>四壞</TableCell>
                )}
                {selectedColumns.includes('奪三振') && (
                  <TableCell>奪三振</TableCell>
                )}
                {selectedColumns.includes('WHIP') && (
                  <TableCell>WHIP</TableCell>
                )}
                {selectedColumns.includes('好壞球比') && (
                  <TableCell>犧飛</TableCell>
                )}
                {selectedColumns.includes('每局耗球') && (
                  <TableCell>每局耗球</TableCell>
                )}
                {selectedColumns.includes('K/9') && (
                  <TableCell>K/9</TableCell>
                )}
                {selectedColumns.includes('BB/9') && (
                  <TableCell>H/9</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {playersData.map((player, index) => {
                return (
                  <TableRow hover key={player.p_id}>
                    <TableCell style={{ position: 'sticky', left: 0, zIndex: 1 }}>{player.p_id}</TableCell>
                    {selectedColumns.includes('好球數') && (
                       <TableCell>
                       {player.totalStrikes}
                     </TableCell>
                    )}
                    {selectedColumns.includes('壞球數') && (
                      <TableCell>
                      {player.totalBalls}
                    </TableCell>
                    )}
                    {selectedColumns.includes('ERA') && (
                      <TableCell>
                       
                      </TableCell>
                    )}
                    {selectedColumns.includes('出賽') && (
                      <TableCell></TableCell>
                    )}
                    {selectedColumns.includes('先發') && (
                      <TableCell></TableCell>
                    )}
                    {selectedColumns.includes('局數') && (
                      <TableCell></TableCell> // 假設你有這個變數
                    )}
                    {selectedColumns.includes('安打') && (
                      <TableCell></TableCell>
                    )}
                    {selectedColumns.includes('失分') && (
                      <TableCell></TableCell>
                    )}
                    {selectedColumns.includes('球數') && (
                      <TableCell></TableCell>
                    )}
                    {selectedColumns.includes('四壞') && (
                      <TableCell></TableCell>
                    )}
                    {selectedColumns.includes('奪三振') && (
                      <TableCell></TableCell>
                    )}
                    {selectedColumns.includes('WHIP') && (
                      <TableCell></TableCell>
                    )}
                    {selectedColumns.includes('好壞球比') && (
                      <TableCell></TableCell>
                    )}
                    {selectedColumns.includes('每局耗球') && (
                      <TableCell></TableCell>
                    )}
                    {selectedColumns.includes('K/9') && (
                      <TableCell></TableCell>
                    )}
                    {selectedColumns.includes('BB/9') && (
                      <TableCell></TableCell>
                    )}
                    {selectedColumns.includes('H/9') && (
                      <TableCell></TableCell>
                    )}
                  </TableRow>
                );
              })}
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
