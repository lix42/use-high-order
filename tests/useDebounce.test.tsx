import { describe, test, expect } from "bun:test";
import { renderHook } from "@testing-library/react";
import { useDebounce } from "../useDebounce";

describe("useDebounce", () => {
	test("should debounce function calls", async () => {
		let callCount = 0;
		const { result } = renderHook(() =>
			useDebounce(() => {
				callCount++;
			}, 100)
		);

		result.current();
		result.current();
		result.current();

		expect(callCount).toBe(0);

		await Bun.sleep(150);
		expect(callCount).toBe(1);
	});

	test("should use default wait time when not specified", async () => {
		let callCount = 0;
		const { result } = renderHook(() =>
			useDebounce(() => {
				callCount++;
			})
		);

		result.current();
		expect(callCount).toBe(0);

		await Bun.sleep(600); // Default is 500ms
		expect(callCount).toBe(1);
	});

	test("should return the same debounced function across re-renders", () => {
		const { result, rerender } = renderHook(() => useDebounce(() => {}, 100));

		const firstDebounced = result.current;

		rerender();
		expect(result.current).toBe(firstDebounced);

		rerender();
		expect(result.current).toBe(firstDebounced);
	});

	test("should call the latest version of the input function", async () => {
		let capturedValue = 0;

		const { result, rerender } = renderHook(
			({ value }) => useDebounce(() => { capturedValue = value; }, 100),
			{ initialProps: { value: 1 } }
		);

		result.current();
		rerender({ value: 2 });

		await Bun.sleep(150);
		expect(capturedValue).toBe(2);
	});

	test("should support cancel method", async () => {
		let callCount = 0;
		const { result } = renderHook(() =>
			useDebounce(() => {
				callCount++;
			}, 100)
		);

		result.current();
		result.current();
		result.current.cancel();

		await Bun.sleep(150);
		expect(callCount).toBe(0);
	});

	test("should support flush method", async () => {
		let callCount = 0;
		const { result } = renderHook(() =>
			useDebounce(() => {
				callCount++;
			}, 100)
		);

		result.current();
		expect(callCount).toBe(0);

		result.current.flush();
		expect(callCount).toBe(1);

		await Bun.sleep(150);
		expect(callCount).toBe(1);
	});

	test("should pass arguments to the debounced function", async () => {
		let capturedArgs: any[] = [];
		const { result } = renderHook(() =>
			useDebounce((...args: any[]) => {
				capturedArgs = args;
			}, 100)
		);

		result.current(1, 2, 3);
		result.current(4, 5, 6);

		await Bun.sleep(150);
		expect(capturedArgs).toEqual([4, 5, 6]);
	});

	test("should work with different function signatures", async () => {
		const { result } = renderHook(() =>
			useDebounce((name: string, age: number) => `${name} is ${age}`, 100)
		);

		let returnValue: any;
		returnValue = result.current("Alice", 30);

		// Debounced functions don't return values immediately
		expect(returnValue).toBeUndefined();

		await Bun.sleep(150);
	});

	test("should handle unmount cleanup with flush", async () => {
		let callCount = 0;
		const { result, unmount } = renderHook(() =>
			useDebounce(() => {
				callCount++;
			}, 100)
		);

		result.current();
		expect(callCount).toBe(0);

		// Flush before unmount
		result.current.flush();
		expect(callCount).toBe(1);

		unmount();
	});
});
