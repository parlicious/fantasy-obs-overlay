import styled, {css, keyframes} from "styled-components";
import React from "react";
import {useConfig, useUpdatingScores} from "./hooks";
import {Banner} from "./Banner";

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
  animation: ${props => props.change > 0 ? improvePulse : worsenPulse} 8s linear 3;
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
  position: relative;
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

const Score = ({actual, projected, change, inPlay}) => {
    return (
        <ScoreContainer change={change}>
            {actual} {" "} {inPlay > 0 && `(${inPlay})`} {" "}
            <ProjectScoreContainer>
                Proj: {projected}
            </ProjectScoreContainer>
        </ScoreContainer>
    )
}

const dropdownAnimation = keyframes`
   0% {
   transform: scaleY(0)
   }
   80% {
     transform: scaleY(1.1)
   }
   100% {
     transform: scaleY(1)
   }
`

const PlayerUpdateContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`

const PlayerUpdateScore = ({score, diff}) => {
    return (
        <span>
            {score} ({diff > 0 ? "+" : ""} {diff})
        </span>
    )
}

const PlayerUpdateTeamName = styled.span`
  font-size: 0.5vw;
`

const PlayerUpdateNameContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const PlayerUpdate = ({playerDelta}) => {
    const {name, score, diff, player, team} = playerDelta
    return (
        <PlayerUpdateContainer
            key={name}>
            <PlayerUpdateNameContainer>
            <span>
                {name}
            </span>
                <PlayerUpdateTeamName>
                    {team}
                </PlayerUpdateTeamName>
            </PlayerUpdateNameContainer>
            <PlayerUpdateScore score={score} diff={diff}/>
        </PlayerUpdateContainer>
    )
}

const DropdownContainer = styled.div`
  position: absolute;
  ${props => props.placement === 'top' ? "top: calc(100% + 0.5em);" : "bottom: calc(100% + 0.5em);"};
  width: calc(100% - 1em + 2px);
  padding: 1em;
  background: rgba(0, 0, 0, .65);
  animation: ${dropdownAnimation} 300ms;
  transform-origin: top center;
  ${props => props.placement === 'top' ? "border-radius:  0 0 1em 1em;" : "border-radius:  1em 1em 0 0;"};
`

function DropDown({deltas, placement}) {
    if (deltas.length > 0) {
        console.log('dropping');
        return (
            <DropdownContainer placement={placement}>
                {deltas.map(d => <PlayerUpdate playerDelta={d}/>)}
            </DropdownContainer>
        )
    } else {
        return null;
    }
}

function GameScore({home, away, deltas, config}) {
    return (
        <GameContainer key={`${home.name}${away.name}`}>
            <NameContainer>
                {home.name}
            </NameContainer>
            <Score
                actual={home.actual}
                projected={home.projected}
                change={home.change}
                inPlay={home.inPlay}
            />
            <NameContainer>
                {away.name}
            </NameContainer>
            <Score
                actual={away.actual}
                projected={away.projected}
                change={away.change}
                inPlay={away.inPlay}
            />
            <DropDown home={home} away={away} deltas={deltas} placement={config.placement}/>
        </GameContainer>
    )
}

export function LeagueScoresBanner() {
    const games = useUpdatingScores();
    const config = useConfig();
    return (
        <div>
            <Banner placement={config?.placement} scrollTime={config.scrollTime}>
                {config.message?.length > 0 ? <h1> {config.message} </h1> : games.map(g => ({...g, config})).map(GameScore)}
            </Banner>
        </div>
    )
}