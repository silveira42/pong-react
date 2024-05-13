import React from 'react';
import { useKeyPressEvent } from 'react-use';
import './styles.css';
import { BoardProps } from './BoardProps';
import Ball from '../Ball';
import Paddle from '../Paddle';
import useKeyPress from '../../util/useKeyPress'; // Import the hook
import AABBIntersect from '../../util/aabbIntersect';
import getMachineSpeed from 'components/Game/getMachineSpeed';
import { PaddleType } from './types/PaddleType';
import { BallPositionType } from './types/BallPositionType';
import { BallVelocityType } from './types/BallVelocityType';
import { OpponentMode } from 'components/Game/enums/OpponentMode';

function Board(props: BoardProps) {
	// Simple state variables
	const [paddleShortSide, setPaddleShortSide] = React.useState(20);
	const [paddleLongSide, setPaddleLongSide] = React.useState(100);
	const [ballSize, setBallSize] = React.useState(20);
	const [lastServePaddleA, setLastServePaddleA] = React.useState(false);

	// Variables to initialize complex states
	const initialBallPosition: BallPositionType = {
		longAxis: props.boardLongAxis / 2,
		shortAxis: props.boardShortAxis / 2 - ballSize / 2,
	};

	const initialBallVelocity: BallVelocityType = { longAxis: 1, shortAxis: 1 };

	const initialPaddleA: PaddleType = {
		longAxis: paddleShortSide * 2,
		shortAxis: props.boardShortAxis / 2 - paddleLongSide / 2,
		upKey: props.playerOneKeys.upKey,
		downKey: props.playerOneKeys.downKey,
		leftKey: props.playerOneKeys.leftKey,
		rightKey: props.playerOneKeys.rightKey,
		position: 'A',
	};

	const initialPaddleZ: PaddleType = {
		longAxis: props.boardLongAxis - paddleShortSide * 3,
		shortAxis: props.boardShortAxis / 2 - paddleLongSide / 2,
		upKey: props.playerTwoKeys.upKey,
		downKey: props.playerTwoKeys.downKey,
		leftKey: props.playerTwoKeys.leftKey,
		rightKey: props.playerTwoKeys.rightKey,
		position: 'Z',
	};

	// Complex states
	const [ballPosition, setBallPosition] = React.useState(initialBallPosition);
	const [ballVelocity, setBallVelocity] = React.useState(initialBallVelocity);
	const [paddleA, setPaddleA] = React.useState(initialPaddleA);
	const [paddleZ, setPaddleZ] = React.useState(initialPaddleZ);

	// Key watchers
	const paddleAUpPressed = useKeyPress(paddleA.upKey);
	const paddleADownPressed = useKeyPress(paddleA.downKey);
	const paddleALeftPressed = useKeyPress(paddleA.leftKey);
	const paddleARightPressed = useKeyPress(paddleA.rightKey);

	const paddleZUpPressed = useKeyPress(paddleZ.upKey);
	const paddleZDownPressed = useKeyPress(paddleZ.downKey);
	const paddleZLeftPressed = useKeyPress(paddleZ.leftKey);
	const paddleZRightPressed = useKeyPress(paddleZ.rightKey);

	// game loop function
	const loop = () => {
		updateBoard();

		if (props.isPaused) {
			window.cancelAnimationFrame(0);
		}
	};

	useKeyPressEvent('p', () => {
		props.handleChangePause(!props.isPaused);
	});

	function updateMachine(
		currentPaddle: PaddleType,
		setCurrentPaddle: Function
	): void {
		// calculate ideal position
		const destination =
			ballPosition.shortAxis - (paddleLongSide - ballSize) * 0.5;

		let opponentY = currentPaddle.shortAxis;

		// ease the movement towards the ideal position
		const machineSpeed = getMachineSpeed(props.opponentDifficulty);

		opponentY += (destination - opponentY) * machineSpeed;

		// keep the paddle inside of the canvas
		opponentY = Math.max(
			Math.min(opponentY, props.boardShortAxis - paddleLongSide),
			0
		);

		if (!visualViewport) return;
		const repositionedLongAxis =
			currentPaddle.position === 'A'
				? paddleShortSide * 2
				: visualViewport.height > visualViewport.width
				? visualViewport.height * 0.6 - paddleShortSide * 3
				: visualViewport.width * 0.6 - paddleShortSide * 3;

		setCurrentPaddle({
			...currentPaddle,
			longAxis: repositionedLongAxis,
			shortAxis: opponentY,
		});
	}

	function updatePlayer(
		currentPaddle: PaddleType,
		setCurrentPaddle: React.Dispatch<React.SetStateAction<PaddleType>>
	): void {
		let playerShortAxis = currentPaddle.shortAxis;

		if (props.gameOrientation === 'horizontal') {
			if (currentPaddle.position === 'A' ? paddleAUpPressed : paddleZUpPressed)
				playerShortAxis += props.playerSpeed;
			if (
				currentPaddle.position === 'A' ? paddleADownPressed : paddleZDownPressed
			)
				playerShortAxis -= props.playerSpeed;
		} else if (props.gameOrientation === 'vertical') {
			if (
				currentPaddle.position === 'A' ? paddleALeftPressed : paddleZLeftPressed
			)
				playerShortAxis -= props.playerSpeed;
			if (
				currentPaddle.position === 'A'
					? paddleARightPressed
					: paddleZRightPressed
			)
				playerShortAxis += props.playerSpeed;
		} else {
			throw new Error('Invalid game orientation');
		}
		// keep the paddle inside of the canvas
		playerShortAxis = Math.max(
			Math.min(playerShortAxis, props.boardShortAxis - paddleLongSide),
			0
		);

		if (!visualViewport) return;

		const repositionedLongAxis =
			currentPaddle.position === 'A'
				? paddleShortSide * 2
				: visualViewport.height > visualViewport.width
				? visualViewport.height * 0.6 - paddleShortSide * 3
				: visualViewport.width * 0.6 - paddleShortSide * 3;

		setCurrentPaddle({
			...currentPaddle,
			longAxis: repositionedLongAxis,
			shortAxis: playerShortAxis,
		});
	}

	function serve(): void {
		const ballVelocityCpy = { ...ballVelocity };

		ballVelocityCpy.longAxis = lastServePaddleA ? 1 : -1;
		ballVelocityCpy.shortAxis = props.ballSpeed * Math.random();

		setBallPosition(initialBallPosition);
		setBallVelocity(ballVelocityCpy);
		setLastServePaddleA(!lastServePaddleA);
	}

	function onBallMove(): void {
		let ballVelocityCpy = { ...ballVelocity };
		let ballPositionCpy = { ...ballPosition };

		// if going to hit top invert y direction
		if (ballPosition.shortAxis >= props.boardShortAxis - ballSize) {
			ballVelocityCpy.shortAxis = -Math.abs(ballVelocity.shortAxis);
		}
		// if going to hit bottom, invert y direction
		if (ballPosition.shortAxis <= 0) {
			ballVelocityCpy.shortAxis = Math.abs(ballVelocity.shortAxis);
		}

		// if going to hit edge, serve and award point
		if (
			ballPosition.longAxis > props.boardLongAxis - ballSize ||
			ballPosition.longAxis <= 0
		) {
			serve();
			ballPosition.longAxis > props.boardLongAxis - ballSize
				? props.handleScoreChange('player')
				: props.handleScoreChange('opponent');
			return;
		}

		// if going to hit paddle, invert x direction
		if (
			AABBIntersect(
				ballPosition.longAxis,
				ballPosition.shortAxis,
				ballSize,
				ballSize,
				paddleA.longAxis,
				paddleA.shortAxis,
				paddleShortSide,
				paddleLongSide
			) ||
			AABBIntersect(
				ballPosition.longAxis,
				ballPosition.shortAxis,
				ballSize,
				ballSize,
				paddleZ.longAxis,
				paddleZ.shortAxis,
				paddleShortSide,
				paddleLongSide
			)
		) {
			const currentPaddle =
				ballVelocity.longAxis < 0 ? { ...paddleA } : { ...paddleZ };

			const paddleName =
				ballPosition.longAxis < props.boardLongAxis / 2 ? 'player' : 'opponent';

			ballPositionCpy.longAxis =
				paddleName === 'player'
					? paddleA.longAxis + paddleShortSide
					: paddleZ.longAxis - ballSize;

			const pi = Math.PI;

			const hitLocation =
				(ballPosition.shortAxis + ballSize - currentPaddle.shortAxis) /
				(paddleLongSide + ballSize);

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

	function updateBoard(): void {
		onBallMove();
		updatePlayer(paddleA, setPaddleA);
		props.opponentMode === OpponentMode.Player
			? updatePlayer(paddleZ, setPaddleZ)
			: updateMachine(paddleZ, setPaddleZ);
	}

	if (!props.isPaused) {
		window.requestAnimationFrame(loop);
	}

	return (
		<div className='board-container'>
			<div
				className={`board board-${props.gameOrientation}-stripe`}
				style={{
					width:
						props.gameOrientation === 'horizontal'
							? props.boardLongAxis
							: props.boardShortAxis,
					height:
						props.gameOrientation === 'vertical'
							? props.boardLongAxis
							: props.boardShortAxis,
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
							? paddleLongSide
							: paddleShortSide
					}
					width={
						props.gameOrientation === 'vertical'
							? paddleLongSide
							: paddleShortSide
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
					size={ballSize}
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
							? paddleLongSide
							: paddleShortSide
					}
					width={
						props.gameOrientation === 'vertical'
							? paddleLongSide
							: paddleShortSide
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
