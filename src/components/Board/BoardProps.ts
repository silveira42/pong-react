import { PlayerKeys } from 'components/Game/GameSettingsType';
import { ScoreType } from 'components/Game/ScoreType';

export type BoardProps = {
	shortAxis: number;
	longAxis: number;
	paddleShortSide: number;
	paddleLongSide: number;
	ballSize: number;
	score: { player: number; opponent: number };
	isPaused: boolean;
	ballSpeed: number;
	playerSpeed: number;
	playerOneKeys: PlayerKeys;
	playerTwoKeys: PlayerKeys;
	opponentDifficulty: number;
	opponentMode: string;
	gameOrientation: string;
	handleChangePause: (newState: boolean) => void;
	handleScoreChange: (newScore: ScoreType) => void;
};
