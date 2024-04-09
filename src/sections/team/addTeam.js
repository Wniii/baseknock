import { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { Typography } from '@mui/material';

const position = [
  {
    value: 'P',
    label: 'P'
  },
  {
    value: 'C',
    label: 'C'
  },
  {
    value: '1B',
    label: '1B'
  },
  {
    value: '2B',
    label: '2B'
  },
  {
    value: '3B',
    label: '3B'
  },
  {
    value: 'SS',
    label: 'SS'
  },
  {
    value: 'LF',
    label: 'LF'
  },
  {
    value: 'CF',
    label: 'CF'
  },
  {
    value: 'RF',
    label: 'RF'
  }
];

const habit = [
  {
    value: 'LL',
    label: '左投/左打'
  },
  {
    value: 'LR',
    label: '左投/右打'
  },
  {
    value: 'RR',
    label: '右投/右打'
  },
  {
    value: 'RL',
    label: '右投/左打'
  }
];

const AddPlayerSx = {
  backgroundColor: '#d3d3d3',
  padding: '8px',
  //borderRadius: '4px',
  height: 'auto',
  width: 'auto',
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start', // 垂直置中
  textAlign: 'center', // 文字水平置中
};








export const AddTeam = () => {
  const [values, setValues] = useState({
    Name: '',
    codeName: '',
    introduction: '',

    players: Array.from({ length: 9 }, (_, index) => ({
      
    }))

  });

  // const handleChange = useCallback(
  //   (event) => {
  //     setValues((prevState) => ({
  //       ...prevState,
  //       [event.target.name]: event.target.value
  //     }));
  //   },
  //   []
  // );

  const handleChange = useCallback(
    (event) => {
      const { name, value } = event.target;
      setValues((prevState) => ({
        ...prevState,
        [name]: value
      }));
    },
    []
  );

  const handlePlayerChange = useCallback(
    (index, event) => {
      const { name, value } = event.target;
      setValues((prevState) => {
        const updatedPlayers = [...prevState.players];
        updatedPlayers[index][name] = value;
        return {
          ...prevState,
          players: updatedPlayers
        };
      });
    },
    []
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      console.log(values); // 这里输出表单数据，包括球员信息
    },
    [values]
  );





  return (
 
<div>
<form autoComplete="off" noValidate onSubmit={handleSubmit}>
  <div style={{ textAlign: 'left', padding: '8px' }}>
    <Typography variant="h6">球員名單</Typography>
  </div>
  <Card sx={AddPlayerSx}>
    <CardContent sx={{ pt: 3 }}>
      <Box sx={{ m: -1.5 }}>
        {values.players.map((player, index) => (
          <Grid key={index} container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="姓名"
                name="PName"
                onChange={(e) => handlePlayerChange(index, e)}
                required
                value={player.PName}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="背號"
                name="PNum"
                onChange={(e) => handlePlayerChange(index, e)}
                required
                value={player.PNum}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="守備位置"
                name="position"
                onChange={(e) => handlePlayerChange(index, e)}
                required
                select
                SelectProps={{ native: true }}
                value={player.position}
              >
                {position.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="投打習慣"
                name="habit"
                onChange={(e) => handlePlayerChange(index, e)}
                required
                select
                SelectProps={{ native: true }}
                value={player.habit}
              >
                {habit.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
          </Grid>
        ))}
      </Box>
    </CardContent>
  </Card>
  {/* <div style={buttonSx}>
    <div>
      <Button size="large" sx={{ mt: 2, mr: 1 }} type="cancel" variant="contained">
        取消
      </Button>
      <Button size="large" sx={{ mt: 2 }} type="submit" variant="contained">
        確認新增
      </Button>
    </div>
  </div> */}
</form>
</div>
);
};