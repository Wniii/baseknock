import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { collection, getDoc, getDocs, doc, query, where, updateDoc, writeBatch } from "firebase/firestore";
import { Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, Table, TableBody, TableCell, TableHead, TablePagination, TableRow } from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import AddIcon from '@mui/icons-material/Add';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { firestore } from '../../pages/firebase';
import { useRouter } from 'next/router';
import { green, red } from '@mui/material/colors';
import { IconButton } from '@mui/material';

const determineButtonProps = (content, index) => {
  let buttonColor;
  switch (content) {
    case '一安':
    case '二安':
    case '三安':
    case '全打':
      buttonColor = green[300]; // 綠色
      break;
    case '三振':
    case '飛球':
    case '滾地':
    case '失誤':
    case '野選':
    case '雙殺':
    case '違規':
      buttonColor = red[300]; // 紅色
      break;
    case '四壞':
    case '犧飛':
    case '犧觸':
    case '觸身':
      buttonColor = 'lightblue'; // 淡藍色
      break;
    default:
      buttonColor = 'black'; // 黑色
  }
  return {
    color: buttonColor,
    text: content
  };
};

const AwayCustomersTable = (props) => {
  const {
    count = 0,
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    teamId,
    codeName,
    acodeName,
    timestamp,
    outs
  } = props;
  const [awayattackListData, setAwayAttackListData] = useState([]);
  const [orderoppo, setorderoppo] = useState([]);
  const [gameDocSnapshot, setGameDocSnapshot] = useState(null);
  const [lastValidIndex, setLastValidIndex] = useState(0);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [selectedPlayerName, setSelectedPlayerName] = useState("");

  const handleSwap = (playerName) => {
    setSelectedPlayerName(playerName);
    setOpen(true);
  };

  const updateSubstitutesForBothTeams = async (teamId, acodeName, timestamp, originalPlayer, substitutePlayer) => {
    const updateSubstituteInFirestore = async (teamId, timestamp, originalPlayer, substitutePlayer) => {
      const teamRef = doc(firestore, "team", teamId);
      const gamesCollectionRef = collection(teamRef, "games");

      const q = query(gamesCollectionRef, where("g_id", "==", timestamp));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (doc) => {
          const gameRef = doc.ref;
          try {
            await updateDoc(gameRef, {
              [`substitute.${originalPlayer}`]: substitutePlayer
            });
          } catch (error) {
            console.error(`Failed to update substitute for game ${doc.id} in team ${teamId}`, error);
          }
        });
      }
    };

    try {
      const teamsData = await getDocs(collection(firestore, "team"));
      const teamIdMap = new Map();
      teamsData.forEach(doc => {
        const data = doc.data();
        teamIdMap.set(data.codeName, doc.id);
      });

      await updateSubstituteInFirestore(teamId, timestamp, originalPlayer, substitutePlayer);

      const awayTeamId = teamIdMap.get(acodeName);
      if (awayTeamId) {
        await updateSubstituteInFirestore(awayTeamId, timestamp, originalPlayer, substitutePlayer);
      }
    } catch (error) {
      console.error("Failed to update substitutes for both teams:", error);
    }
  };

  const ReplacementDialog = ({ open, onClose, filteredPlayers, originalPlayer, teamId, acodeName, timestamp, onSelectPlayer }) => {
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    const handleSelectPlayer = (player) => {
      setSelectedPlayer(player);
    };

    const handleConfirm = () => {
      if (selectedPlayer && originalPlayer) {
        onSelectPlayer(selectedPlayer);
        updateSubstitutesForBothTeams(teamId, acodeName, timestamp, originalPlayer, selectedPlayer.name);
        onClose();
      } else {
        console.log("No player or substitute selected");
      }
    };

    return (
      <Dialog open={open} onClose={onClose} maxWidth="md">
        <DialogTitle>選擇替補球員 - {originalPlayer}</DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="space-between">
            <List>
              {filteredPlayers.map((player, index) => (
                <ListItem
                  button
                  key={index}
                  onClick={() => handleSelectPlayer(player)}
                  style={{ backgroundColor: selectedPlayer === player ? '#cfe8fc' : 'transparent' }}
                >
                  <Box component="span" sx={{ display: 'block' }}>
                    {player.name}
                  </Box>
                </ListItem>
              ))}
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirm}>確認</Button>
        </DialogActions>
      </Dialog>
    );
  };

  const handleSelectPlayer = async (player) => {
    if (player) {
      const newPlayerList = [...awayattackListData, player.name];
      setAwayAttackListData(newPlayerList);
      setOpen(false);
      fetchTeamPlayers(newPlayerList);
      await updateGameDataForAllMatches(player.name);
    } else {
      console.log("Player is null, cannot add to list.");
    }
  };

  const updateGameDataForAllMatches = async (newPlayer) => {
    try {
      const teamsData = await getDocs(collection(firestore, "team"));
      const teamIdMap = new Map();
      teamsData.forEach(doc => {
        const data = doc.data();
        teamIdMap.set(data.codeName, doc.id);
      });

      const batch = writeBatch(firestore);
      for (let [codeName, teamId] of teamIdMap) {
        const teamDocRef = doc(firestore, "team", teamId);
        const teamDocSnapshot = await getDoc(teamDocRef);
        if (!teamDocSnapshot.exists()) {
          console.log("Team document not found for", codeName);
          continue;
        }

        const gamesCollectionRef = collection(teamDocSnapshot.ref, "games");
        const q = query(gamesCollectionRef, where("g_id", "==", timestamp));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          continue;
        }

        querySnapshot.forEach((doc) => {
          const gameDocRef = doc.ref;
          const gameData = doc.data();
          const currentAwayList = gameData.awayattacklist || [];

          batch.update(gameDocRef, {
            awayattacklist: [...currentAwayList, newPlayer]
          });
        });
      }

      await batch.commit();
      console.log("Batch update successful");
    } catch (error) {
      console.error("Failed to update games:", error);
    }
  };

  useEffect(() => {
    fetchGames();
    fetchTeamPlayers();
  }, [teamId, timestamp]);

  useEffect(() => {
    if (teamId && timestamp && acodeName && awayattackListData.length > 0) {
      fetchTeamPlayers(acodeName, awayattackListData);
    }
  }, [teamId, timestamp, acodeName, awayattackListData]);

  const [substituteMap, setSubstituteMap] = useState({});

  const fetchGames = async () => {
    if (!teamId || !timestamp) {
      console.log('Required IDs are missing.');
      return;
    }
    const teamDocRef = doc(firestore, "team", teamId);
    const teamDocSnapshot = await getDoc(teamDocRef);
    if (!teamDocSnapshot.exists()) {
      console.log("No team document found with ID:", teamId);
      return;
    }

    const gamesCollectionRef = collection(teamDocSnapshot.ref, "games");
    const gameDocRef = doc(gamesCollectionRef, timestamp);
    const gameDocSnapshot = await getDoc(gameDocRef);
    if (!gameDocSnapshot.exists()) {
      console.log("No matching game document with ID:", timestamp);
      return;
    }

    const gameData = gameDocSnapshot.data();
    const orderOppoLength = gameData.orderoppo ? gameData.orderoppo.length : 0;
    const lastValidIndex = orderOppoLength + 1;

    setLastValidIndex(lastValidIndex);
    setAwayAttackListData(gameData.awayattacklist || []);
    setorderoppo(gameData.orderoppo || []);
    setGameDocSnapshot(gameDocSnapshot);

    if (gameData.substitute) {
      setSubstituteMap(gameData.substitute);
    }

    const teamQuerySnapshot = await getDocs(query(collection(firestore, "team"), where("codeName", "==", gameData.awayteam)));
    if (!teamQuerySnapshot.empty) {
      const teamDoc = teamQuerySnapshot.docs[0];
      if (teamDoc && teamDoc.id) {
        fetchTeamPlayers(teamDoc.id, gameData.awayattacklist);
      }
    } else {
      console.log("No matching team found for codeName:", gameData.awayteam);
    }
  };

  const fetchTeamPlayers = async (acodeName, awayattackListData) => {
    const teamsData = await getDocs(collection(firestore, "team"));
    const teamIdMap = new Map();
    const teamNameMap = new Map();
    teamsData.forEach(doc => {
      const data = doc.data();
      teamIdMap.set(data.codeName, doc.id);
      teamNameMap.set(data.codeName, data.Name);
    });

    const ateam = teamIdMap.get(acodeName);
    if (!ateam) {
      console.log("No such team found for", acodeName);
      return;
    }

    const teamDocRef = doc(firestore, "team", ateam);
    const teamDocSnap = await getDoc(teamDocRef);
    if (!teamDocSnap.exists()) {
      console.log("No such team document!");
      return;
    }

    const teamData = teamDocSnap.data();
    const normalizedAwayList = awayattackListData.map(name => name.trim().toLowerCase());
    const filteredPlayers = Object.entries(teamData.players || {})
      .filter(([playerName]) => !normalizedAwayList.includes(playerName.trim().toLowerCase()))
      .map(([playerName, playerData]) => ({ name: playerName, ...playerData }));

    setFilteredPlayers(filteredPlayers);
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

  const renderRowWithSubstitutes = (attack, substituteMap, visibleContentArray, index) => {
    const generateSubstituteRow = (playerName) => (
      <TableRow hover key={`${playerName}-substitute`}>
        <TableCell>
          <Box sx={{ position: 'relative' }}>
            <IconButton
              onClick={() => handleSwap(playerName)}
              sx={{
                position: 'absolute',
                left: '-15px',
                top: '-10px',
                minWidth: '10px',
                height: '10px',
                width: '1px',
                borderRadius: '50%',
                backgroundColor: 'lightblue',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'darkblue'
                }
              }}
            >
              <SwapHorizIcon fontSize="small" />
            </IconButton>
            (替){playerName}
          </Box>
        </TableCell>
        {Array(8).fill(null).map((_, i) => (
          <TableCell key={i}></TableCell>
        ))}
      </TableRow>
    );

    const mainRow = (
      <TableRow hover key={index}>
        <TableCell>
          <Box sx={{ position: 'relative' }}>
            <IconButton
              onClick={() => handleSwap(attack)}
              sx={{
                position: 'absolute',
                left: '-15px',
                top: '-10px',
                minWidth: '10px',
                height: '10px',
                width: '1px',
                borderRadius: '50%',
                backgroundColor: 'lightblue',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'darkblue'
                }
              }}
            >
              <SwapHorizIcon fontSize="small" />
            </IconButton>
            {attack}
          </Box>
        </TableCell>
        {visibleContentArray.map((content, i) => {
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
        {Array(9 - visibleContentArray.length).fill(null).map((_, i) => (
          <TableCell key={visibleContentArray.length + i}></TableCell>
        ))}
      </TableRow>
    );

    const substituteRows = [];
    let currentPlayer = attack;

    while (substituteMap[currentPlayer]) {
      const substitutePlayer = substituteMap[currentPlayer];
      substituteRows.push(generateSubstituteRow(substitutePlayer));
      currentPlayer = substitutePlayer;
    }

    return (
      <>
        {mainRow}
        {substituteRows}
      </>
    );
  };

  let buttonRow = -1;
  let buttonColumn = -1;

  if (gameDocSnapshot && gameDocSnapshot.data()) {
    const outs = gameDocSnapshot.data().outs || 0;
    buttonColumn = Math.floor(outs / 6) + 1;
    let remainder = lastValidIndex % 9;
    if (remainder === 0) {
      remainder = 9;
    }
    buttonRow = remainder;
    console.log("aaaa:",buttonRow)
  }

  return (
    <Card>
      <ReplacementDialog
        open={open}
        onClose={() => setOpen(false)}
        filteredPlayers={filteredPlayers}
        originalPlayer={selectedPlayerName}
        teamId={teamId}
        acodeName={acodeName}
        timestamp={timestamp}
        onSelectPlayer={handleSelectPlayer}
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
              {awayattackListData.slice(0, 9).map((attack, index) => {
                const orderOppoItems = orderoppo.filter((item) => item.o_p_name === attack);
                const contentArray = new Array(9).fill('');
                orderOppoItems.forEach((orderOppoItem) => {
                  if (orderOppoItem && orderOppoItem.o_inn) {
                    const innContent = orderOppoItem.o_inn;
                    contentArray[innContent - 1] = orderOppoItem.o_content.split(',')[0];
                  }
                });

                const visibleContentArray = contentArray.slice(0, 9);

                return renderRowWithSubstitutes(attack, substituteMap, visibleContentArray, index);
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
  acodeName: PropTypes.string,
  timestamp: PropTypes.string,
};

export default AwayCustomersTable;
