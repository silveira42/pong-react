import { Difficulty } from './Difficulty';

const getMachineSpeed = (difficulty: Difficulty) => {
	switch (difficulty) {
		case Difficulty.Easy:
			return 0.05;
		case Difficulty.Medium:
			return 0.1;
		case Difficulty.Hard:
			return 0.2;
		case Difficulty.Impossible:
			return 1;
		default:
			throw new Error('Invalid difficulty level');
	}
};

export default getMachineSpeed;
