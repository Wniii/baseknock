import PropTypes from 'prop-types';
import { format } from 'date-fns';
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

  const selectedSome = (selected.length > 0) && (selected.length < items.length);
  const selectedAll = (items.length > 0) && (selected.length === items.length);

  return (
    <Card>
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
                          variant='contained'
                          startIcon={<AddIcon />}
                          sx={{ width: '50px', height: '30px', padding: 0 }}
                        >
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
