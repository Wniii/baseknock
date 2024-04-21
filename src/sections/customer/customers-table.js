import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { collection, getDoc, doc } from "firebase/firestore";
import { Box, Button, Card, Table, TableBody, TableCell, TableHead, TablePagination, TableRow } from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import AddIcon from '@mui/icons-material/Add';
import { firestore } from '../../pages/firebase';
import { useRouter } from 'next/router';

export const CustomersTable = (props) => {
  const {
    count = 0,
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    teamId,
    codeName,
    timestamp,
  } = props;
  const [attackListData, setAttackListData] = useState([]);
  const [ordermain, setordermain] = useState([]);
  const [gameDocSnapshot, setGameDocSnapshot] = useState(null);
  const [displayedButton, setDisplayedButton] = useState(false);
  const router = useRouter(); // 初始化router

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
          setAttackListData(gameDocSnapshot.data().attacklist || []);
          setordermain(gameDocSnapshot.data().ordermain || []);
          setGameDocSnapshot(gameDocSnapshot);
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
  
  const handleClick = (attack) => {
    router.push({
      pathname: '/attackrecord',
      query: {
        attack: attack,
        timestamp: timestamp,
        codeName: codeName,
        teamId: teamId,
      }
    });
  };
// 函数来确定应该放置按钮的列数
let buttonPlaced = false;


  return (
    <Card>
  <Scrollbar>
    <Box sx={{ minWidth: 800 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>打者</TableCell>
            <TableCell>1</TableCell>
            <TableCell>2</TableCell>
            <TableCell>3</TableCell>
            <TableCell>4</TableCell>
            <TableCell>5</TableCell>
            <TableCell>6</TableCell>
            <TableCell>7</TableCell>
            <TableCell>8</TableCell>
            <TableCell>9</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
  {attackListData.map((attack, index) => {
    // 在 ordermain 中查找具有相同 p_name 的对象
    const orderMainItem = ordermain.find(item => item.p_name === attack);

    // 获取当前攻击者的内容
    const content = orderMainItem ? orderMainItem.content.split(',')[0] : '';

    // 初始化存放内容的数组
    const contentArray = new Array(9).fill('');

    // 根据 inn 字符串的内容确定应该放置在哪一列
    if (orderMainItem && orderMainItem.inn) {
      const innContent = orderMainItem.inn;
      for (let i = 0; i < 9; i++) {
        if (innContent.includes(`${i + 1}`)) {
          contentArray[i] = content;
        }
      }
    }

    // 根据 outs 数字计算按钮所在的列数
    let buttonColumn = -1;
    if (gameDocSnapshot && gameDocSnapshot.data()) {
      const outs = gameDocSnapshot.data().outs || 0;
      buttonColumn = Math.floor(outs / 3) + 1;
    }

    // 检查是否已经放置了按钮
    

    return (
      <TableRow hover key={index}>
        {/* 攻击者信息 */}
        <TableCell>{attack}</TableCell>

        {/* 根据当前列数决定是否显示内容或按钮 */}
        {contentArray.map((content, i) => {
          if (!buttonPlaced && content === '') {
            // 如果是第一个没有放置内容的球员，并且按钮未被放置，则放置按钮
            if (buttonColumn === i + 1) {
              buttonPlaced = true;
              console.log(`Button placed for player ${attack} in column ${buttonColumn}`);
              return (
                <TableCell key={i}>
                  <Button
                    variant="outlined"
                    color="inherit"
                    sx={{ height: '30px', padding: 0 }}
                    type="button"
                    onClick={() => handleClick(attack)}
                  >
                    <AddIcon />
                  </Button>
                </TableCell>
              );
            }
          }
          // 显示内容
          return (
            <TableCell key={i}>
              {content && <span>{content}</span>}
            </TableCell>
          );
        })}
      </TableRow>
    );
  })}
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

CustomersTable.propTypes = {
  count: PropTypes.number,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  teamId: PropTypes.string,
  codeName: PropTypes.string,
  timestamp: PropTypes.string,
};

export default CustomersTable;

