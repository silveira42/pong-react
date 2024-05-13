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
	playerOneUpKey: string;
	playerOneDownKey: string;
	playerTwoUpKey: string;
	playerTwoDownKey: string;
	opponentDifficulty: number;
	opponentMode: string;
	handleChangePause: (newState: boolean) => void;
	handleScoreChange: (newScore: ScoreType) => void;
};
