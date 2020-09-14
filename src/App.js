import React, {useCallback, useEffect, useRef, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {getEspnFantasyData, getWeekScores, tester} from "./fantasy";
import styled, {css, keyframes} from 'styled-components';
import {useConfig, useInterval, useReloadOnVersionChange, useUpdatingScores} from "./hooks";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import {db} from "./firebase";

const ScoreRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0 0;
  justify-content: space-between;
  color: white;
  font-size: 1vw;
  font-weight: bold;
  
  background: rgba(0, 0, 0, .65);
  border-radius: 1em;
`

const improvePulse = keyframes`
  0% {
    color: #FFFFFF
  }
  50% {
    color: #27ae60
  }
  100% {
    color: #FFFFFF
  }
`

const worsenPulse = keyframes`
  0% {
    color: #FFFFFF
  }
  50% {
    color: #c0392b
  }
  100% {
    color: #FFFFFF
  }
`

const changeAnimation = css`
  animation: ${props => props.change > 0 ? improvePulse : worsenPulse} 4s linear 3;
`

const GameContainer = styled.div`
  margin: 0.5em;
  padding: 0.5em;
  display: grid;
  grid-template-columns: 2fr 3fr;
  grid-column-gap: 10px;
  grid-row-gap: 10px;
  border: 2px white;
  border-style: none none none solid;
  
  font-size: 1vw;
`

const NameContainer = styled.div`
  white-space: nowrap;
`

const ScoreContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  text-align: end;
  vertical-align: center;
  
  ${props => props.change === 0 ? "" : changeAnimation}
`

const ProjectScoreContainer = styled.span`
  font-size: 1vw;
  font-weight: normal;
`

const Score = ({actual, projected, change}) => {
    return (
        <ScoreContainer change={change}>
            {actual} {" "}
            <ProjectScoreContainer>
                Proj: {projected}
            </ProjectScoreContainer>
        </ScoreContainer>
    )
}


function GameScore({home, away}) {
    return (
        <GameContainer key={`${home.name}${away.name}`}>
            <NameContainer>
                {home.name}
            </NameContainer>
            <Score
                actual={home.actual}
                projected={home.projected}
                change={home.change}
            />
            <NameContainer>
                {away.name}
            </NameContainer>
            <Score
                actual={away.actual}
                projected={away.projected}
                change={away.change}
            />
        </GameContainer>
    )
}

function LeagueScores() {
    const [games, setGames] = useState([]);
    const config = useConfig();

    useEffect(() => async () => {
        const games = await getWeekScores();
        setGames(games);
    }, []);

    useInterval(async () => {
        const games = await getWeekScores();
        setGames(games);
    }, config.refreshInterval);

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
  animation: ${translate} 45s linear infinite;
  background: rgba(0, 0, 0, .65);
  position: absolute;
  width: 150vw;
  display: grid;
  font-weight: bold;
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
    const games = useUpdatingScores();

    return (
        <div>
            <Banner>
                {games.map(GameScore)}
            </Banner>
        </div>
    )
}

function Matchups() {

}

function App() {
    useReloadOnVersionChange();
    return (
        <Router>
            <Switch>
                <Route exact path='/'>
                    <LeagueScores/>
                </Route>
                <Route path='/updates'>
                    <UpdatesBanner/>
                </Route>
                <Route path='/matchups'>
                    <UpdatesBanner/>
                </Route>
            </Switch>
        </Router>
    )
}

export default App;
