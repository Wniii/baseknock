import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { Box, Button, Card, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Typographyㄋ } from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import AddIcon from '@mui/icons-material/Add';
import { firestore } from '../../pages/firebase';
import { useRouter } from 'next/router';

export const CustomersTable = (props) => {
  const {
    count = 0,
    onPageChange = () => { },
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
  } = props;
  const [attackListData, setAttackListData] = useState([]);
  const [gameID, setGameID] = useState('');
  const { codeName, timestamp,teamId } = props; // 从props中获取路由参数
  const router = useRouter(); // 初始化router

  useEffect(() => {
    fetchGames();
  }, [codeName]); // 当codeName发生变化时重新获取数据

  const fetchGames = async () => {
    if (!codeName) {
      return; // 如果 codeName 不存在，直接返回
    }
  
    console.log('Fetching games...');
  
    try {
      const teamQuerySnapshot = await getDocs(
        query(collection(firestore, "team"), where("codeName", "==", codeName))
      );
  
      // 检查是否存在符合条件的文档
      if (!teamQuerySnapshot.empty) {
        // 获取第一个匹配的文档
        const teamDocSnapshot = teamQuerySnapshot.docs[0];
        console.log("Team document ID:", teamDocSnapshot.id);
  
        // 获取文档中的 "games" 子集合的引用
        const gamesCollectionRef = collection(teamDocSnapshot.ref, "games");
  
        // 获取 "games" 子集合中的所有文档
        const gamesQuerySnapshot = await getDocs(gamesCollectionRef);
  
        console.log('Games found:', gamesQuerySnapshot.size);
  
        // 遍历游戏文档快照列表，输出游戏数据和进行进一步操作
        gamesQuerySnapshot.forEach((gameDoc) => {
          const gameId = gameDoc.id;
          const gameData = gameDoc.data();
  
          console.log("Game ID:", gameId);
          console.log("Game data:", gameData);
  
          // 获取传递过来的时间戳
          console.log("Passed timestamp:", timestamp);
  
          // 如果游戏文档的ID和传递过来的时间戳匹配成功，则继续执行后续代码
          if (gameId === timestamp) {
            console.log("Match found for timestamp:", timestamp);
  
            // 如果游戏文档存在，则更新状态
            if (gameDoc.exists()) {
              console.log('Game exists:', gameId);
              console.log('Game data:', gameDoc.data());
  
              // 更新状态
              setGameID(gameId);
              setAttackListData(gameDoc.data().attacklist || []);
            } else {
              console.log("No matching document with ID:", gameId);
            }
          } else {
            console.log("No match for timestamp:", timestamp);
          }
        });
      } else {
        console.log("No team document found with codeName:", codeName);
      }
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };
      
   // 传递 codeName 作为 useEffect 的依赖项
  



   const handleClick = (attack) => {
    router.push({
      pathname: '/attackrecord',
      query: {
        attack: attack,
        timestamp: timestamp,
        codeName: codeName,
        teamId: teamId // Added the missing comma here
      }
    });
  };
  

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>打者</TableCell>
                <TableCell>E</TableCell>
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
              {attackListData.length > 0 ? attackListData.map((attack, index) => (
                <TableRow hover key={index}>
                  <TableCell>{attack}</TableCell>
                  <TableCell />
                  <TableCell align="left"> {/* 將 align 改為 "left" 以達到左對齊 */}
                    <Button
                      variant="outlined"
                      color="inherit"
                      sx={{ height: '30px', padding: 0 }}
                      type="button"
                      onClick={() => handleClick(attack)} // 傳遞該行的 `attack` 數據
                    >
                      <AddIcon />
                    </Button>
                  </TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={11}>No Data Available</TableCell>
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

CustomersTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array
};

export default CustomersTable;
