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

export const VsteamSelect = () => {
 // 使用 useState 钩子来创建状态和更新函数
 const [values, setValues] = useState({
  state: '',
  // 添加其他需要的状态属性
});

  const teamA = [
    {
      value: '生涯',
      label: '生涯'
    },
    {
      value: '沒有區間',
      label: '沒有區間'
    }
  ];

  const teamB = [
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
                  label="選擇球隊A"
                  name="teamA"
                  onChange={handleChange}
                  select
                  SelectProps={{ 
                    native: true,
                    style: { padding: '7px', margin: '5px 0' }
                   }}
                  value={values.interval}
                  sx={{ marginTop: '10px' }}
                >
                  {teamA.map((option) => (
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
        xs={12}
        md={4}
      >
                <TextField
                  fullWidth
                  label="選擇球隊B"
                  name="teamB"
                  onChange={handleChange}
                  select
                  SelectProps={{ 
                    native: true,
                    style: { padding: '7px', margin: '5px 0' }
                   }}
                  value={values.sort}
                  sx={{ marginTop: '10px' }}
                >
                  {teamB.map((option) => (
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
    {/* 第二个 Grid 用于显示 Messages */}
    <Grid item xs={12}>
      <Typography variant="h6">
        選示欄位
      </Typography>
      <Grid container spacing={1}>
        {[
          '全選',
          '打席',
          '打數',
          '安打',
          '壘打數',
          '上壘數',
          '得分',
          '打點',
          '一安',
          '二安',
          '三安',
          '全壘打',
          '三振',
          '雙殺',
          '四壞',
          '犧飛',
          '打擊率',
          '上壘率',
          '長打率',
          'OPS',
          '三圍',
          '壘上無人',
          '得圈點',
          '滿壘'
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
