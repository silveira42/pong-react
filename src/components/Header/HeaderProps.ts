import { ScoreType } from 'components/Game/types/ScoreType';

export type HeaderProps = {
	height: number;
	width: number;
	score: ScoreType;
	matchScore: ScoreType;
	showMatchScore: boolean;
};
