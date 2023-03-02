import { consumeAction, FormPackage, LatestVersionTag } from "./types";
import get from 'lodash/get'
import set from 'lodash/set'
import merge from 'lodash/merge'
import { DeepPartial } from "utility-types";

export type ExactType<T, U> = T extends U ? (U extends T ? T : never) : never;

function isObject(o: unknown): o is Record<string, unknown> {
  return typeof o === "object" && !Array.isArray(o) && o !== null;
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
    ? `${K}${"" extends P ? "" : "."}${P}`
    : never
  : never;

/**
 * Represents all valid dot (`.`) deliminated path strings of an object.
 * @note Parameter D is the max recursion depth and can be ignored
 */
export type Paths<T, D extends number = 4> = [D] extends [never]
  ? never
  : T extends object
  ? {
      [K in keyof T]-?: K extends string | number
        ? `${K}` | Join<K, Paths<T[K], Prev[D]>>
        : never;
    }[keyof T]
  : "";

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
    ? Path["length"] extends 1
      ? Omit<T, Path[0]>
      : {
          [K in keyof T]: K extends Path[0] ? DeepOmit<T[K], Tail<Path>> : T[K];
        }
    : never
  : T;

// Work-around to restrict array types to certain lengths
// Example: `Arr extends string[] & { length: N }`
type SingleDigit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

/**
 * Extracts the value given an array of keys as the path
 * The result is also typed correctly, returning "never" if the path is invalid
 * @important The path must be a tuple type i.e. have a fixed length that is visible in the type. Otherwise the value will always be never
 */
export type ValueAt<T, Path extends string[]> = T extends object
  ? Path extends Path
    ? Path[0] extends keyof T
      ? Path["length"] extends 1
        ? T[Path[0]]
        : Path["length"] extends SingleDigit ? ValueAt<T[Path[0]], Tail<Path>> : never
      : never
    : never
  : never;

/**
 * Splits a dot (`.`) deliminated string into a tuple type
 */
export type UnDot<T extends string> = T extends `${infer A}.${infer B}`
  ? [A, ...UnDot<B>]
  : [T];


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
 * These keys will be marked as "never" and cannot be assigned undefined or null
 * @example
 * ```
 * type Deep = {
 *   a: {
 *     b: {
 *       c: number;
 *     };
 *     d: null;
 *   };
 * }; *
 * const d = {} as Deep; *
 * let r1 = prune(d, { a: null });
 * // r1 -> {
 * //   a: never
 * // }
 * let r2 = prune(d, { a: { d: null } });
 * // r2 -> {
 * //   a: {
 * //     b: {
 * //       c: number
 * //     };
 * //     d: never
 * //   }
 * // }
 * let r3 = prune(d, { a: { b: null, d: null } });
 * // r3 -> {
 * //   a: {
 * //     b: {
 * //       c: number
 * //     };
 * //     d: never
 * //   }
 * // }
 * let r4 = prune(d, { a: { b: { c: null } } });
 * // r4 -> {
 * //   a: {
 * //     b: never
 * //     d: never
 * //   }
 * // }
 * let r5 = prune(d, { a: { b: {} } });
 * // r5 -> r5
 * ```
 */
export const prune = <
  Value extends Record<string, unknown>,
  ExclusionMap extends NullMap<Value>
>(
  value: Value,
  remove: ExclusionMap
): Removed<Value, ExclusionMap> => {
  const result = {} as Record<string, unknown>;
  for (const key in value) {
    const removeTree = remove[key];
    if (removeTree === null) {
      continue;
    }
    const keyValue = value[key];
    if (isObject(keyValue)) {
      result[key] = prune(keyValue, removeTree ?? {});
    } else {
      result[key] = keyValue;
    }
  }
  return result as Removed<Value, ExclusionMap>;
};

/**
 * Utility function for passing nested form state. Here is what the alternative looks like.
 * ```
 * value={{
 *   schema: schema.subcomponent,
 *   formState: formState.CHILD_COMPONENT,
 * }}
 * onChange={(action) => 
 *   onChange((old) => {
 *     const actionValue = consumeAction(
 *       {
 *         schema: old.schema.subcomponent,
 *         formState: old.formState.CHILD_COMPONENT,
 *       },
 *       action
 *     );
 *     return {
 *       schema: {
 *         ...old.schema,
 *         subcomponent: actionValue.schema
 *       },
 *       formState: {
 *         ...old.formState,
 *         CHILD_COMPONENT: actionValue.formState
 *       },
 *     };
 *   })
 * }
 * ```
 */
export function createNestingAdapter<S extends LatestVersionTag,F,ParentProps extends FormPackage<S, F>>(props: ParentProps) {
  return function passChildProps<A extends Paths<S>, B extends Paths<F>>(schemaPath: A, formStatePath: B) {
    type MaybeChildSchema = ValueAt<S, UnDot<A>>
    type MaybeChildFormState = ValueAt<F, UnDot<B>>
    function getChildValue(value: ParentProps["value"]) {
      return {
        schema: get(value.schema, schemaPath) as MaybeChildSchema,
        formState: get(value.formState, formStatePath) as MaybeChildFormState
      }
    }
    return {
      value: getChildValue(props.value),
      onChange: (action: React.SetStateAction<ReturnType<typeof getChildValue>>) => props.onChange((old) => {
        const actionValue = consumeAction(
          getChildValue(old),
          action
        );
        return {
          schema: merge(old.schema, set({}, schemaPath, actionValue.schema)),
          formState: merge(old.formState, set({}, formStatePath, actionValue.formState)),
        };
      })
    }
  }
}