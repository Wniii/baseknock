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
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { firestore, storage } from 'src/pages/firebase';

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
  const [values, setValues] = useState({
    Name: '',
    codeName: '',
    introduction: '',
    players: Array.from({ length: 9 }, (_, index) => ({
      PName: '',
      PNum: '',
      position: '',
      habit: ''
    }))
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
    let photoURL = '';

    if (file) {
      try {
        const storageRef = ref(storage, `profileImages/${file.name}`);
        await uploadBytes(storageRef, file);
        photoURL = await getDownloadURL(storageRef);
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('图片上传失败');
        return; // Stop the submission if the upload fails
      }
    }

    try {
      const teamCollectionRef = collection(firestore, 'team');
      const newTeamDocRef = await addDoc(teamCollectionRef, {
        Name: values.Name,
        codeName: values.codeName,
        introduction: values.introduction,
        photo: photoURL, // Storing the photo URL in the document
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
      setPreviewUrl(null); // Clear the preview after successful upload
      setFile(null); // Clear the file state
    } catch (error) {
      console.error('Error adding team document:', error);
    }
  };

  const handleAddPlayer = () => {
    setValues((prevState) => ({
      ...prevState,
      players: [
        ...prevState.players,
        {
          PName: '',
          PNum: '',
          position: '',
          habit: ''
        }
      ]
    }));
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
                      />
                    )}
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
                <Button onClick={handleAddPlayer} variant="contained">新增球員</Button>
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
