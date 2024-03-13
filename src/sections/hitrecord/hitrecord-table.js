import PropTypes from 'prop-types';
import { format } from 'date-fns';

import React, { useState } from 'react';

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
  Typography,

  Button,
  Popover

} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';

import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

export const CustomersTable = (props) => {
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
  
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 2500 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell size="small">
                  查看細節
                </TableCell>
                <TableCell>
                  排名
                </TableCell>
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
              {items.map((customer) => {
                const isSelected = selected.includes(customer.id);
                const createdAt = format(customer.createdAt, 'dd/MM/yyyy');

                return (
                  <TableRow
                    hover
                    key={customer.id}
                    selected={isSelected}
                  >
                    <TableCell>
                      <Button
                        size="small"
                        startIcon={<SearchIcon />}
                        aria-owns={open ? 'popover' : undefined}
                        aria-haspopup="true"
                        onMouseEnter={handlePopoverOpen}
                        onMouseLeave={handlePopoverClose}
                      >
                        查看
                      </Button>
                      <Popover
                        id="popover"
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handlePopoverClose}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'center',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'center',
                        }}
                      >
                        {/* 这里放置您的弹出窗口内容 */}
                        <Typography>弹出窗口内容</Typography>
                      </Popover>
                    </TableCell>
                    <TableCell>
                      1
                    </TableCell>
                    <TableCell>
                    <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                      >
                        <Avatar src={customer.avatar}>
                          {getInitials(customer.name)}
                        </Avatar>
                        <Typography variant="subtitle2">
                          {customer.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {customer.address.city}, {customer.address.state}, {customer.address.country}
                    </TableCell>
                    <TableCell>
                      {customer.phone}
                    </TableCell>
                    <TableCell>
                      {createdAt}
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
