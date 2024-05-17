/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import './styles.css';
import Board from '../../components/Board';
import Header from '../../components/Header';
import Menu from 'components/Menu';
import useLocalStorage from 'util/useLocalStorage';
import { GameSettingsType } from './types/GameSettingsType';
import { Difficulty } from './enums/Difficulty';
import { GameOptionsType } from './types/GameOptionsType';
import { MenuOption } from 'components/Menu/MenuProps';
import { GameDataType } from './types/GameDataType';
import { useKeyPressEvent } from 'react-use';
import { GameStatus } from './enums/GameStatus';
import { GameMode } from './enums/GameMode';
import { OpponentMode } from './enums/OpponentMode';
import PauseMenu from 'components/PauseMenu';

if (!visualViewport) throw new Error('visualViewport is not supported');

/*
 * Regarding the axis:
 * The short axis is the smallest of the two dimensions.
 * For example, if the screen is in portrait mode, the short axis is the width.
 * The long axis is the main direction of the ball.
 */

const initialGameSettings: GameSettingsType = {
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
			? visualViewport.width * 0.1
			: visualViewport.height * 0.1,
	headerLongAxis:
		visualViewport.height > visualViewport.width
			? visualViewport.height * 0.6
			: visualViewport.width * 0.6,
	playerSpeedStep: 1,
	ballSpeedStep: 0.5,
	maxGoalsPerMatch: 100,
};

const initialGameOptions: GameOptionsType = {
	playerOneKeys: {
		upKey: 'w',
		downKey: 's',
		leftKey: 'a',
		rightKey: 'd',
		code: 'wasd',
	},
	playerTwoKeys: {
		upKey: 'ArrowUp',
		downKey: 'ArrowDown',
		leftKey: 'ArrowLeft',
		rightKey: 'ArrowRight',
		code: 'arrows',
	},
	playerSpeed: 15,
	ballSpeed: 4,
	opponentDifficulty: Difficulty.Hard,
	opponentMode: OpponentMode.Machine,
	gameMode: GameMode.Infinite,
	goalsPerMatch: 5,
};

const initialGameData: GameDataType = {
	infiniteMachineScore: {
		player: 0,
		opponent: 0,
	},
	gameScore: {
		player: 0,
		opponent: 0,
	},
	matchScore: {
		player: 0,
		opponent: 0,
	},
};

export default function Game() {
	const [gameSettings, setGameSettings] = React.useState(initialGameSettings);
	const [gameStatus, setGameStatus] = React.useState(GameStatus.InitialScreen);
	const [isPaused, setIsPaused] = React.useState(false);

	const [gameOptions, setGameOptions] = useLocalStorage<GameOptionsType>(
		'gameOptions',
		initialGameOptions
	);

	const [gameData, setGameData] = useLocalStorage<GameDataType>(
		'gameData',
		initialGameData
	);

	// windows resize event
	React.useEffect(() => {
		window.addEventListener('resize', handlePageSizeChange);
		return () => {
			window.removeEventListener('resize', handlePageSizeChange);
		};
	}, []);

	// windows blur and focus event
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

	useKeyPressEvent('r', () => {
		setGameStatus(GameStatus.InitialScreen);
		setGameData({ ...initialGameData, matchScore: gameData.matchScore });
	});

	useKeyPressEvent('R', () => {
		setGameStatus(GameStatus.InitialScreen);
		setGameOptions(initialGameOptions);
		setGameData(initialGameData);
	});

	function handlePageSizeChange(): void {
		if (!visualViewport) return;

		setGameSettings({
			...gameSettings,
			gameOrientation:
				visualViewport.height > visualViewport.width
					? 'vertical'
					: 'horizontal',
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
		});
	}

	function handleChangePause(newState: boolean): void {
		setIsPaused(newState);
	}

	function handleChangeGoalsPerMatch(goalsPerMatch: number): void {
		setGameOptions({
			...gameOptions,
			goalsPerMatch: goalsPerMatch,
		});
	}

	function handleChangeOpponentDifficulty(newOpponentDifficulty: number): void {
		setGameOptions({
			...gameOptions,
			opponentDifficulty: newOpponentDifficulty,
		});
	}

	function handleChangeBallSpeed(newBallSpeed: number): void {
		setGameOptions({
			...gameOptions,
			ballSpeed: newBallSpeed,
		});
	}

	function handleChangePlayerSpeed(newPlayerSpeed: number): void {
		setGameOptions({
			...gameOptions,
			playerSpeed: newPlayerSpeed,
		});
	}

	function handleScoreChange(whoScored: string): void {
		// In infinite mode
		if (gameOptions.gameMode === GameMode.Infinite) {
			const newPlayerScore =
				whoScored === 'player'
					? gameData.infiniteMachineScore.player + 1
					: gameData.infiniteMachineScore.player;
			const newOpponentScore =
				whoScored === 'opponent'
					? gameData.infiniteMachineScore.opponent + 1
					: gameData.infiniteMachineScore.opponent;
			setGameData({
				...gameData,
				infiniteMachineScore: {
					player: newPlayerScore,
					opponent: newOpponentScore,
				},
			});
		} else if (gameOptions.gameMode === GameMode.Match) {
			const playerWon =
				gameData.gameScore.player + 1 >= gameOptions.goalsPerMatch;
			const opponentWon =
				gameData.gameScore.opponent + 1 >= gameOptions.goalsPerMatch;
			// Check if the match is over
			if (playerWon || opponentWon) {
				setGameData({
					...gameData,
					gameScore: initialGameData.gameScore,
					matchScore: {
						player: playerWon
							? gameData.matchScore.player + 1
							: gameData.matchScore.player,
						opponent: opponentWon
							? gameData.matchScore.opponent + 1
							: gameData.matchScore.opponent,
					},
				});
			} else {
				setGameData({
					...gameData,
					gameScore: {
						player:
							whoScored === 'player'
								? gameData.gameScore.player + 1
								: gameData.gameScore.player,
						opponent:
							whoScored === 'opponent'
								? gameData.gameScore.opponent + 1
								: gameData.gameScore.opponent,
					},
				});
			}
		}
	}

	function handleChooseOpponentMode(opponentMode: string): void {
		setGameOptions({
			...gameOptions,
			opponentMode:
				opponentMode === 'machine' ? OpponentMode.Machine : OpponentMode.Player,
		});
		setGameStatus(GameStatus.SelectKeys);
	}

	function handleChooseKeys(keys: string): void {
		const wasd = {
			upKey: 'w',
			downKey: 's',
			leftKey: 'a',
			rightKey: 'd',
			code: 'wasd',
		};
		const arrows = {
			upKey: 'ArrowUp',
			downKey: 'ArrowDown',
			leftKey: 'ArrowLeft',
			rightKey: 'ArrowRight',
			code: 'arrows',
		};

		setGameOptions({
			...gameOptions,
			playerOneKeys: keys === 'wasd' ? wasd : arrows,
			playerTwoKeys: keys === 'wasd' ? arrows : wasd,
		});

		if (gameStatus === GameStatus.SelectKeys)
			setGameStatus(GameStatus.SelectGameMode);
	}

	function handleChooseGameMode(gameMode: string): void {
		setGameOptions({
			...gameOptions,
			gameMode:
				gameMode === GameMode.Match ? GameMode.Match : GameMode.Infinite,
		});
		setGameStatus(GameStatus.Playing);
	}

	function handleNextScreen(): void {
		setGameStatus(GameStatus.SelectOpponentMode);
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
				<div className='game-container'>
					<Header
						height={gameSettings.headerShortAxis}
						width={gameSettings.headerLongAxis}
						gameScore={
							gameOptions.gameMode === GameMode.Infinite
								? gameData.infiniteMachineScore
								: gameData.gameScore
						}
						matchScore={gameData.matchScore}
						showMatchScore={gameOptions.gameMode === GameMode.Match}
					/>
					<Menu
						title='Welcome!'
						gameOrientation={gameSettings.gameOrientation}
						shortAxis={gameSettings.boardShortAxis}
						longAxis={gameSettings.boardLongAxis}
						handleClick={handleNextScreen}
					/>
				</div>
			);
		case GameStatus.SelectOpponentMode:
			return (
				<div className='game-container'>
					<Header
						height={gameSettings.headerShortAxis}
						width={gameSettings.headerLongAxis}
						gameScore={
							gameOptions.gameMode === GameMode.Infinite
								? gameData.infiniteMachineScore
								: gameData.gameScore
						}
						matchScore={gameData.matchScore}
						showMatchScore={gameOptions.gameMode === GameMode.Match}
					/>
					<Menu
						title='Choose opponent mode:'
						gameOrientation={gameSettings.gameOrientation}
						shortAxis={gameSettings.boardShortAxis}
						longAxis={gameSettings.boardLongAxis}
						options={opponentModeOptions}
						handleSelection={handleChooseOpponentMode}
					/>
				</div>
			);
		case GameStatus.SelectKeys:
			return (
				<div className='game-container'>
					<Header
						height={gameSettings.headerShortAxis}
						width={gameSettings.headerLongAxis}
						gameScore={
							gameOptions.gameMode === GameMode.Infinite
								? gameData.infiniteMachineScore
								: gameData.gameScore
						}
						matchScore={gameData.matchScore}
						showMatchScore={gameOptions.gameMode === GameMode.Match}
					/>
					<Menu
						title={
							gameOptions.opponentMode === OpponentMode.Machine
								? 'Choose your keys:'
								: 'Choose player one keys:'
						}
						gameOrientation={gameSettings.gameOrientation}
						shortAxis={gameSettings.boardShortAxis}
						longAxis={gameSettings.boardLongAxis}
						options={selectKeysOptions}
						handleSelection={handleChooseKeys}
					/>
				</div>
			);
		case GameStatus.SelectGameMode:
			return (
				<div className='game-container'>
					<Header
						height={gameSettings.headerShortAxis}
						width={gameSettings.headerLongAxis}
						gameScore={
							gameOptions.gameMode === GameMode.Infinite
								? gameData.infiniteMachineScore
								: gameData.gameScore
						}
						matchScore={gameData.matchScore}
						showMatchScore={gameOptions.gameMode === GameMode.Match}
					/>
					<Menu
						title='Choose game mode:'
						gameOrientation={gameSettings.gameOrientation}
						shortAxis={gameSettings.boardShortAxis}
						longAxis={gameSettings.boardLongAxis}
						options={gameModeOptions}
						handleSelection={handleChooseGameMode}
					/>
				</div>
			);
		case GameStatus.Playing:
			return (
				<div className='game-container'>
					<Header
						height={gameSettings.headerShortAxis}
						width={gameSettings.headerLongAxis}
						gameScore={
							gameOptions.gameMode === GameMode.Infinite
								? gameData.infiniteMachineScore
								: gameData.gameScore
						}
						matchScore={gameData.matchScore}
						showMatchScore={gameOptions.gameMode === GameMode.Match}
					/>
					<div className='board-container'>
						<Board
							gameOrientation={gameSettings.gameOrientation}
							boardShortAxis={gameSettings.boardShortAxis}
							boardLongAxis={gameSettings.boardLongAxis}
							score={gameData.gameScore}
							isPaused={isPaused}
							playerOneKeys={gameOptions.playerOneKeys}
							playerTwoKeys={gameOptions.playerTwoKeys}
							playerSpeed={gameOptions.playerSpeed}
							ballSpeed={gameOptions.ballSpeed}
							opponentDifficulty={gameOptions.opponentDifficulty}
							opponentMode={gameOptions.opponentMode}
							handleChangePause={handleChangePause}
							handleScoreChange={handleScoreChange}
						/>
						{isPaused ? (
							<PauseMenu
								handleChangePause={handleChangePause}
								gameOrientation={gameSettings.gameOrientation}
								boardShortAxis={gameSettings.boardShortAxis}
								boardLongAxis={gameSettings.boardLongAxis}
								playerSpeed={gameOptions.playerSpeed}
								handleChangePlayerSpeed={handleChangePlayerSpeed}
								ballSpeed={gameOptions.ballSpeed}
								handleChangeBallSpeed={handleChangeBallSpeed}
								opponentDifficulty={gameOptions.opponentDifficulty}
								handleChangeOpponentDifficulty={handleChangeOpponentDifficulty}
								playerOneKeys={gameOptions.playerOneKeys.code}
								handleChooseKeys={handleChooseKeys}
								goalsPerMatch={gameOptions.goalsPerMatch}
								maxGoalsPerMatch={gameSettings.maxGoalsPerMatch}
								handleChangeGoalsPerMatch={handleChangeGoalsPerMatch}
								gameMode={gameOptions.gameMode}
								handleChooseGameMode={handleChooseGameMode}
							/>
						) : null}
					</div>
				</div>
			);
		default:
			return null;
	}
}
