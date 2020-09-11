import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {getEspnFantasyData, getWeekScores, tester} from "./fantasy";
import styled, {css, keyframes} from 'styled-components';
import {useInterval} from "./hooks";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

const ScoreRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0 0;
  justify-content: space-between;
  color: white;
  font-weight: bold;
  font-size: 1vw;
  
  background: rgba(0, 0, 0, .65);
  border-radius: 1em;
`

const GameContainer = styled.div`
  padding: 1em;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 10px;
  grid-row-gap: 10px;
`

const NameContainer = styled.div`
  white-space: nowrap;
`

const ScoreContainer = styled.div`
  text-align: end;
`


function GameScore({home, away}) {
    return (
        <GameContainer>
            <NameContainer>
                {home.name}
            </NameContainer>
            <ScoreContainer>
                {home.score}
            </ScoreContainer>
            <NameContainer>
                {away.name}
            </NameContainer>
            <ScoreContainer>
                {away.score}
            </ScoreContainer>
        </GameContainer>
    )
}

function LeagueScores() {
    const [games, setGames] = useState([]);

    useEffect(() => async () => {
        const games = await getWeekScores();
        setGames(games);
    }, []);

    useInterval(async () => {
        const games = await getWeekScores();
        setGames(games);
    }, 10000);

    return (
        <ScoreRowContainer>
            {games.map(GameScore)}
        </ScoreRowContainer>
    );
}

const translate = keyframes`
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(-150vw, 0);
  }
`

const bannerCss = css`
  animation: ${translate} 30s linear infinite;
  background: rgba(0, 0, 0, .65);
  position: absolute;
  width: 150vw;
  display: grid;
  grid-template-columns: repeat(${props => props.columns}, 1fr);
`

const BannerContainer = styled.div`
  ${bannerCss};
  margin-left: 0;
`

const BannerContainerOffset = styled.div`
  ${bannerCss};
  margin-left: 150vw;
`

function Banner({children}) {
    const numChildren = React.Children.count(children);
    return (
        <div>
            <BannerContainer columns={numChildren}>
                {children}
            </BannerContainer>

            <BannerContainerOffset columns={numChildren}>
                {children}
            </BannerContainerOffset>
        </div>
    )
}

function UpdatesBanner() {
    const [games, setGames] = useState([]);

    useEffect(() => async () => {
        const games = await getWeekScores();
        setGames(games);
    }, []);

    useInterval(async () => {
        const games = await getWeekScores();
        setGames(games);
    }, 10000);

    return (
        <div>
            <Banner>
                {games.map(GameScore)}
            </Banner>
        </div>
    )
}

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path='/'>
                    <LeagueScores/>
                </Route>
                <Route path='/updates'>
                    <UpdatesBanner/>
                </Route>
            </Switch>
        </Router>
    )
}

export default App;
