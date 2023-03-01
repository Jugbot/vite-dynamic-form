/**
 * This type should represent any possible config that might exist 
 * in the system before we adopted versioning
 */

type Legacy = {
  _version: never
  value?: string
}

/**
 * This component's schema, which may change in future iterations
 * of the component, comes with a version number and migration plan.
 * 
 * When a change is made to the schema which requires a transformation 
 * of the last schema, a new file must be made. 
 */

export const VERSION = 0

/** The type that holds the union of this schema and any previous schema type */
export type AnySchema = Schema | Legacy

/** This version's schema */ 
export type Schema = {
  _version: typeof VERSION,
  value?: string
}

export const defaults: Schema = {
  _version: VERSION
}

/** 
 * The migration plan chains the current migration plan with the previous migration plan 
 * @see `addMigrationPlan`
 */
export const migrationPlan = (legacy: Legacy | Schema): Schema => {
  return {
    ...legacy,
    _version: VERSION
  }
}