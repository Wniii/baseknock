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

  let totalGamesCount = 0;

  const calculateHits = (gamesData, playersKeys) => {
    const hitsByPitcher = {
      hits: {},
      walks: {},
      strikeouts: {}
    };
  
    gamesData.forEach((gameData, index) => {
      console.log(`Processing game ${index + 1}`);
      ['ordermain', 'orderoppo'].forEach((orderKey) => {
        const orders = gameData[orderKey];
        if (Array.isArray(orders)) {
          orders.forEach((order) => {
            const content = order.content || order.o_content;
            console.log(`Order content: ${content}`);
            const pitcherName = order.pitcher?.name;
            console.log(`Pitcher name: ${pitcherName}`);
            if (pitcherName && playersKeys.includes(pitcherName)) {
              const hasHit = ['一安', '二安', '三安', '全壘打'].some(hitType => content && content.includes(hitType));
              const hasWalk = content && content.includes('四壞');
              const hasStrikeout = content && content.includes('奪三振');
              if (hasHit) {
                if (!hitsByPitcher.hits[pitcherName]) {
                  hitsByPitcher.hits[pitcherName] = 0;
                }
                hitsByPitcher.hits[pitcherName]++;
              }
              if (hasWalk) {
                if (!hitsByPitcher.walks[pitcherName]) {
                  hitsByPitcher.walks[pitcherName] = 0;
                }
                hitsByPitcher.walks[pitcherName]++;
              }
              if (hasStrikeout) {
                if (!hitsByPitcher.strikeouts[pitcherName]) {
                  hitsByPitcher.strikeouts[pitcherName] = 0;
                }
                hitsByPitcher.strikeouts[pitcherName]++;
              }
            }
          });
        }
      });
    });
  
    console.log('Hits by pitcher:', hitsByPitcher);
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
    const playersKeys = Object.keys(teamData.players);
    console.log("Team Data:", teamData);
  
    const gamesCollectionRef = collection(teamDocRef, "games");
    const gamesQuerySnapshot = await getDocs(gamesCollectionRef);
  
    let gamesDataByPlayer = {};
    const gamesParticipation = {};
    const startingPitchers = {};
    const pitchersSet = new Set(); // 使用集合來存儲唯一的投手名單
  
    gamesQuerySnapshot.forEach((gameDocSnap) => {
      const gameData = gameDocSnap.data();
  
      // 检查是否已經計算了該場比賽的參與球員
      let alreadyCountedPlayers = {};
      let alreadyCountedStartingPitcher = {};
  
      ['ordermain', 'orderoppo'].forEach((orderKey) => {
        const orders = gameData[orderKey];
        if (Array.isArray(orders)) {
          orders.forEach((order) => {
            const pitcherName = order.pitcher?.name; // 從 pitcher 物件中獲取名字
            if (pitcherName && playersKeys.includes(pitcherName)) {
              pitchersSet.add(pitcherName); // 添加投手名稱到集合中
  
              // 計算好球數和壞球數
              const balls = Number(order.pitcher.ball) || 0;
              const strikes = Number(order.pitcher.strike) || 0;
              if (!gamesDataByPlayer[pitcherName]) {
                gamesDataByPlayer[pitcherName] = { totalBalls: 0, totalStrikes: 0 };
              }
              gamesDataByPlayer[pitcherName].totalBalls += balls;
              gamesDataByPlayer[pitcherName].totalStrikes += strikes;
  
              if (!alreadyCountedPlayers[pitcherName]) {
                if (!gamesParticipation[pitcherName]) {
                  gamesParticipation[pitcherName] = 0;
                }
                gamesParticipation[pitcherName]++;
                alreadyCountedPlayers[pitcherName] = true;
              }
  
              const firstPitcherName = orders[0].pitcher?.name;
              if (firstPitcherName && playersKeys.includes(firstPitcherName) && !alreadyCountedStartingPitcher[firstPitcherName]) {
                if (!startingPitchers[firstPitcherName]) {
                  startingPitchers[firstPitcherName] = 0;
                }
                startingPitchers[firstPitcherName]++;
                alreadyCountedStartingPitcher[firstPitcherName] = true;
              }
            }
          });
        }
      });
    });
  
    // 計算安打數據
    const hitsByPitcher = calculateHits(gamesQuerySnapshot.docs.map(doc => doc.data()), playersKeys);
  
    const pitchersList = Array.from(pitchersSet); // 將集合轉換為陣列
  
    // 將投手名單轉換為玩家數據，並初始化相關統計信息
    const playersList = pitchersList.map((pitcherName) => {
      const player = teamData.players[pitcherName];
      const stats = gamesDataByPlayer[pitcherName] || { totalBalls: 0, totalStrikes: 0 };
      const gamesPlayed = gamesParticipation[pitcherName] || 0;
      const gamesStarted = startingPitchers[pitcherName] || 0;
      const totalHits = hitsByPitcher[pitcherName] || 0; // 獲取該投手的安打數
      const goodBallCount = stats.totalStrikes || 0;
      const badBallCount = stats.totalBalls || 0;
      const strikeBallRatio = goodBallCount > 0 ? (goodBallCount / (goodBallCount + badBallCount)).toFixed(2) : 0;
  
      return {
        p_id: pitcherName, // 使用投手名字作為唯一ID
        ...player,
        ...stats,
        gamesPlayed,
        gamesStarted,
        totalHits, // 將安打數添加到 player 物件
        totalWalks: hitsByPitcher.walks[pitcherName] || 0, // 添加四壞數據
        totalStrikeouts: hitsByPitcher.strikeouts[pitcherName] || 0, // 添加奪三振數據
        strikeBallRatio,
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
                {selectedColumns.includes('先發') && (
                      <TableCell>先發</TableCell>
                )}
                {selectedColumns.includes('出賽') && (
                  <TableCell>出賽</TableCell>
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
                  <TableCell>好壞球比</TableCell>
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
                    {selectedColumns.includes('先發') && (
                      <TableCell>{player.gamesStarted}</TableCell>
                    )}
                    {selectedColumns.includes('出賽') && (
                     <TableCell>{player.gamesPlayed}</TableCell>
                    )}
                    {selectedColumns.includes('局數') && (
                      <TableCell></TableCell> // 假設你有這個變數
                    )}
                    {selectedColumns.includes('安打') && (
                      <TableCell>{player.totalHits}</TableCell>
                    )}
                    {selectedColumns.includes('失分') && (
                      <TableCell></TableCell>
                    )}
                    {selectedColumns.includes('球數') && (
                      <TableCell></TableCell>
                    )}
                    {selectedColumns.includes('四壞') && (
                      <TableCell>{player.totalWalks}</TableCell>
                    )}
                    {selectedColumns.includes('奪三振') && (
                      <TableCell>{player.totalStrikeouts}</TableCell>
                    )}
                    {selectedColumns.includes('WHIP') && (
                      <TableCell></TableCell>
                    )}
                    {selectedColumns.includes('好壞球比') && (
                      <TableCell>{player.strikeBallRatio}</TableCell>
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
