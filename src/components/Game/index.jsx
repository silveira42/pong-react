import React from 'react';
import Board from '../../components/Board';
import './styles.css';
import GameHeader from '../GameHeader';

const boardHeight = parseFloat(visualViewport.height * 0.6);
const boardWidth = parseFloat(visualViewport.width * 0.6);

const paddleHeight = 100;
const paddleWidth = 20;
const ballSize = 20;

const initialBallPosition = {
	x: boardWidth / 2,
	y: boardHeight / 2 - ballSize / 2,
};
const initialBallVelocity = { x: 1, y: 1 };
const initialPlayerPosition = {
	x: paddleWidth * 2,
	y: boardHeight / 2 - paddleHeight / 2,
};
const initialOpponentPosition = {
	x: boardWidth - paddleWidth * 3,
	y: boardHeight / 2 - paddleHeight / 2,
};

const initialPlayerSpeed = 10;
const initialOpponentDifficulty = 2; //1, 2 ou 3.
const initialBallSpeed = 4;

const playerSpeedStep = 1;
const opponentDifficultyStep = 1;
const ballSpeedStep = 0.5;

const initialScore = {
	player: 0,
	opponent: 0,
};

function Game() {
	const [score, setScore] = React.useState(initialScore);
	const [isPaused, setIsPaused] = React.useState(false);
	const [ballSpeed, setBallSpeed] = React.useState(initialBallSpeed);
	const [playerSpeed, setPlayerSpeed] = React.useState(initialPlayerSpeed);
	const [opponentDifficulty, setOpponentDifficulty] = React.useState(
		initialOpponentDifficulty
	);

	function handleChangePause(newState) {
		setIsPaused(newState);
	}

	function handleScoreChange(newScore) {
		setScore(newScore);
	}

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
			playerSpeed >= 15 ? playerSpeed : playerSpeed + playerSpeedStep
		);
	}

	function handlePlayerSpeedDecrease() {
		setPlayerSpeed(
			playerSpeed <= 5 ? playerSpeed : playerSpeed - playerSpeedStep
		);
	}

	function handleOpponentDifficultyIncrease() {
		setOpponentDifficulty(
			opponentDifficulty >= 3
				? opponentDifficulty
				: opponentDifficulty + opponentDifficultyStep
		);
	}

	function handleOpponentDifficultyDecrease() {
		setOpponentDifficulty(
			opponentDifficulty <= 1
				? opponentDifficulty
				: opponentDifficulty - opponentDifficultyStep
		);
	}

	function handleBallSpeedIncrease() {
		setBallSpeed(ballSpeed >= 6 ? ballSpeed : ballSpeed + ballSpeedStep);
	}

	function handleBallSpeedDecrease() {
		setBallSpeed(ballSpeed <= 1 ? ballSpeed : ballSpeed - ballSpeedStep);
	}

	return (
		<div className='game-container'>
			<GameHeader
				score={score}
				playerSpeed={playerSpeed}
				opponentDifficulty={opponentDifficulty}
				ballSpeed={ballSpeed}
				handlePlayerSpeedIncrease={handlePlayerSpeedIncrease}
				handlePlayerSpeedDecrease={handlePlayerSpeedDecrease}
				handleOpponentDifficultyIncrease={handleOpponentDifficultyIncrease}
				handleOpponentDifficultyDecrease={handleOpponentDifficultyDecrease}
				handleBallSpeedIncrease={handleBallSpeedIncrease}
				handleBallSpeedDecrease={handleBallSpeedDecrease}
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
				handleChangePause={handleChangePause}
				handleScoreChange={handleScoreChange}
			/>
		</div>
	);
}

export default Game;
