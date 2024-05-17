import { ScoreType } from 'pages/GamePage/types/ScoreType';

export type HeaderProps = {
	height: number;
	width: number;
	gameScore: ScoreType;
	matchScore: ScoreType;
	showMatchScore: boolean;
};
