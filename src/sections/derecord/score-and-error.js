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
  TextField,
} from "@mui/material";

export const ScoreAndError = () => {
  const handleSubmit = useCallback((event) => {
    event.preventDefault();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="對方得分/我方失誤" title="卡皮巴拉 0:0 FJU" />
        <Divider />
        <CardContent>
          <Grid container spacing={12} wrap="wrap">
            <Grid xs={12} sm={6} md={12}>
              <Stack spacing={1}>
                <Typography variant="h6">卡皮巴拉</Typography>
                <Stack>
                  <div>
                    <TextField
                      label="1"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="2"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="3"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="4"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="5"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="6"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="7"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="8"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="9"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                  </div>
                </Stack>
              </Stack>
              <Stack spacing={1}>
                <Typography variant="h6">失誤</Typography>
                <Stack>
                  <div>
                  <TextField
                      label="1"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="2"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="3"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="4"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="5"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="6"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="7"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="8"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
                    <TextField
                      label="9"
                      id="standard-size-normal"
                      defaultValue="0"
                      size="normal"
                      variant="standard"
                      sx={{ width: "50px" }}
                    />
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
