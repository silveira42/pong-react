import { Difficulty } from './Difficulty';

export type GameSettingsType = {
	boardShortAxis: number;
	boardLongAxis: number;
	headerShortAxis: number;
	headerLongAxis: number;
	playerSpeed: number;
	playerSpeedStep: number;
	playerOneKeys: PlayerKeys;
	playerTwoKeys: PlayerKeys;
	ballSpeed: number;
	ballSpeedStep: number;
	opponentDifficulty: Difficulty;
	opponentMode: string;
	paddleShortSide: number;
	paddleLongSide: number;
	ballSize: number;
	gameOrientation: string;
};

export type PlayerKeys = {
	upKey: string;
	downKey: string;
	leftKey: string;
	rightKey: string;
};
