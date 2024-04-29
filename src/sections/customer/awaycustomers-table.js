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

                    // 更新状态
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
                            {awayattackListData.map((attack, index) => {
                                // 在 orderoppo 中查找具有相同 o_p_name 的对象
                                const orderOppoItems = orderoppo.filter(item => item.o_p_name === attack);

                                // 初始化存放内容的数组
                                const contentArray = new Array(9).fill('');

                                // 將每個攻擊者的內容添加到相應的列中
                                orderOppoItems.forEach(orderOppoItem => {
                                    if (orderOppoItem && orderOppoItem.o_inn >= 0) { // 假設 o_inn 是一個數字，且可能為0
                                        contentArray[orderOppoItem.o_inn] = orderOppoItem.o_content || ""; // 使用正確的字段名
                                    }
                                });

                                // 根据 outs 数字计算按钮所在的列数
                                let buttonRowFound = false;

                                if (buttonRowFound) {
                                return null;
                                }

                                // 根据 outs 数字计算按钮所在的列数
                                let buttonColumn = -1;
                                if (gameDocSnapshot && gameDocSnapshot.data()) {
                                const outs = gameDocSnapshot.data().outs || 0;
                                buttonColumn = Math.floor(outs / 6) + 1;
                                }
                                // 检查是否已经放置了按钮
                                const hasContent = contentArray.some(content => content !== '');

                                return (
                                <TableRow hover key={index}>
                                    {/* 攻击者信息 */}
                                    <TableCell>{attack}</TableCell>
                                
                                    {/* 根据当前列数决定是否显示内容或按钮 */}
                                    {contentArray.map((content, i) => {
                                    // 如果当前行有内容，则跳过该行
                                    if (hasContent) {
                                        return (
                                        <TableCell key={i}>
                                            {content && (
                                            <div
                                                style={{
                                                height: '30px',
                                                padding: 0,
                                                backgroundColor: determineButtonProps(content, i).color, 
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                }}
                                            >
                                                {determineButtonProps(content, i).text} 
                                            </div>
                                            )}
                                        </TableCell>
                                        );
                                    }
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

                                            

                                            // 根据当前内容确定按钮颜色

                                            // 渲染按钮
                                            
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

