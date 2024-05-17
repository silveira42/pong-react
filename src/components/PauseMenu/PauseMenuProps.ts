import { GameMode } from 'pages/Game/enums/GameMode';

export type PauseMenuProps = {
	handleChangePause: (newState: boolean) => void;
	gameOrientation: string;
	boardLongAxis: number;
	boardShortAxis: number;
	playerSpeed: number;
	ballSpeed: number;
	opponentDifficulty: number;
	playerOneKeys: string;
	gameMode: GameMode;
	goalsPerMatch: number;
	maxGoalsPerMatch: number;
	handleChangePlayerSpeed: (newSpeed: number) => void;
	handleChangeBallSpeed: (newSpeed: number) => void;
	handleChangeOpponentDifficulty: (newSpeed: number) => void;
	handleChooseKeys: (keys: string) => void;
	handleChooseGameMode: (newGameMode: string) => void;
	handleChangeGoalsPerMatch: (newGoalsPerMatch: number) => void;
};
