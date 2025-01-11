import { useCallback, useEffect, useReducer, useState } from "react";

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(
	initialValue: [boolean, T | null] = [true, null],
): UseStateHook<T> {
	return useReducer(
		(_: [boolean, T | null], action: T | null = null): [boolean, T | null] => [
			false,
			action,
		],
		initialValue,
	);
}

export async function setStorageItemAsync(key: string, value: string | null) {
	try {
		if (value === null) localStorage.removeItem(key);
		else localStorage.setItem(key, value);
	} catch (error) {
		console.error("Error setting storage item: ", error);
	}
}

export function useStorageState(key: string): UseStateHook<string> {
	const [state, setState] = useAsyncState<string>();

	useEffect(() => {
		try {
			if (typeof localStorage !== "undefined") {
				const token = localStorage.getItem(key);
				if (!token) {
					localStorage.removeItem(key);
				}

				setState(token);
			}
		} catch (error) {
			console.error("Error getting storage item: ", error);
		}
	}, [key]);

	const setValue = useCallback(
		(value: string | null) => {
			setState(value);
			setStorageItemAsync(key, value);
		},
		[key],
	);

	return [state, setValue];
}

export function useStorageStateList(key: string): UseStateHook<string[]> {
	const [state, setState] = useAsyncState<string[]>();

	useEffect(() => {
		try {
			if (typeof localStorage !== "undefined") {
				const storedValue = localStorage.getItem(key);
				const parsedValue = storedValue ? JSON.parse(storedValue) : [];
				setState(parsedValue);
			}
		} catch (error) {
			console.error("Error getting storage item: ", error);
		}
	}, [key]);

	const setValue = useCallback(
		(value: string[] | null) => {
			setState(value);
			setStorageItemAsync(key, value ? JSON.stringify(value) : null);
		},
		[key],
	);

	return [state, setValue];
}