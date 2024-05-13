/* eslint-disable react-hooks/exhaustive-deps */
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
import { GameDataType } from './GameDataType';
import { useKeyPressEvent } from 'react-use';
import useLocalStorage from 'util/useLocalStorage';

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
			? visualViewport.width * 0.25
			: visualViewport.height * 0.25,
	headerLongAxis:
		visualViewport.height > visualViewport.width
			? visualViewport.height * 0.6
			: visualViewport.width * 0.6,
	playerSpeedStep: 1,
	ballSpeedStep: 0.5,
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
	playerSpeed: 15,
	ballSpeed: 4,
	opponentDifficulty: Difficulty.Hard,
	opponentMode: OpponentMode.Machine,
	gameMode: GameMode.Infinite,
	goalsPerMatch: 5,
};

const initialGameData: GameDataType = {
	score: {
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
	const [gameOptions, setGameOptions] = React.useState(initialGameOptions);
	const [gameStatus, setGameStatus] = React.useState(GameStatus.InitialScreen);
	const [score, setScore] = React.useState(initialGameData.score);
	const [isPaused, setIsPaused] = React.useState(false);

	const [playerMatchScore, setPlayerMatchScore] = useLocalStorage(
		'playerMatchScore',
		initialGameData.matchScore.player.toString()
	);
	const [opponentMatchScore, setOpponentMatchScore] = useLocalStorage(
		'opponentMatchScore',
		initialGameData.matchScore.opponent.toString()
	);

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

	useKeyPressEvent('r', () => {
		setGameStatus(GameStatus.InitialScreen);
		setGameOptions(initialGameOptions);
	});

	useKeyPressEvent('R', () => {
		setGameStatus(GameStatus.InitialScreen);
		setGameOptions(initialGameOptions);
		setPlayerMatchScore(initialGameData.matchScore.player);
		setOpponentMatchScore(initialGameData.matchScore.opponent);
	});

	function handlePageSizeChange() {
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

	function handleChangePause(newState: boolean) {
		setIsPaused(newState);
	}

	function handleScoreChange(whoScored: string) {
		const scoreCpy = { ...score };

		scoreCpy.player =
			whoScored === 'player' ? scoreCpy.player + 1 : scoreCpy.player;
		scoreCpy.opponent =
			whoScored === 'opponent' ? scoreCpy.opponent + 1 : scoreCpy.opponent;

		// Check if the match is over
		if (
			scoreCpy.player === gameOptions.goalsPerMatch &&
			gameOptions.gameMode === GameMode.Match
		) {
			setPlayerMatchScore(playerMatchScore + 1);
			setScore(initialGameData.score);
		} else if (
			scoreCpy.opponent === gameOptions.goalsPerMatch &&
			gameOptions.gameMode === GameMode.Match
		) {
			setOpponentMatchScore(opponentMatchScore + 1);
			setScore(initialGameData.score);
		} else {
			setScore(scoreCpy);
		}
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
		const wasd = { upKey: 'w', downKey: 's', leftKey: 'a', rightKey: 'd' };
		const arrows = {
			upKey: 'ArrowUp',
			downKey: 'ArrowDown',
			leftKey: 'ArrowLeft',
			rightKey: 'ArrowRight',
		};

		setGameOptions(prev => ({
			...prev,
			playerOneKeys: keys === 'wasd' ? wasd : arrows,
			playerTwoKeys: keys === 'wasd' ? arrows : wasd,
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

	function handleNextScreen() {
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
						score={score}
						matchScore={{
							player: playerMatchScore,
							opponent: opponentMatchScore,
						}}
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
						score={score}
						matchScore={{
							player: playerMatchScore,
							opponent: opponentMatchScore,
						}}
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
						score={score}
						matchScore={{
							player: playerMatchScore,
							opponent: opponentMatchScore,
						}}
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
						score={score}
						matchScore={{
							player: playerMatchScore,
							opponent: opponentMatchScore,
						}}
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
						score={score}
						matchScore={{
							player: playerMatchScore,
							opponent: opponentMatchScore,
						}}
						showMatchScore={gameOptions.gameMode === GameMode.Match}
					/>
					<div className='board'>
						<Board
							gameOrientation={gameSettings.gameOrientation}
							boardShortAxis={gameSettings.boardShortAxis}
							boardLongAxis={gameSettings.boardLongAxis}
							score={score}
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
					</div>
				</div>
			);
		default:
			return null;
	}
}
