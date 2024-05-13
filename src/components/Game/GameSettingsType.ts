import { Difficulty } from './Difficulty';

export type GameSettingsType = {
	boardShortAxis: number;
	boardLongAxis: number;
	headerShortAxis: number;
	headerLongAxis: number;
	playerSpeed: number;
	playerSpeedStep: number;
	playerOneUpKey: string;
	playerOneDownKey: string;
	playerTwoUpKey: string;
	playerTwoDownKey: string;
	playerOneLeftKey: string;
	playerOneRightKey: string;
	playerTwoLeftKey: string;
	playerTwoRightKey: string;
	ballSpeed: number;
	ballSpeedStep: number;
	opponentDifficulty: Difficulty;
	opponentMode: string;
	paddleShortSide: number;
	paddleLongSide: number;
	ballSize: number;
	gameOrientation: string;
};
