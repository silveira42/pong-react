import React from 'react';
import './styles.css';

export default function GameHeader(props) {
	return (
		<div className='game-header-container'>
			<div className='score'>
				<h2>
					{props.score.player} - {props.score.opponent}
				</h2>
			</div>
			<div className='player-paddle-speed'>
				<h2>Player Speed: {props.playerSpeed}</h2>
				<button onClick={() => props.handlePlayerSpeedIncrease()}>
					Increase player speed
				</button>
				<button onClick={() => props.handlePlayerSpeedDecrease()}>
					Decrease player speed
				</button>
			</div>
			<div className='opponent-difficulty'>
				<h2>Opponent Difficulty: {props.opponentDifficulty}</h2>
				<button onClick={() => props.handleOpponentDifficultyIncrease()}>
					Increase difficulty
				</button>
				<button onClick={() => props.handleOpponentDifficultyDecrease()}>
					Decrease difficulty
				</button>
			</div>
			<div className='ball-speed'>
				<h2>Ball Speed: {props.ballSpeed}</h2>
				<button onClick={() => props.handleBallSpeedIncrease()}>
					Increase Speed
				</button>
				<button onClick={() => props.handleBallSpeedDecrease()}>
					Decrease Speed
				</button>
			</div>
		</div>
	);
}
