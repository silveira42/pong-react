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
import { OpponentMode } from 'components/Game/GameOptionsType';

function Board(props: BoardProps) {
	const initialBallPosition = {
		longAxis: props.gameSettings.boardLongAxis / 2,
		shortAxis:
			props.gameSettings.boardShortAxis / 2 - props.gameSettings.ballSize / 2,
	};
	const initialBallVelocity = { longAxis: 1, shortAxis: 1 };

	const initialPaddleA: PaddleType = {
		longAxis: props.gameSettings.paddleShortSide * 2,
		shortAxis:
			props.gameSettings.boardShortAxis / 2 -
			props.gameSettings.paddleLongSide / 2,
		upKey: props.gameOptions.playerOneKeys.upKey,
		downKey: props.gameOptions.playerOneKeys.downKey,
		leftKey: props.gameOptions.playerOneKeys.leftKey,
		rightKey: props.gameOptions.playerOneKeys.rightKey,
		position: 'A',
	};

	const initialPaddleZ: PaddleType = {
		longAxis:
			props.gameSettings.boardLongAxis - props.gameSettings.paddleShortSide * 3,
		shortAxis:
			props.gameSettings.boardShortAxis / 2 -
			props.gameSettings.paddleLongSide / 2,
		upKey: props.gameOptions.playerTwoKeys.upKey,
		downKey: props.gameOptions.playerTwoKeys.downKey,
		leftKey: props.gameOptions.playerTwoKeys.leftKey,
		rightKey: props.gameOptions.playerTwoKeys.rightKey,
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

	const paddleAUpPressed = useKeyPress(paddleA.upKey);
	const paddleADownPressed = useKeyPress(paddleA.downKey);
	const paddleALeftPressed = useKeyPress(paddleA.leftKey);
	const paddleARightPressed = useKeyPress(paddleA.rightKey);

	const paddleZUpPressed = useKeyPress(paddleZ.upKey);
	const paddleZDownPressed = useKeyPress(paddleZ.downKey);
	const paddleZLeftPressed = useKeyPress(paddleZ.leftKey);
	const paddleZRightPressed = useKeyPress(paddleZ.rightKey);

	useKeyPressEvent('p', () => {
		props.handleChangePause(!props.isPaused);
	});

	function updateMachine(
		currentPaddle: PaddleType,
		setCurrentPaddle: Function
	) {
		// calculate ideal position
		const destination =
			ballPosition.shortAxis -
			(props.gameSettings.paddleLongSide - props.gameSettings.ballSize) * 0.5;

		let opponentY = currentPaddle.shortAxis;

		// ease the movement towards the ideal position
		const machineSpeed = getMachineSpeed(props.gameOptions.opponentDifficulty);

		opponentY += (destination - opponentY) * machineSpeed;

		// keep the paddle inside of the canvas
		opponentY = Math.max(
			Math.min(
				opponentY,
				props.gameSettings.boardShortAxis - props.gameSettings.paddleLongSide
			),
			0
		);

		if (!visualViewport) return;
		const repositionedLongAxis =
			currentPaddle.position === 'A'
				? props.gameSettings.paddleShortSide * 2
				: visualViewport.height > visualViewport.width
				? visualViewport.height * 0.6 - props.gameSettings.paddleShortSide * 3
				: visualViewport.width * 0.6 - props.gameSettings.paddleShortSide * 3;

		setCurrentPaddle({
			...currentPaddle,
			longAxis: repositionedLongAxis,
			shortAxis: opponentY,
		});
	}

	function updatePlayer(currentPaddle: PaddleType, setCurrentPaddle: Function) {
		let playerShortAxis = currentPaddle.shortAxis;

		if (props.gameSettings.gameOrientation === 'horizontal') {
			if (currentPaddle.position === 'A' ? paddleAUpPressed : paddleZUpPressed)
				playerShortAxis += props.gameOptions.playerSpeed;
			if (
				currentPaddle.position === 'A' ? paddleADownPressed : paddleZDownPressed
			)
				playerShortAxis -= props.gameOptions.playerSpeed;
		} else if (props.gameSettings.gameOrientation === 'vertical') {
			if (
				currentPaddle.position === 'A' ? paddleALeftPressed : paddleZLeftPressed
			)
				playerShortAxis -= props.gameOptions.playerSpeed;
			if (
				currentPaddle.position === 'A'
					? paddleARightPressed
					: paddleZRightPressed
			)
				playerShortAxis += props.gameOptions.playerSpeed;
		} else {
			throw new Error('Invalid game orientation');
		}
		// keep the paddle inside of the canvas
		playerShortAxis = Math.max(
			Math.min(
				playerShortAxis,
				props.gameSettings.boardShortAxis - props.gameSettings.paddleLongSide
			),
			0
		);

		if (!visualViewport) return;

		const repositionedLongAxis =
			currentPaddle.position === 'A'
				? props.gameSettings.paddleShortSide * 2
				: visualViewport.height > visualViewport.width
				? visualViewport.height * 0.6 - props.gameSettings.paddleShortSide * 3
				: visualViewport.width * 0.6 - props.gameSettings.paddleShortSide * 3;

		setCurrentPaddle({
			...currentPaddle,
			longAxis: repositionedLongAxis,
			shortAxis: playerShortAxis,
		});
	}

	function serve() {
		const ballVelocityCpy = { ...ballVelocity };

		ballVelocityCpy.longAxis = lastServePlayer ? 1 : -1;
		ballVelocityCpy.shortAxis = props.gameOptions.ballSpeed * Math.random();

		setBallPosition(initialBallPosition);
		setBallVelocity(ballVelocityCpy);
		setLastServePlayer(!lastServePlayer);
	}

	function onBallMove() {
		let ballVelocityCpy = { ...ballVelocity };
		let ballPositionCpy = { ...ballPosition };

		// if going to hit top invert y direction
		if (
			ballPosition.shortAxis >=
			props.gameSettings.boardShortAxis - props.gameSettings.ballSize
		) {
			ballVelocityCpy.shortAxis = -Math.abs(ballVelocity.shortAxis);
		}
		// if going to hit bottom, invert y direction
		if (ballPosition.shortAxis <= 0) {
			ballVelocityCpy.shortAxis = Math.abs(ballVelocity.shortAxis);
		}

		// if going to hit edge, serve and award point
		if (
			ballPosition.longAxis >
				props.gameSettings.boardLongAxis - props.gameSettings.ballSize ||
			ballPosition.longAxis <= 0
		) {
			serve();
			ballPosition.longAxis >
			props.gameSettings.boardLongAxis - props.gameSettings.ballSize
				? props.handleScoreChange('player')
				: props.handleScoreChange('opponent');
			return;
		}

		// if going to hit paddle, invert x direction
		if (
			AABBIntersect(
				ballPosition.longAxis,
				ballPosition.shortAxis,
				props.gameSettings.ballSize,
				props.gameSettings.ballSize,
				paddleA.longAxis,
				paddleA.shortAxis,
				props.gameSettings.paddleShortSide,
				props.gameSettings.paddleLongSide
			) ||
			AABBIntersect(
				ballPosition.longAxis,
				ballPosition.shortAxis,
				props.gameSettings.ballSize,
				props.gameSettings.ballSize,
				paddleZ.longAxis,
				paddleZ.shortAxis,
				props.gameSettings.paddleShortSide,
				props.gameSettings.paddleLongSide
			)
		) {
			const currentPaddle =
				ballVelocity.longAxis < 0 ? { ...paddleA } : { ...paddleZ };

			const paddleName =
				ballPosition.longAxis < props.gameSettings.boardLongAxis / 2
					? 'player'
					: 'opponent';

			ballPositionCpy.longAxis =
				paddleName === 'player'
					? paddleA.longAxis + props.gameSettings.paddleShortSide
					: paddleZ.longAxis - props.gameSettings.ballSize;

			const pi = Math.PI;

			const hitLocation =
				(ballPosition.shortAxis +
					props.gameSettings.ballSize -
					currentPaddle.shortAxis) /
				(props.gameSettings.paddleLongSide + props.gameSettings.ballSize);

			const normalizedHitLocation = hitLocation * 2 - 1;
			// Getting the hit location and normalizing it to be between -1 and 1

			const phi = 0.25 * pi * normalizedHitLocation; // pi/4 = 45
			// Angle in radians

			// calculate smash value and update velocity
			const smash = Math.abs(phi) > 0.2 * pi ? 1.5 : 1;

			ballVelocityCpy.longAxis =
				smash *
				(paddleName === 'player' ? 1 : -1) *
				props.gameOptions.ballSpeed *
				Math.cos(phi);
			ballVelocityCpy.shortAxis =
				smash * props.gameOptions.ballSpeed * Math.sin(phi);
		}

		setBallPosition({
			longAxis:
				ballPositionCpy.longAxis +
				props.gameOptions.ballSpeed * ballVelocityCpy.longAxis,
			shortAxis:
				ballPositionCpy.shortAxis +
				props.gameOptions.ballSpeed * ballVelocityCpy.shortAxis,
		});

		setBallVelocity(ballVelocityCpy);
	}

	function updateBoard() {
		onBallMove();
		updatePlayer(paddleA, setPaddleA);
		props.gameOptions.opponentMode === OpponentMode.Player
			? updatePlayer(paddleZ, setPaddleZ)
			: updateMachine(paddleZ, setPaddleZ);
	}

	if (!props.isPaused) {
		window.requestAnimationFrame(loop);
	}

	return (
		<div className='board-container'>
			<div
				className={`board board-${props.gameSettings.gameOrientation}-stripe`}
				style={{
					width:
						props.gameSettings.gameOrientation === 'horizontal'
							? props.gameSettings.boardLongAxis
							: props.gameSettings.boardShortAxis,
					height:
						props.gameSettings.gameOrientation === 'vertical'
							? props.gameSettings.boardLongAxis
							: props.gameSettings.boardShortAxis,
				}}
			>
				<Paddle
					left={
						props.gameSettings.gameOrientation === 'horizontal'
							? paddleA.longAxis
							: paddleA.shortAxis
					}
					bottom={
						props.gameSettings.gameOrientation === 'horizontal'
							? paddleA.shortAxis
							: paddleA.longAxis
					}
					height={
						props.gameSettings.gameOrientation === 'horizontal'
							? props.gameSettings.paddleLongSide
							: props.gameSettings.paddleShortSide
					}
					width={
						props.gameSettings.gameOrientation === 'vertical'
							? props.gameSettings.paddleLongSide
							: props.gameSettings.paddleShortSide
					}
				/>
				<Ball
					left={
						props.gameSettings.gameOrientation === 'horizontal'
							? ballPosition.longAxis
							: ballPosition.shortAxis
					}
					bottom={
						props.gameSettings.gameOrientation === 'horizontal'
							? ballPosition.shortAxis
							: ballPosition.longAxis
					}
					size={props.gameSettings.ballSize}
				/>
				<Paddle
					left={
						props.gameSettings.gameOrientation === 'horizontal'
							? paddleZ.longAxis
							: paddleZ.shortAxis
					}
					bottom={
						props.gameSettings.gameOrientation === 'horizontal'
							? paddleZ.shortAxis
							: paddleZ.longAxis
					}
					height={
						props.gameSettings.gameOrientation === 'horizontal'
							? props.gameSettings.paddleLongSide
							: props.gameSettings.paddleShortSide
					}
					width={
						props.gameSettings.gameOrientation === 'vertical'
							? props.gameSettings.paddleLongSide
							: props.gameSettings.paddleShortSide
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
