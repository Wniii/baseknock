import React, { useState, useRef, useCallback } from "react";
import { Box, Card, CardContent, CardHeader, TextField, Grid, Button, Typography } from '@mui/material'; // Import Typography
import { collection, addDoc } from "firebase/firestore";
import { firestore } from "../../pages/firebase";
import { v4 as uuidv4 } from 'uuid';

const position = [
  { value: 'P', label: 'P' },
  { value: 'C', label: 'C' },
  { value: '1B', label: '1B' },
  { value: '2B', label: '2B' },
  { value: '3B', label: '3B' },
  { value: 'SS', label: 'SS' },
  { value: 'LF', label: 'LF' },
  { value: 'CF', label: 'CF' },
  { value: 'RF', label: 'RF' }
];

const habit = [
  { value: 'LL', label: '左投/左打' },
  { value: 'LR', label: '左投/右打' },
  { value: 'RR', label: '右投/右打' },
  { value: 'RL', label: '右投/左打' }
];

const AddPlayerSx = {
  backgroundColor: '#d3d3d3',
  padding: '8px',
  height: 'auto',
  width: 'auto',
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  textAlign: 'center',
};

export const AddTeam = () => {
  const [values, setValues] = useState({
    Name: '',
    codeName: '',
    introduction: '',
    players: Array.from({ length: 2 }, (_, index) => ({
      PName: '',
      PNum: '',
      position: '',
      habit: ''
    }))
  });

  const handlePlayerChange = (index, event) => {
    const { name, value } = event.target;
    setValues((prevState) => {
      const updatedPlayers = [...prevState.players];
      updatedPlayers[index][name] = value;
      return {
        ...prevState,
        players: updatedPlayers
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // 获取团队集合的引用
      const teamCollectionRef = collection(firestore, 'team');
      // 向团队集合添加新文档，Firestore 会生成一个唯一的文档 ID
      const newTeamDocRef = await addDoc(teamCollectionRef, {
        Name: values.Name,
        codeName: values.codeName,
        introduction: values.introduction,
        players: values.players.reduce((acc, player) => {
          acc[player.PName] = {
            PNum: player.PNum,
            position: player.position,
            habit: player.habit
          };
          return acc;
        }, {})
      });
      console.log('Team document added successfully with ID:', newTeamDocRef.id);
      // 清空表单
      setValues({
        Name: '',
        codeName: '',
        introduction: '',
        players: Array.from({ length: 2 }, (_, index) => ({
          PName: '',
          PNum: '',
          position: '',
          habit: ''
        }))
      });
    } catch (error) {
      console.error('Error adding team document:', error);
    }
  };

  return (
    <div>
      <Card sx={{ p: 0 }}>
        <CardHeader />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="球隊名稱"
                  name="name"
                  type="text"
                  onChange={(e) => setValues({...values, Name: e.target.value})}
                  required
                  value={values.Name}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="球隊代號"
                  name="codeName"
                  onChange={(e) => setValues({...values, codeName: e.target.value})}
                  required
                  value={values.codeName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="球隊簡介"
                  name="introduction"
                  type="text"
                  onChange={(e) => setValues({...values, introduction: e.target.value})}
                  required
                  value={values.introduction}
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
      <div style={{  bottom: 90, left: '60%', transform: 'translateX(-40%)', width: '180%', zIndex: 999 }}>
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
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Button type="submit" variant="contained">確認新增</Button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default AddTeam;
