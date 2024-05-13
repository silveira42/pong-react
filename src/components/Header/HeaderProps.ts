import { Difficulty } from 'components/Game/Difficulty';
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
	handleOpponentDifficultyChange: (newDifficulty: Difficulty) => void;
	handleBallSpeedIncrease: () => void;
	handleBallSpeedDecrease: () => void;
	handleToggleOpponentMode: () => void;
};
