import PropTypes from 'prop-types';
import Head from 'next/head';
import NextLink from 'next/link';
import ArrowLeftIcon from '@heroicons/react/24/solid/ArrowLeftIcon';
import { Box, Button, Card, CardContent, CardHeader, Container, Stack, SvgIcon, Typography, useTheme } from '@mui/material';

const useChartOptions = (labels) => {
  const theme = useTheme();

  return {
    // 保留原本的圖表選項相關配置，用於生成圖片
  };
};

const OverviewTraffic = (props) => {
  const { chartSeries, labels, sx } = props;
  const chartOptions = useChartOptions(labels);

  // 使用相對路徑導入圖片，請確保路徑是正確的
  
  return (
    <>
      <Head>
        <title>Traffic Source | Your Site Title</title>
      </Head>
      <Card sx={sx}>
        <CardHeader title="Traffic Source" />
        <CardContent>
          {/* 使用img標籤顯示圖片 */}
          <img
            src={imagePath}
            alt="Traffic Chart"
            style={{ width: '100%', height: '300px', objectFit: 'contain' }}
          />
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="center"
            spacing={2}
            sx={{ mt: 2 }}
          >
            {chartSeries.map((item, index) => {
              const label = labels[index];

              return (
                <Box
                  key={label}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  {/* 可以在這裡加入額外的元素，比如圖例或其他相關內容 */}
                </Box>
              );
            })}
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};

OverviewTraffic.propTypes = {
  chartSeries: PropTypes.array.isRequired,
  labels: PropTypes.array.isRequired,
  sx: PropTypes.object
};

export default OverviewTraffic;
