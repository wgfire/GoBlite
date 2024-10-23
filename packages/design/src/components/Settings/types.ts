type Primitive = string | number | boolean | undefined | null;
type PathArray<T> = T extends Array<infer U> ? (U extends object ? keyof U & string : never) : never;

type PathImpl<T, K extends keyof T> = K extends string
  ? T[K] extends Primitive
    ? K
    : T[K] extends Array<infer U>
      ? U extends Primitive | object
        ? K | `${K}.${number}` | PathArray<U>
        : K
      : T[K] extends Record<string, unknown> | undefined
        ? K | `${K}.${PathImpl<NonNullable<T[K]>, keyof NonNullable<T[K]>>}`
        : K
  : never;

export type PropPath<T> = PathImpl<T, keyof T>;

export type PropValue<T, P extends PropPath<T>> = P extends keyof T
  ? T[P]
  : P extends `${infer K}.${infer R}`
    ? K extends keyof T
      ? T[K] extends (infer V)[]
        ? R extends `${number}`
          ? V
          : R extends `${number}.${infer Rest}`
            ? PropValue<V, Rest extends PathImpl<V, keyof V & string> ? Rest : never>
            : never
        : T[K] extends object
          ? PropValue<T[K], R extends PathImpl<T[K], keyof T[K] & string> ? R : never>
          : never
      : never
    : never;

export type SetPropFunction<T> = (cb: (props: T) => void) => void;

export interface defaultProps<T> {
  propKey?: PropPath<T>;
  label?: string;
  className?: string;
  placeholder?: string;
  defaultValue?: PropValue<T, PropPath<T>>;
  value?: PropValue<T, PropPath<T>>;
  onChange?: (value: PropValue<T, PropPath<T>>) => void;
}
