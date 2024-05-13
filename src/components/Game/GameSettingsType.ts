export type GameSettingsType = {
	gameOrientation: string;
	boardShortAxis: number;
	boardLongAxis: number;
	headerShortAxis: number;
	headerLongAxis: number;
	paddleShortSide: number;
	paddleLongSide: number;
	playerSpeedStep: number;
	ballSpeedStep: number;
	ballSize: number;
};

export type PlayerKeys = {
	upKey: string;
	downKey: string;
	leftKey: string;
	rightKey: string;
};
