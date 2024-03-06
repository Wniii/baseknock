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

  FormControl,
  InputLabel,
  Select,
  MenuItem,

  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';

export const CompaniesSearch = () => {
 // 使用 useState 钩子来创建状态和更新函数
 const [values, setValues] = useState({
  state: '',
  // 添加其他需要的状态属性
});

 


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
              <FormControl variant="outlined" style={{ minWidth: '150px' }}>
              <InputLabel id="dropdown-label-1">查詢期間</InputLabel>
              <Select
                labelId="dropdown-label-1"
                label="選項1"
                // Add onChange and value props as needed
              >
                {/* Add MenuItem components with options */}
                <MenuItem value={1}>生涯</MenuItem>
                <MenuItem value={2}>沒有區間</MenuItem>
                {/* Add more options as needed */}
              </Select>
            </FormControl>
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
            確認
          </Button>
        </CardActions>
      </Card>
    // </form>
  );
};
