import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import React, { useState, useEffect } from 'react';
import {collection, query, where, getDocs } from "firebase/firestore";
import {
  Avatar,
  Box,
  Button,
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
import AddIcon from '@mui/icons-material/Add';
import { firestore } from '../../pages/firebase';

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

  const [blistData, setBlistData] = useState([]); // 用于存储从数据库中获取的 blist 数据
  const [g_id, setGId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const { query } = router;
    // 从路由参数中获取 g_id
    if (query && query.g_id) {
      setGId(query.g_id);
    }  }, [router.query]);
    console.log(g_id)


  useEffect(() => {
    const fetchBlistData = async () => {
      try {
        if (g_id) {
          const collectionRef = collection(firestore, "blist");
          const q = query(collectionRef, where("g_id", "==", g_id));
          const snapshot = await getDocs(q);
          console.log("Received blist data:", snapshot.docs);
          const fetchedData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setBlistData(fetchedData);
        } else {
          // 如果 g_id 不存在，可能需要採取相應的措施，例如清空 blist 數據
          setBlistData([]);
        }
      } catch (error) {
        console.error("Error fetching blist data:", error);
      }
    };
  
    fetchBlistData();
  }, [g_id]);
  
  const selectedSome = (selected.length > 0) && (selected.length < items.length);
  const selectedAll = (items.length > 0) && (selected.length === items.length);
  const handleClick = () => {
    // 在点击时进行页面导航
    window.location.href = '/attackrecord';
  };

  
  return (
    <Card>
      <div>
          <h2>Game ID: {g_id}</h2>
            <ul>
                {blistData.map(blistItem => (
                    <li key={blistItem.id}>
                        <h3>Blist ID: {blistItem.blist_id}</h3>
                        <p>Home 1: {blistItem.home[0]}</p>
                        <p>Home 2: {blistItem.home[1]}</p>
                        <p>Home 3: {blistItem.home[2]}</p>
                        {/* 继续渲染其他数据项 */}
                    </li>
                ))}
            </ul>
        </div>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={(event) => {
                      if (event.target.checked) {
                        onSelectAll?.();
                      } else {
                        onDeselectAll?.();
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  打者
                </TableCell>
                <TableCell>
                  E
                </TableCell>
                <TableCell>
                  1
                </TableCell>
                <TableCell>
                  2
                </TableCell>
                <TableCell>
                  3
                </TableCell>
                <TableCell>
                  4
                </TableCell>
                <TableCell>
                  5
                </TableCell>
                <TableCell>
                  6
                </TableCell>
                <TableCell>
                  7
                </TableCell>
                <TableCell>
                  8
                </TableCell>
                <TableCell>
                  9
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
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne?.(customer.id);
                          } else {
                            onDeselectOne?.(customer.id);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell style={{ width: '150px' }}>
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
                    <TableCell style={{ width: '50px' }}>
                      <div style={{ display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center',  
                                    height: '100%' 
                                  }}>
                        <Button 
                          variant='outlined'
                          color='inherit'
                          startIcon={<AddIcon />}
                          sx={{ width: '50px', height: '30px', padding: 0 }}
                          type='button'
                          onClick={handleClick}
                        >
                          {/*<Link
                            component={NextLink}
                            href="../pages/attackrecord"
                            underline="hover"
                            variant="subtitle2"
                            sx={{mt:1}}
                          >
                            <AddIcon />
                                </Link>*/}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      
                    </TableCell>
                    <TableCell>
                      
                    </TableCell>
                    <TableCell>
                      
                    </TableCell>
                    <TableCell>
                      
                    </TableCell>
                    <TableCell>
                      
                    </TableCell>
                    <TableCell>
                      
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


