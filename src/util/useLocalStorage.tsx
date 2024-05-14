import { useEffect } from 'react';
import { useState } from 'react';

export default function useLocalStorage<T>(
	key: string,
	defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
	const [value, setValue] = useState<T>(() => {
		try {
			const storedValue = localStorage.getItem(key);
			return storedValue ? JSON.parse(storedValue) : defaultValue;
		} catch (error) {
			console.log(error);
			return defaultValue;
		}
	});

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(value));
	}, [key, value]);

	return [value, setValue];
}
