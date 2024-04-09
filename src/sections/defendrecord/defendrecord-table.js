import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';

import React, { useEffect, useState } from 'react';
import { firestore } from 'src/pages/firebase'; // 导入 firestore
import { collection, getDocs } from "firebase/firestore"; // 导入获取文档的方法

export const DefendTable = (props) => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = []
  } = props;

  // const selectedSome = (selected.length > 0) && (selected.length < items.length);
  // const selectedAll = (items.length > 0) && (selected.length === items.length);

  const [open, setOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playersData, setPlayersData] = useState([]); // 用于存储从数据库中获取的球员数据
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
                <TableCell>
                  排名
                </TableCell>
                <TableCell>
                  球員
                </TableCell>
                <TableCell>
                  勝投
                </TableCell>
                <TableCell>
                  敗投
                </TableCell>
                <TableCell>
                  ERA
                </TableCell>
                <TableCell>
                  出賽
                </TableCell>
                <TableCell>
                  先發
                </TableCell>
                <TableCell>
                  局數
                </TableCell>
                <TableCell>
                  安打
                </TableCell>
                <TableCell>
                  失分
                </TableCell>
                <TableCell>
                  球數
                </TableCell>
                <TableCell>
                  四壞
                </TableCell>
                <TableCell>
                  奪三振
                </TableCell>
                <TableCell>
                  WHIP
                </TableCell>
                <TableCell>
                  雙殺
                </TableCell>
                <TableCell>
                  好壞球比
                </TableCell>
                <TableCell>
                  每局耗球比
                </TableCell>
                <TableCell>
                  K/9
                </TableCell>
                <TableCell>
                  BB/9
                </TableCell>
                <TableCell>
                  H/9
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {items.map((player, index) => {
                  const isSelected = selected.includes(player.id);
                return (
                  <TableRow
                    hover
                    key={player.id}
                    selected={isSelected}
                  >
                    <TableCell>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                      >
                        <Typography variant="subtitle2">
                          {index + 1} {/* 替代 player.name */}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                    {player.p_name}
                    </TableCell>
                    <TableCell>
                      
                    </TableCell>
                    <TableCell>
                      
                    </TableCell>
                    <TableCell>
                      
                    </TableCell>
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

DefendTable.propTypes = {
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
