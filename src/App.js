import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {getEspnFantasyData, getWeekScores, tester} from "./fantasy";
import styled from 'styled-components';
import {useInterval} from "./hooks";

const ScoreRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 2em 1em;
  justify-content: space-between;
  
  font-weight: bold;
  color: black;
  
  background: rgba(255, 255, 255, .6);
  border-radius: 1em;
`

const GameContainer = styled.div`
  padding: 1em;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 10px;
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

function App() {
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

export default App;
