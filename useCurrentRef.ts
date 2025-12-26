import { type RefObject, useEffect, useRef } from "react";

export const useCurrentRef = <T>(value: T): RefObject<T> => {
	const ref = useRef(value);
	useEffect(() => {
		ref.current = value;
	}, [value]);
	return ref;
};
