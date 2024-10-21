type Primitive = string | number | boolean | null | undefined;

type PathImpl<T, K extends keyof T> = K extends string
  ? T[K] extends Primitive
    ? K
    : T[K] extends (infer V)[]
      ? K | `${K}.${number}` | `${K}.${number}.${PathImpl<V, keyof V & string>}`
      : T[K] extends object
        ? K | `${K}.${PathImpl<T[K], keyof T[K] & string>}`
        : K
  : never;

export type PropPath<T> = PathImpl<T, keyof T & string>;

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
