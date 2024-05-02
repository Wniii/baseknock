import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { collection, getDoc, doc, getDocs } from "firebase/firestore";
import { Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, Table, TableBody, TableCell, TableHead, TablePagination, TableRow } from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import AddIcon from '@mui/icons-material/Add';
import { firestore } from '../../pages/firebase';
import { useRouter } from 'next/router';
import { green, red } from '@mui/material/colors';


const ReplacementDialog = ({ open, onClose, attackListData, teamPlayers }) => {
  return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
          <DialogTitle>選擇替補球員</DialogTitle>
          <DialogContent>
              <Box display="flex" justifyContent="space-between">
                  <List>
                      {attackListData.map((player, index) => (
                          <ListItem key={index}>{player}</ListItem>
                      ))}
                  </List>
                  <List>
                      {teamPlayers.map((player, index) => (
                          <ListItem key={index}>
                              {Object.keys(player).map((key, idx) => (
                                  <Box key={idx} component="span" sx={{ display: 'block' }}>
                                      {key}: {player[key]}
                                  </Box>
                              ))}
                          </ListItem>
                      ))}
                  </List>
              </Box>
          </DialogContent>
          <DialogActions>
              <Button onClick={onClose}>取消</Button>
          </DialogActions>
      </Dialog>
  );
};

// 定義 determineButtonProps 函數
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
    outs
  } = props;
  const [attackListData, setAttackListData] = useState([]);
  const [ordermain, setordermain] = useState([]);
  const [gameDocSnapshot, setGameDocSnapshot] = useState(null);
  const [displayedButton, setDisplayedButton] = useState(false);
  const [lastValidIndex, setLastValidIndex] = useState(0);  // 修正初始值為 0
  const [teamPlayers, setTeamPlayers] = useState([]);
  const [open, setOpen] = useState(false); // 定義 open 狀態
  const router = useRouter();

  useEffect(() => {
    const fetchGameData = async () => {
      await fetchGames();
      await fetchTeamPlayers();
    };
    fetchGameData();
  }, [codeName, timestamp, teamId]);

  const fetchGames = async () => {
    if (!teamId || !timestamp) {
      console.log('Required IDs are missing.');
      return; // 直接返回如果缺少 ID
    }
    
    console.log('Fetching games...');
    try {
      const teamDocRef = doc(firestore, "team", teamId);
      const teamDocSnapshot = await getDoc(teamDocRef);
  
      if (teamDocSnapshot.exists()) {
        const gamesCollectionRef = collection(teamDocSnapshot.ref, "games");
        const gameDocRef = doc(gamesCollectionRef, timestamp);
        const gameDocSnapshot = await getDoc(gameDocRef);

        if (gameDocSnapshot.exists()) {
          const gameData = gameDocSnapshot.data();
          const orderMainLength = gameData.ordermain ? gameData.ordermain.length : 0;
          const lastValidIndex = orderMainLength - 1;

          setLastValidIndex(lastValidIndex);
          setAttackListData(gameData.attacklist || []);
          setordermain(gameData.ordermain || []);
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

  const fetchTeamPlayers = async () => {
    try {
      const playersSnapshot = await getDocs(collection(firestore, "team"));
      const players = [];
      playersSnapshot.forEach(doc => {
        if (!attackListData.includes(doc.data().name)) {
          players.push(doc.data());
        }
      });
      setTeamPlayers(teamPlayers);
    } catch (error) {
      console.error("Error fetching team players:", error);
    }
  };
  console.log("d",teamPlayers)

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

  let buttonRow = -1;

// 在迴圈外計算按鈕的行數和按鈕的列數
let buttonColumn = -1;
if (gameDocSnapshot && gameDocSnapshot.data()) {
  const outs = gameDocSnapshot.data().outs || 0;
  buttonColumn = Math.floor(outs / 6) + 1;

  // 計算按鈕應該放置的行數
  const remainder = (lastValidIndex % 9)+2;
  console.log("s",remainder)
    buttonRow = remainder;

}
  
  return (
    <Card>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        替補球員
      </Button>
      <ReplacementDialog
        open={open}
        onClose={() => setOpen(false)}
        attackListData={attackListData}
        teamPlayers={teamPlayers}
      />
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
                console.log('Processing attack:', attack);
                const orderMainItems = ordermain.filter(item => item.p_name === attack);
                console.log('OrderMain items for', attack, ':', orderMainItems);
                const contentArray = new Array(9).fill('');
                orderMainItems.forEach(orderMainItem => {
                  if (orderMainItem && orderMainItem.inn) {
                    const innContent = orderMainItem.inn;
                    contentArray[innContent - 1] = orderMainItem.content.split(',')[0];
                    console.log(`Updated contentArray for inning ${innContent} of ${attack}:`, contentArray);
                  }
                });
  
                console.log('Final contentArray for', attack, ':', contentArray);
  
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
                        console.log("Button key:", i);
                        return (
                          <TableCell key={i}>
                            <Button
                              variant="outlined"
                              color="inherit"
                              sx={{ height: '30px', padding: 0 }}
                              onClick={() => handleClick(attack)}
                            >
                              <AddIcon />
                            </Button>
                          </TableCell>
                        );
                      } else {
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
  )
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
