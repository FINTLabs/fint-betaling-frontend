import React from 'react';
import './App.css';
import {
    createTheme,
    ThemeProvider,
} from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Scaffold from './common/scaffold/scaffold';
import store from './data/redux/store';

const theme = createTheme({
    palette: {
        primary: {
            main: '#8cc640',
            dark: '#666666',
        },
        secondary: {
            main: '#8cc640',
            contrastText: '#fff',
        },
    },
    status: {
        danger: 'orange',
        error: 'red',
    },
    overrides: {
        MuiOutlinedInput: {
            root: {
                '&:hover:not($disabled):not($focused):not($error) $notchedOutline': {
                    borderColor: '#8cc640',
                    // Reset on touch devices, it doesn't add specificity
                    '@media (hover: none)': {
                        borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                },
                '&$focused $notchedOutline': {
                    borderColor: '#8cc640',
                    borderWidth: 1,
                },
            },
        },
        MuiFormLabel: {
            root: {
                '&$focused': {
                    color: '#8cc640',
                },
            },
        },
        MuiInput: {},
    },
});

function App() {
    const BASE_PATH = process.env.BASE_PATH || '/afk';
    // eslint-disable-next-line no-console
    console.log('BASE_PATH', BASE_PATH);

    return (
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <BrowserRouter basename={BASE_PATH}>
                    <Scaffold />
                </BrowserRouter>
            </Provider>
        </ThemeProvider>
    );
}

export default App;
