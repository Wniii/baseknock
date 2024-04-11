import { useCallback, useState,useEffect } from 'react';
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
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

const addSx = {
  backgroundColor: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center', // 垂直置中
  textAlign: 'right', // 文字水平置中
  ml:'auto',
  position:'absolute',
  bottom: 0, // 定位在父元素的底部
  right: 0, // 定位在父元素的右側
  marginRight: '20px', // 可以添加一些額外的右邊距
  marginBottom: '20px', // 可以添加一些額外的下邊距
};





export const ManageProfileDetails = ({ teamInfo }) => {
  const [values, setValues] = useState({
    Name: '',
    codeName: '',
    introduction: ''
  });

  useEffect(() => {
    if (teamInfo) {
      setValues(teamInfo);
    }
  }, [teamInfo]);

  
  
  useEffect(() => {
    console.log('Received teamInfo:', teamInfo); // 打印来查看实际接收到的teamInfo内容
    if (teamInfo) {
      setValues(teamInfo);
    }
  }, [teamInfo]);
  return (
    
    <form>
      <div>
      <Card>
        <CardHeader
          // subheader="The information can be edited"
          // title="Profile"
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid
              container
              spacing={2}
            >
              <Grid
                xs={24}
                md={12}
              >
                 <TextField
                fullWidth
                label="球隊名稱"
                name="Name"
                value={values.Name}
                required
              />
              </Grid>
              <Grid
                xs={24}
                md={12}
              >
                <TextField
                  fullWidth
                  label="球隊代號"
                  name="codeName"
                  value={values.codeName}
                  required
                />
              </Grid>
              <Grid
                xs={24}
                md={12}
              >
                <TextField
                  fullWidth
                  label="球隊簡介"
                  name="introduction"
                  value={values.introduction}

                //   required
                />
              </Grid>
            </Grid>
            
          </Box>
        </CardContent>
        
      </Card>
      
      
                
                
                
  </div>
    </form>
    
  );
};
