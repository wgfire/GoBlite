type Condition = boolean | (() => boolean);
type Callback<T> = T | (() => T);

const identity = <T>(x: T): T => x;

function isFunction<T>(x: T | (() => T)): x is () => T {
  return typeof x === "function";
}

const evaluateCondition = (condition: Condition): boolean => (isFunction(condition) ? condition() : condition);

const evaluateCallback = <T>(callback: Callback<T>): T => (isFunction(callback) ? callback() : callback);

function expect<T, U extends T = T>(
  successCallback: Callback<U>
): {
  (condition: Condition): {
    (failureCallback?: Callback<T>): T | U;
  };
} {
  return (condition: Condition) =>
    (failureCallback: Callback<T> = identity as Callback<T>): T | U =>
      evaluateCondition(condition) ? evaluateCallback(successCallback) : evaluateCallback(failureCallback);
}

export default expect;
