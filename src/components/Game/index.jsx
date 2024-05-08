import React from 'react';
import Board from '../../components/Board';
import './styles.css';

const height = parseFloat(visualViewport.height * 0.7);
const width = parseFloat(visualViewport.width * 0.7);

const paddleHeight = 100;
const paddleWidth = 20;
const ballSize = 20;

const initialBallPosition = { x: width / 2, y: height / 2 - ballSize / 2 };
const initialBallVelocity = { x: 1, y: 1 };
const initialPlayerSpeed = 10;
const initialOpponentDifficulty = 2; //1, 2 ou 3.

const initialBallSpeed = 3;
const playerSpeedStep = 1;
const opponentDifficultyStep = 1;
const ballSpeedStep = 0.5;

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

	return (
		<div className='game-container'>
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
			<Board
				height={height}
				width={width}
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
