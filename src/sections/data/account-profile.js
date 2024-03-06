import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography
} from '@mui/material';

const user = {
  avatar: '/assets/avatars/avatar-anika-visser.png',
  city: '位置：中外野手',
  bphabits: '投打習慣：右投右打',
  jobTitle: 'Senior Developer',
  name: '陳文尼',
  heightweight: '身高/體重：168cm/50kg',
  bday: '生日：2003/3/17'
};

export const AccountProfile = () => (
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
            mb: 2,
            width: 80
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
          {user.city}
        </Typography>
        <Typography
          color="text.secondary"
          variant="body2"
        >
          {user.bphabits}
        </Typography>
        <Typography
          color="text.secondary"
          variant="body2"
        >
          {user.heightweight}
        </Typography>
        <Typography
          color="text.secondary"
          variant="body2"
        >
          {user.bday}
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
  
);
