import React, { useState, useRef } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Typography,
  Container
} from '@mui/material';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { firestore, storage } from 'src/pages/firebase';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import { v4 as uuidv4 } from 'uuid';

const position = [
  { value: '', label: '' },
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
  { value: '', label: '' },
  { value: 'LL', label: '左投/左打' },
  { value: 'LR', label: '左投/右打' },
  { value: 'RR', label: '右投/右打' },
  { value: 'RL', label: '右投/左打' }
];

export const TeamManagement = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  // 初始化包含九个空白球员条目的Map
  const initialPlayers = new Map([...Array(1)].map((_, index) => [`${index}`, { PName: '', PNum: '', habit: '', position: '' }]));


  const [values, setValues] = useState({
    Name: '',
    codeName: '',
    introduction: '',
    players: initialPlayers
  });

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };


  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handlePlayerChange = (id, field, event) => {
    const value = event.target.value;
  
    // 如果正在改變'PName'，則直接返回並不更新Map鍵值
    if (field === 'PName') {
      setValues(prevState => ({
        ...prevState,
        players: new Map(prevState.players).set(id, {
          ...prevState.players.get(id),
          [field]: value
        })
      }));
      return;
    }
  
    // 其他字段正常更新
    setValues(prevState => {
      const newPlayers = new Map(prevState.players);
      const playerData = newPlayers.get(id) || {};
      playerData[field] = value;
      newPlayers.set(id, playerData);
      return { ...prevState, players: newPlayers };
    });
  };

  const handlePlayerNameChange = (id, newName) => {
  setValues(prevState => {
    const newPlayers = new Map(prevState.players);
    const playerData = newPlayers.get(id);
    newPlayers.delete(id); // 刪除舊的鍵
    newPlayers.set(newName, playerData); // 使用新名稱作為鍵
    return { ...prevState, players: newPlayers };
  });
};

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Submit started'); // 调试语句
  
    let photoURL = '';
    if (file) {
      try {
        const storageRef = ref(storage, `profileImages/${file.name}`);
        await uploadBytes(storageRef, file);
        photoURL = await getDownloadURL(storageRef);
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('图片上传失败');
        return;
      }
    }
  
    const playersObject = {};
  values.players.forEach((playerData, playerName) => {
    playersObject[playerName] = { ...playerData }; // 使用玩家名稱作為鍵
  });

  // 調試：輸出 players 對象以確認它的內容
  console.log('Players to upload:', playersObject);

  try {
    const playersToSave = {};
  values.players.forEach((playerData, id) => {
    const playerName = playerData.PName.trim();
    if (playerName) {
      playersToSave[playerName] = {
        PNum: playerData.PNum,
        habit: playerData.habit,
        position: playerData.position,
      };
    }
  });


    // 將玩家數據上傳至 Firebase
    const newTeamDocRef = await addDoc(collection(firestore, 'team'), {
      Name: values.Name,
      codeName: values.codeName,
      introduction: values.introduction,
      photo: photoURL,
      players: playersToSave
    });

    // ...後續的處理
  } catch (error) {
    console.error('Error adding team document:', error);
  }
};

  

  const handleAddPlayer = () => {
    setValues(prevState => {
      const newKey = uuidv4();
      const updatedPlayers = new Map(prevState.players);
      updatedPlayers.set(newKey, { PName: '', PNum: '', position: '', habit: '' });
      return {
        ...prevState,
        players: updatedPlayers
      };
    });
  };

  const handleDeletePlayer = (key) => {
    setValues(prevState => {
      const updatedPlayers = new Map(prevState.players);
      updatedPlayers.delete(key);
      return {
        ...prevState,
        players: updatedPlayers
      };
    });
  };
  
  return (
    <div>
      <Container maxWidth="lg" sx={{ my: 4, mx: 'auto' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Box sx={{
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    width: 120,
                    height: 120,
                  }}>
                    {previewUrl && (
                      <Avatar
                        src={previewUrl}
                        sx={{ height: 120, mb: 80, width: 120, md: 2, borderRadius: 0 }}
                      />)
                    }
                  </Box>
                </CardContent>
                <Divider />
                <CardActions>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                  />
                  <Button fullWidth variant="text" onClick={handleButtonClick}>
                    Upload photo
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={8}>
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
                          onChange={(e) => setValues({ ...values, Name: e.target.value })}
                          required
                          value={values.Name}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="球隊代號"
                          name="codeName"
                          onChange={(e) => setValues({ ...values, codeName: e.target.value })}
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
                          onChange={(e) => setValues({ ...values, introduction: e.target.value })}
                          required
                          value={values.introduction}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <div style={{ marginTop: '16px' }}>
            <form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <div style={{ textAlign: 'left', padding: '8px' }}>
                <Typography variant="h6">球員名單</Typography>
              </div>
               <Card sx={{
          backgroundColor: '#d3d3d3',
          padding: '8px',
          height: 'auto',
          width: 'auto',
          margin: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          textAlign: 'center',
        }}>
                <CardContent sx={{ pt: 3 }}>
                  <Box sx={{ m: -1.5 }}>
                  {Array.from(values.players.entries()).map(([index, player]) => (
                       <Grid container key={index} spacing={2} alignItems="center">
                      <Grid item xs={12} md={3}>
                      <TextField
  fullWidth
  label="姓名"
  name="PName"
  value={player.PName || ''}
  onChange={(e) => handlePlayerChange(index, 'PName', e)}
  required
/>

                      </Grid>
                      <Grid item xs={12} md={3}>
                      <TextField
  fullWidth
  label="背號"
  name="PNum"
  onChange={(e) => handlePlayerChange(index, 'PNum', e)} // 传入 'PNum' 作为要更新的字段名称
  required
  value={player.PNum}
/>
                      </Grid>
                      <Grid item xs={12} md={3}>
                      <TextField
  fullWidth
  label="守備位置"
  name="position"
  onChange={(e) => handlePlayerChange(index, 'position', e)} // 传入 'position' 作为要更新的字段名称
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
                      <Grid item xs={12} md={2}>
                      <TextField
  fullWidth
  label="投打習慣"
  name="habit"
  onChange={(e) => handlePlayerChange(index, 'habit', e)} // 传入 'habit' 作为要更新的字段名称
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
                      {values.players.size > 9 && (
      <IconButton size="small" onClick={() => handleDeletePlayer(index)}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    )}
                    </Grid>
                    ))}
                  </Box>
                </CardContent>
              </Card>
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <Button onClick={handleAddPlayer} variant="contained">新增</Button>
                <Button type="submit" variant="contained">確認新增</Button>
              </div>
            </form>
          </div>
        </Box>
      </Container>
    </div>
  );
};

export default TeamManagement;
