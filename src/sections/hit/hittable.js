import { useCallback, useEffect, useState } from 'react';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { firestore } from '../../pages/firebase';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
  Paper
} from '@mui/material';

export const HitTable = () => {
  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
    },
    []
  );

  useEffect(() => {
    const fetchPlayers = async () => {
      try{
        const playerCollection = collection(firestore, "players");
        const playerSnapshot = await getDocs(playerCollection);
        const playerData = playerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}));
    } catch (error){
       console.error('Error fetching players:', error);
    }};
    fetchPlayers();
  }, []);
  

  // 將新的擊打結果儲存至 Firestore
  const handleCreateHitResult = async (hitResultData) => {
    try {
      const hitResultRef = await addDoc(collection(firestore, "hresult"), hitResultData);
      console.log("Document written with ID: ", hitResultRef.id);
      alert("Hit result created successfully!");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>        
        <CardContent>
        <div style={{ display: 'flex', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Divider style={{ flex: '1', marginRight: '10px' }} />
            <Typography variant="body2">
              目前局勢
            </Typography>
            <Divider style={{ flex: '1', marginLeft: '10px' }} />
          </div>
          
        </div>
        <div>
          <div style={{display: 'flex', alignItems:'center', marginTop: '20px'}}>
            <Paper
              variant='outlined'
              sx={{
                width: 150,
                height: 50, 
                padding: '8px',
                borderRadius: 5,
                bgcolor: 'info.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              {/* {players.length > 0 ? (
              <Typography variant="body1" color="white">
              {players.map(player => (
                <span key={player.id}>{player.p_number} {player.p_name}</span>
              ))}
              </Typography>
               ) : (
                <Typography variant="body1" color="white">
                  Loading...
                </Typography>
              )}*/}
            </Paper>
            <div style={{display: 'flex', alignItems: 'center', marginLeft: '100px'}}>
              <Typography variant='h5'>
                B  
              </Typography>
              <div style={{marginLeft: '22px'}}>
              <FormControlLabel
                control={<Checkbox defaultChecked={false} />} // 將 checked 改為 defaultChecked
                label=""
              />  
              </div>
              <div style={{marginLeft: '5px'}}>
                <FormControlLabel
                    control={<Checkbox defaultChecked={false} />}
                    label=""
                  />  
              </div>
              <div style={{marginLeft: '5px'}}>
                <FormControlLabel
                    control={<Checkbox defaultChecked={false} />}
                    label=""
                  />  
              </div>
              
            </div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', marginTop: '30px', marginLeft: '250px'}}>
              <Typography variant='h5'>
                S  
              </Typography>
              <div style={{marginLeft: '22px'}}>
                <FormControlLabel
                    control={<Checkbox defaultChecked={false} />}
                    label=""
                  />  
              </div>
              <div style={{marginLeft: '5px'}}>
                <FormControlLabel
                    control={<Checkbox defaultChecked={false} />}
                    label=""
                  />  
              </div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', marginTop: '40px', marginLeft: '250px'}}>
              <Typography variant='h5'>
                O  
              </Typography>
              <div style={{marginLeft: '18px'}}>
                <FormControlLabel
                    control={<Checkbox defaultChecked={false} />}
                    label=""
                  />  
              </div>
              <div style={{marginLeft: '5px'}}>
                <FormControlLabel
                    control={<Checkbox defaultChecked={false} />}
                    label=""
                  />  
              </div>
            </div>
          <div style={{ display: 'flex', alignItems: 'center',marginTop: '40px', marginLeft: '20px' }}>
            <Typography variant='body1'>
              1
            </Typography>
            <ArrowDropUpIcon />
            <Typography variant='body1'>
              輪到第＿棒
            </Typography>
          </div>
          <div style={{ display: 'flex', alignItems: 'center',marginTop: '20px', marginLeft: '20px' }}>
            <Typography variant='body1'>
              P:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;pitches
            </Typography>
          </div>
        </div>
        </CardContent>
      </Card>
    </form>
  );
};
