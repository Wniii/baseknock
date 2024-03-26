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

import { firestore } from 'src/pages/firebase'; // 导入 firestore
import { collection, getDocs } from "firebase/firestore"; // 导入获取文档的方法

export const HitrecordTable = (props) => {
  const {
    count = 0,
    items = [],
    selected = []
  } = props;

  const [open, setOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playersData, setPlayersData] = useState([]); // 用于存储从数据库中获取的球员数据


  const handleOpen = (player) => {
    setSelectedPlayer(player);
    setOpen(true);
  };

  const handleClose = () => {0
    setOpen(false);
  };

  

  useEffect(() => {
    // 在组件加载时从数据库中获取球员数据
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
  }, []); // 空依赖项，表示仅在组件加载时运行一次

  

  
  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 2500 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell size="small">查看細節</TableCell>
                <TableCell>排名</TableCell>
                <TableCell>
                  球員
                </TableCell>
                <TableCell>
                  打席
                </TableCell>
                <TableCell>
                  打數
                </TableCell>
                <TableCell>
                  安打
                </TableCell>
                <TableCell>
                  壘打數
                </TableCell>
                <TableCell>
                  壘數
                </TableCell>
                <TableCell>
                  得分
                </TableCell>
                <TableCell>
                  打點
                </TableCell>
                <TableCell>
                  一安
                </TableCell>
                <TableCell>
                  二安
                </TableCell>
                <TableCell>
                  三安
                </TableCell>
                <TableCell>
                  全壘打
                </TableCell>
                <TableCell>
                  三振
                </TableCell>
                <TableCell>
                  雙殺
                </TableCell>
                <TableCell>
                  四壞
                </TableCell>
                <TableCell>
                  犧飛
                </TableCell>
                <TableCell>
                  打擊率
                </TableCell>
                <TableCell>
                  上壘率
                </TableCell>
                <TableCell>
                  長打率
                </TableCell>
                <TableCell>
                  OPS
                </TableCell>
                <TableCell>
                  三圍
                </TableCell>
                <TableCell>
                  壘上無人
                </TableCell>
                <TableCell>
                  得點圈
                </TableCell>
                <TableCell>
                  滿壘
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                {items.map((player, index) => {
                  const isSelected = selected.includes(player.id);
                  // const createdAt = format(player.createdAt, 'dd/MM/yyyy');

                return (
                  <TableRow hover key={player.id} selected={isSelected}>
                    <TableCell>
                      <Button size="small" startIcon={<SearchIcon />} onClick={() => handleOpen(player)}>
                        查看
                      </Button>
                    </TableCell>
                    <TableCell>
                        <Typography variant="subtitle2">
                          {index + 1} {/* 替代 player.name */}
                        </Typography>
                    </TableCell>
                    <TableCell>
                      {player.p_name}
                    </TableCell>
                    <TableCell>
                      {/* {player.address.city}, {player.address.state}, {player.address.country} */}
                    </TableCell>
                    <TableCell>
                      {player.phone}
                    </TableCell>
                    <TableCell>
                      {/* {createdAt} */}
                    </TableCell>

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
  selected: PropTypes.array
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
