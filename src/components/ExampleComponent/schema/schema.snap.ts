import { ExactType } from '../../../utils';

/**
 * In oreder to prevent people from accidentally changing the schema type to something that should be migrated, we need to save a snapshot of the type (probs as json schema) so that we can check:
 * ```
 * const schema: Schema = {} as SchemaSnapsot
 * ```
 * When incrementing
 */
export {};

/** Examples */

// Add new non-optional prop (fail)
`const example1: { a: string; b: string } = {} as { a: string };`;
// Add an optional prop (pass)
const example2: { a: string; b?: string } = {} as { a: string };

type Union = 'a' | 'b';
type NewUnion = 'a' | 'b' | 'c';
// Add to an existing union or enum (pass)
const example3: { g: NewUnion } = {} as { g: Union };
// Remove from a union/enum value (fail)
`const example4: { g: Union } = {} as { g: NewUnion };`;

/** Limitations */

// Cannot account for removed properties
const example5: { a: string } = {} as { g: Union; a: string };

// We can instead opt for using `Exact` comparison (fail)
`const example6: ExactType<{ a: string }, { g: Union; a: string }>;`;
// When types can fit into each other (pass)
const example7: ExactType<{ a: string }, { a: string }> = {} as any;

// If we use exact then it would just be easier to code review snapshot changes and not worry about it failing a ts check
