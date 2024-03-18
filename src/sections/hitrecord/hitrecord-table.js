import React, { useState } from 'react';
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
import { getInitials } from 'src/utils/get-initials';
import SearchIcon from '@mui/icons-material/Search';

export const CustomersTable = (props) => {
  const {
    count = 0,
    items = [],
    selected = []
  } = props;

  const [open, setOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleOpen = (customer) => {
    setSelectedCustomer(customer);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
              {items.map((customer) => {
                const isSelected = selected.includes(customer.id);
                const createdAt = format(customer.createdAt, 'dd/MM/yyyy');

                return (
                  <TableRow hover key={customer.id} selected={isSelected}>
                    <TableCell>
                      <Button size="small" startIcon={<SearchIcon />} onClick={() => handleOpen(customer)}>
                        查看
                      </Button>
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
                      {customer.email}
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
      <CustomerDialog open={open} onClose={handleClose} customer={selectedCustomer} />
    </Card>
  );
};

CustomersTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  selected: PropTypes.array
};

const CustomerDialog = ({ open, onClose, customer }) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
     
      <DialogContent>
        {customer && (
          <>
           <DialogTitle>{customer.name}</DialogTitle>
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
            {/* 其他客戶詳細資訊 */}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>關閉</Button>
      </DialogActions>
    </Dialog>
  );
};

CustomerDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  customer: PropTypes.object
};

export default CustomersTable;
