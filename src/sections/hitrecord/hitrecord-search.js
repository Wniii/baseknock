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

export const HitrecordSearch = ({ onConfirm }) => {
  const [values, setValues] = useState({
    state: '',
  });
 
  const [checkboxStates, setCheckboxStates] = useState([
    { label: '打席', checked: false },
    { label: '打數', checked: false },
    { label: '安打', checked: false },
    { label: '壘打數', checked: false },
    { label: '上壘數', checked: false },
    { label: '得分', checked: false },
    { label: '打點', checked: false },
    { label: '一安', checked: false },
    { label: '二安', checked: false },
    { label: '三安', checked: false },
    { label: '全壘打', checked: false },
    { label: '雙殺', checked: false },
    { label: '四壞', checked: false },
    { label: '犧飛', checked: false },
    { label: '打擊率', checked: false },
    { label: '上壘率', checked: false },
    { label: '長打率', checked: false },
    { label: 'OPS', checked: false },
    { label: '三圍', checked: false },
    { label: '壘上無人', checked: false },
    { label: '得圈點', checked: false },
    { label: '滿壘', checked: false },
  ]);


    const interval = [
      { value: '生涯', label: '生涯' },
      { value: '沒有區間', label: '沒有區間' }
    ];
  
    const sort = [{ value: 'alabama', label: 'Alabama' }];
  
    const recent = [{ value: 'alabama', label: 'Alabama' }];

  const handleChange = useCallback((event) => {
    setValues((prevValues) => ({
      ...prevValues,
      [event.target.name]: event.target.value
    }));
  }, []);

  const handleSelectAllChange = (event) => {
    const isChecked = event.target.checked;
    const updatedCheckboxStates = checkboxStates.map((checkbox) => ({
      ...checkbox,
      checked: isChecked
    }));
    setCheckboxStates(updatedCheckboxStates);
  };

  
  const handleCheckboxChange = (index) => (event) => {
    const { checked } = event.target;
    const updatedCheckboxStates = [...checkboxStates];
    updatedCheckboxStates[index] = { ...updatedCheckboxStates[index], checked };
    setCheckboxStates(updatedCheckboxStates);
  };

  const handleConfirm = () => {
    const selectedColumns = checkboxStates.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.label);
    onConfirm(selectedColumns);
  };
  return (
    <Card>
      <CardContent sx={{ pt: 2 }}>
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="排序"
              name="sort"
              onChange={handleChange}
              select
              SelectProps={{
                native: true,
                style: { padding: '7px', margin: '5px 0' }
              }}
              value={values.sort}
              sx={{ marginTop: '10px' }}
            >
              {sort.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="最近打席"
              name="recent"
              onChange={handleChange}
              select
              SelectProps={{
                native: true,
                style: { padding: '7px', margin: '5px 0' }
              }}
              value={values.recent}
              sx={{ marginTop: '10px' }}
            >
              {recent.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={6}>
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
          <Grid item xs={12}>
            <Typography variant="h6">
              選示欄位
            </Typography>
            <Grid container spacing={1}>
              <FormControlLabel
                control={<Checkbox onChange={handleSelectAllChange} />}
                label="全選"
              />
              {checkboxStates.map((checkbox, index) => (
                <Grid item xs={4} key={index} >
                  <FormControlLabel
                    control={<Checkbox checked={checkbox.checked} onChange={handleCheckboxChange(index)} />}
                    label={checkbox.label}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
      <CardActions>
        <Button onClick={handleConfirm}>確認</Button>
      </CardActions>
    </Card>
  );
};

