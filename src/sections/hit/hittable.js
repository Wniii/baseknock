import { useCallback } from 'react';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
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

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader
          title="新增打席"
          align="center"
        />
        
        <CardContent>
        <div style={{ display: 'flex', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', width: '50%' }}>
            <Divider style={{ flex: '1', marginRight: '10px' }} />
            <Typography variant="body2">
              目前局勢
            </Typography>
            <Divider style={{ flex: '1', marginLeft: '10px' }} />
          </div>
          <div style={{marginLeft:'20px'}}></div>
          <div style={{ display: 'flex', alignItems: 'center', width: '50%', justifyContent: 'flex-end' }}>
            <Divider style={{ flex: '1', marginRight: '5px' }} />
            <Typography variant="body2">
              擊球落點
            </Typography>
            <Divider style={{ flex: '1', marginLeft: '5px' }} />
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
              <Typography variant="body1" color="white">
                背號 姓名
              </Typography>
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
              <div style={{ marginLeft: '170px' }}>
                <img
                    src='https://media.istockphoto.com/id/1269757192/zh/%E5%90%91%E9%87%8F/%E6%A3%92%E7%90%83%E5%A0%B4%E5%9C%96%E7%A4%BA%E6%A3%92%E7%90%83%E5%A0%B4%E5%90%91%E9%87%8F%E8%A8%AD%E8%A8%88%E7%9A%84%E5%B9%B3%E9%9D%A2%E5%9C%96%E8%A7%A3%E9%A0%82%E8%A6%96%E5%9C%96-web.jpg?s=612x612&w=0&k=20&c=Zt85Kr6EksFKBmYQmgs138zfLRp3eoIzKeQLS2mirLU='
                    width={'400px'}
                    alt='棒球向量圖'
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
        <div style={{ display: 'flex', alignItems: 'center', width: '50%' }}>
          <Divider style={{ flex: '1', marginRight: '10px' }} />
          <Typography variant="body2">
            打擊內容＆打點
          </Typography>
          <Divider style={{ flex: '1', marginLeft: '10px' }} />
        </div>
        <div style={{ display: 'flex', marginLeft: '30px', marginBottom: '10px' , marginTop: '10px'}}>
            <div style={{width: '100px', textAlign: 'center'}}>
                <Button
                    variant='outlined'
                    borderRadius={5}
                    padding={1}
                    color='success'
                >
                    一安
                </Button>
            </div>
            <div style={{width: '100px', textAlign: 'center'}}>
                    <Button
                        variant='outlined'
                        borderRadius={5}
                        padding={1}
                        color='success'
                    >
                        二安
                    </Button>
            </div>
            <div style={{width: '100px', textAlign: 'center'}}>
                    <Button
                        variant='outlined'
                        borderRadius={5}
                        padding={1}
                        color='success'
                    >
                        三安
                    </Button>
            </div>
            <div style={{width: '100px', textAlign: 'center'}}>
                    <Button
                        variant='outlined'
                        borderRadius={5}
                        padding={1}
                        color='success'
                    >
                        全壘打
                    </Button>
            </div>
            <div style={{width: '100px', textAlign: 'center'}}>
                    <Button
                        variant='outlined'
                        borderRadius={5}
                        padding={1}
                    >
                        一分
                    </Button>
            </div>
        </div>
        <div style={{ display: 'flex', marginLeft: '30px', marginBottom: '10px'}}>
            <div style={{width: '100px', textAlign: 'center'}}>
                    <Button
                        variant='outlined'
                        borderRadius={5}
                        padding={1}
                        color='error'
                    >
                        三振
                    </Button>
            </div>
            <div style={{width: '100px', textAlign: 'center'}}>
                    <Button
                        variant='outlined'
                        borderRadius={5}
                        padding={1}
                        color='error'
                    >
                        飛球
                    </Button>
            </div>
            <div style={{width: '100px', textAlign: 'center'}}>
                    <Button
                        variant='outlined'
                        borderRadius={5}
                        padding={1}
                        color='error'
                    >
                        滾地
                    </Button>
            </div>
            <div style={{width: '100px', textAlign: 'center'}}>
                    <Button
                        variant='outlined'
                        borderRadius={5}
                        padding={1}
                        color='error'
                    >
                        失誤
                    </Button>
            </div>
            <div style={{width: '100px', textAlign: 'center'}}>
                    <Button
                        variant='outlined'
                        borderRadius={5}
                        padding={1}
                    >
                        兩分
                    </Button>
            </div>
        </div>
        <div style={{ display: 'flex', marginLeft: '30px', marginBottom: '10px'}}>
        <div style={{width: '100px', textAlign: 'center'}}>
                <Button
                    variant='outlined'
                    borderRadius={5}
                    padding={1}
                    color='error'
                >
                    野選
                </Button>
            </div>
            <div style={{width: '100px', textAlign: 'center'}}>
                <Button
                    variant='outlined'
                    borderRadius={5}
                    padding={1}
                    color='error'
                >
                    雙殺
                </Button>
            </div>
            <div style={{width: '100px', textAlign: 'center'}}></div>
            <div style={{width: '100px', textAlign: 'center'}}>
                <Button
                    variant='outlined'
                    borderRadius={5}
                    padding={1}
                    color='error'
                >
                    違規
                </Button>
            </div>
            <div style={{width: '100px', textAlign: 'center'}}>
                <Button
                    variant='outlined'
                    borderRadius={5}
                    padding={1}
                >
                    三分
                </Button>
            </div>
        </div>
        <div style={{ display: 'flex', marginLeft: '30px', marginBottom: '10px'}}>
        <div style={{width: '100px', textAlign: 'center'}}>
                <Button
                    variant='outlined'
                    borderRadius={5}
                    padding={1}
                    color='info'
                >
                    四壞
                </Button>
            </div>
            <div style={{width: '100px', textAlign: 'center'}}>
                <Button
                    variant='outlined'
                    borderRadius={5}
                    padding={1}
                    color='info'
                >
                    犧牲飛球
                </Button>
            </div>
            <div style={{width: '100px', textAlign: 'center'}}>
                <Button
                    variant='outlined'
                    borderRadius={5}
                    padding={1}
                    color='info'
                >
                    犧牲觸擊
                </Button>
            </div>
            <div style={{width: '100px', textAlign: 'center'}}>
                <Button
                    variant='outlined'
                    borderRadius={5}
                    padding={1}
                    color='inherit'
                >
                    不知道
                </Button>
            </div>
            <div style={{width: '100px', textAlign: 'center'}}>
                <Button
                    variant='outlined'
                    borderRadius={5}
                    padding={1}
                >
                    四分
                </Button>
            </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', width: '50%' }}>
          <Divider style={{ flex: '1', marginRight: '10px' }} />
          <Typography variant="body2">
            壘上情況
          </Typography>
          <Divider style={{ flex: '1', marginLeft: '10px' }} />
        </div>
  
            <div style={{marginLeft: '150px', marginTop: '10px'}}>   
                     
                <FormControlLabel
                  control={<Checkbox defaultChecked={false} />}
                  label="一壘"
                />
              
                  <FormControlLabel
                    control={<Checkbox defaultChecked={false} />}
                    label="二壘"
                  />
                  <FormControlLabel
                    control={<Checkbox />}
                    label="三壘"
                  />
             </div>   

        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained">
            Save
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
