type AnyFunction = (...args: any[]) => any;

export interface DebouncedFunc<T extends AnyFunction> {
	(...args: Parameters<T>): void;
	cancel: () => void;
	flush: () => void;
}

export const debounce = <T extends AnyFunction>(
	func: T,
	wait: number
): DebouncedFunc<T> => {
	let timeoutId: ReturnType<typeof setTimeout> | undefined;
	let lastArgs: Parameters<T> | undefined;

	const debounced = (...args: Parameters<T>) => {
		lastArgs = args;
		if (timeoutId !== undefined) {
			clearTimeout(timeoutId);
		}
		timeoutId = setTimeout(() => {
			func(...args);
			timeoutId = undefined;
			lastArgs = undefined;
		}, wait);
	};

	debounced.cancel = () => {
		if (timeoutId !== undefined) {
			clearTimeout(timeoutId);
			timeoutId = undefined;
			lastArgs = undefined;
		}
	};

	debounced.flush = () => {
		if (timeoutId !== undefined && lastArgs !== undefined) {
			clearTimeout(timeoutId);
			func(...lastArgs);
			timeoutId = undefined;
			lastArgs = undefined;
		}
	};

	return debounced as DebouncedFunc<T>;
};
