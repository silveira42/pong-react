import { ScoreType } from 'pages/Game/types/ScoreType';

export type HeaderProps = {
	height: number;
	width: number;
	gameScore: ScoreType;
	matchScore: ScoreType;
	showMatchScore: boolean;
};
