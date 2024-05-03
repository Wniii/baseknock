import React, { useState, useEffect } from 'react';
import { collection, getDoc, doc } from "firebase/firestore";
import { firestore } from '../../pages/firebase';
import PropTypes from 'prop-types';
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


const statusMap = {
  pending: 'warning',
  delivered: 'success',
  refunded: 'error'
};

const calculateRbi = (ordermain) => {
  const rbiTotalByInn = {};
  ordermain.forEach((order) => {
    const inn = order.inn.toString(); // 将数字转换为字符串
    const rbi = order.rbi || 0;
    if (!rbiTotalByInn[inn]) {
      rbiTotalByInn[inn] = 0;
    }
    rbiTotalByInn[inn] += rbi;
  });
  return rbiTotalByInn;
};

const calculateAwayRbi = (orderoppo) => {
  const AwayrbiTotalByInn = {};
  orderoppo.forEach((order) => {
    const o_inn = order.o_inn.toString(); // 将数字转换为字符串
    const o_rbi = order.o_rbi || 0;
    if (!AwayrbiTotalByInn[o_inn]) { // 修正此处的变量名
      AwayrbiTotalByInn[o_inn] = 0;
    }
    AwayrbiTotalByInn[o_inn] += o_rbi; // 修正此处的变量名
    console.log('away score:', AwayrbiTotalByInn)
  });
  return AwayrbiTotalByInn;
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
  const [orderoppo, setorderoppo] = useState([]);
  const [rbiTotalByInn, setRbiTotalByInn] = useState({});
  const [AwayrbiTotalByInn, setAwayRbiTotalByInn] = useState({}); // 使用 useState 保存 rbiTotalByInn
  const [hitTotal, setHitTotal] = useState(0);
  const [awayHitTotal, setAwayHitTotal] = useState(0);

  const calculateHit = (ordermain) => {
    let hitCount = 0;
    ordermain.forEach((order) => {
      if (["一安", "二安", "三安", "全打"].includes(order.content)) {
        hitCount += 1;
      }
    });
    return hitCount;
  };

  const calculateAwayHit = (orderoppo) => {
    let awayHitCount = 0;
    orderoppo.forEach((order) => {
      if (["一安", "二安", "三安", "全打"].includes(order.o_content)) {
        awayHitCount += 1;
      }
    });
    return awayHitCount;
  };


  useEffect(() => {
    fetchGames();
  }, [codeName, timestamp, teamId]); // 当codeName、timestamp、teamId 发生变化时重新获取数据
  useEffect(() => {
    if (ordermain.length > 0) {
      const totalHits = calculateHit(ordermain);
      setHitTotal(totalHits);
    }
    if (orderoppo.length > 0) {
      const totalAwayHits = calculateAwayHit(orderoppo);
      setAwayHitTotal(totalAwayHits);
    }
  }, [ordermain, orderoppo]);

  const fetchGames = async () => {
    if (!teamId || !timestamp) {
      return; // 如果没有提供团队文档ID或游戏文档ID，直接返回
    }

    // console.log('Fetching games...');

    try {
      // 获取指定团队文档
      const teamDocSnapshot = await getDoc(doc(firestore, "team", teamId));

      if (teamDocSnapshot.exists()) {
        // console.log("Team document ID:", teamId);

        // 获取指定团队文档中的游戏子集合
        const gamesCollectionRef = collection(teamDocSnapshot.ref, "games");

        // 获取指定游戏文档
        const gameDocSnapshot = await getDoc(doc(gamesCollectionRef, timestamp));

        if (gameDocSnapshot.exists()) {
          // console.log("Game document ID:", timestamp);
          // console.log("Game data:", gameDocSnapshot.data());

          // 更新状态
          sethometeam(gameDocSnapshot.data().hometeam || []);
          setawayteam(gameDocSnapshot.data().awayteam || []);
          setordermain(gameDocSnapshot.data().ordermain || []);
          setorderoppo(gameDocSnapshot.data().orderoppo || []);

          // 计算 RBI 并设置状态
          const rbiTotal = calculateRbi(gameDocSnapshot.data().ordermain || []);
          setRbiTotalByInn(rbiTotal);

          const AwayrbiTotal = calculateAwayRbi(gameDocSnapshot.data().orderoppo || []);
          setAwayRbiTotalByInn(AwayrbiTotal);
          // console.log("wd",rbiTotal)
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
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                { teamName: awayteam, rbiTotals: AwayrbiTotalByInn, hitTotals: awayHitTotal },
                { teamName: hometeam, rbiTotals: rbiTotalByInn, hitTotals: hitTotal }
              ].map((team, rowIndex) => (
                <TableRow key={rowIndex} hover>
                  <TableCell>{team.teamName}</TableCell>
                  {[...Array(9)].map((_, colIndex) => {
                    const inn = (colIndex + 1).toString();
                    const rbiTotal = team.rbiTotals[inn] || 0;
                    return <TableCell key={colIndex}>{rbiTotal}</TableCell>;
                  })}
                  <TableCell></TableCell>
                  <TableCell>
                    {Object.values(team.rbiTotals).reduce((a, b) => a + b, 0)}
                  </TableCell>
                  <TableCell>
                    {team.hitTotals}
                  </TableCell>
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

Score.propTypes = {
  orders: PropTypes.array,
  sx: PropTypes.object
};
