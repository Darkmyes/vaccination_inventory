import './App.css';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import RouterComponent from './router';

const theme = createTheme({
  palette: {
    primary: {
      main: '#03a5cf',
    },
    secondary: {
      main: '#ff471b',
    }
  },
});

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={theme}>
        <HashRouter>
          <RouterComponent />
        </HashRouter>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
