import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { collection, getDoc, doc, getDocs } from "firebase/firestore";
import { Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import AddIcon from '@mui/icons-material/Add';
import { firestore } from 'src/firebase';
import { useRouter } from 'next/router';
import { green, red } from '@mui/material/colors';
import GoogleIcon from '@mui/icons-material/Google';

const ReplacementDialog = ({ open, onClose, attackListData, filteredPlayers }) => {
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
            {Array.isArray(filteredPlayers) && filteredPlayers.map(([playerName, playerData], index) => (
              <ListItem key={index}>
                <Box component="span" sx={{ display: 'block' }}>
                  {playerName}: {playerData.position}
                </Box>
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

const determineButtonProps = (content, index) => {
  let buttonColor;
  switch (content) {
    case '一安':
    case '二安':
    case '三安':
    case '全打':
      buttonColor = green[300];
      break;
    case '三振':
    case '飛球':
    case '滾地':
    case '失誤':
    case '野選':
    case '雙殺':
    case '違規':
      buttonColor = red[300];
      break;
    case '四壞':
    case '犧飛':
    case '犧觸':
    case '觸身':
      buttonColor = 'lightblue';
      break;
    case '不知':
      buttonColor = 'black';
    default:
      buttonColor = 'gray';
  }
  return {
    color: buttonColor,
    text: content
  };
};

export const CustomersTable = (props) => {
  const {
    teamId,
    codeName,
    timestamp,
    outs,
    acodeName,
  } = props;

  const [attackListData, setAttackListData] = useState([]);
  const [ordermain, setordermain] = useState([]);
  const [gameDocSnapshot, setGameDocSnapshot] = useState(null);
  const [displayedButton, setDisplayedButton] = useState(false);
  const [lastValidIndex, setLastValidIndex] = useState(0);
  const [filteredPlayers, setTeamPlayers] = useState([]);
  const [open, setOpen] = useState(false);
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
      return;
    }

    try {
      const teamDocRef = doc(firestore, "team", teamId);
      const teamDocSnapshot = await getDoc(teamDocRef);

      if (teamDocSnapshot.exists()) {
        const gamesCollectionRef = collection(teamDocRef, "games");
        const gameDocRef = doc(gamesCollectionRef, timestamp);
        const gameDocSnapshot = await getDoc(gameDocRef);

        if (gameDocSnapshot.exists()) {
          const gameData = gameDocSnapshot.data();
          console.log('gameData', gameData);
          const orderMainLength = gameData.ordermain ? gameData.ordermain.length : 0;
          const lastValidIndex = orderMainLength + 1;

          setLastValidIndex(lastValidIndex);

          const attackListData = [];

          if (gameData.attacklist) {
            gameData.attacklist.forEach((item) => {
              const key = Object.keys(item)[0];
              const playerData = item[key];

              console.log(`playerData for ${key}:`, playerData);

              if (Array.isArray(playerData) && playerData.length > 0) {
                attackListData.push(playerData[0]);
              }
            });
          }


          console.log('attackListData:', attackListData);
          setAttackListData(attackListData);
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
      console.log("Fetching team document...");
      const teamDocRef = doc(firestore, "team", teamId);
      const teamDocSnapshot = await getDoc(teamDocRef);

      if (teamDocSnapshot.exists()) {
        const teamData = teamDocSnapshot.data();

        if (teamData.players) {
          const filteredPlayers = {};
          Object.keys(teamData.players).forEach(playerName => {
            if (!attackListData.includes(playerName)) {
              filteredPlayers[playerName] = teamData.players[playerName];
            }
          });

          setTeamPlayers(Object.entries(filteredPlayers) || []);
        } else {
          console.log("No players data available.");
        }
      } else {
        console.log("No such team document!");
      }
    } catch (error) {
      console.error("Error fetching team players:", error);
    }
  };

  const handleClick = (attack) => {
    router.push({
      pathname: '/attackrecord',
      query: {
        acodeName: acodeName,
        attack: attack,
        timestamp: timestamp,
        codeName: codeName,
        teamId: teamId,
        outs: outs
      }
    });
  };

  const handleEditClick = (attack, row, column) => {
    router.push({
      pathname: '/editattackrecord',
      query: {
        attack: attack,
        timestamp: timestamp,
        codeName: codeName,
        teamId: teamId,
        outs: outs,
        row: row,
        column: column,
        acodeName: acodeName,
      }
    });
  };

  let buttonRow = -1;

  let buttonColumn = -1;
  if (gameDocSnapshot && gameDocSnapshot.data()) {
    const outs = gameDocSnapshot.data().outs || 0;
    buttonColumn = Math.floor(outs / 6) + 1;

    if (lastValidIndex === 0) {
      buttonRow = lastValidIndex + 1;
    } else {
      let remainder = (lastValidIndex % 9);
      if (remainder === 0) {
        remainder += 9;
      }

      buttonRow = remainder;
    }
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
        filteredPlayers={filteredPlayers}
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
                const orderMainItems = ordermain.filter(item => item.p_name === attack);
                const contentArray = new Array(9).fill('');
                orderMainItems.forEach(orderMainItem => {
                  if (orderMainItem && orderMainItem.inn) {
                    const innContent = orderMainItem.inn;
                    contentArray[innContent - 1] = orderMainItem.content.split(',')[0];
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
                              onClick={() => handleEditClick(attack, index, i + 1)}
                            >
                              {buttonProps.text}
                            </Button>
                          </TableCell>
                        );
                      } else if (i === buttonColumn - 1 && index === buttonRow - 1) {
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
