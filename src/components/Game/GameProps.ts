import { MenuOption } from 'components/Menu/MenuProps';
import { GameStatus } from 'pages/GamePage/enums/GameStatus';
import { GameDataType } from 'pages/GamePage/types/GameDataType';
import { GameOptionsType } from 'pages/GamePage/types/GameOptionsType';
import { GameSettingsType } from 'pages/GamePage/types/GameSettingsType';

export type GameProps = {
	gameSettings: GameSettingsType;
	gameStatus: GameStatus;
	isPaused: boolean;
	gameOptions: GameOptionsType;
	gameData: GameDataType;
	handleNextScreen: () => void;
	opponentModeOptions: MenuOption[];
	handleChooseOpponentMode: (opponentMode: string) => void;
	selectKeysOptions: MenuOption[];
	handleChooseKeys: (keys: string) => void;
	gameModeOptions: MenuOption[];
	handleChooseGameMode: (gameMode: string) => void;
	handleChangePause: (newState: boolean) => void;
	handleScoreChange: (player: string) => void;
	handleChangePlayerSpeed: (newSpeed: number) => void;
	handleChangeBallSpeed: (newSpeed: number) => void;
	handleChangeOpponentDifficulty: (newDifficulty: number) => void;
	handleChangeGoalsPerMatch: (newGoals: number) => void;
};
