import React from 'react';
import './styles.css';
import Ball from '../Ball';
import Paddle from '../Paddle';
import useKeyPress from '../../util/useKeyPress'; // Import the hook
import { useKeyPressEvent } from 'react-use';
import AABBIntersect from '../../util/aabbIntersect';
import { BoardProps } from './BoardProps';
import { PaddleType } from './PaddleType';
import getMachineSpeed from 'components/Game/getMachineSpeed';

function Board(props: BoardProps) {
	const initialBallPosition = {
		longAxis: props.longAxis / 2,
		shortAxis: props.shortAxis / 2 - props.ballSize / 2,
	};
	const initialBallVelocity = { longAxis: 1, shortAxis: 1 };

	const initialPaddleA: PaddleType = {
		longAxis: props.paddleShortSide * 2,
		shortAxis: props.shortAxis / 2 - props.paddleLongSide / 2,
		upKey: props.playerOneKeys.upKey,
		downKey: props.playerOneKeys.downKey,
		leftKey: props.playerOneKeys.leftKey,
		rightKey: props.playerOneKeys.rightKey,
		position: 'A',
	};

	const initialPaddleZ: PaddleType = {
		longAxis: props.longAxis - props.paddleShortSide * 3,
		shortAxis: props.shortAxis / 2 - props.paddleLongSide / 2,
		upKey: props.playerTwoKeys.upKey,
		downKey: props.playerTwoKeys.downKey,
		leftKey: props.playerTwoKeys.leftKey,
		rightKey: props.playerTwoKeys.rightKey,
		position: 'Z',
	};

	const [ballPosition, setBallPosition] = React.useState(initialBallPosition);
	const [ballVelocity, setBallVelocity] = React.useState(initialBallVelocity);
	const [paddleA, setPaddleA] = React.useState(initialPaddleA);
	const [paddleZ, setPaddleZ] = React.useState(initialPaddleZ);
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

	const arrowLeftPressed = useKeyPress('ArrowLeft');
	const aPressed = useKeyPress('a');
	const arrowRightPressed = useKeyPress('ArrowRight');
	const dPressed = useKeyPress('d');

	useKeyPressEvent('p', () => {
		props.handleChangePause(!props.isPaused);
	});

	function updateMachine(
		currentPaddle: PaddleType,
		setCurrentPaddle: Function
	) {
		// calculate ideal position
		const destination =
			ballPosition.shortAxis - (props.paddleLongSide - props.ballSize) * 0.5;

		let opponentY = currentPaddle.shortAxis;

		// ease the movement towards the ideal position
		const machineSpeed = getMachineSpeed(props.opponentDifficulty);

		opponentY += (destination - opponentY) * machineSpeed;

		// keep the paddle inside of the canvas
		opponentY = Math.max(
			Math.min(opponentY, props.shortAxis - props.paddleLongSide),
			0
		);

		if (!visualViewport) return;
		const repositionedLongAxis =
			currentPaddle.position === 'A'
				? props.paddleShortSide * 2
				: visualViewport.height > visualViewport.width
				? visualViewport.height * 0.6 - props.paddleShortSide * 3
				: visualViewport.width * 0.6 - props.paddleShortSide * 3;

		setCurrentPaddle({
			...currentPaddle,
			longAxis: repositionedLongAxis,
			shortAxis: opponentY,
		});
	}

	function updatePlayer(currentPaddle: PaddleType, setCurrentPaddle: Function) {
		let playerShortAxis = currentPaddle.shortAxis;

		if (props.gameOrientation === 'horizontal') {
			if (currentPaddle.upKey === 'w' ? wPressed : arrowUpPressed)
				playerShortAxis += props.playerSpeed;
			if (currentPaddle.downKey === 's' ? sPressed : arrowDownPressed)
				playerShortAxis -= props.playerSpeed;
		} else if (props.gameOrientation === 'vertical') {
			if (currentPaddle.leftKey === 'a' ? aPressed : arrowLeftPressed)
				playerShortAxis -= props.playerSpeed;
			if (currentPaddle.rightKey === 'd' ? dPressed : arrowRightPressed)
				playerShortAxis += props.playerSpeed;
		} else {
			throw new Error('Invalid game orientation');
		}
		// keep the paddle inside of the canvas
		playerShortAxis = Math.max(
			Math.min(playerShortAxis, props.shortAxis - props.paddleLongSide),
			0
		);

		if (!visualViewport) return;

		const repositionedLongAxis =
			currentPaddle.position === 'A'
				? props.paddleShortSide * 2
				: visualViewport.height > visualViewport.width
				? visualViewport.height * 0.6 - props.paddleShortSide * 3
				: visualViewport.width * 0.6 - props.paddleShortSide * 3;

		setCurrentPaddle({
			...currentPaddle,
			longAxis: repositionedLongAxis,
			shortAxis: playerShortAxis,
		});
	}

	function serve() {
		const ballVelocityCpy = { ...ballVelocity };

		ballVelocityCpy.longAxis = lastServePlayer ? 1 : -1;
		ballVelocityCpy.shortAxis = props.ballSpeed * Math.random();

		setBallPosition(initialBallPosition);
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
				paddleA.longAxis,
				paddleA.shortAxis,
				props.paddleShortSide,
				props.paddleLongSide
			) ||
			AABBIntersect(
				ballPosition.longAxis,
				ballPosition.shortAxis,
				props.ballSize,
				props.ballSize,
				paddleZ.longAxis,
				paddleZ.shortAxis,
				props.paddleShortSide,
				props.paddleLongSide
			)
		) {
			const currentPaddle =
				ballVelocity.longAxis < 0 ? { ...paddleA } : { ...paddleZ };

			const paddleName =
				ballPosition.longAxis < props.longAxis / 2 ? 'player' : 'opponent';

			ballPositionCpy.longAxis =
				paddleName === 'player'
					? paddleA.longAxis + props.paddleShortSide
					: paddleZ.longAxis - props.ballSize;

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
		updatePlayer(paddleA, setPaddleA);
		props.opponentMode === 'player'
			? updatePlayer(paddleZ, setPaddleZ)
			: updateMachine(paddleZ, setPaddleZ);
	}

	if (!props.isPaused) {
		window.requestAnimationFrame(loop);
	}

	return (
		<div className='board-container'>
			<hr />
			<div
				className={`board board-${props.gameOrientation}-stripe`}
				style={{
					width:
						props.gameOrientation === 'horizontal'
							? props.longAxis
							: props.shortAxis,
					height:
						props.gameOrientation === 'vertical'
							? props.longAxis
							: props.shortAxis,
				}}
			>
				<Paddle
					left={
						props.gameOrientation === 'horizontal'
							? paddleA.longAxis
							: paddleA.shortAxis
					}
					bottom={
						props.gameOrientation === 'horizontal'
							? paddleA.shortAxis
							: paddleA.longAxis
					}
					height={
						props.gameOrientation === 'horizontal'
							? props.paddleLongSide
							: props.paddleShortSide
					}
					width={
						props.gameOrientation === 'vertical'
							? props.paddleLongSide
							: props.paddleShortSide
					}
				/>
				<Ball
					left={
						props.gameOrientation === 'horizontal'
							? ballPosition.longAxis
							: ballPosition.shortAxis
					}
					bottom={
						props.gameOrientation === 'horizontal'
							? ballPosition.shortAxis
							: ballPosition.longAxis
					}
					size={props.ballSize}
				/>
				<Paddle
					left={
						props.gameOrientation === 'horizontal'
							? paddleZ.longAxis
							: paddleZ.shortAxis
					}
					bottom={
						props.gameOrientation === 'horizontal'
							? paddleZ.shortAxis
							: paddleZ.longAxis
					}
					height={
						props.gameOrientation === 'horizontal'
							? props.paddleLongSide
							: props.paddleShortSide
					}
					width={
						props.gameOrientation === 'vertical'
							? props.paddleLongSide
							: props.paddleShortSide
					}
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
