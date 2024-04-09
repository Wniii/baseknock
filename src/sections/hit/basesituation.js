import { useCallback } from 'react';
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

export const BaseSituation = () => {
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
    </CardContent>
    </Card>      
    </form>
  );
};

export default BaseSituation;