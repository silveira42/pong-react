import React from 'react';
import './styles.css';
import { HeaderProps } from './HeaderProps';

export default function Header(props: HeaderProps) {
	const onOpponentDifficultyIncrease = () => {
		if (props.opponentDifficulty === 3) {
			return;
		}
		props.handleOpponentDifficultyChange(props.opponentDifficulty + 1);
	};

	const onOpponentDifficultyDecrease = () => {
		if (props.opponentDifficulty === 1) {
			return;
		}
		props.handleOpponentDifficultyChange(props.opponentDifficulty - 1);
	};

	return (
		<div
			className='game-header-container'
			style={{ height: props.height, width: props.width }}
		>
			<div className='score-container'>
				<h2 className='score'>
					{props.score.player} - {props.score.opponent}
				</h2>
				<h2>Opponent Mode</h2>
				<button
					className='game-header-button'
					onClick={() => props.handleToggleOpponentMode()}
				>
					{props.opponentMode}
				</button>
			</div>
			<div className='player-paddle-speed'>
				<h2>Player Speed: {props.playerSpeed}</h2>
				<button
					className='game-header-button'
					onClick={() => props.handlePlayerSpeedIncrease()}
				>
					Increase player speed
				</button>
				<button
					className='game-header-button'
					onClick={() => props.handlePlayerSpeedDecrease()}
				>
					Decrease player speed
				</button>
			</div>
			<div className='opponent-difficulty'>
				<h2>Opponent Difficulty: {props.opponentDifficulty}</h2>
				<button
					className={
						props.opponentMode === 'machine'
							? 'game-header-button'
							: 'game-header-button-disabled'
					}
					disabled={props.opponentMode === 'machine' ? false : true}
					onClick={() => onOpponentDifficultyIncrease()}
				>
					Increase difficulty
				</button>
				<button
					className={
						props.opponentMode === 'machine'
							? 'game-header-button'
							: 'game-header-button-disabled'
					}
					disabled={props.opponentMode === 'machine' ? false : true}
					onClick={() => onOpponentDifficultyDecrease()}
				>
					Decrease difficulty
				</button>
			</div>
			<div className='ball-speed'>
				<h2>Ball Speed: {props.ballSpeed}</h2>
				<button
					className='game-header-button'
					onClick={() => props.handleBallSpeedIncrease()}
				>
					Increase Speed
				</button>
				<button
					className='game-header-button'
					onClick={() => props.handleBallSpeedDecrease()}
				>
					Decrease Speed
				</button>
			</div>
		</div>
	);
}
