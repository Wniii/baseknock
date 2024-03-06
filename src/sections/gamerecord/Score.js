import { format } from 'date-fns';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  SvgIcon,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { SeverityPill } from 'src/components/severity-pill';

const statusMap = {
  pending: 'warning',
  delivered: 'success',
  refunded: 'error'
};

export const Score = (props) => {
  const { orders = [], sx } = props;

  return (
    <Card sx={sx}>
      <Scrollbar sx={{ flexGrow: 1 }}>
        <Box sx={{ minWidth: 1000 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  隊伍
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
                <TableCell></TableCell>
                <TableCell>
                  R
                </TableCell>
                <TableCell>
                  H
                </TableCell>
                <TableCell>
                  E
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
             
                  <TableRow
                    hover
                    
                  >
                    <TableCell>
                      FJU
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
                    <TableCell></TableCell>
                    <TableCell>
                        
                    </TableCell>
                    <TableCell>
                        
                    </TableCell>
                    <TableCell>
                        
                    </TableCell>
                  </TableRow>
                  <TableRow
                    hover
                  >
                    <TableCell>
                      卡皮巴拉
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
                    <TableCell></TableCell>
                    <TableCell>
                        
                    </TableCell>
                    <TableCell>
                        
                    </TableCell>
                    <TableCell>
                        
                    </TableCell>
                  </TableRow>
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <Divider />
    </Card>
  );
};

Score.proptype = {
  orders: PropTypes.array,
  sx: PropTypes.object
};
