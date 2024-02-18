import { useCallback, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { ScoreAndError } from "src/sections/derecord/score-and-error";

const states = [
  {
    value: "alabama",
    label: "Alabama",
  },
  {
    value: "new-york",
    label: "New York",
  },
  {
    value: "san-francisco",
    label: "San Francisco",
  },
  {
    value: "los-angeles",
    label: "Los Angeles",
  },
];

export const EditGameForm = () => {
  const [values, setValues] = useState({
    firstName: "Anika",
    lastName: "Visser",
    email: "demo@devias.io",
    phone: "",
    state: "los-angeles",
    country: "USA",
  });

  const handleChange = useCallback((event) => {
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }, []);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
  }, []);

  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="The information can be edited" title="賽後資訊" />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={12}>
                <ScoreAndError />
              </Grid>
              <Grid xs={12} md={6}>
                <FormControl>
                  <FormLabel id="demo-row-radio-buttons-group-label">勝敗</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                  >
                    <FormControlLabel value="win" control={<Radio />} label="勝" />
                    <FormControlLabel value="lose" control={<Radio />} label="敗" />
                    <FormControlLabel value="tie" control={<Radio />} label="平" />
                    <FormControlLabel value="We abstain" control={<Radio />} label="我方棄權" />
                    <FormControlLabel
                      value="Opponent abstains"
                      control={<Radio />}
                      label="對手棄權"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="賽後簡報"
                  name="email"
                  onChange={handleChange}
                  value=""
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="YouTube Video Link"
                  name="phone"
                  onChange={handleChange}
                  value={values.phone}
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <CardHeader subheader="The information can be edited" title="賽前資訊" />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="比賽日期"
                  name="email"
                  onChange={handleChange}
                  value=""
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="比賽時間"
                  name="email"
                  onChange={handleChange}
                  value=""
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="使用隊名"
                  name="email"
                  onChange={handleChange}
                  value=""
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField fullWidth label="對手" name="email" onChange={handleChange} value="" />
              </Grid>
              <Grid xs={12} md={6}>
                <FormControl>
                  <FormLabel id="demo-row-radio-buttons-group-label">比賽性質</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                  >
                    <FormControlLabel value="win" control={<Radio />} label="季賽" />
                    <FormControlLabel value="lose" control={<Radio />} label="季後賽" />
                    <FormControlLabel value="tie" control={<Radio />} label="盃賽" />
                    <FormControlLabel value="We abstain" control={<Radio />} label="友誼賽" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="教練/總管/排歐打的人"
                  name="email"
                  onChange={handleChange}
                  value=""
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField fullWidth label="記錄員" name="email" onChange={handleChange} value="" />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField fullWidth label="標籤" name="email" onChange={handleChange} value="" />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button variant="contained">Save details</Button>
        </CardActions>
      </Card>
    </form>
  );
};
