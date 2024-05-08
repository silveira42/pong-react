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

const initialBallDirection = { x: 1, y: 1 };

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
	const [ballDirection, setBallDirection] =
		React.useState(initialBallDirection);
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
		setBallDirection(initialBallDirection);
	}

	function onBallMove() {
		let ballDirectionCpy = { ...ballDirection };
		// if going to hit top or bottom, invert y direction
		if (ballPosition.y > height - ballSize || ballPosition.y <= 0) {
			ballDirectionCpy.y = ballDirection.y * -1;
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
			ballDirectionCpy.x = ballDirection.x * -1;
		}

		setBallPosition({
			x: ballPosition.x + speed * ballDirectionCpy.x,
			y: ballPosition.y + speed * ballDirectionCpy.y,
		});

		setBallDirection(ballDirectionCpy);
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
