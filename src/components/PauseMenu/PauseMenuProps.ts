import { GameMode } from 'components/Game/enums/GameMode';
import { PlayerKeys } from 'components/Game/types/PlayerKeysType';

export type PauseMenuProps = {
	handleChangePause: (newState: boolean) => void;
	gameOrientation: string;
	boardLongAxis: number;
	boardShortAxis: number;
	playerSpeed: number;
	handleChangePlayerSpeed: (newSpeed: number) => void;
	ballSpeed: number;
	handleChangeBallSpeed: (newSpeed: number) => void;
	opponentDifficulty: number;
	handleChangeOpponentDifficulty: (newSpeed: number) => void;
	playerOneKeys: string;
	handleChooseKeys: (keys: string) => void;
	gameMode: GameMode;
	handleChooseGameMode: (newGameMode: string) => void;
	goalsPerMatch: number;
	handleChangeGoalsPerMatch: (newGoalsPerMatch: number) => void;
};
