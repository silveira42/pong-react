import React from 'react';
import Board from '../Board';
import './styles.css';
import Header from '../Header';
import { GameSettingsType } from './GameSettingsType';
import { Difficulty } from './Difficulty';
import {
	GameMode,
	GameOptionsType,
	GameStatus,
	OpponentMode,
} from './GameOptionsType';
import Menu from 'components/Menu';
import { MenuOption } from 'components/Menu/MenuProps';

if (!visualViewport) throw new Error('visualViewport is not supported');

/*
 * Regarding the axis:
 * The short axis is the smallest of the two dimensions.
 * For example, if the screen is in portrait mode, the short axis is the width.
 * The long axis is the main direction of the ball.
 */

const gameSettings: GameSettingsType = {
	gameOrientation:
		visualViewport.height > visualViewport.width ? 'vertical' : 'horizontal',
	boardShortAxis:
		visualViewport.height > visualViewport.width
			? visualViewport.width * 0.6
			: visualViewport.height * 0.6,
	boardLongAxis:
		visualViewport.height > visualViewport.width
			? visualViewport.height * 0.6
			: visualViewport.width * 0.6,
	headerShortAxis:
		visualViewport.height > visualViewport.width
			? visualViewport.width * 0.25
			: visualViewport.height * 0.25,
	headerLongAxis:
		visualViewport.height > visualViewport.width
			? visualViewport.height * 0.6
			: visualViewport.width * 0.6,
	paddleShortSide: 20,
	paddleLongSide: 100,
	playerSpeedStep: 1,
	ballSpeedStep: 0.5,
	ballSize: 20,
};

const initialGameOptions: GameOptionsType = {
	playerOneKeys: {
		upKey: 'w',
		downKey: 's',
		leftKey: 'a',
		rightKey: 'd',
	},
	playerTwoKeys: {
		upKey: 'ArrowUp',
		downKey: 'ArrowDown',
		leftKey: 'ArrowLeft',
		rightKey: 'ArrowRight',
	},
	playerSpeed: 10,
	ballSpeed: 4,
	opponentDifficulty: Difficulty.Medium,
	opponentMode: OpponentMode.Machine,
	gameMode: GameMode.Infinite,
	goalsPerMatch: 10,
};

const initialScore = {
	player: 0,
	opponent: 0,
};

function Game() {
	// Game settings state
	const [boardShortAxis, setBoardShortAxis] = React.useState(
		gameSettings.boardShortAxis
	);
	const [boardLongAxis, setBoardLongAxis] = React.useState(
		gameSettings.boardLongAxis
	);
	const [gameOrientation, setGameOrientation] = React.useState(
		gameSettings.gameOrientation
	);
	const [headerHeight, setHeaderHeight] = React.useState(
		gameSettings.headerShortAxis
	);
	const [headerWidth, setHeaderWidth] = React.useState(
		gameSettings.headerLongAxis
	);
	const [paddleWidth, setPaddleWidth] = React.useState(
		gameSettings.paddleShortSide
	);
	const [paddleHeight, setPaddleHeight] = React.useState(
		gameSettings.paddleLongSide
	);
	const [ballSize, setBallSize] = React.useState(gameSettings.ballSize);

	const [gameOptions, setGameOptions] = React.useState(initialGameOptions);

	// Game data state
	const [gameStatus, setGameStatus] = React.useState(GameStatus.InitialScreen);
	const [score, setScore] = React.useState(initialScore);
	const [isPaused, setIsPaused] = React.useState(false);

	React.useEffect(() => {
		window.addEventListener('resize', handlePageSizeChange);
		return () => {
			window.removeEventListener('resize', handlePageSizeChange);
		};
	}, []);

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

	function handlePageSizeChange() {
		if (!visualViewport) return;

		setBoardShortAxis(
			visualViewport.height > visualViewport.width
				? visualViewport.width * 0.6
				: visualViewport.height * 0.6
		);
		setBoardLongAxis(
			visualViewport.height > visualViewport.width
				? visualViewport.height * 0.6
				: visualViewport.width * 0.6
		);
		setHeaderHeight(
			visualViewport.height > visualViewport.width
				? visualViewport.width * 0.25
				: visualViewport.height * 0.25
		);
		setHeaderWidth(
			visualViewport.height > visualViewport.width
				? visualViewport.height * 0.6
				: visualViewport.width * 0.6
		);
		setGameOrientation(
			visualViewport.height > visualViewport.width ? 'vertical' : 'horizontal'
		);
		setPaddleWidth(20);
		setPaddleHeight(100);
		setBallSize(20);
	}

	function handleChangePause(newState: boolean) {
		setIsPaused(newState);
	}

	function handleScoreChange(newScore: { player: number; opponent: number }) {
		setScore(newScore);
	}

	function handlePlayerSpeedChange(newSpeed: number) {
		setGameOptions(prev => ({
			...prev,
			playerSpeed: newSpeed,
		}));
	}

	function handleOpponentDifficultyChange(newDifficulty: Difficulty) {
		setGameOptions(prev => ({
			...prev,
			opponentDifficulty: newDifficulty,
		}));
	}

	function handleBallSpeedChange(newSpeed: number) {
		setGameOptions(prev => ({
			...prev,
			ballSpeed: newSpeed,
		}));
	}

	function handleChooseOpponentMode(opponentMode: string) {
		setGameOptions(prev => ({
			...prev,
			opponentMode:
				opponentMode === 'machine' ? OpponentMode.Machine : OpponentMode.Player,
		}));
		setGameStatus(GameStatus.SelectKeys);
	}

	function handleChooseKeys(keys: string) {
		setGameOptions(prev => ({
			...prev,
			playerOneKeys:
				keys === 'wasd'
					? { upKey: 'w', downKey: 's', leftKey: 'a', rightKey: 'd' }
					: {
							upKey: 'ArrowUp',
							downKey: 'ArrowDown',
							leftKey: 'ArrowLeft',
							rightKey: 'ArrowRight',
					  },
		}));
		setGameStatus(GameStatus.SelectGameMode);
	}

	function handleChooseGameMode(gameMode: string) {
		setGameOptions(prev => ({
			...prev,
			gameMode:
				gameMode === GameMode.Match ? GameMode.Match : GameMode.Infinite,
		}));
		setGameStatus(GameStatus.Playing);
	}

	const opponentModeOptions: MenuOption[] = [
		{
			key: OpponentMode.Machine,
			label: 'Machine',
		},
		{
			key: OpponentMode.Player,
			label: 'Player',
		},
	];

	const selectKeysOptions: MenuOption[] = [
		{
			key: 'wasd',
			label: 'WASD',
		},
		{
			key: 'arrows',
			label: 'Arrows',
		},
	];

	const gameModeOptions: MenuOption[] = [
		{
			key: GameMode.Match,
			label: 'Match',
		},
		{
			key: GameMode.Infinite,
			label: 'Infinite',
		},
	];

	switch (gameStatus) {
		case GameStatus.InitialScreen:
			return (
				<div
					onClick={() => setGameStatus(GameStatus.SelectOpponentMode)}
					className='game-container'
				>
					<Header height={headerHeight} width={headerWidth} score={score} />
					<Menu
						title='Welcome!'
						gameOrientation={gameOrientation}
						shortAxis={boardShortAxis}
						longAxis={boardLongAxis}
					/>
				</div>
			);
		case GameStatus.SelectOpponentMode:
			return (
				<div className='game-container'>
					<Header height={headerHeight} width={headerWidth} score={score} />
					<Menu
						gameOrientation={gameOrientation}
						shortAxis={boardShortAxis}
						longAxis={boardLongAxis}
						options={opponentModeOptions}
						handleSelection={handleChooseOpponentMode}
					/>
				</div>
			);
		case GameStatus.SelectKeys:
			return (
				<div className='game-container'>
					<Header height={headerHeight} width={headerWidth} score={score} />
					<Menu
						gameOrientation={gameOrientation}
						shortAxis={boardShortAxis}
						longAxis={boardLongAxis}
						options={selectKeysOptions}
						handleSelection={handleChooseKeys}
					/>
				</div>
			);
		case GameStatus.SelectGameMode:
			return (
				<div className='game-container'>
					<Header height={headerHeight} width={headerWidth} score={score} />
					<Menu
						gameOrientation={gameOrientation}
						shortAxis={boardShortAxis}
						longAxis={boardLongAxis}
						options={gameModeOptions}
						handleSelection={handleChooseGameMode}
					/>
				</div>
			);
		case GameStatus.Playing:
			return (
				<div className='game-container'>
					<Header height={headerHeight} width={headerWidth} score={score} />
					<div className='board'>
						<Board
							shortAxis={boardShortAxis}
							longAxis={boardLongAxis}
							paddleShortSide={paddleWidth}
							paddleLongSide={paddleHeight}
							ballSize={ballSize}
							score={score}
							isPaused={isPaused}
							ballSpeed={gameOptions.ballSpeed}
							playerSpeed={gameOptions.playerSpeed}
							playerOneKeys={gameOptions.playerOneKeys}
							playerTwoKeys={gameOptions.playerTwoKeys}
							opponentDifficulty={gameOptions.opponentDifficulty}
							opponentMode={gameOptions.opponentMode}
							gameOrientation={gameOrientation}
							handleChangePause={handleChangePause}
							handleScoreChange={handleScoreChange}
						/>
					</div>
				</div>
			);
		default:
			return null;
	}
}

export default Game;
