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
    const basePath = process.env.BASE_PATH || '/';

    return basePath ? (
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <BrowserRouter basename={basePath}>
                    <Scaffold />
                </BrowserRouter>
            </Provider>
        </ThemeProvider>
    ) : (
        <h1>Loading</h1>
    );
}

export default App;
