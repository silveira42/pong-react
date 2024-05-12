import { ScoreType } from 'components/Game/ScoreType';

export type HeaderProps = {
	score: ScoreType;
	playerSpeed: number;
	opponentDifficulty: number;
	ballSpeed: number;
	opponentMode: string;
	height: number;
	width: number;
	handlePlayerSpeedIncrease: () => void;
	handlePlayerSpeedDecrease: () => void;
	handleOpponentDifficultyIncrease: () => void;
	handleOpponentDifficultyDecrease: () => void;
	handleBallSpeedIncrease: () => void;
	handleBallSpeedDecrease: () => void;
	handleToggleOpponentMode: () => void;
};
