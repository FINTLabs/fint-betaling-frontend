import React from 'react';
import './App.css';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Scaffold from './common/scaffold/scaffold';
import store from './data/redux/store';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#fff',
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
    return (
        <MuiThemeProvider theme={theme}>
            <Provider store={store}>
                <BrowserRouter basename="/">
                    <Scaffold />
                </BrowserRouter>
            </Provider>
        </MuiThemeProvider>
    );
}

export default App;
