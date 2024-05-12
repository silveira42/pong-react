import { ScoreType } from 'components/Game/ScoreType';

export type BoardProps = {
	height: number;
	width: number;
	paddleWidth: number;
	paddleHeight: number;
	ballSize: number;
	initialBallPosition: { x: number; y: number };
	initialBallVelocity: { x: number; y: number };
	initialPlayerPosition: { x: number; y: number };
	initialOpponentPosition: { x: number; y: number };
	score: { player: number; opponent: number };
	isPaused: boolean;
	ballSpeed: number;
	playerSpeed: number;
	opponentDifficulty: number;
	opponentMode: string;
	handleChangePause: (newState: boolean) => void;
	handleScoreChange: (newScore: ScoreType) => void;
};
