import { useRef, useMemo } from 'react';

type Noop = (...args: any[]) => any; // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * A hook that returns a memoized function that will always have the same reference,
 * but will always execute the latest version of the function passed to it.
 * Useful for optimizing callbacks passed to child components that rely on reference equality.
 *
 * @param fn The function to memoize.
 * @returns A memoized function with a stable reference.
 */
function useMemoizedFn<T extends Noop>(fn: T): T { // Added return type annotation
  // Use useRef to store the latest version of the function.
  const fnRef = useRef<T>(fn);

  // Update the ref with the latest function whenever the component re-renders.
  // This ensures the memoized function always calls the most recent version.
  fnRef.current = useMemo(() => fn, [fn]);

  // Use useRef to store the memoized function itself to ensure stable reference.
  // Initialize with null to satisfy TypeScript when no initial value is provided.
  const memoizedFnRef = useRef<T | null>(null);

  // Create the memoized function only once.
  if (!memoizedFnRef.current) {
    memoizedFnRef.current = function (this: any, ...args: any[]) { // eslint-disable-line @typescript-eslint/no-explicit-any
      // Always call the latest function stored in fnRef.
      return fnRef.current.apply(this, args);
    } as T;
  }

  // Return the stable memoized function. Type assertion needed because current could be null initially.
  return memoizedFnRef.current as T;
}

export default useMemoizedFn;