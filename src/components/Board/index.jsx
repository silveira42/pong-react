import React from 'react';
import './styles.css';
import Ball from '../Ball';
import Paddle from '../Paddle';
import useKeyPress from './useKeyPress'; // Import the hook
import { useKeyPressEvent } from 'react-use';

const height = parseFloat(visualViewport.height * 0.7);
const width = parseFloat(visualViewport.width * 0.7);

const paddleWidth = 20;
const paddleHeight = 100;
const ballSize = 20;
const ballSpeedStep = 0.5;

const initialBallPosition = { x: width / 2, y: height / 2 - ballSize / 2 };

const initialBallVelocity = { x: 1, y: 1 };

const initialPlayerSpeed = 7;
const playerSpeedStep = 1;
const initialOpponentDifficulty = 2; //1, 2 ou 3.
const opponentDifficultyStep = 1;

const initialPlayerPosition = {
	x: paddleWidth,
	y: height / 2 - paddleHeight / 2,
};

const initialOpponentPosition = {
	x: width - paddleWidth * 2,
	y: height / 2 - paddleHeight / 2,
};

const initialScore = {
	player: 0,
	opponent: 0,
};

var AABBIntersect = function (ax, ay, aw, ah, bx, by, bw, bh) {
	return ax < bx + bw && ay < by + bh && bx < ax + aw && by < ay + ah;
};

function Board() {
	const [ballSpeed, setBallSpeed] = React.useState(3);
	const [isPaused, setIsPaused] = React.useState(false);
	const [ballPosition, setBallPosition] = React.useState(initialBallPosition);
	const [ballVelocity, setBallVelocity] = React.useState(initialBallVelocity);
	const [playerSpeed, setPlayerSpeed] = React.useState(initialPlayerSpeed);
	const [opponentDifficulty, setOpponentDifficulty] = React.useState(
		initialOpponentDifficulty
	);
	const [playerPosition, setPlayerPosition] = React.useState(
		initialPlayerPosition
	);
	const [opponentPosition, setOpponentPosition] = React.useState(
		initialOpponentPosition
	);
	const [lastServePlayer, setLastServePlayer] = React.useState(false);
	const [score, setScore] = React.useState(initialScore);

	// game loop function
	const loop = function () {
		updateBoard();

		if (isPaused) {
			window.cancelAnimationFrame(loop);
		}
	};

	useKeyPressEvent('p', () => {
		setIsPaused(!isPaused);
	});

	function updateOpponent() {
		// calculate ideal position
		const destiny = ballPosition.y - (paddleHeight - ballSize) * 0.5;

		let opponentY = opponentPosition.y;
		// ease the movement towards the ideal position
		let opponentSpeed = 0;

		if (opponentDifficulty === 1) {
			opponentSpeed = 0.05;
		}
		if (opponentDifficulty === 2) {
			opponentSpeed = 0.1;
		}
		if (opponentDifficulty === 3) {
			opponentSpeed = 0.2;
		}
		if (opponentDifficulty === 10) {
			opponentSpeed = 1;
		}

		opponentY += (destiny - opponentY) * opponentSpeed;
		// keep the paddle inside of the canvas
		opponentY = Math.max(Math.min(opponentY, height - paddleHeight), 0);

		setOpponentPosition({
			...opponentPosition,
			y: opponentY,
		});
	}

	const arrowUpPressed = useKeyPress('ArrowUp');
	const arrowDownPressed = useKeyPress('ArrowDown');

	function updatePlayer() {
		let playerY = playerPosition.y;

		if (arrowUpPressed) playerY -= playerSpeed;
		if (arrowDownPressed) playerY += playerSpeed;
		// keep the paddle inside of the canvas
		playerY = Math.max(Math.min(playerY, height - paddleHeight), 0);

		setPlayerPosition({
			...playerPosition,
			y: playerY,
		});
	}

	function serve() {
		const ballVelocityCpy = { ...ballVelocity };

		ballVelocityCpy.x = lastServePlayer ? 1 : -1;
		ballVelocityCpy.y = ballSpeed * Math.random();

		setBallPosition(initialBallPosition);
		setBallVelocity(ballVelocityCpy);
		setLastServePlayer(!lastServePlayer);
	}

	function onBallMove() {
		let ballVelocityCpy = { ...ballVelocity };
		let ballPositionCpy = { ...ballPosition };

		// if going to hit top invert y direction
		if (ballPosition.y >= height - ballSize) {
			ballVelocityCpy.y = -Math.abs(ballVelocity.y);
		}
		// if going to hit bottom, invert y direction
		if (ballPosition.y <= 0) {
			ballVelocityCpy.y = Math.abs(ballVelocity.y);
		}

		// if going to hit edge, serve and award point
		if (ballPosition.x > width - ballSize || ballPosition.x <= 0) {
			serve();
			const newScore = { ...score };
			ballPosition.x > width - ballSize
				? newScore.player++
				: newScore.opponent++;
			setScore(newScore);
			return;
		}

		// if going to hit paddle, invert x direction
		if (
			AABBIntersect(
				ballPosition.x,
				ballPosition.y,
				ballSize,
				ballSize,
				playerPosition.x,
				playerPosition.y,
				paddleWidth,
				paddleHeight
			) ||
			AABBIntersect(
				ballPosition.x,
				ballPosition.y,
				ballSize,
				ballSize,
				opponentPosition.x,
				opponentPosition.y,
				paddleWidth,
				paddleHeight
			)
		) {
			const currentPaddle =
				ballVelocity.x < 0 ? { ...playerPosition } : { ...opponentPosition };

			const paddleName = ballVelocity.x < 0 ? 'player' : 'opponent';

			ballPositionCpy.x =
				paddleName === 'player'
					? playerPosition.x + paddleWidth
					: opponentPosition.x - ballSize;

			const pi = Math.PI;

			const n =
				(ballPosition.y + ballSize - currentPaddle.y) /
				(paddleHeight + ballSize);
			const phi = 0.25 * pi * (2 * n - 1); // pi/4 = 45

			// calculate smash value and update velocity
			const smash = Math.abs(phi) > 0.2 * pi ? 1.5 : 1;

			ballVelocityCpy.x =
				smash * (paddleName === 'player' ? 1 : -1) * ballSpeed * Math.cos(phi);
			ballVelocityCpy.y = smash * ballSpeed * Math.sin(phi);
		}

		setBallPosition({
			x: ballPositionCpy.x + ballSpeed * ballVelocityCpy.x,
			y: ballPositionCpy.y + ballSpeed * ballVelocityCpy.y,
		});

		setBallVelocity(ballVelocityCpy);
	}

	function updateBoard() {
		onBallMove();
		updateOpponent();
		updatePlayer();
	}

	if (!isPaused) {
		window.requestAnimationFrame(loop);
	}

	return (
		<div className='board-container'>
			<div className='board-header'>
				<div className='score'>
					<h2>
						{score.player} - {score.opponent}
					</h2>
				</div>
				<div className='player-paddle-speed'>
					<h2>Player Speed: {playerSpeed}</h2>
					<button
						onClick={() =>
							setPlayerSpeed(
								playerSpeed >= 10 ? playerSpeed : playerSpeed + playerSpeedStep
							)
						}
					>
						Increase player speed
					</button>
					<button
						onClick={() =>
							setPlayerSpeed(
								playerSpeed <= 5 ? playerSpeed : playerSpeed - playerSpeedStep
							)
						}
					>
						Decrease player speed
					</button>
				</div>
				<div className='opponent-difficulty'>
					<h2>Opponent Difficulty: {opponentDifficulty}</h2>
					<button
						onClick={() =>
							setOpponentDifficulty(
								opponentDifficulty >= 3
									? opponentDifficulty
									: opponentDifficulty + opponentDifficultyStep
							)
						}
					>
						Increase difficulty
					</button>
					<button
						onClick={() =>
							setOpponentDifficulty(
								opponentDifficulty <= 1
									? opponentDifficulty
									: opponentDifficulty - opponentDifficultyStep
							)
						}
					>
						Decrease difficulty
					</button>
					<button onClick={() => setOpponentDifficulty(10)}>Impossible</button>
				</div>
				<div className='ball-speed'>
					<h2>Ball Speed: {ballSpeed}</h2>
					<button
						onClick={() =>
							setBallSpeed(
								ballSpeed >= 5 ? ballSpeed : ballSpeed + ballSpeedStep
							)
						}
					>
						Increase Speed
					</button>
					<button
						onClick={() =>
							setBallSpeed(
								ballSpeed <= 1 ? ballSpeed : ballSpeed - ballSpeedStep
							)
						}
					>
						Decrease Speed
					</button>
				</div>
			</div>
			<div className='board' style={{ width: width, height: height }}>
				<Paddle position={playerPosition} />
				<Ball position={ballPosition} />
				<Paddle position={opponentPosition} />
				{isPaused ? (
					<button
						className='board-resume-button'
						onClick={() => {
							setIsPaused(false);
						}}
					>
						Resume
					</button>
				) : null}
			</div>
		</div>
	);
}

export default Board;
