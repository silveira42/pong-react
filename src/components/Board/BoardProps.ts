import { GameOptionsType } from 'components/Game/GameOptionsType';
import { GameSettingsType } from 'components/Game/GameSettingsType';

export type BoardProps = {
	gameSettings: GameSettingsType;
	gameOptions: GameOptionsType;
	score: { player: number; opponent: number };
	isPaused: boolean;
	handleChangePause: (newState: boolean) => void;
	handleScoreChange: (whoScored: string) => void;
};
