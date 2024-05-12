import { ScoreType } from 'components/Game/ScoreType';

export type BoardProps = {
	shortAxis: number;
	longAxis: number;
	paddleShortSide: number;
	paddleLongSide: number;
	ballSize: number;
	initialBallPosition: { longAxis: number; shortAxis: number };
	initialBallVelocity: { longAxis: number; shortAxis: number };
	initialPlayerPosition: { longAxis: number; shortAxis: number };
	initialOpponentPosition: { longAxis: number; shortAxis: number };
	score: { player: number; opponent: number };
	isPaused: boolean;
	ballSpeed: number;
	playerSpeed: number;
	opponentDifficulty: number;
	opponentMode: string;
	handleChangePause: (newState: boolean) => void;
	handleScoreChange: (newScore: ScoreType) => void;
};
