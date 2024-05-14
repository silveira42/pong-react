/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';

export default function useKeyPress(targetKey: string) {
	const [keyPressed, setKeyPressed] = React.useState(false);

	function downHandler({ key }: { key: string }) {
		if (key === targetKey) {
			setKeyPressed(true);
		}
	}

	const upHandler = ({ key }: { key: string }) => {
		if (key === targetKey) {
			setKeyPressed(false);
		}
	};

	React.useEffect(() => {
		window.addEventListener('keydown', downHandler);
		window.addEventListener('keyup', upHandler);
		return () => {
			window.removeEventListener('keydown', downHandler);
			window.removeEventListener('keyup', upHandler);
		};
	}, []);

	return keyPressed;
}
