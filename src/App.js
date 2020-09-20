import React, {useEffect, useState} from 'react';
import './App.css';
import {getWeekScores} from "./fantasy";
import styled, {css, keyframes} from 'styled-components';
import {useConfig, useInterval, useReloadOnVersionChange, useUpdatingScores} from "./hooks";
import {BrowserRouter as Router, Route, Switch,} from "react-router-dom";
import {Banner} from "./Banner";
import {LeagueScoresBanner} from "./LeagueScoresBanner";


function App() {
    useReloadOnVersionChange();
    return (
        <Router>
            <Switch>
                <Route exact path='/'>
                    <LeagueScoresBanner/>
                </Route>
            </Switch>
        </Router>
    )
}

export default App;
