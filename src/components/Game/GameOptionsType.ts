import { Difficulty } from './Difficulty';
import { GameMode } from './GameMode';
import { OpponentMode } from './OpponentMode';
import { PlayerKeys } from './PlayerKeysType';

export type GameOptionsType = {
	playerOneKeys: PlayerKeys;
	playerTwoKeys: PlayerKeys;
	playerSpeed: number;
	ballSpeed: number;
	opponentDifficulty: Difficulty;
	opponentMode: OpponentMode;
	gameMode: GameMode;
	goalsPerMatch: number;
};
