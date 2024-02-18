import * as React from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';



export const Calendar = () => { 
    
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar />
    </LocalizationProvider>
    
  );
}

// import * as React from 'react';
// import dayjs from 'dayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// export const Calendar = () => {
//   // 获取当前月的第一天和最后一天
//   const firstDayOfMonth = dayjs().startOf('month');
//   const lastDayOfMonth = dayjs().endOf('month');

//   // 填充当前月的所有日期到一个数组中
//   const daysInMonth = [];
//   let currentDay = firstDayOfMonth;
//   while (currentDay <= lastDayOfMonth) {
//     daysInMonth.push(currentDay);
//     currentDay = currentDay.add(1, 'day');
//   }

//   // 将日期分配到每一行中
//   const calendarRows = [];
//   let currentRow = [];
//   daysInMonth.forEach((day, index) => {
//     currentRow.push(day);
//     if ((index + 1) % 7 === 0) {
//       calendarRows.push(currentRow);
//       currentRow = [];
//     }
//   });

//   // 如果最后一行没有填满7天，则补齐剩余的单元格
//   if (currentRow.length > 0) {
//     while (currentRow.length < 7) {
//       currentRow.push(null);
//     }
//     calendarRows.push(currentRow);
//   }

//   // 渲染日历表格
//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//         <thead>
//           <tr>
//             <th>Sun</th>
//             <th>Mon</th>
//             <th>Tue</th>
//             <th>Wed</th>
//             <th>Thu</th>
//             <th>Fri</th>
//             <th>Sat</th>
//           </tr>
//         </thead>
//         <tbody>
//           {calendarRows.map((row, rowIndex) => (
//             <tr key={rowIndex}>
//               {row.map((day, dayIndex) => (
//                 <td key={dayIndex}>{day ? day.date() : ''}</td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </LocalizationProvider>
//   );
// }
