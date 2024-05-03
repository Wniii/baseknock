import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { collection, getDoc, doc } from "firebase/firestore";
import { Box, Button, Card, Table, TableBody, TableCell, TableHead, TablePagination, TableRow } from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import AddIcon from '@mui/icons-material/Add';
import { firestore } from '../../pages/firebase';
import { useRouter } from 'next/router';
import { green, blue, red } from '@mui/material/colors';

const determineButtonProps = (content, index) => {
    let buttonColor;
    switch (content) {
      case '一安':
      case '二安':
      case '三安':
      case '全打':
        buttonColor = green[300]; // 绿色
        break;
      case '三振':
      case '飛球':
      case '滾地':
      case '失誤':
      case '野選':
      case '雙殺':
      case '違規':
        buttonColor = red[300]; // 红色
        break;
      case '四壞':
      case '犧飛':
      case '犧觸':
      case '觸身':
        buttonColor = 'lightblue'; // 淡蓝色
        break;
      default:
        buttonColor = 'black'; // 黑色
    }
    return {
      color: buttonColor,
      text: content
    };
  };
export const AwayCustomersTable = (props) => {
    const {
        count = 0,
        onPageChange = () => { },
        onRowsPerPageChange,
        page = 0,
        rowsPerPage = 0,
        teamId,
        codeName,
        timestamp,
        outs
    } = props;
    const [awayattackListData, setAwayAttackListData] = useState([]);
    const [orderoppo, setorderoppo] = useState([]);
    const [gameDocSnapshot, setGameDocSnapshot] = useState(null);
    const [displayedButton, setDisplayedButton] = useState(false);
    const [lastValidIndex, setOderoppoLengthMinusOne] = useState(false);
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
                // console.log("Team document ID:", teamId);

                // 获取指定团队文档中的游戏子集合
                const gamesCollectionRef = collection(teamDocSnapshot.ref, "games");

                // 获取指定游戏文档
                const gameDocSnapshot = await getDoc(doc(gamesCollectionRef, timestamp));

                if (gameDocSnapshot.exists()) {
                    //   console.log("Game document ID:", timestamp);
                    //   console.log("Game data:", gameDocSnapshot.data());
                    const gameData = gameDocSnapshot.data();
                    const oderoppoLength = gameData.orderoppo ? gameData.orderoppo.length : 0;  // 如果ordermain存在则使用其长度，否则使用0
                      const lastValidIndex = oderoppoLength;
  
                      console.log('Length of ordermain array:', oderoppoLength);
                      console.log('Last valid index of ordermain array:', oderoppoLength - 1);
                  
                    // 更新状态
                    setOderoppoLengthMinusOne(lastValidIndex);
                    setAwayAttackListData(gameDocSnapshot.data().awayattacklist || []);
                    setorderoppo(gameDocSnapshot.data().orderoppo || []);
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
            pathname: '/awayattackrecord',
            query: {
                attack: attack,
                timestamp: timestamp,
                codeName: codeName,
                teamId: teamId,
                outs: outs
            }
        });
    };
   // 初始化按鈕放置的行數
let buttonRow = -1;

// 在迴圈外計算按鈕的行數和按鈕的列數
let buttonColumn = -1;
if (gameDocSnapshot && gameDocSnapshot.data()) {
  const outs = gameDocSnapshot.data().outs || 0;
  buttonColumn = Math.floor(outs / 6) + 1;

  // 計算按鈕應該放置的行數
  const remainder = (lastValidIndex % 9)+1;
    buttonRow = remainder;

}
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
            {awayattackListData.map((attack, index) => {
              const orderOppoItems = orderoppo.filter((item) => item.o_p_name === attack);
              const contentArray = new Array(9).fill('');

              orderOppoItems.forEach((orderOppoItem) => {
                if (orderOppoItem && orderOppoItem.o_inn) {
                  const innContent = orderOppoItem.o_inn;
                  contentArray[innContent - 1] = orderOppoItem.o_content.split(',')[0];
                }
              });

              return (
                <TableRow hover key={index}>
                  <TableCell>{attack}</TableCell>
                  {contentArray.map((content, i) => {
                    if (content) {
                      const buttonProps = determineButtonProps(content, i);
                      return (
                        <TableCell key={i}>
                          <Button
                            variant="contained"
                            style={{
                              height: '30px',
                              backgroundColor: buttonProps.color,
                              color: 'white',
                            }}
                            onClick={() => handleClick(attack)}
                          >
                            {buttonProps.text}
                          </Button>
                        </TableCell>
                      );
                    } else if (i === buttonColumn - 1 && index === buttonRow - 1) {
                      // 確保只在未放置按鈕且當前列沒有內容時放置按鈕
                    
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
                    } else {
                      // 其他情況下返回空的 TableCell
                      return <TableCell key={i}></TableCell>;
                    }
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

AwayCustomersTable.propTypes = {
    count: PropTypes.number,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number,
    teamId: PropTypes.string,
    codeName: PropTypes.string,
    timestamp: PropTypes.string,
};

export default AwayCustomersTable;

