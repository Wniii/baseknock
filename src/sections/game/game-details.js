import { useCallback, useState } from 'react';
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
import { Typography } from '@mui/material';
import * as React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';




const hometeam = [

  {
    value: 'fju',
    label: '輔仁大學'
  },
  {
    value: 'kpbl',
    label: '卡皮巴拉'
  }
];

const awayteam = [
  {
    value: 'fju',
    label: '輔仁大學'
  },
  {
    value: 'kpbl',
    label: '卡皮巴拉'
  }
];

const gName = [
  {
    value: 'friendly',
    label: '友誼賽'
  },
  {
    value: 'ubl',
    label: '大專盃'
  },
  {
    value: 'mei',
    label: '梅花旗'
  }
];
const label = [
  {
    value: 'top8',
    label: '八強賽'
  },
  {
    value: 'top4',
    label: '四強賽'
  },
  {
    value: 'champ',
    label: '冠亞賽'
  },
  {
    value: 'others',
    label: '其他'
  }
];

const AddGameSx = {
  backgroundColor: '#d3d3d3',
  padding: '8px',
  //borderRadius: '4px',
  height: 'auto',
  width: 'auto',
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between', // 垂直置中
  textAlign: 'center', // 文字水平置中
};



const buttonSx = {
  backgroundColor: 'd3d3d3',
  display: 'flex',
  justifyContent: 'center', // 將兩個按鈕水平置中

};



export const AddGame = () => {
  const [values, setValues] = useState({
    GDate: '',
    GTime: '',
    // hometeam: '',
    // awayteam: '',
    // gName: '',
    coach: '',
    recorder: '',
    // label: '',
    remark: '',

  });

  const handleChange = useCallback(
    (event) => {
      setValues((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
    },
    []
  );

  return (
    <div>

      <form
        autoComplete="off"
        noValidate
        onSubmit={handleSubmit}
      >



        <Card sx={AddGameSx}>
          {/* <CardHeader />    */}
          <CardContent sx={{ pt: 3 }}>
            <Box sx={{ m: -1.5 }}>
              <Grid container spacing={2} >

                <Grid item
                  xs={12}
                  md={6}
                >
                  {/* <TextField
                    fullWidth
                    label="比賽日期"
                    name="GDate"
                    onChange={handleChange}
                    required
                    value={values.GDate}
                  /> */}

                    <DatePicker
                    sx={{ width: '100%' }}
                    label="比賽日期"
                    name="GDate"
                    onChange={handleChange}
                    required
                    value={values.GDate} />
                </Grid>

                <Grid item
                  xs={12}
                  md={6}
                >
                  <TimePicker
                    sx={{ width: '100%' }}
                    label="比賽時間"
                    name="GTime"
                    onChange={handleChange}
                    required
                    value={values.GTime}
                  />
                </Grid>



                <Grid item
                  xs={10}
                  md={5}
                  lg={5}
                >
                  <TextField
                    fullWidth
                    label="主隊"
                    name="hometeam"
                    onChange={handleChange}
                    required
                    select
                    SelectProps={{ native: true }}
                    value={values.hometeam}
                  >
                    {hometeam.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                </Grid>


                <Grid
                  container
                  alignItems="center">
                  <Grid item
                    xs={4}
                    md={2}
                    lg={2}>
                    <Typography>v.s</Typography>
                  </Grid>
                </Grid>

                <Grid item
                  xs={10}
                  md={5}
                  lg={5}
                >
                  <TextField
                    fullWidth
                    label="對手"
                    name="awayteam"
                    onChange={handleChange}
                    required
                    select
                    SelectProps={{ native: true }}
                    value={values.awayteam}
                  >
                    {awayteam.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                </Grid>

                <Grid item
                  xs={12}
                  md={12}
                >
                  <TextField
                    fullWidth
                    label="比賽性質"
                    name="gName"
                    onChange={handleChange}
                    required
                    select
                    SelectProps={{ native: true }}
                    value={values.gName}
                  >
                    {gName.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                </Grid>

                <Grid item
                  xs={12}
                  md={6}
                >
                  <TextField
                    fullWidth
                    label="教練"
                    name="coach"
                    onChange={handleChange}
                    //required
                    value={values.GTime}
                  />
                </Grid>
                <Grid item
                  xs={12}
                  md={6}
                >
                  <TextField
                    fullWidth
                    label="紀錄員"
                    name="recorder"
                    onChange={handleChange}
                    //required
                    value={values.GTime}
                  />
                </Grid>

                <Grid item
                  xs={12}
                  md={12}
                >
                  <TextField
                    fullWidth
                    label="標籤"
                    name="label"
                    onChange={handleChange}
                    required
                    select
                    SelectProps={{ native: true }}
                    value={values.label}
                  >
                    {label.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item
                  xs={12}
                  md={12}
                >
                  <TextField
                    fullWidth
                    label="備註"
                    name="remark"
                    onChange={handleChange}
                    //required
                    value={values.remark}

                  />
                </Grid>




              </Grid>



            </Box>
          </CardContent>
        </Card>

        <div style={buttonSx}>
          <div>
            <Button
              //fullWidth
              size="large"
              sx={{ mt: 2, mr: 1 }}
              type="cancel"
              variant="contained"

            >
              取消
            </Button>

            <Button
              //fullWidth
              size="large"
              sx={{ mt: 2 }}
              type="save"
              variant="contained"

            >
              確認新增
            </Button>
          </div>
        </div>

      </form>
    </div>

  );
};
