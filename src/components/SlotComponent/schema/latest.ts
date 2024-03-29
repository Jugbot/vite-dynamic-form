import {
  ComponentIDTag,
  LATEST_GLOBAL_VERSION,
  LegacyTagged,
  ModuleID,
  Slot,
  SlotAttributes,
  VersionTag,
} from '../../../types';
import { cloneReadonly } from '../../../utils';

/**
 * This type should represent any possible config that might exist
 * in the system before we adopted versioning
 */

type Legacy = LegacyTagged<{
}, ModuleID.SlotComponent>;

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
export interface Schema
  extends VersionTag<typeof VERSION>,
    ComponentIDTag<ModuleID.SlotComponent> {
  someSlot: Slot<[SlotAttributes.RENDERABLE]>;
}

export const defaults = {
  _version: VERSION,
  _id: ModuleID.SlotComponent,
  someSlot: {
    _accepts: [SlotAttributes.RENDERABLE],
    subcomponent: null,
  },
} as const;

/**
 * The migration plan chains the current migration plan with the previous migration plan
 * @see `addMigrationPlan`
 */
export const migrationPlan = (_legacy: AnySchema): Schema => {
  return {
    ...cloneReadonly(defaults),
  };
};
