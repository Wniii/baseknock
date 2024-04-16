import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { collection, getDocs, doc, getDoc, query } from "firebase/firestore";
import { Avatar, Box, Button, Card, Checkbox, Stack, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';
import AddIcon from '@mui/icons-material/Add';
import { firestore } from '../../pages/firebase';
import { useRouter } from 'next/router';

export const CustomersTable = (props) => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => { },
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = []
  } = props;

  const [attackListData, setAttackListData] = useState([]);
  const [gameID, setGameID] = useState('');

  useEffect(() => {
    const fetchGames = async () => {
      const gamesCollectionRef = collection(firestore, "team", "4DllBDaCXJOxbZRaRPCM", "games");
      const querySnapshot = await getDocs(gamesCollectionRef);
      querySnapshot.forEach((doc) => {
        console.log('gameId', doc.id);
      });

      const gameId = "12221";
      const gameDocRef = doc(gamesCollectionRef, gameId);
      const gameDocSnapshot = await getDoc(gameDocRef);
      if (gameDocSnapshot.exists()) {
        console.log(gameId, " => ", gameDocSnapshot.data());
        setGameID(gameId);
        setAttackListData(gameDocSnapshot.data().attacklist || []);
      } else {
        console.log("No matching document with ID:", gameId);
      }
    };

    fetchGames();
  }, []);


  const router = useRouter();
  const handleClick = (attack) => {
    router.push({
      pathname: '/attackrecord',
      query: { attack: attack }
    });
  };

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>打者</TableCell>
                <TableCell>E</TableCell>
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
              {attackListData.length > 0 ? attackListData.map((attack, index) => (
                <TableRow hover key={index}>
                  <TableCell>{attack}</TableCell>
                  <TableCell />
                  <TableCell align="left"> {/* 將 align 改為 "left" 以達到左對齊 */}
                    <Button
                      variant="outlined"
                      color="inherit"
                      sx={{ height: '30px', padding: 0 }}
                      type="button"
                      onClick={() => handleClick(attack)} // 傳遞該行的 `attack` 數據
                    >
                      <AddIcon />
                    </Button>
                  </TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={11}>No Data Available</TableCell>
                </TableRow>
              )}
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

export default CustomersTable;
