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
  const [ordermain, setordermain] = useState([]);
  const [gameID, setGameID] = useState('');
  const { codeName, timestamp,teamId, } = props; // 从props中获取路由参数
  const router = useRouter(); // 初始化router




  
  useEffect(() => {
    fetchGames();
  }, [codeName,timestamp,teamId]); // 当codeName发生变化时重新获取数据

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
          setGameID(timestamp);
          setAttackListData(gameDocSnapshot.data().attacklist || []);
          setordermain(gameDocSnapshot.data().ordermain || []);
          console.log("wwew",ordermain)
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
                    {/* 攻击者信息 */}
                    <TableCell>{attack}</TableCell>
                    
                    {/* 在第一行显示按钮 */}
                    {index === 0 && gameID && (
                      <TableCell>
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
                    )}
                    
                    {/* 空单元格 */}
                    <TableCell />
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
