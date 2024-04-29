import React from 'react';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    Typography,
    TextField,
    Unstable_Grid2 as Grid,
    List,
    ListItem,
    ListItemIcon,
} from '@mui/material';


export const ManageProfile = ({ selectedTeam }) => (
    <div>
      <Card>
        <Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
          <Grid container spacing={3}>
            <Grid xs={12} md={6} lg={4}>
              {selectedTeam ? (
                <img 
                  src={selectedTeam.photo}
                  alt={selectedTeam.name} 
                  style={{ height: '200px', width: '200px' }} 
                />
              ) : (
                <Typography>No team selected</Typography>
              )}
            </Grid>
          </Grid>
          <CardActions>
            <Button fullWidth variant="text">
              Upload picture
            </Button>
          </CardActions>
        </Box>
      </Card>
      <br />
    </div>
  );
  
  export default ManageProfile;
