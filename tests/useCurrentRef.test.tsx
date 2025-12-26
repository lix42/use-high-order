import { describe, test, expect } from "bun:test";
import { renderHook } from "@testing-library/react";
import { useCurrentRef } from "../useCurrentRef";

describe("useCurrentRef", () => {
	test("should return a ref with the current value", () => {
		const { result } = renderHook(() => useCurrentRef(42));
		expect(result.current.current).toBe(42);
	});

	test("should update ref.current when value changes", () => {
		const { result, rerender } = renderHook(
			({ value }) => useCurrentRef(value),
			{ initialProps: { value: 1 } }
		);

		expect(result.current.current).toBe(1);

		rerender({ value: 2 });
		expect(result.current.current).toBe(2);

		rerender({ value: 3 });
		expect(result.current.current).toBe(3);
	});

	test("should maintain the same ref object across renders", () => {
		const { result, rerender } = renderHook(
			({ value }) => useCurrentRef(value),
			{ initialProps: { value: 1 } }
		);

		const firstRef = result.current;

		rerender({ value: 2 });
		expect(result.current).toBe(firstRef);

		rerender({ value: 3 });
		expect(result.current).toBe(firstRef);
	});

	test("should work with objects", () => {
		const obj1 = { name: "Alice" };
		const obj2 = { name: "Bob" };

		const { result, rerender } = renderHook(
			({ value }) => useCurrentRef(value),
			{ initialProps: { value: obj1 } }
		);

		expect(result.current.current).toBe(obj1);

		rerender({ value: obj2 });
		expect(result.current.current).toBe(obj2);
	});

	test("should work with functions", () => {
		const fn1 = () => "hello";
		const fn2 = () => "world";

		const { result, rerender } = renderHook(
			({ value }) => useCurrentRef(value),
			{ initialProps: { value: fn1 } }
		);

		expect(result.current.current).toBe(fn1);
		expect(result.current.current()).toBe("hello");

		rerender({ value: fn2 });
		expect(result.current.current).toBe(fn2);
		expect(result.current.current()).toBe("world");
	});
});
