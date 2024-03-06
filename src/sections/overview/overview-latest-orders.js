import { format } from 'date-fns';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { SeverityPill } from 'src/components/severity-pill';

// import React from 'react';

import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { Typography } from '@mui/material';


import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
//import NextLink from 'next/link';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NavigationIcon from '@mui/icons-material/Navigation';

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

import Link from '@mui/material/Link';

const preventDefault = (event) => event.preventDefault();


const style = {
  py: 0,
  width: '100%',
  maxWidth: 360,
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  backgroundColor: 'background.paper',
};




// const statusMap = {
//   pending: 'warning',
//   delivered: 'success',
//   refunded: 'error'
// };




export const OverviewLatestOrders = () => {
  // const { orders = [], sx } = props;

  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  const formattedDate = `${year}/${month}/${day} `;
  // const [date, setDate] = useState(new Date());
  // const handleDateChange = (newDate) => {
  //   setDate(newDate);
  // };

  const todayCardSx = {
    backgroundColor: '#d3d3d3',
    padding: '4px',
    //borderRadius: '4px',
    height: '100px',
    width: 'auto',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', // 垂直置中
    textAlign: 'center', // 文字水平置中
  };
  const contentCardSx = {
    backgroundColor: '#d3d3d3',
    padding: '4px',
    //borderRadius: '4px',
    width: 'auto',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', // 垂直置中
    textAlign: 'center', // 文字水平置中
  };
  const sx = {
    backgroundColor: '#d3d3d3',
    padding: '4px',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', // 垂直置中
    textAlign: 'center', // 文字水平置中
    position: 'relative'
  };
  const addSx = {
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', // 垂直置中
    textAlign: 'right', // 文字水平置中
    ml: 'auto',
    position: 'absolute',
    top: 160,
    right: 30,
  };
  const ytCardSx = {
    backgroundColor: '#d3d3d3',
    padding: '4px',
    //borderRadius: '4px',
    width: 'auto',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', // 垂直置中
    textAlign: 'center', // 文字水平置中
  };

  return (

    <div>
      <div style={{ textAlign: 'center', padding: '8px' }}>
        <Typography variant="h5" fontWeight="bold">{formattedDate}</Typography>
      </div>


      <Card sx={todayCardSx}>
        <List sx={sx}>
          <ListItem>
            <ListItemText primary={<Typography align="center" fontSize={25} variant='h4'>今日尚無比賽</Typography>} />
          </ListItem>
        </List>
        <Box>
          {/* <NextLink href="/add" passHref> */}
          <Fab sx={addSx} align='right' size="small" aria-label="add">
            <AddIcon />
          </Fab>
          {/* </NextLink> */}
        </Box>
      </Card>
      <br></br>

      {/* 日曆
              <div style={{ maxWidth: '400px', margin: 'auto'  }}>
              <Calendar 
                //onChange={handleDateChange}
                value={date}
              />
              </div> */}
      <div style={{ textAlign: 'left', padding: '8px', marginLeft: '25px' }}>
        <Typography variant="h6">coming up...</Typography>
      </div>

      <Card sx={contentCardSx}>
        <List sx={sx}>
          <ListItem>
            <ListItemText primary={
              <div>
                <Typography align="center">10/09(Mon.) 卡皮巴拉v.s輔仁大學</Typography>
              </div>
            } />

          </ListItem>
          <Divider variant="middle" component="li" />
          <ListItem>
            <ListItemText primary={<Typography align="center">10/10(Tue.) 卡皮巴拉v.s輔仁大學</Typography>} />
          </ListItem>
        </List>
      </Card>

      <CardActions sx={{ justifyContent: 'flex-end' }}>
        {/* <Button
          color="inherit"
          endIcon={(
            <SvgIcon fontSize="small">
              <ArrowRightIcon />
            </SvgIcon>
          )}
          size="small"
          variant="text"
        >
          View more
        </Button> */}
        <Box
          sx={{
            typography: 'body1',
            '& > :not(style) ~ :not(style)': {
              ml: 2,
            },
          }}
          onClick={preventDefault}
        >
          <Link href="/schedule" >
            <Button
              color="inherit"
              endIcon={(
                <SvgIcon fontSize="small">
                  <ArrowRightIcon />
                </SvgIcon>
              )}
              size="small"
              variant="text"
            >
              View more
            </Button>
          </Link>

        </Box>
      </CardActions>

      <div style={{ textAlign: 'left', padding: '8px', marginLeft: '25px' }}>
        <Typography variant="h6">YouTube Links</Typography>
      </div>

      <Card sx={ytCardSx}>
        <List sx={sx}>
          <Scrollbar sx={{ flexGrow: 1 }}>
            <ImageList sx={{ height: 450, width: 1150 }} cols={3}>
              <ImageListItem key="Subheader" cols={3}>
              </ImageListItem>
              {itemData.map((item) => (
                <ImageListItem key={item.img} cols={1}>
                  <img
                    srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    src={`${item.img}?w=248&fit=crop&auto=format`}
                    //alt={item.title}
                    loading="lazy"
                    align="center"
                  />
                  <ImageListItemBar
                    title={item.title}
                    // subtitle={<span>by: {item.author}</span>}
                    position="below"
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Scrollbar>
        </List>
      </Card>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          endIcon={(
            <SvgIcon fontSize="small">
              <ArrowRightIcon />
            </SvgIcon>
          )}
          size="small"
          variant="text"
        >
          View more
        </Button>
      </CardActions>
    </div>
  );
};
const itemData = [
  {
    img: 'https://www.japantimes.co.jp/uploads/imported_images/uploads/2023/06/np_file_232569.jpeg',
    title: '230930|練習賽|v.s卡皮巴拉',
    rows: 1,
    cols: 3,
    featured: true,
  },
  {
    img: 'https://media.newyorker.com/photos/650c81455e099cd38ea4d9d3/master/w_2560%2Cc_limit/thomas-shohei%2520ohtani.jpg',
    title: '231002|練習賽|v.s卡皮巴拉',

  },
  {
    img: 'https://i.cbc.ca/1.7050798.1701907110!/fileImage/httpImage/image.JPG_gen/derivatives/16x9_780/ohtani-v-jays.JPG',
    title: '231003|練習賽|v.s卡皮巴拉',
    featured: true,
  },]

// OverviewLatestOrders.prototype = {
//   orders: PropTypes.array,
//   sx: PropTypes.object
// };
