import { formatDistanceToNow } from 'date-fns';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import EllipsisVerticalIcon from '@heroicons/react/24/solid/EllipsisVerticalIcon';

import {
  Box,
  Card,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  SvgIcon
} from '@mui/material';

export const AttackPlayerPage = (props) => {
  const { players = [], sx } = props;
  console.log(players);
  // Limit to the first 5 players
  const visiblePlayers = players;
  

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', ...sx }}>
      <CardHeader title="先發球員" />
      <List sx={{ flex: 1, overflowY: 'auto' }}>
        {visiblePlayers.map((player, index) => {
          const hasDivider = index < visiblePlayers.length - 1;
          const ago = formatDistanceToNow(player.updatedAt);
          const playerNumber = index + 1;

          return (
            <ListItem
              divider={hasDivider}
              key={player.id}
            >
              <ListItemAvatar>
                {player.image ? (
                  <Box
                    component="img"
                    src={player.image}
                    sx={{
                      borderRadius: 1,
                      height: 48,
                      width: 48
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      borderRadius: 1,
                      backgroundColor: 'neutral.200',
                      height: 48,
                      width: 48
                    }}
                  />
                )}
              </ListItemAvatar>
              <ListItemText
                primary={`${playerNumber}. ${player.name}`}
                primaryTypographyProps={{ variant: 'subtitle1' }}
                secondary={`Updated ${ago} ago`}
                secondaryTypographyProps={{ variant: 'body2' }}
              />
              <IconButton edge="end">
                <SvgIcon>
                  <EllipsisVerticalIcon />
                </SvgIcon>
              </IconButton>
            </ListItem>
          );
        })}
      </List>
      <Divider />
    </Card>
  );
};

AttackPlayerPage.propTypes = {
  players: PropTypes.array,
  sx: PropTypes.object
};
