import { useCallback, useState } from 'react';
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

  TextField,

  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';

export const CompaniesSearch = () => {
 // 使用 useState 钩子来创建状态和更新函数
 const [values, setValues] = useState({
  state: '',
  // 添加其他需要的状态属性
});

  const interval = [
    {
      value: '生涯',
      label: '生涯'
    },
    {
      value: '沒有區間',
      label: '沒有區間'
    }
  ];


  // 定义 handleChange 函数来处理输入框变化
  const handleChange = useCallback((event) => {
    // 使用更新函数来更新状态
    setValues((prevValues) => ({
      ...prevValues,
      [event.target.name]: event.target.value
    }));
  }, []); // 请注意，依赖项是一个空数组，表示这个回调函数不依赖于外部变量

  return (
    
      <Card>
      
      <CardContent sx={{ pt: 2 }}>
      {/* <form onSubmit={handleSubmit}> */}
      
      <Grid container spacing={5}>
      <Grid
        xs={12}
        md={4}
      >
                <TextField
                  fullWidth
                  label="查詢區間"
                  name="interval"
                  onChange={handleChange}
                  select
                  SelectProps={{ 
                    native: true,
                    style: { padding: '7px', margin: '5px 0' }
                   }}
                  value={values.interval}
                  sx={{ marginTop: '10px' }}
                >
                  {interval.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </TextField>
        </Grid>
        </Grid><br></br>
  <Grid container spacing={6}>
    {/* 第一个 Grid 用于显示 Notifications */}
    <Grid item xs={12}>
      <Typography variant="h6">
        比賽性質
      </Typography>
      <Grid container spacing={1}>
        {[
          '季賽',
          '季後賽',
          '盃賽',
          '友誼賽',
        ].map((label, index) => (
          <Grid item xs={4} key={index}>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label={label}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
    
  </Grid>
</CardContent>

        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained">
            Save
          </Button>
        </CardActions>
      </Card>
    // </form>
  );
};
