import React from 'react';
import './App.css';
import Scaffold from "./common/scaffold/scaffold";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";
import {BrowserRouter} from "react-router-dom";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#fff",
            dark: "#666666",
        },
        secondary: {
            main: "#8cc640",
            contrastText: "#fff",
        },
    },
    status: {
        danger: 'orange',
    },
});

function App() {
    return (
        <MuiThemeProvider theme={theme}>
            <BrowserRouter basename='/'>
                <Scaffold/>
            </BrowserRouter>
        </MuiThemeProvider>
    );
}

export default App;
