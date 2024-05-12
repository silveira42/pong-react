import React from 'react';
import Board from '../Board';
import './styles.css';
import Header from '../Header';
import { GameSettingsType } from './GameSettingsType';

const gameSettings: GameSettingsType = {
	boardHeight: visualViewport ? visualViewport.height * 0.6 : 700,
	boardWidth: visualViewport ? visualViewport.width * 0.6 : 600,
	headerHeight: visualViewport ? visualViewport.height * 0.25 : 300,
	headerWidth: visualViewport ? visualViewport.width * 0.6 : 600,
	playerSpeed: 10,
	playerSpeedStep: 1,
	ballSpeed: 4,
	ballSpeedStep: 0.5,
	opponentDifficulty: 2,
	opponentDifficultyStep: 1,
	opponentMode: 'machine',
	paddleWidth: 20,
	paddleHeight: 100,
	ballSize: 20,
};

const initialBallPosition = {
	x: gameSettings.boardWidth / 2,
	y: gameSettings.boardHeight / 2 - gameSettings.ballSize / 2,
};
const initialBallVelocity = { x: 1, y: 1 };
const initialPlayerPosition = {
	x: gameSettings.paddleWidth * 2,
	y: gameSettings.boardHeight / 2 - gameSettings.paddleHeight / 2,
};
const initialOpponentPosition = {
	x: gameSettings.boardWidth - gameSettings.paddleWidth * 3,
	y: gameSettings.boardHeight / 2 - gameSettings.paddleHeight / 2,
};

const initialScore = {
	player: 0,
	opponent: 0,
};

function Game() {
	const [boardHeight, setBoardHeight] = React.useState(
		gameSettings.boardHeight
	);
	const [boardWidth, setBoardWidth] = React.useState(gameSettings.boardWidth);
	const [headerHeight, setHeaderHeight] = React.useState(
		gameSettings.headerHeight
	);
	const [headerWidth, setHeaderWidth] = React.useState(
		gameSettings.headerWidth
	);
	const [paddleWidth, setPaddleWidth] = React.useState(
		gameSettings.paddleWidth
	);
	const [paddleHeight, setPaddleHeight] = React.useState(
		gameSettings.paddleHeight
	);
	const [ballSize, setBallSize] = React.useState(gameSettings.ballSize);
	const [score, setScore] = React.useState(initialScore);
	const [isPaused, setIsPaused] = React.useState(false);
	const [ballSpeed, setBallSpeed] = React.useState(gameSettings.ballSpeed);
	const [playerSpeed, setPlayerSpeed] = React.useState(
		gameSettings.playerSpeed
	);
	const [opponentMode, setOpponentMode] = React.useState(
		gameSettings.opponentMode
	);
	const [opponentDifficulty, setOpponentDifficulty] = React.useState(
		gameSettings.opponentDifficulty
	);

	function handleChangePause(newState: boolean) {
		setIsPaused(newState);
	}

	function handleScoreChange(newScore: { player: number; opponent: number }) {
		setScore(newScore);
	}

	// function handlePageSizeChange() {
	// 	setBoardHeight(visualViewport ? visualViewport.height * 0.6 : 700);
	// 	setBoardWidth(visualViewport ? visualViewport.width * 0.6 : 600);
	// 	setHeaderHeight(visualViewport ? visualViewport.height * 0.25 : 300);
	// 	setHeaderWidth(visualViewport ? visualViewport.width * 0.6 : 600);
	// 	setPaddleWidth(20);
	// 	setPaddleHeight(100);
	// 	setBallSize(20);
	// }

	// React.useEffect(() => {
	// 	window.addEventListener('resize', handlePageSizeChange);
	// 	return () => {
	// 		window.removeEventListener('resize', handlePageSizeChange);
	// 	};
	// }, []);

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
				height={boardHeight}
				width={boardWidth}
				paddleWidth={paddleWidth}
				paddleHeight={paddleHeight}
				ballSize={ballSize}
				initialBallPosition={initialBallPosition}
				initialBallVelocity={initialBallVelocity}
				initialPlayerPosition={initialPlayerPosition}
				initialOpponentPosition={initialOpponentPosition}
				score={score}
				isPaused={isPaused}
				ballSpeed={ballSpeed}
				playerSpeed={playerSpeed}
				opponentDifficulty={opponentDifficulty}
				opponentMode={opponentMode}
				handleChangePause={handleChangePause}
				handleScoreChange={handleScoreChange}
			/>
		</div>
	);
}

export default Game;
