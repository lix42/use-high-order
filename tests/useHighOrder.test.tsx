import { describe, test, expect } from "bun:test";
import { renderHook } from "@testing-library/react";
import { useAnyHighOrderFunction, useHighOrderFunction } from "../useHighOrder";

describe("useAnyHighOrderFunction", () => {
	test("should call high order function once", () => {
		let highOrderCallCount = 0;
		const highOrder = (fn: () => void) => {
			highOrderCallCount++;
			return fn;
		};

		const inputFn = () => {};

		const { rerender } = renderHook(() =>
			useAnyHighOrderFunction(highOrder, inputFn)
		);

		expect(highOrderCallCount).toBe(1);

		rerender();
		rerender();
		expect(highOrderCallCount).toBe(1);
	});

	test("should return the same output function across renders", () => {
		const highOrder = (fn: () => void) => fn;
		const inputFn = () => {};

		const { result, rerender } = renderHook(() =>
			useAnyHighOrderFunction(highOrder, inputFn)
		);

		const firstOutput = result.current;

		rerender();
		expect(result.current).toBe(firstOutput);

		rerender();
		expect(result.current).toBe(firstOutput);
	});

	test("should call the latest input function", () => {
		let callCount = 0;
		const highOrder = (fn: () => void) => fn;

		const { result, rerender } = renderHook(
			({ fn }) => useAnyHighOrderFunction(highOrder, fn),
			{
				initialProps: {
					fn: () => {
						callCount = 1;
					},
				},
			}
		);

		result.current();
		expect(callCount).toBe(1);

		rerender({
			fn: () => {
				callCount = 2;
			},
		});

		result.current();
		expect(callCount).toBe(2);
	});

	test("should pass additional arguments to high order function", () => {
		let capturedArgs: any[] = [];
		const highOrder = (fn: () => void, ...args: any[]) => {
			capturedArgs = args;
			return fn;
		};

		const inputFn = () => {};

		renderHook(() => useAnyHighOrderFunction(highOrder, inputFn, "a", "b", "c"));

		expect(capturedArgs).toEqual(["a", "b", "c"]);
	});

	test("should work with a wrapper that adds functionality", () => {
		const highOrder = (fn: (x: number) => number) => {
			return (x: number) => {
				const result = fn(x);
				return result * 2;
			};
		};

		let multiplier = 3;
		const { result, rerender } = renderHook(
			({ mult }) => useAnyHighOrderFunction(highOrder, (x: number) => x * mult),
			{ initialProps: { mult: multiplier } }
		);

		expect(result.current(5)).toBe(30); // 5 * 3 * 2

		multiplier = 4;
		rerender({ mult: multiplier });
		expect(result.current(5)).toBe(40); // 5 * 4 * 2
	});
});

describe("useHighOrderFunction", () => {
	test("should work the same as useAnyHighOrderFunction", () => {
		let highOrderCallCount = 0;
		const highOrder = (fn: (x: number) => number) => {
			highOrderCallCount++;
			return fn;
		};

		const inputFn = (x: number) => x * 2;

		const { result, rerender } = renderHook(() =>
			useHighOrderFunction(highOrder, inputFn)
		);

		expect(highOrderCallCount).toBe(1);
		expect(result.current(5)).toBe(10);

		rerender();
		expect(highOrderCallCount).toBe(1);
	});

	test("should preserve input/output function signature", () => {
		const highOrder = (fn: (a: string, b: number) => string) => {
			return (a: string, b: number) => fn(a, b).toUpperCase();
		};

		const inputFn = (a: string, b: number) => `${a}-${b}`;

		const { result } = renderHook(() =>
			useHighOrderFunction(highOrder, inputFn)
		);

		expect(result.current("hello", 42)).toBe("HELLO-42");
	});
});
