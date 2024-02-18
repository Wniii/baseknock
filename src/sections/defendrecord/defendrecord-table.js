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
