import React from 'react';
import Board from '../Board';
import './styles.css';
import Header from '../Header';
import { GameSettingsType } from './GameSettingsType';

if (!visualViewport) throw new Error('visualViewport is not supported');

const gameSettings: GameSettingsType = {
	boardShortAxis:
		visualViewport.height > visualViewport.width
			? visualViewport.width * 0.6
			: visualViewport.height * 0.6,
	boardLongAxis:
		visualViewport.height > visualViewport.width
			? visualViewport.height * 0.6
			: visualViewport.width * 0.6,
	headerShortAxis:
		visualViewport.height > visualViewport.width
			? visualViewport.width * 0.25
			: visualViewport.height * 0.25,
	headerLongAxis:
		visualViewport.height > visualViewport.width
			? visualViewport.height * 0.6
			: visualViewport.width * 0.6,
	playerSpeed: 10,
	playerSpeedStep: 1,
	playerOneUpKey: 'w',
	playerOneDownKey: 's',
	playerTwoUpKey: 'ArrowUp',
	playerTwoDownKey: 'ArrowDown',
	ballSpeed: 4,
	ballSpeedStep: 0.5,
	opponentDifficulty: 2,
	opponentDifficultyStep: 1,
	opponentMode: 'machine',
	paddleShortSide: 20,
	paddleLongSide: 100,
	ballSize: 20,
};

const initialScore = {
	player: 0,
	opponent: 0,
};

function Game() {
	// Game settings state
	const [boardShortAxis, setBoardShortAxis] = React.useState(
		gameSettings.boardShortAxis
	);
	const [boardLongAxis, setBoardLongAxis] = React.useState(
		gameSettings.boardLongAxis
	);
	const [headerHeight, setHeaderHeight] = React.useState(
		gameSettings.headerShortAxis
	);
	const [headerWidth, setHeaderWidth] = React.useState(
		gameSettings.headerLongAxis
	);
	const [paddleWidth, setPaddleWidth] = React.useState(
		gameSettings.paddleShortSide
	);
	const [paddleHeight, setPaddleHeight] = React.useState(
		gameSettings.paddleLongSide
	);
	const [ballSize, setBallSize] = React.useState(gameSettings.ballSize);
	const [ballSpeed, setBallSpeed] = React.useState(gameSettings.ballSpeed);
	const [playerSpeed, setPlayerSpeed] = React.useState(
		gameSettings.playerSpeed
	);
	const [playerOneUpKey, setPlayerOneUpKey] = React.useState(
		gameSettings.playerOneUpKey
	);
	const [playerOneDownKey, setPlayerOneDownKey] = React.useState(
		gameSettings.playerOneDownKey
	);
	const [playerTwoUpKey, setPlayerTwoUpKey] = React.useState(
		gameSettings.playerTwoUpKey
	);
	const [playerTwoDownKey, setPlayerTwoDownKey] = React.useState(
		gameSettings.playerTwoDownKey
	);
	const [opponentMode, setOpponentMode] = React.useState(
		gameSettings.opponentMode
	);
	const [opponentDifficulty, setOpponentDifficulty] = React.useState(
		gameSettings.opponentDifficulty
	);

	// Game data state
	const [score, setScore] = React.useState(initialScore);
	const [isPaused, setIsPaused] = React.useState(true);

	React.useEffect(() => {
		window.addEventListener('resize', handlePageSizeChange);
		return () => {
			window.removeEventListener('resize', handlePageSizeChange);
		};
	}, []);

	React.useEffect(() => {
		window.addEventListener(
			'blur',
			function (event) {
				setIsPaused(true);
			},
			false
		);
		return () => {
			window.removeEventListener(
				'blur',
				function (event) {
					setIsPaused(true);
				},
				false
			);
		};
	}, []);

	function handleChangePause(newState: boolean) {
		setIsPaused(newState);
	}

	function handleScoreChange(newScore: { player: number; opponent: number }) {
		setScore(newScore);
	}

	function handlePageSizeChange() {
		if (!visualViewport) return;

		setBoardShortAxis(
			visualViewport.height > visualViewport.width
				? visualViewport.width * 0.6
				: visualViewport.height * 0.6
		);
		setBoardLongAxis(
			visualViewport.height > visualViewport.width
				? visualViewport.height * 0.6
				: visualViewport.width * 0.6
		);
		setHeaderHeight(
			visualViewport.height > visualViewport.width
				? visualViewport.width * 0.25
				: visualViewport.height * 0.25
		);
		setHeaderWidth(
			visualViewport.height > visualViewport.width
				? visualViewport.height * 0.6
				: visualViewport.width * 0.6
		);
		setPaddleWidth(20);
		setPaddleHeight(100);
		setBallSize(20);
	}

	function handlePlayerSpeedIncrease() {
		setPlayerSpeed(
			playerSpeed >= 15
				? playerSpeed
				: playerSpeed + gameSettings.playerSpeedStep
		);
	}

	function handlePlayerSpeedDecrease() {
		setPlayerSpeed(
			playerSpeed <= 5
				? playerSpeed
				: playerSpeed - gameSettings.playerSpeedStep
		);
	}

	function handleOpponentDifficultyIncrease() {
		setOpponentDifficulty(
			opponentDifficulty >= 3
				? opponentDifficulty
				: opponentDifficulty + gameSettings.opponentDifficultyStep
		);
	}

	function handleOpponentDifficultyDecrease() {
		setOpponentDifficulty(
			opponentDifficulty <= 1
				? opponentDifficulty
				: opponentDifficulty - gameSettings.opponentDifficultyStep
		);
	}

	function handleBallSpeedIncrease() {
		setBallSpeed(
			ballSpeed >= 6 ? ballSpeed : ballSpeed + gameSettings.ballSpeedStep
		);
	}

	function handleBallSpeedDecrease() {
		setBallSpeed(
			ballSpeed <= 1 ? ballSpeed : ballSpeed - gameSettings.ballSpeedStep
		);
	}

	function handleToggleOpponentMode() {
		setOpponentMode(opponentMode === 'machine' ? 'player' : 'machine');
	}

	return (
		<div className='game-container'>
			<Header
				score={score}
				playerSpeed={playerSpeed}
				opponentDifficulty={opponentDifficulty}
				ballSpeed={ballSpeed}
				opponentMode={opponentMode}
				height={headerHeight}
				width={headerWidth}
				handlePlayerSpeedIncrease={handlePlayerSpeedIncrease}
				handlePlayerSpeedDecrease={handlePlayerSpeedDecrease}
				handleOpponentDifficultyIncrease={handleOpponentDifficultyIncrease}
				handleOpponentDifficultyDecrease={handleOpponentDifficultyDecrease}
				handleBallSpeedIncrease={handleBallSpeedIncrease}
				handleBallSpeedDecrease={handleBallSpeedDecrease}
				handleToggleOpponentMode={handleToggleOpponentMode}
			/>
			<Board
				shortAxis={boardShortAxis}
				longAxis={boardLongAxis}
				paddleShortSide={paddleWidth}
				paddleLongSide={paddleHeight}
				ballSize={ballSize}
				score={score}
				isPaused={isPaused}
				ballSpeed={ballSpeed}
				playerSpeed={playerSpeed}
				playerOneUpKey={playerOneUpKey}
				playerOneDownKey={playerOneDownKey}
				playerTwoUpKey={playerTwoUpKey}
				playerTwoDownKey={playerTwoDownKey}
				opponentDifficulty={opponentDifficulty}
				opponentMode={opponentMode}
				handleChangePause={handleChangePause}
				handleScoreChange={handleScoreChange}
			/>
		</div>
	);
}

export default Game;
