import { Difficulty } from 'pages/GamePage/enums/Difficulty';
import { OpponentMode } from 'pages/GamePage/enums/OpponentMode';
import { PlayerKeys } from 'pages/GamePage/types/PlayerKeysType';

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
