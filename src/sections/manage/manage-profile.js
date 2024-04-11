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


// 现在，ManageProfile 接收一个名为 selectedIcon 的 prop
export const ManageProfile = ({ selectedIcon }) => (
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
                                {/* 动态渲染图标，如果 selectedIcon 存在，则显示 */}
                                <img 
                                    src={selectedIcon || '默认图标的URL'} 
                                    alt="icon" 
                                    style={{ height: '200px', width: '200px' }} 
                                />
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

export default ManageProfile;
