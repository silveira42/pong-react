export type PauseMenuProps = {
	handleChangePause: (newState: boolean) => void;
	gameOrientation: string;
	boardLongAxis: number;
	boardShortAxis: number;
};
