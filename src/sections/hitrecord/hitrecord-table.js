import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import SearchIcon from '@mui/icons-material/Search';

import { firestore } from 'src/pages/firebase';
import { doc, getDoc } from "firebase/firestore";

export const HitrecordTable = (props) => {
  const {
    items = [],
    selectedColumns = []
  } = props;

  const [open, setOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playerNames, setPlayerNames] = useState([]);
  const { selectedTeam } = props;

  const handleOpen = (playerName) => {
    setSelectedPlayer(playerName);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchPlayers = async () => {
      if (selectedTeam) {
        const teamDocRef = doc(firestore, "team", selectedTeam);
        const teamDocSnap = await getDoc(teamDocRef);

        if (teamDocSnap.exists()) {
          const teamData = teamDocSnap.data();
          const playerKeys = Object.keys(teamData.players);
          setPlayerNames(playerKeys);
        } else {
          console.log("No such document!");
          setPlayerNames([]);
        }
      }
    };

    fetchPlayers();
  }, [selectedTeam]);

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 2500, overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell size="small" style={{ position: 'sticky', left: 0, zIndex: 1 }}>查看細節</TableCell>
                <TableCell style={{ position: 'sticky', left: 0, zIndex: 1 }}>排名</TableCell>
                <TableCell style={{ position: 'sticky', left: 0, zIndex: 1 }}>球員</TableCell>
                {selectedColumns.map((column) => (
                  <TableCell key={column}>{column}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {playerNames.map((playerName, index) => (
                <TableRow hover key={playerName}>
                  <TableCell>
                    <Button size="small" startIcon={<SearchIcon />} onClick={() => handleOpen(playerName)}>
                      查看
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">{index + 1}</Typography>
                  </TableCell>
                  <TableCell>{playerName}</TableCell>
                  {selectedColumns.map((column) => (
                    <TableCell key={column}>
                      {/* 根据您的数据结构，这里可能需要访问具体的球员信息 */}
                      {/* 示例: playerInfo[column] 或其他 */}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <PlayerDialog open={open} onClose={handleClose} player={selectedPlayer} />
    </Card>
  );
};

HitrecordTable.propTypes = {
  items: PropTypes.array,
  selectedColumns: PropTypes.array
};

const PlayerDialog = ({ open, onClose, player }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{player}</DialogTitle>
      <DialogContent>
        <DialogContentText>
        <img
        src='https://media.istockphoto.com/id/1269757192/zh/%E5%90%91%E9%87%8F/%E6%A3%92%E7%90%83%E5%A0%B4%E5%9C%96%E7%A4%BA%E6%A3%92%E7%90%83%E5%A0%B4%E5%90%91%E9%87%8F%E8%A8%AD%E8%A8%88%E7%9A%84%E5%B9%B3%E9%9D%A2%E5%9C%96%E8%A7%A3%E9%A0%82%E8%A6%96%E5%9C%96-web.jpg?s=612x612&w=0&k=20&c=Zt85Kr6EksFKBmYQmgs138zfLRp3eoIzKeQLS2mirLU='
        width={'250px'}
      />
      <img
        src=' pic.png'
        width={'250px'}
      />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

PlayerDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  player: PropTypes.string // 假设 player 是一个字符串
};

export default HitrecordTable;
