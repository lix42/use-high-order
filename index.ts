// Main hooks
export {
	useAnyHighOrderFunction,
	useHighOrderFunction,
} from "./useHighOrder";

export type {
	AnyFunction,
	InputFunction,
	OutputFunction,
	HighOrderFunction,
} from "./useHighOrder";

// Utility hooks
export { useCurrentRef } from "./useCurrentRef";

// Example hooks
export { useDebounce } from "./useDebounce";

// Utility functions
export { debounce } from "./debounce";
export type { DebouncedFunc } from "./debounce";