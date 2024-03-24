import { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { firestore } from "src/pages/firebase"; 
import { setDoc, doc, collection } from "firebase/firestore"; 


const hometeam = [
  { value: 'fju', label: '輔仁大學' },
  { value: 'kpbl', label: '卡皮巴拉' }
];

const awayteam = [
  { value: 'fju', label: '輔仁大學' },
  { value: 'kpbl', label: '卡皮巴拉' }
];

const gName = [
  { value: 'friendly', label: '友誼賽' },
  { value: 'ubl', label: '大專盃' },
  { value: 'mei', label: '梅花旗' }
];

const labelOptions = [
  { value: 'top8', label: '八強賽' },
  { value: 'top4', label: '四強賽' },
  { value: 'champ', label: '冠亞賽' },
  { value: 'others', label: '其他' }
];

export const AddGame = () => {
  const [values, setValues] = useState({
    GDate: null,
    GTime: null,
    hometeam: '',
    awayteam: '',
    gName: '',
    coach: '',
    recorder: '',
    label: '',
    remark: '',
  });

  const AddGameSx = {
    backgroundColor: '#d3d3d3',
    padding: '8px',
    height: 'auto',
    width: 'auto',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    textAlign: 'center',
  };

  const handleChange = useCallback((event) => {
    if (event.target && event.target.name) {
      const { name, value } = event.target;
      console.log('Name:', name);
      console.log('Value:', value);
      setValues((prevState) => ({
        ...prevState,
        [name]: value
      }));
    }
  }, []);

  
  const generateRandomId = () => {
    // 生成一個隨機的 g_id
    return Math.random().toString(36).substr(2, 9);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const g_id = generateRandomId(); // 生成隨機的 g_id
      const { GDate, GTime, ...otherValues } = values; // 分离日期和时间
      const hours = new Date(GTime).getHours();
      const minutes = new Date(GTime).getMinutes();
      const seconds = new Date(GTime).getSeconds();
      
      // 格式化为 24 小时制时间字符串
      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
      // 将日期转换为 Firebase 期望的格式（YYYY-MM-DD）
      const formattedDate = new Date(GDate).toLocaleDateString();
  
      // 在 "games" 集合中添加一个新文档，文档 ID 为 g_id
      const docRef = doc(collection(firestore, "games"), g_id);
      await setDoc(docRef, {
        g_id: g_id, // 将 g_id 作为文档的一个字段
        GDate: formattedDate, // 仅存储日期部分
        GTime: formattedTime,
        hometeam: values.hometeam,
        awayteam: values.awayteam,
        gName: values.gName,
        coach: values.coach,
        recorder: values.recorder,
        label: values.label,
        remark: values.remark,
      });
  
      console.log("Document written with ID: ", g_id);
      alert("Game document created successfully!");
    } catch (error) {
      console.error("Error creating game document:", error);
    }
  };
  

  return (
    <div>
      <form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Card>
          <CardContent>
            <Grid container spacing={4}>
            <DatePicker
                      label="比賽日期"
                      name="GDate"
                      onChange={(date) => {
                        const formattedDate = date.toISOString().split('T')[0]; // 格式化为 YYYY-MM-DD
                        console.log('Selected date:', formattedDate);
                        handleChange({ target: { name: 'GDate', value: formattedDate } });
                      }}
                      required
                      value={values.GDate}
                      fullWidth
                    />
                <Grid item xs={12} md={5}>
                  <TimePicker
                    label="比賽時間"
                    name="GTime"
                    onChange={(time) => {
                      console.log('Selected time:', time);
                      handleChange({ target: { name: 'GTime', value: time } });
                    }}
                    required
                    value={values.GTime}
                    fullWidth // 让时间选择器的表单项变长
                  />
                </Grid>
              <Grid item xs={12} md={5}>
                <FormControl fullWidth required>
                  <InputLabel>主隊</InputLabel>
                  <Select
                    value={values.hometeam}
                    onChange={handleChange}
                    name="hometeam"
                  >
                    {hometeam.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2} align="center">
    <Typography variant="body1" component="div" sx={{ paddingTop: '15px' }}>V.S</Typography>
  </Grid>
              <Grid item xs={12} md={5}>
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
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={12}>
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
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={15} md={6}>
                <FormControl fullWidth required>
                  <TextField
                  fullWidth
                  label="教練"
                  name="coach"
                  onChange={handleChange}
                  value={values.coach}
                />
                  
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
              
              <TextField
                  fullWidth
                  label="記錄員"
                  name="recorder"
                  onChange={handleChange}
                  value={values.recorder}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <FormControl fullWidth required>
                  <InputLabel>標籤</InputLabel>
                  <Select
                    value={values.label}
                    onChange={handleChange}
                    name="label"
                  >
                    {labelOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  fullWidth
                  label="備註"
                  name="remark"
                  onChange={handleChange}
                  value={values.remark}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Button type="submit" variant="contained" color="primary">確認新增</Button>
      </form>
    </div>
  );
}
