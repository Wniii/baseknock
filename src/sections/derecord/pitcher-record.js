import * as React from 'react';
import { useCallback } from "react";
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
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  NativeSelect,
  InputBase,
  Unstable_Grid2 as Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material";

export const PitcherRecord = () => {
  const handleSubmit = useCallback((event) => {
    event.preventDefault();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader title="投手紀錄" />
        <Divider />
        <CardContent>
          <Grid container spacing={12} wrap="wrap">
            <Grid xs={12} sm={6} md={12}>
              <Stack spacing={1}>
                <Stack>
                  <div>
                  <List sx={{ width: '100%', maxWidth: 960, bgcolor: 'background.paper' }}>
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                        </ListItemAvatar>
                        <ListItemText
                        primary="69 茲提  0.0 IP 0 SO 0 BB 0 R"
                        />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                        <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
                        </ListItemAvatar>
                        <ListItemText
                        primary="10 加西  0.0 IP 0 SO 0 BB 0 R"
                        />
                    </ListItem>
                    </List>
                    <FormControl sx={{ m: 1 }} variant="standard">
                      <InputLabel htmlFor="demo-customized-select-native">1</InputLabel>
                      <NativeSelect id="demo-customized-select-native">
                        <option aria-label="None" value="0" />
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                      </NativeSelect>
                    </FormControl>
                    <FormControl sx={{ m: 1 }} variant="standard">
                      <InputLabel htmlFor="demo-customized-select-native">2</InputLabel>
                      <NativeSelect id="demo-customized-select-native">
                        <option aria-label="None" value="0" />
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                      </NativeSelect>
                    </FormControl>
                    <FormControl sx={{ m: 1 }} variant="standard">
                      <InputLabel htmlFor="demo-customized-select-native">3</InputLabel>
                      <NativeSelect id="demo-customized-select-native">
                        <option aria-label="None" value="0" />
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                      </NativeSelect>
                    </FormControl>
                    <FormControl sx={{ m: 1 }} variant="standard">
                      <InputLabel htmlFor="demo-customized-select-native">4</InputLabel>
                      <NativeSelect id="demo-customized-select-native">
                        <option aria-label="None" value="0" />
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                      </NativeSelect>
                    </FormControl>
                    <FormControl sx={{ m: 1 }} variant="standard">
                      <InputLabel htmlFor="demo-customized-select-native">5</InputLabel>
                      <NativeSelect id="demo-customized-select-native">
                        <option aria-label="None" value="0" />
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                      </NativeSelect>
                    </FormControl>
                    <FormControl sx={{ m: 1 }} variant="standard">
                      <InputLabel htmlFor="demo-customized-select-native">6</InputLabel>
                      <NativeSelect id="demo-customized-select-native">
                        <option aria-label="None" value="0" />
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                      </NativeSelect>
                    </FormControl>
                    <FormControl sx={{ m: 1 }} variant="standard">
                      <InputLabel htmlFor="demo-customized-select-native">7</InputLabel>
                      <NativeSelect id="demo-customized-select-native">
                        <option aria-label="None" value="0" />
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                      </NativeSelect>
                    </FormControl>
                    <FormControl sx={{ m: 1 }} variant="standard">
                      <InputLabel htmlFor="demo-customized-select-native">8</InputLabel>
                      <NativeSelect id="demo-customized-select-native">
                        <option aria-label="None" value="0" />
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                      </NativeSelect>
                    </FormControl>
                    <FormControl sx={{ m: 1 }} variant="standard">
                      <InputLabel htmlFor="demo-customized-select-native">9</InputLabel>
                      <NativeSelect id="demo-customized-select-native">
                        <option aria-label="None" value="0" />
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                      </NativeSelect>
                    </FormControl>
                  </div>
                </Stack>
              </Stack>
              <Stack spacing={1}>
                <Stack>
                  <div>
                    <FormControl sx={{ m: 1 }} variant="standard">
                      <InputLabel htmlFor="demo-customized-select-native">1</InputLabel>
                      <NativeSelect id="demo-customized-select-native">
                        <option aria-label="None" value="0" />
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                      </NativeSelect>
                    </FormControl>
                    <FormControl sx={{ m: 1 }} variant="standard">
                      <InputLabel htmlFor="demo-customized-select-native">2</InputLabel>
                      <NativeSelect id="demo-customized-select-native">
                        <option aria-label="None" value="0" />
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                      </NativeSelect>
                    </FormControl>
                    <FormControl sx={{ m: 1 }} variant="standard">
                      <InputLabel htmlFor="demo-customized-select-native">3</InputLabel>
                      <NativeSelect id="demo-customized-select-native">
                        <option aria-label="None" value="0" />
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                      </NativeSelect>
                    </FormControl>
                    <FormControl sx={{ m: 1 }} variant="standard">
                      <InputLabel htmlFor="demo-customized-select-native">4</InputLabel>
                      <NativeSelect id="demo-customized-select-native">
                        <option aria-label="None" value="0" />
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                      </NativeSelect>
                    </FormControl>
                    <FormControl sx={{ m: 1 }} variant="standard">
                      <InputLabel htmlFor="demo-customized-select-native">5</InputLabel>
                      <NativeSelect id="demo-customized-select-native">
                        <option aria-label="None" value="0" />
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                      </NativeSelect>
                    </FormControl>
                    <FormControl sx={{ m: 1 }} variant="standard">
                      <InputLabel htmlFor="demo-customized-select-native">6</InputLabel>
                      <NativeSelect id="demo-customized-select-native">
                        <option aria-label="None" value="0" />
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                      </NativeSelect>
                    </FormControl>
                    <FormControl sx={{ m: 1 }} variant="standard">
                      <InputLabel htmlFor="demo-customized-select-native">7</InputLabel>
                      <NativeSelect id="demo-customized-select-native">
                        <option aria-label="None" value="0" />
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                      </NativeSelect>
                    </FormControl>
                    <FormControl sx={{ m: 1 }} variant="standard">
                      <InputLabel htmlFor="demo-customized-select-native">8</InputLabel>
                      <NativeSelect id="demo-customized-select-native">
                        <option aria-label="None" value="0" />
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                      </NativeSelect>
                    </FormControl>
                    <FormControl sx={{ m: 1 }} variant="standard">
                      <InputLabel htmlFor="demo-customized-select-native">9</InputLabel>
                      <NativeSelect id="demo-customized-select-native">
                        <option aria-label="None" value="0" />
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                      </NativeSelect>
                    </FormControl>
                  </div>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button variant="contained">Save</Button>
        </CardActions>
      </Card>
    </form>
  );
};
