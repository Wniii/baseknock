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
import BallLandingPoint from './balllandingpoint';

export const HitDetail = () => {
  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
    },
    []
  );

  return (
    <form onSubmit={handleSubmit}>

    <Card>
        <CardContent>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
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
                        全打
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
                    犧飛
                </Button>
            </div>
            <div style={{width: '100px', textAlign: 'center'}}>
                <Button
                    variant='outlined'
                    borderRadius={5}
                    padding={1}
                    color='info'
                >
                    犧觸
                </Button>
            </div>
            <div style={{width: '100px', textAlign: 'center'}}>
                <Button
                    variant='outlined'
                    borderRadius={5}
                    padding={1}
                    color='inherit'
                >
                    不知
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
        </CardContent>
    </Card>
    </form>
  );
};

export default HitDetail;