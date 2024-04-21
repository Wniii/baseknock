import { format } from 'date-fns';
import React, { useState, useEffect } from 'react';
import { collection, getDoc, doc } from "firebase/firestore";
import { firestore } from '../../pages/firebase';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import { useRouter } from 'next/router';

import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  SvgIcon,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { SeverityPill } from 'src/components/severity-pill';

const statusMap = {
  pending: 'warning',
  delivered: 'success',
  refunded: 'error'
};

export const Score = (props) => {
  const {
    teamId,
    codeName,
    timestamp,
  } = props;
  const { orders = [], sx } = props;
  const router = useRouter(); // 初始化router
  const [hometeam, sethometeam] = useState([]);
  const [awayteam, setawayteam] = useState([]);
  const [ordermain, setordermain] = useState([]);

  useEffect(() => {
    fetchGames();
  }, [codeName, timestamp, teamId]); // 当codeName、timestamp、teamId 发生变化时重新获取数据

  const fetchGames = async () => {
    if (!teamId || !timestamp) {
      return; // 如果没有提供团队文档ID或游戏文档ID，直接返回
    }
    
    console.log('Fetching games...');
  
    try {
      // 获取指定团队文档
      const teamDocSnapshot = await getDoc(doc(firestore, "team", teamId));
  
      if (teamDocSnapshot.exists()) {
        console.log("Team document ID:", teamId);
  
        // 获取指定团队文档中的游戏子集合
        const gamesCollectionRef = collection(teamDocSnapshot.ref, "games");
  
        // 获取指定游戏文档
        const gameDocSnapshot = await getDoc(doc(gamesCollectionRef, timestamp));
  
        if (gameDocSnapshot.exists()) {
          console.log("Game document ID:", timestamp);
          console.log("Game data:", gameDocSnapshot.data());
          
          // 更新状态
          sethometeam(gameDocSnapshot.data().hometeam || []);
          setawayteam(gameDocSnapshot.data().awayteam || []);
          setordermain(gameDocSnapshot.data().ordermain || []);

        } else {
          console.log("No matching game document with ID:", timestamp);
        }
      } else {
        console.log("No team document found with ID:", teamId);
      }
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };


  const calculateRbi = (inn, ordermain) => {
    let rbiTotal = 0;
    ordermain.forEach((order) => {
      if (order.inn.includes(inn)) {
        rbiTotal += order.rbi || 0;
      }
    });
    return rbiTotal;
  };
  
  return (
    <Card sx={sx}>
      <Scrollbar sx={{ flexGrow: 1 }}>
        <Box sx={{ minWidth: 1000 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>隊伍</TableCell>
                {[...Array(9)].map((_, index) => (
                  <TableCell key={index}>{index + 1}</TableCell>
                ))}
                <TableCell></TableCell>
                <TableCell>R</TableCell>
                <TableCell>H</TableCell>
                <TableCell>E</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                { teamName: hometeam, scores: [] },
                { teamName: awayteam, scores: [] }
              ].map((team, rowIndex) => (
                <TableRow key={rowIndex} hover>
                  <TableCell>{team.teamName}</TableCell>
                  {[...Array(9)].map((_, colIndex) => {
                    const inn = (colIndex + 1).toString(); // 转换为字符串
                    const rbiTotal = calculateRbi(inn, ordermain);
                    return <TableCell key={colIndex}>{rbiTotal}</TableCell>;
                  })}
                  <TableCell></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <Divider />
    </Card>
  );
  
};

Score.proptype = {
  orders: PropTypes.array,
  sx: PropTypes.object
};
