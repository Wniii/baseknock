import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Avatar,
  Box,
  Card,
  Stack,
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
import { collection, getDocs } from "firebase/firestore";

export const HitrecordTable = (props) => {
  const {
    count = 0,
    items = [],
    selected = [],
    selectedColumns = [] // 新增選擇的欄位數組
  } = props;

  const [open, setOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playersData, setPlayersData] = useState([]);

  const handleOpen = (player) => {
    setSelectedPlayer(player);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchPlayersData = async () => {
      const playersCollection = collection(firestore, "player");
      const querySnapshot = await getDocs(playersCollection);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      setPlayersData(data);
    };
    fetchPlayersData();
  }, []);

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 2500, overflowX: 'auto' }}> {/* 使用 overflow-x: auto 让表头可以横向滚动 */}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell size="small" style={{ position: 'sticky', left: 0, zIndex: 1 }}>查看細節</TableCell> {/* 使用 position: sticky 让列固定 */}
                <TableCell style={{ position: 'sticky', left: 0, zIndex: 1 }}>排名</TableCell>
                <TableCell style={{ position: 'sticky', left: 0, zIndex: 1 }}>球員</TableCell>
                {selectedColumns.map((column) => (
                  <TableCell key={column}>
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((player, index) => {
                const isSelected = selected.includes(player.id);

                return (
                  <TableRow hover key={player.id} selected={isSelected}>
                    <TableCell>
                      <Button size="small" startIcon={<SearchIcon />} onClick={() => handleOpen(player)}>
                        查看
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {index + 1}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {player.p_name}
                    </TableCell>
                    {selectedColumns.map((column) => (
                      <TableCell key={column}>
                        {player[column]}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <PlayerDialog open={open} onClose={handleClose} player={selectedPlayer} />
    </Card>
  );
};

HitrecordTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  selected: PropTypes.array,
  selectedColumns: PropTypes.array // 新增選擇的欄位數組的 PropTypes 定義
};

const PlayerDialog = ({ open, onClose, player }) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
     
      <DialogContent>
        {player && (
          <>
           <DialogTitle>{player.p_name}</DialogTitle>
            <DialogContentText>
            <img
        src='https://media.istockphoto.com/id/1269757192/zh/%E5%90%91%E9%87%8F/%E6%A3%92%E7%90%83%E5%A0%B4%E5%9C%96%E7%A4%BA%E6%A3%92%E7%90%83%E5%A0%B4%E5%90%91%E9%87%8F%E8%A8%AD%E8%A8%88%E7%9A%84%E5%B9%B3%E9%9D%A2%E5%9C%96%E8%A7%A3%E9%A0%82%E8%A6%96%E5%9C%96-web.jpg?s=612x612&w=0&k=20&c=Zt85Kr6EksFKBmYQmgs138zfLRp3eoIzKeQLS2mirLU='
        width={'250px'}
      />
      <img
        src='https://media.istockphoto.com/id/1269757192/zh/%E5%90%91%E9%87%8F/%E6%A3%92%E7%90%83%E5%A0%B4%E5%9C%96%E7%A4%BA%E6%A3%92%E7%90%83%E5%A0%B4%E5%90%91%E9%87%8F%E8%A8%AD%E8%A8%88%E7%9A%84%E5%B9%B3%E9%9D%A2%E5%9C%96%E8%A7%A3%E9%A0%82%E8%A6%96%E5%9C%96-web.jpg?s=612x612&w=0&k=20&c=Zt85Kr6EksFKBmYQmgs138zfLRp3eoIzKeQLS2mirLU='
        width={'250px'}
      />
            </DialogContentText>
            {/* 其他球員詳細資訊 */}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>關閉</Button>
      </DialogActions>
    </Dialog>
  );
};


PlayerDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  player: PropTypes.object
};

export default HitrecordTable;
