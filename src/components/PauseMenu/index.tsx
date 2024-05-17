import './styles.css';
import { PauseMenuProps } from './PauseMenuProps';
import React from 'react';
import { GameMode } from 'pages/Game/enums/GameMode';

export default function PauseMenu(props: PauseMenuProps) {
	const [playerSpeed, setPlayerSpeed] = React.useState(props.playerSpeed);
	const [ballSpeed, setBallSpeed] = React.useState(props.ballSpeed);
	const [opponentDifficulty, setOpponentDifficulty] = React.useState(
		props.opponentDifficulty
	);
	const [gameMode, setGameMode] = React.useState(props.gameMode);
	const [playerOneKeys, setPlayerOneKeys] = React.useState(props.playerOneKeys);
	const [goalsPerMatch, setGoalsPerMatch] = React.useState(props.goalsPerMatch);

	function handleChooseGoalsPerMatch(newGoalsPerMatch: number) {
		setGoalsPerMatch(newGoalsPerMatch);
		props.handleChangeGoalsPerMatch(newGoalsPerMatch);
	}

	function handleChoosePlayerOneKeys(newPlayerOneKeys: string) {
		setPlayerOneKeys(newPlayerOneKeys);
		props.handleChooseKeys(newPlayerOneKeys);
	}

	function handleChooseGameMode(newGameMode: GameMode) {
		setGameMode(newGameMode);
		props.handleChooseGameMode(newGameMode);
	}

	function handleChooseOpponentDifficulty(e: any) {
		const newOpponentDifficulty: number = parseInt(e.target.value);
		setOpponentDifficulty(newOpponentDifficulty);
		props.handleChangeOpponentDifficulty(newOpponentDifficulty);
	}

	function handleChooseBallSpeed(e: any) {
		const newBallSpeed: number = parseInt(e.target.value);
		setBallSpeed(newBallSpeed);
		props.handleChangeBallSpeed(newBallSpeed);
	}

	function handleChoosePlayerSpeed(e: any) {
		const newPlayerSpeed: number = parseInt(e.target.value);
		setPlayerSpeed(newPlayerSpeed);
		props.handleChangePlayerSpeed(newPlayerSpeed);
	}
	console.log('props', props.boardShortAxis);
	return (
		<div
			className='pause-menu-container'
			style={{
				width:
					props.gameOrientation === 'horizontal'
						? props.boardLongAxis
						: props.boardShortAxis,
				height:
					props.gameOrientation === 'vertical'
						? props.boardLongAxis
						: props.boardShortAxis,
			}}
		>
			<button
				className='pause-menu-resume-button'
				onClick={() => {
					props.handleChangePause(false);
				}}
			>
				Resume
			</button>
			<div className='pause-menu'>
				<div className='pause-menu-wrapper'>
					<h3>Player speed</h3>
					<input
						className='pause-menu-input-range'
						type='range'
						min='5'
						max='15'
						value={playerSpeed}
						onChange={e => {
							handleChoosePlayerSpeed(e);
						}}
					/>
				</div>
				<div className='pause-menu-wrapper'>
					<h3>Ball speed</h3>
					<input
						className='pause-menu-input-range'
						type='range'
						min='1'
						max='5'
						value={ballSpeed}
						onChange={e => {
							handleChooseBallSpeed(e);
						}}
					/>
				</div>
				<div className='pause-menu-wrapper'>
					<h3>Machine difficulty</h3>
					<input
						className='pause-menu-input-range'
						type='range'
						min='1'
						max='3'
						value={opponentDifficulty}
						onChange={e => {
							handleChooseOpponentDifficulty(e);
						}}
					/>
				</div>
				<div className='pause-menu-wrapper'>
					<h3>Game mode</h3>
					<div className='pause-menu-selector'>
						<button
							className={`pause-menu-selector-button pause-menu-selector-button-${
								gameMode === GameMode.Infinite ? 'selected' : 'unselected'
							}`}
							onClick={() => handleChooseGameMode(GameMode.Infinite)}
						>
							Infinite
						</button>
						<button
							className={`pause-menu-selector-button pause-menu-selector-button-${
								gameMode === GameMode.Match ? 'selected' : 'unselected'
							}`}
							onClick={() => handleChooseGameMode(GameMode.Match)}
						>
							Matches
						</button>
					</div>
				</div>
				<div className='pause-menu-wrapper'>
					<h3>Player one keys</h3>
					<div className='pause-menu-selector'>
						<button
							className={`pause-menu-selector-button pause-menu-selector-button-${
								playerOneKeys === 'wasd' ? 'selected' : 'unselected'
							}`}
							onClick={() => handleChoosePlayerOneKeys('wasd')}
						>
							WASD
						</button>
						<button
							className={`pause-menu-selector-button pause-menu-selector-button-${
								playerOneKeys === 'arrows' ? 'selected' : 'unselected'
							}`}
							onClick={() => handleChoosePlayerOneKeys('arrows')}
						>
							Arrows
						</button>
					</div>
				</div>
				<div className='pause-menu-wrapper'>
					<h3>Goals per match</h3>
					<div className='pause-menu-number-incrementer'>
						<button
							className={`pause-menu-number-incrementer-button ${
								goalsPerMatch <= 1
									? 'pause-menu-number-incrementer-button-disabled'
									: null
							}`}
							onClick={() => handleChooseGoalsPerMatch(goalsPerMatch - 1)}
						>
							-
						</button>
						<input
							className='pause-menu-number-incrementer-input'
							type='number'
							value={goalsPerMatch}
							min='1'
							max={props.maxGoalsPerMatch}
							onChange={e => {
								handleChooseGoalsPerMatch(parseInt(e.target.value) || 5);
							}}
						/>
						<button
							className={`pause-menu-number-incrementer-button ${
								goalsPerMatch >= props.maxGoalsPerMatch
									? 'pause-menu-number-incrementer-button-disabled'
									: null
							}`}
							onClick={() => handleChooseGoalsPerMatch(goalsPerMatch + 1)}
						>
							+
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
