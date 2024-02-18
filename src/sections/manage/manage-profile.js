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



const user = {
    // avatar: '/assets/avatars/avatar-anika-visser.png',
    // city: 'Los Angeles',
    // country: 'USA',
    // jobTitle: 'Senior Developer',
    // name: 'Anika Visser',
    // timezone: 'GTM-7'
};



export const ManageProfile = () => (
    <div>
        <Card>
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Grid
                    container
                    spacing={3}
                    
                >
                    <Grid
                        xs={12}
                        md={6}
                        lg={4}
                    >
                        <List>
                            <ListItem>
                                <img src="https://upload.wikimedia.org/wikipedia/zh/thumb/d/da/Fu_Jen_Catholic_University_logo.svg/640px-Fu_Jen_Catholic_University_logo.svg.png" alt="icon" style={{ height: '200px', width: '200px' }} />
                            </ListItem>
                        </List>
                    </Grid>
                </Grid>
                <CardActions>
                    <Button
                        fullWidth
                        variant="text"
                    >
                        Upload picture
                    </Button>
                </CardActions>
            </Box>
        </Card>
        <br></br>


    </div>
);

