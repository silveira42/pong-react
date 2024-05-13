export type GameSettingsType = {
	gameOrientation: string;
	boardShortAxis: number;
	boardLongAxis: number;
	headerShortAxis: number;
	headerLongAxis: number;
	playerSpeedStep: number;
	ballSpeedStep: number;
};

export type PlayerKeys = {
	upKey: string;
	downKey: string;
	leftKey: string;
	rightKey: string;
};
