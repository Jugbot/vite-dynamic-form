import { DeepReadonly } from 'utility-types';
import { ModuleID, LATEST_GLOBAL_VERSION, Tagged } from '../../../types';
import * as ExampleComponent from '../../ExampleComponent';

/**
 * This type should represent any possible config that might exist
 * in the system before we adopted versioning
 */

type Legacy = {
  _version?: never
};

/**
 * This component's schema, which may change in future iterations
 * of the component, comes with a version number and migration plan.
 *
 * When a change is made to the schema which requires a transformation
 * of the last schema, a new file must be made.
 */

export const VERSION = LATEST_GLOBAL_VERSION;

/** The type that holds the union of this schema and any previous schema type */
export type AnySchema = Schema | Legacy;

/** This version's schema */
export type Schema = Tagged<
  {
    subcomponent: ExampleComponent.Schema;
    someValue: string
  },
  typeof VERSION,
  ModuleID.ParentCompoennt
>;

export const defaults = {
  _version: VERSION,
  _id: ModuleID.ParentCompoennt,
  subcomponent: ExampleComponent.schemaDefaults,
  someValue: ''
} as const

/**
 * The migration plan chains the current migration plan with the previous migration plan
 * @see `addMigrationPlan`
 */
export const migrationPlan = (legacy: AnySchema): Schema => {
  return {
    ...defaults,
  };
};
