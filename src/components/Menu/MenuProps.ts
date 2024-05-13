export type MenuProps = {
	gameOrientation: string;
	shortAxis: number;
	longAxis: number;
	title?: string;
	handleSelection?: (key: string) => void;
	options?: MenuOption[];
};

export type MenuOption = {
	key: string;
	label: string;
};
