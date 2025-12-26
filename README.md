# use-high-order

React hooks for applying higher-order functions with stable references.

## Overview

`use-high-order` provides React hooks that enable you to apply higher-order functions (like debounce, throttle, etc.) to your callbacks while maintaining stable function references and always calling the latest version of your input function.

## Installation

```bash
npm install use-high-order
# or
yarn add use-high-order
# or
pnpm add use-high-order
# or
bun add use-high-order
```

## Features

- **Stable references**: Output functions maintain the same reference across re-renders
- **Latest closure**: Always calls the latest version of your input function
- **TypeScript support**: Full TypeScript types included
- **Zero dependencies**: No lodash or other heavy dependencies required
- **Lightweight**: Minimal bundle size

## API

### `useHighOrderFunction`

Apply any higher-order function to your callback while maintaining stable references.

```typescript
function useHighOrderFunction<T extends Function, R extends OutputFunction<T>>(
  highOrder: HighOrderFunction<T, R>,
  inputFunction: T,
  ...otherArgs: any[]
): R
```

**Example:**

```typescript
import { useHighOrderFunction } from 'use-high-order';

function MyComponent() {
  const [count, setCount] = useState(0);

  // The debounced function maintains a stable reference
  // but always uses the latest 'count' value
  const debouncedLog = useHighOrderFunction(
    debounce,
    () => console.log('Count:', count),
    500
  );

  return <button onClick={debouncedLog}>Log Count</button>;
}
```

### `useAnyHighOrderFunction`

Similar to `useHighOrderFunction`, but without type constraints on the output function signature.

```typescript
function useAnyHighOrderFunction<T extends Function, R extends Function>(
  highOrder: HighOrderFunction<T, R>,
  inputFunction: T,
  ...otherArgs: any[]
): R
```

Use this when the higher-order function changes the signature of the input function.

### `useDebounce`

A ready-to-use debounce hook.

```typescript
function useDebounce<T extends Function>(
  inputFn: T,
  wait?: number
): DebouncedFunc<T>
```

**Example:**

```typescript
import { useDebounce } from 'use-high-order';

function SearchComponent() {
  const [query, setQuery] = useState('');

  const debouncedSearch = useDebounce(
    () => {
      // This will always use the latest 'query' value
      console.log('Searching for:', query);
    },
    500
  );

  useEffect(() => {
    debouncedSearch();
    // Cleanup: flush on unmount
    return () => debouncedSearch.flush();
  }, [query, debouncedSearch]);

  return <input onChange={(e) => setQuery(e.target.value)} />;
}
```

**Debounced function methods:**

- `cancel()`: Cancel pending execution
- `flush()`: Immediately execute pending call

### `useCurrentRef`

A utility hook that maintains a ref with the current value.

```typescript
function useCurrentRef<T>(value: T): RefObject<T>
```

**Example:**

```typescript
import { useCurrentRef } from 'use-high-order';

function MyComponent() {
  const [count, setCount] = useState(0);
  const countRef = useCurrentRef(count);

  // countRef.current always has the latest count value
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Current count:', countRef.current);
    }, 1000);
    return () => clearInterval(interval);
  }, [countRef]);

  return <button onClick={() => setCount(c => c + 1)}>Increment</button>;
}
```

### `debounce`

The standalone debounce utility function (if you need it outside of React).

```typescript
function debounce<T extends Function>(
  func: T,
  wait: number
): DebouncedFunc<T>
```

## How It Works

The key insight is that higher-order functions often maintain state in their closures (like debounce's timeout ID). To keep this state consistent while allowing the input function to update, `use-high-order`:

1. **Runs the higher-order function only once** - preserving its internal state
2. **Wraps the input function** - ensuring the latest version is always called
3. **Maintains stable output reference** - preventing unnecessary re-renders

## Common Use Cases

### Debounced API Calls

```typescript
function UserSearch() {
  const [username, setUsername] = useState('');

  const searchUser = useDebounce(
    () => {
      fetch(`/api/users?name=${username}`)
        .then(res => res.json())
        .then(data => console.log(data));
    },
    300
  );

  useEffect(() => {
    if (username) searchUser();
  }, [username, searchUser]);

  return <input onChange={(e) => setUsername(e.target.value)} />;
}
```

### Custom Higher-Order Function

```typescript
// Custom throttle implementation
function throttle<T extends Function>(fn: T, delay: number) {
  let lastCall = 0;
  return (...args: any[]) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
}

function MyComponent() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const throttledUpdate = useHighOrderFunction(
    throttle,
    (e: MouseEvent) => setPosition({ x: e.clientX, y: e.clientY }),
    100
  );

  return <div onMouseMove={throttledUpdate}>...</div>;
}
```

## TypeScript

This library is written in TypeScript and provides full type definitions. All hooks and utilities are fully typed.

## Testing

Run tests with:

```bash
bun test
```

All core functionality is thoroughly tested with 28+ test cases.

## License

MIT © Li Xu

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
