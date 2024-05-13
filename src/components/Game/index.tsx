import React from 'react';
import Board from '../Board';
import './styles.css';
import Header from '../Header';
import { GameSettingsType } from './GameSettingsType';
import { Difficulty } from './Difficulty';

if (!visualViewport) throw new Error('visualViewport is not supported');

/*
 * Regarding the axis:
 * The short axis is the smallest of the two dimensions.
 * For example, if the screen is in portrait mode, the short axis is the width.
 * The long axis is the main direction of the ball.
 */

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
	gameOrientation:
		visualViewport.height > visualViewport.width ? 'vertical' : 'horizontal',
	playerSpeed: 10,
	playerSpeedStep: 1,
	playerOneUpKey: 'w',
	playerOneDownKey: 's',
	playerTwoUpKey: 'ArrowUp',
	playerTwoDownKey: 'ArrowDown',
	playerOneLeftKey: 'a',
	playerOneRightKey: 'd',
	playerTwoLeftKey: 'ArrowLeft',
	playerTwoRightKey: 'ArrowRight',
	ballSpeed: 4,
	ballSpeedStep: 0.5,
	opponentDifficulty: Difficulty.Medium,
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
	const [gameOrientation, setGameOrientation] = React.useState(
		gameSettings.gameOrientation
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
	const [playerOneLeftKey, setplayerOneLeftKey] = React.useState(
		gameSettings.playerOneLeftKey
	);
	const [playerOneRightKey, setplayerOneRightKey] = React.useState(
		gameSettings.playerOneRightKey
	);
	const [playerTwoLeftKey, setplayerTwoLeftKey] = React.useState(
		gameSettings.playerTwoLeftKey
	);
	const [playerTwoRightKey, setplayerTwoRightKey] = React.useState(
		gameSettings.playerTwoRightKey
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
		setGameOrientation(
			visualViewport.height > visualViewport.width ? 'vertical' : 'horizontal'
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

	function handleOpponentDifficultyChange(newDifficulty: Difficulty) {
		setOpponentDifficulty(newDifficulty);
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
				handleOpponentDifficultyChange={handleOpponentDifficultyChange}
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
				playerOneLeftKey={playerOneLeftKey}
				playerOneRightKey={playerOneRightKey}
				playerTwoLeftKey={playerTwoLeftKey}
				playerTwoRightKey={playerTwoRightKey}
				opponentDifficulty={opponentDifficulty}
				opponentMode={opponentMode}
				gameOrientation={gameOrientation}
				handleChangePause={handleChangePause}
				handleScoreChange={handleScoreChange}
			/>
		</div>
	);
}

export default Game;
