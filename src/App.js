import React from 'react';
import './App.css';
import {useReloadOnVersionChange} from "./hooks";
import {BrowserRouter as Router, Route, Switch,} from "react-router-dom";
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
