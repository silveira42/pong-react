import { Difficulty } from 'components/Game/Difficulty';
import {
	GameMode,
	OpponentMode,
	PlayerKeys,
} from 'components/Game/GameOptionsType';

export type BoardProps = {
	gameOrientation: string;
	boardShortAxis: number;
	boardLongAxis: number;
	playerOneKeys: PlayerKeys;
	playerTwoKeys: PlayerKeys;
	playerSpeed: number;
	ballSpeed: number;
	opponentDifficulty: Difficulty;
	opponentMode: OpponentMode;
	score: { player: number; opponent: number };
	isPaused: boolean;
	handleChangePause: (newState: boolean) => void;
	handleScoreChange: (whoScored: string) => void;
};
