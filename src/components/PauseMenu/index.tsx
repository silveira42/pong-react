import './styles.css';
import { PauseMenuProps } from './PauseMenuProps';
import React from 'react';
import { GameMode } from 'components/Game/enums/GameMode';

export default function PauseMenu(props: PauseMenuProps) {
	const [playerSpeed, setPlayerSpeed] = React.useState(props.playerSpeed);
	const [ballSpeed, setBallSpeed] = React.useState(props.ballSpeed);
	const [opponentDifficulty, setOpponentDifficulty] = React.useState(
		props.opponentDifficulty
	);
	const [gameMode, setGameMode] = React.useState(props.gameMode);
	const [playerOneKeys, setPlayerOneKeys] = React.useState(props.playerOneKeys);
	const [goalsPerMatch, setGoalsPerMatch] = React.useState(props.goalsPerMatch);

	function handleChooseGoalsPerMatch(e: any) {
		const newGoalsPerMatch = parseInt(e.target.value);
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

	return (
		<div
			className='pause-menu'
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
				<input
					type='number'
					value={goalsPerMatch}
					onChange={e => {
						handleChooseGoalsPerMatch(e);
					}}
				/>
			</div>
		</div>
	);
}
