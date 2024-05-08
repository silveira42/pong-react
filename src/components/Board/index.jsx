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
const speed = 3;

const initialBallPosition = { x: width / 2, y: height / 2 - ballSize / 2 };

const initialBallVelocity = { x: 1, y: 1 };

const initialPlayerPosition = {
	x: paddleWidth,
	y: height / 2 - paddleHeight / 2,
};

const initialOpponentPosition = {
	x: width - paddleWidth * 2,
	y: height / 2 - paddleHeight / 2,
};

var AABBIntersect = function (ax, ay, aw, ah, bx, by, bw, bh) {
	return ax < bx + bw && ay < by + bh && bx < ax + aw && by < ay + ah;
};

function Board() {
	const [isRunning, setIsRunning] = React.useState(false);
	const [ballPosition, setBallPosition] = React.useState(initialBallPosition);
	const [ballVelocity, setBallVelocity] = React.useState(initialBallVelocity);
	const [playerPosition, setPlayerPosition] = React.useState(
		initialPlayerPosition
	);
	const [opponentPosition, setOpponentPosition] = React.useState(
		initialOpponentPosition
	);

	// game loop function
	const loop = function () {
		updateBoard();

		if (!isRunning) {
			window.cancelAnimationFrame(loop);
		}
	};

	useKeyPressEvent('p', () => {
		setIsRunning(!isRunning);
	});

	function updateOpponent() {
		// calculate ideal position
		const destiny = ballPosition.y - (paddleHeight - ballSize) * 0.5;

		let opponentY = opponentPosition.y;
		// ease the movement towards the ideal position
		opponentY += (destiny - opponentY) * 0.1;
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

		if (arrowUpPressed) playerY -= 7;
		if (arrowDownPressed) playerY += 7;
		// keep the paddle inside of the canvas
		playerY = Math.max(Math.min(playerY, height - paddleHeight), 0);

		setPlayerPosition({
			...playerPosition,
			y: playerY,
		});
	}

	function serve() {
		setBallPosition(initialBallPosition);
		setBallVelocity(initialBallVelocity);
	}

	function onBallMove() {
		let ballVelocityCpy = { ...ballVelocity };
		let ballPositionCpy = { ...ballPosition };

		// if going to hit top or bottom, invert y direction
		if (ballPosition.y > height - ballSize || ballPosition.y <= 0) {
			ballVelocityCpy.y = ballVelocity.y * -1;
		}

		// if going to hit edge, serve and award point
		if (ballPosition.x > width - ballSize || ballPosition.x <= 0) {
			serve();
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
				smash * (paddleName === 'player' ? 1 : -1) * speed * Math.cos(phi);
			ballVelocityCpy.y = smash * speed * Math.sin(phi);
		}

		setBallPosition({
			x: ballPosition.x + speed * ballVelocityCpy.x,
			y: ballPosition.y + speed * ballVelocityCpy.y,
		});

		setBallVelocity(ballVelocityCpy);
	}

	function updateBoard() {
		onBallMove();
		updateOpponent();
		updatePlayer();
	}

	if (isRunning) {
		window.requestAnimationFrame(loop);
	}

	return (
		<div className='board-container' style={{ width: width, height: height }}>
			<Paddle position={playerPosition} />
			<Ball position={ballPosition} />
			<Paddle position={opponentPosition} />
			{isRunning ? null : (
				<button
					className='board-resume-button'
					onClick={() => {
						setIsRunning(true);
					}}
				>
					Resume
				</button>
			)}
		</div>
	);
}

export default Board;
