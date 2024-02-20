import React, { useEffect, useState } from 'react';
import './App.css';
import {
    createTheme,
    ThemeProvider,
} from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import axios from 'axios';
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
    const [basePath, setBasePath] = useState();
    useEffect(() => {
        axios
            .get('betaling/api/application/configuration')
            .then((value) => {
                axios.defaults.baseURL = value.data.basePath;
                setBasePath(value.data.basePath);
            })
            .catch((reason) => {
                // eslint-disable-next-line no-console
                console.log(reason);
                setBasePath('/');
            });
        // eslint-disable-next-line no-console
        console.log('Base path:', basePath);
    }, [basePath]);

    return basePath ? (
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <BrowserRouter basename={basePath}>
                    <Scaffold basename={basePath}/>
                </BrowserRouter>
            </Provider>
        </ThemeProvider>
    ) : (
        <h1>Loading</h1>
    );
}

export default App;
