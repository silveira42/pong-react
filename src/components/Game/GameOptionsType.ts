import { Difficulty } from './Difficulty';

export type GameOptionsType = {
	playerOneKeys: PlayerKeys;
	playerTwoKeys: PlayerKeys;
	playerSpeed: number;
	ballSpeed: number;
	opponentDifficulty: Difficulty;
	opponentMode: OpponentMode;
	gameMode: GameMode;
	goalsPerMatch: number;
};

export type PlayerKeys = {
	upKey: string;
	downKey: string;
	leftKey: string;
	rightKey: string;
};

export enum GameMode {
	Match = 'match',
	Infinite = 'infinite',
}

export enum OpponentMode {
	Machine = 'machine',
	Player = 'opponent',
}

export enum GameStatus {
	InitialScreen = 0,
	SelectOpponentMode = 1,
	SelectKeys = 2,
	SelectGameMode = 3,
	Playing = 4,
	GameOver = 5,
}
