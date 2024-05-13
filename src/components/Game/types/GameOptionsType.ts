import { Difficulty } from '../enums/Difficulty';
import { GameMode } from '../enums/GameMode';
import { OpponentMode } from '../enums/OpponentMode';
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
