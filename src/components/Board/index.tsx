import React from 'react';
import './styles.css';
import Ball from '../Ball';
import Paddle from '../Paddle';
import useKeyPress from '../../util/useKeyPress'; // Import the hook
import { useKeyPressEvent } from 'react-use';
import AABBIntersect from '../../util/aabbIntersect';
import { BoardProps } from './BoardProps';

function Board(props: BoardProps) {
	const [ballPosition, setBallPosition] = React.useState(
		props.initialBallPosition
	);
	const [ballVelocity, setBallVelocity] = React.useState(
		props.initialBallVelocity
	);
	const [playerPosition, setPlayerPosition] = React.useState(
		props.initialPlayerPosition
	);
	const [opponentPosition, setOpponentPosition] = React.useState(
		props.initialOpponentPosition
	);
	const [lastServePlayer, setLastServePlayer] = React.useState(false);

	// game loop function
	const loop = function () {
		updateBoard();

		if (props.isPaused) {
			window.cancelAnimationFrame(0);
		}
	};

	const arrowUpPressed = useKeyPress('ArrowUp');
	const wPressed = useKeyPress('w');
	const arrowDownPressed = useKeyPress('ArrowDown');
	const sPressed = useKeyPress('s');

	useKeyPressEvent('p', () => {
		props.handleChangePause(!props.isPaused);
	});

	function updateMachineOpponent() {
		// calculate ideal position
		const destination =
			ballPosition.y - (props.paddleHeight - props.ballSize) * 0.5;

		let opponentY = opponentPosition.y;

		// ease the movement towards the ideal position
		let opponentSpeed = 0;

		if (props.opponentDifficulty === 1) {
			opponentSpeed = 0.05;
		}
		if (props.opponentDifficulty === 2) {
			opponentSpeed = 0.1;
		}
		if (props.opponentDifficulty === 3) {
			opponentSpeed = 0.2;
		}
		if (props.opponentDifficulty === 10) {
			opponentSpeed = 1;
		}

		opponentY += (destination - opponentY) * opponentSpeed;

		// keep the paddle inside of the canvas
		opponentY = Math.max(
			Math.min(opponentY, props.height - props.paddleHeight),
			0
		);

		setOpponentPosition({
			...opponentPosition,
			y: opponentY,
		});
	}

	function updatePlayerOpponent() {
		let playerY = opponentPosition.y;

		if (wPressed) playerY -= props.playerSpeed;
		if (sPressed) playerY += props.playerSpeed;

		// keep the paddle inside of the canvas
		playerY = Math.max(Math.min(playerY, props.height - props.paddleHeight), 0);

		setOpponentPosition({
			...opponentPosition,
			y: playerY,
		});
	}

	function updatePlayer() {
		let playerY = playerPosition.y;

		if (arrowUpPressed) playerY -= props.playerSpeed;
		if (arrowDownPressed) playerY += props.playerSpeed;

		// keep the paddle inside of the canvas
		playerY = Math.max(Math.min(playerY, props.height - props.paddleHeight), 0);

		setPlayerPosition({
			...playerPosition,
			y: playerY,
		});
	}

	function serve() {
		const ballVelocityCpy = { ...ballVelocity };

		ballVelocityCpy.x = lastServePlayer ? 1 : -1;
		ballVelocityCpy.y = props.ballSpeed * Math.random();

		setBallPosition(props.initialBallPosition);
		setBallVelocity(ballVelocityCpy);
		setLastServePlayer(!lastServePlayer);
	}

	function onBallMove() {
		let ballVelocityCpy = { ...ballVelocity };
		let ballPositionCpy = { ...ballPosition };

		// if going to hit top invert y direction
		if (ballPosition.y >= props.height - props.ballSize) {
			ballVelocityCpy.y = -Math.abs(ballVelocity.y);
		}
		// if going to hit bottom, invert y direction
		if (ballPosition.y <= 0) {
			ballVelocityCpy.y = Math.abs(ballVelocity.y);
		}

		// if going to hit edge, serve and award point
		if (ballPosition.x > props.width - props.ballSize || ballPosition.x <= 0) {
			serve();
			const newScore = { ...props.score };
			ballPosition.x > props.width - props.ballSize
				? newScore.player++
				: newScore.opponent++;
			props.handleScoreChange(newScore);
			return;
		}

		// if going to hit paddle, invert x direction
		if (
			AABBIntersect(
				ballPosition.x,
				ballPosition.y,
				props.ballSize,
				props.ballSize,
				playerPosition.x,
				playerPosition.y,
				props.paddleWidth,
				props.paddleHeight
			) ||
			AABBIntersect(
				ballPosition.x,
				ballPosition.y,
				props.ballSize,
				props.ballSize,
				opponentPosition.x,
				opponentPosition.y,
				props.paddleWidth,
				props.paddleHeight
			)
		) {
			const currentPaddle =
				ballVelocity.x < 0 ? { ...playerPosition } : { ...opponentPosition };

			const paddleName =
				ballPosition.x < props.width / 2 ? 'player' : 'opponent';

			ballPositionCpy.x =
				paddleName === 'player'
					? playerPosition.x + props.paddleWidth
					: opponentPosition.x - props.ballSize;

			const pi = Math.PI;

			const hitLocation =
				(ballPosition.y + props.ballSize - currentPaddle.y) /
				(props.paddleHeight + props.ballSize);

			const normalizedHitLocation = hitLocation * 2 - 1;
			// Getting the hit location and normalizing it to be between -1 and 1

			const phi = 0.25 * pi * normalizedHitLocation; // pi/4 = 45
			// Angle in radians

			// calculate smash value and update velocity
			const smash = Math.abs(phi) > 0.2 * pi ? 1.5 : 1;

			ballVelocityCpy.x =
				smash *
				(paddleName === 'player' ? 1 : -1) *
				props.ballSpeed *
				Math.cos(phi);
			ballVelocityCpy.y = smash * props.ballSpeed * Math.sin(phi);
		}

		setBallPosition({
			x: ballPositionCpy.x + props.ballSpeed * ballVelocityCpy.x,
			y: ballPositionCpy.y + props.ballSpeed * ballVelocityCpy.y,
		});

		setBallVelocity(ballVelocityCpy);
	}

	function updateBoard() {
		onBallMove();
		updatePlayer();
		props.opponentMode === 'player'
			? updatePlayerOpponent()
			: updateMachineOpponent();
	}

	if (!props.isPaused) {
		window.requestAnimationFrame(loop);
	}

	return (
		<div className='board-container'>
			<hr />
			<div
				className='board'
				style={{ width: props.width, height: props.height }}
			>
				<Paddle
					position={playerPosition}
					width={props.paddleWidth}
					height={props.paddleHeight}
				/>
				<Ball position={ballPosition} size={props.ballSize} />
				<Paddle
					position={opponentPosition}
					width={props.paddleWidth}
					height={props.paddleHeight}
				/>
				{props.isPaused ? (
					<button
						className='board-resume-button'
						onClick={() => {
							props.handleChangePause(false);
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
