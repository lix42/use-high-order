import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { debounce } from "../debounce";

describe("debounce", () => {
	beforeEach(() => {
		// Use fake timers for debounce tests
	});

	afterEach(() => {
		// Clean up
	});

	test("should debounce function calls", async () => {
		let callCount = 0;
		const fn = debounce(() => {
			callCount++;
		}, 100);

		fn();
		fn();
		fn();

		expect(callCount).toBe(0);

		await Bun.sleep(150);
		expect(callCount).toBe(1);
	});

	test("should pass arguments to the debounced function", async () => {
		let capturedArgs: any[] = [];
		const fn = debounce((...args: any[]) => {
			capturedArgs = args;
		}, 100);

		fn(1, 2, 3);
		fn(4, 5, 6);

		await Bun.sleep(150);
		expect(capturedArgs).toEqual([4, 5, 6]);
	});

	test("should cancel pending execution", async () => {
		let callCount = 0;
		const fn = debounce(() => {
			callCount++;
		}, 100);

		fn();
		fn();
		fn.cancel();

		await Bun.sleep(150);
		expect(callCount).toBe(0);
	});

	test("should flush pending execution immediately", async () => {
		let callCount = 0;
		const fn = debounce(() => {
			callCount++;
		}, 100);

		fn();
		expect(callCount).toBe(0);

		fn.flush();
		expect(callCount).toBe(1);

		await Bun.sleep(150);
		expect(callCount).toBe(1);
	});

	test("should not flush if no pending execution", () => {
		let callCount = 0;
		const fn = debounce(() => {
			callCount++;
		}, 100);

		fn.flush();
		expect(callCount).toBe(0);
	});

	test("should handle multiple debounce cycles", async () => {
		let callCount = 0;
		const fn = debounce(() => {
			callCount++;
		}, 100);

		fn();
		await Bun.sleep(150);
		expect(callCount).toBe(1);

		fn();
		await Bun.sleep(150);
		expect(callCount).toBe(2);
	});

	test("should preserve function return type", () => {
		const fn = debounce((x: number): number => x * 2, 100);
		// Type check - the debounced function should not return anything
		const result = fn(5);
		expect(result).toBeUndefined();
	});
});
