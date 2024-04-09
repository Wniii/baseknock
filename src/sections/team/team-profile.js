import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  TextField,
  Unstable_Grid2 as Grid
} from '@mui/material';




const user = {
  // avatar: '/assets/avatars/avatar-anika-visser.png',
  // city: 'Los Angeles',
  // country: 'USA',
  // jobTitle: 'Senior Developer',
  // name: 'Anika Visser',
  // timezone: 'GTM-7'
};



export const TeamProfile = () => (
  <div>
    <Card>
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Avatar
            src={user.avatar}
            sx={{
              height: 80,
              mb: 7,
              width: 80,
              justifyContent: 'center',
            }}
          />
          <Typography
            gutterBottom
            variant="h5"
          >
            {user.name}
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            {user.city} {user.country}
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            {user.timezone}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button
          fullWidth
          variant="text"
        >
          Upload picture
        </Button>
      </CardActions>
    </Card>
    <br></br>


  </div>
);

