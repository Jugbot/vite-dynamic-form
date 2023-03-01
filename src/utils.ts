export type ExactType<T, U> = T extends U ? (U extends T ? T : never) : never;

// Typescript does not care about "extra" properties
type A = { A: '' };
type B = { B: '' };
function test(a: A): B {
  return {
    ...a, // This does not error
    B: '',
  };
}
const result: B = { A: '', B: '' };

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

function isObject(o: unknown): o is Record<string, unknown> {
  return typeof o === 'object' && !Array.isArray(o) && o !== null;
}

/**
 * Recursively removes extra fields from old schema that does not exist on default
 * and sets defaults where old schema does not have value set
 */
export const combine = <A extends DeepPartial<B>, B>(
  old: A,
  defaults: B
): B => {
  if (isObject(old) && isObject(defaults)) {
    const pruned = Object.entries(old).reduce<Record<string, unknown>>(
      (acc, [key, value]) => {
        if (key in defaults) {
          acc[key] = combine(value as Partial<unknown>, defaults[key]);
        }
        return acc;
      },
      {}
    );
    return {
      ...defaults,
      ...pruned,
    };
  }
  return defaults;
};

// Util type for deccreasing a number literal by one
type Prev = [
  never,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  ...0[]
];

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${'' extends P ? '' : '.'}${P}`
    : never
  : never;

// D is maximum depth
type Paths<T, D extends number = 4> = [D] extends [never]
  ? never
  : T extends object
  ? {
      [K in keyof T]-?: K extends string | number
        ? `${K}` | Join<K, Paths<T[K], Prev[D]>>
        : never;
    }[keyof T]
  : '';

// Removes the first element from a tuple type and returns the rest as a tuple
type Tail<T extends any[]> = T extends T
  ? ((...t: T) => void) extends (h: any, ...r: infer R) => void
    ? R
    : never
  : never;

// FIXME
type DeepIntersection<T, K extends keyof T = keyof T> = Record<
  K,
  T[K] extends object ? DeepIntersection<T[K]> : T[K]
>;

type DeepOmit<T, Path extends string[]> = T extends object
  ? Path extends Path
    ? Path['length'] extends 1
      ? Omit<T, Path[0]>
      : {
          [K in keyof T]: K extends Path[0] ? DeepOmit<T[K], Tail<Path>> : T[K];
        }
    : never
  : T;

type UnDot<T extends string> = T extends `${infer A}.${infer B}`
  ? [A, ...UnDot<B>]
  : [T];

export const removeold = <V, P extends Paths<V>, A extends readonly P[] | []>(
  value: V,
  arr: A
): A extends [] ? V : DeepIntersection<DeepOmit<V, UnDot<A[number]>>> => {
  return {};
};

type IncludeFlag = undefined;
type ExcludeFlag = null;
type Flags = IncludeFlag | ExcludeFlag;
type NullMap<T extends Record<string, unknown>> = {
  [K in keyof T]?: T[K] extends Record<string, unknown>
    ? NullMap<T[K]> | Flags
    : Flags;
};

type Removed<T extends Record<string, unknown>, R extends NullMap<T>> = {
  [K in keyof T]: R[K] extends ExcludeFlag
    ? never
    : T[K] extends Record<string, unknown>
    ? R[K] extends NullMap<T[K]>
      ? Removed<T[K], R[K]>
      : T[K]
    : T[K];
};

/**
 * Removes nested keys from an object as specified by null values in `ExclusionMap`
 * ```
 * prune({a: b: ""}, {a: {b: null}})
 * 
 * ```
 */
export const prune = <Value extends Record<string, unknown>, ExclusionMap extends NullMap<Value>>(
  value: Value,
  remove: ExclusionMap
): Removed<Value, ExclusionMap> => {
  const result = {} as Record<string, unknown>;
  for (const key in value) {
    const removeTree = remove[key]
    if (removeTree === null) {
      continue;
    }
    const keyValue = value[key]
    if (isObject(keyValue)) {
      result[key] = prune(keyValue, removeTree ?? {})
    } else {
      result[key] = keyValue
    }
  }
  return result as Removed<Value, ExclusionMap>
};

type Deep = {
  a: {
    b: {
      c: number;
    };
    d: null;
  };
};

const d = {} as Deep;

let r1 = prune(d, { a: null });
let r2 = prune(d, { a: { d: null } });
let r3 = prune(d, { a: { b: null, d: null } });
let r4 = prune(d, { a: { b: { c: null } } });
let r5 = prune(d, { a: { b: {} } });
let r6 = prune(d, undefined);
let r7 = prune(d, null);

type S = Omit<Deep, 'a'>;

const s: S = {};

const blah = {} as Deep;

const res = removeold(blah, ['a.b.c', 'a.d'] as const);

res.a;
res.a.b.c;
if ('d' in res.a) {
  res.a.d;
}

const filters = ['a.b.c', 'a.d'] as const;

type EEE = typeof filters[number];
type LLL = FFF['length'];
type FFF = UnDot<EEE>;
type DDD = Tail<FFF>;

type Deep2 = {
  a: {
    b: {
      c: number;
    };
  };
  z: '';
};

type Test = DeepIntersection<
  { a: 'a'; b: {}; c: '' } | { a: ''; b: { c: '' } } | { a: 'a'; b: {} }
>;

type Deep3 = DeepIntersection<Deep | Deep2>;
const d3 = {} as Test;

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends Record<string, unknown>
    ? DeepReadonly<T[P]>
    : T[P];
};