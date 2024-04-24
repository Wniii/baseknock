import PropTypes from "prop-types";
import { format } from "date-fns";
import {
  Box,
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { Timestamp } from 'firebase/firestore'; // 导入 Timestamp 类型

export const Bdata = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    selectedPlayer, // 接收来自 AccountProfile 组件传递的球员信息
  } = props;

  console.log('Bdata 组件收到的球员信息:', selectedPlayer);

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>比賽日期</TableCell>
                <TableCell>打席</TableCell>
                <TableCell>打數</TableCell>
                <TableCell>安打</TableCell>
                <TableCell>壘打數</TableCell>
                <TableCell>得分</TableCell>
                <TableCell>打點</TableCell>
                <TableCell>一安</TableCell>
                <TableCell>二安</TableCell>
                <TableCell>三安</TableCell>
                <TableCell>全壘打</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {items.map((game) => {
  const isSelected = selected.includes(game.id);
  // 如果游戏对象中没有 date 属性或者 date 是 undefined，则返回一个空字符串
  const formattedDate = game.date ? format(game.date.toDate(), "dd/MM/yyyy") : "";

  return (
    <TableRow hover key={game.id} selected={isSelected}>
      <TableCell>{formattedDate}</TableCell>
      <TableCell>{game.at_bat}</TableCell>
      <TableCell>{game.hits}</TableCell>
      <TableCell>{game.total_bases}</TableCell>
      <TableCell>{game.runs}</TableCell>
      <TableCell>{game.rbi}</TableCell>
      <TableCell>{game.single_hits}</TableCell>
      <TableCell>{game.double_hits}</TableCell>
      <TableCell>{game.triple_hits}</TableCell>
      <TableCell>{game.home_runs}</TableCell>
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

Bdata.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
