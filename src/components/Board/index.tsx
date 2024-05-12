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
			ballPosition.shortAxis - (props.paddleLongSide - props.ballSize) * 0.5;

		let opponentY = opponentPosition.shortAxis;

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
			Math.min(opponentY, props.shortAxis - props.paddleLongSide),
			0
		);

		if (!visualViewport) return;

		setOpponentPosition({
			...opponentPosition,
			longAxis:
				visualViewport.height > visualViewport.width
					? visualViewport.height * 0.6
					: visualViewport.width * 0.6 - props.paddleShortSide * 3,
			shortAxis: opponentY,
		});
	}

	function updatePlayerOpponent() {
		let playerY = opponentPosition.shortAxis;

		if (wPressed) playerY -= props.playerSpeed;
		if (sPressed) playerY += props.playerSpeed;

		// keep the paddle inside of the canvas
		playerY = Math.max(
			Math.min(playerY, props.shortAxis - props.paddleLongSide),
			0
		);

		setOpponentPosition({
			...opponentPosition,
			longAxis: props.paddleShortSide * 2,
			shortAxis: playerY,
		});
	}

	function updatePlayer() {
		let playerY = playerPosition.shortAxis;

		if (arrowUpPressed) playerY -= props.playerSpeed;
		if (arrowDownPressed) playerY += props.playerSpeed;

		// keep the paddle inside of the canvas
		playerY = Math.max(
			Math.min(playerY, props.shortAxis - props.paddleLongSide),
			0
		);

		setPlayerPosition({
			...playerPosition,
			longAxis: props.paddleShortSide * 2,
			shortAxis: playerY,
		});
	}

	function serve() {
		const ballVelocityCpy = { ...ballVelocity };

		ballVelocityCpy.longAxis = lastServePlayer ? 1 : -1;
		ballVelocityCpy.shortAxis = props.ballSpeed * Math.random();

		setBallPosition(props.initialBallPosition);
		setBallVelocity(ballVelocityCpy);
		setLastServePlayer(!lastServePlayer);
	}

	function onBallMove() {
		let ballVelocityCpy = { ...ballVelocity };
		let ballPositionCpy = { ...ballPosition };

		// if going to hit top invert y direction
		if (ballPosition.shortAxis >= props.shortAxis - props.ballSize) {
			ballVelocityCpy.shortAxis = -Math.abs(ballVelocity.shortAxis);
		}
		// if going to hit bottom, invert y direction
		if (ballPosition.shortAxis <= 0) {
			ballVelocityCpy.shortAxis = Math.abs(ballVelocity.shortAxis);
		}

		// if going to hit edge, serve and award point
		if (
			ballPosition.longAxis > props.longAxis - props.ballSize ||
			ballPosition.longAxis <= 0
		) {
			serve();
			const newScore = { ...props.score };
			ballPosition.longAxis > props.longAxis - props.ballSize
				? newScore.player++
				: newScore.opponent++;
			props.handleScoreChange(newScore);
			return;
		}

		// if going to hit paddle, invert x direction
		if (
			AABBIntersect(
				ballPosition.longAxis,
				ballPosition.shortAxis,
				props.ballSize,
				props.ballSize,
				playerPosition.longAxis,
				playerPosition.shortAxis,
				props.paddleShortSide,
				props.paddleLongSide
			) ||
			AABBIntersect(
				ballPosition.longAxis,
				ballPosition.shortAxis,
				props.ballSize,
				props.ballSize,
				opponentPosition.longAxis,
				opponentPosition.shortAxis,
				props.paddleShortSide,
				props.paddleLongSide
			)
		) {
			const currentPaddle =
				ballVelocity.longAxis < 0
					? { ...playerPosition }
					: { ...opponentPosition };

			const paddleName =
				ballPosition.longAxis < props.longAxis / 2 ? 'player' : 'opponent';

			ballPositionCpy.longAxis =
				paddleName === 'player'
					? playerPosition.longAxis + props.paddleShortSide
					: opponentPosition.longAxis - props.ballSize;

			const pi = Math.PI;

			const hitLocation =
				(ballPosition.shortAxis + props.ballSize - currentPaddle.shortAxis) /
				(props.paddleLongSide + props.ballSize);

			const normalizedHitLocation = hitLocation * 2 - 1;
			// Getting the hit location and normalizing it to be between -1 and 1

			const phi = 0.25 * pi * normalizedHitLocation; // pi/4 = 45
			// Angle in radians

			// calculate smash value and update velocity
			const smash = Math.abs(phi) > 0.2 * pi ? 1.5 : 1;

			ballVelocityCpy.longAxis =
				smash *
				(paddleName === 'player' ? 1 : -1) *
				props.ballSpeed *
				Math.cos(phi);
			ballVelocityCpy.shortAxis = smash * props.ballSpeed * Math.sin(phi);
		}

		setBallPosition({
			longAxis:
				ballPositionCpy.longAxis + props.ballSpeed * ballVelocityCpy.longAxis,
			shortAxis:
				ballPositionCpy.shortAxis + props.ballSpeed * ballVelocityCpy.shortAxis,
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
				style={{ width: props.longAxis, height: props.shortAxis }}
			>
				<Paddle
					position={playerPosition}
					width={props.paddleShortSide}
					height={props.paddleLongSide}
				/>
				<Ball position={ballPosition} size={props.ballSize} />
				<Paddle
					position={opponentPosition}
					width={props.paddleShortSide}
					height={props.paddleLongSide}
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
