export type MenuProps = {
	gameOrientation: string;
	shortAxis: number;
	longAxis: number;
	title?: string;
	options?: MenuOption[];
	handleSelection?: (key: string) => void;
	handleClick?: () => void;
};

export type MenuOption = {
	key: string;
	label: string;
};
