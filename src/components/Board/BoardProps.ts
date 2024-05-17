import { Difficulty } from 'pages/Game/enums/Difficulty';
import { OpponentMode } from 'pages/Game/enums/OpponentMode';
import { PlayerKeys } from 'pages/Game/types/PlayerKeysType';

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
