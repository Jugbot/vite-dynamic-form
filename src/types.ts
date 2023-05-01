import { SetStateAction } from 'react';

import type { CompatibleModuleTypes } from './components/modules';
import { ExtractSchema } from './components/formComponentModule';

export enum ModuleID {
  ExampleComponent = "ExampleComponent",
  ParentCompoennt = "ParentComponent",
  SlotComponent = "SlotComponent"
}

/** Component id used for attributing data to the component that uses it (get rid of form configs) */
export interface ComponentIDTag<UID extends ModuleID> {
  _id: UID
}

export interface VersionTag<Version extends number> {
  _version: Version;
}

export type LatestVersionTag = VersionTag<typeof LATEST_GLOBAL_VERSION>
/** Legacy schemas (schemas before versioning was implemented) */
export type LegacyVersionTag = Partial<VersionTag<never>>

export type Tagged<Schema, Version extends number, UID extends ModuleID> = Schema &
  VersionTag<Version> &
  ComponentIDTag<UID>;

export type LegacyTagged<Schema, UID extends ModuleID> = Schema &
LegacyVersionTag &
ComponentIDTag<UID>;

export const LATEST_GLOBAL_VERSION = 2;


export function addMigrationPlan<
  LastSchema,
  PastVersions extends number,
  PastSchemas extends VersionTag<PastVersions> | LegacyVersionTag,
  CurrentVersion extends number,
  CurrentSchema extends VersionTag<CurrentVersion>
>(
  previous: (a: PastSchemas) => LastSchema,
  next: (b: LastSchema) => CurrentSchema,
  currentVersion: CurrentVersion
): (config: PastSchemas | CurrentSchema) => CurrentSchema {
  const shouldBeMigrated = (
    config: PastSchemas | CurrentSchema
  ): config is PastSchemas => {
    return config._version === undefined || config._version < currentVersion;
  };

  return (unknownSchema: PastSchemas | CurrentSchema) => {
    if (shouldBeMigrated(unknownSchema)) {
      return next(previous(unknownSchema));
    }
    // Do nothing if schema version is >= migration plan version
    return unknownSchema;
  };
}

export enum ProblemLabels {
  ADA = 'ADA',
  REQUIRED = 'REQUIRED',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  DISABLE = 'DISABLE',
}

export enum FormDataType {
  STATUS = "STATUS",
  DATA = "DATA"
}

interface TagFormData<T extends FormDataType> {
  _type: T
}

/**
 * A standard object for form state status that enables us to keep track of form state at the 
 * highest level e.g. whether a form's state is valid or not and whether we can submit data.
 * 
 * Would require a deep lookup and search of the `_type` key which may be too expensive. 
 * We could have some way of globally keeping track of all form errors which is more 
 * performant but I didn't want to prematurely optimize.
 */
export interface ValidationInfo extends TagFormData<FormDataType.STATUS> {
  // In case we need to do something based on a certain subset of errors (e.g. warnings vs errors)
  labels: ProblemLabels[];
  // Optional message to display
  reason: string;
};

export interface FormPackage<
  Schema extends LatestVersionTag,
  FormData
> {
  // Basic controlled component pattern
  onChange: (action: SetStateAction<{schema: Schema, formState: FormData}>) => void;
  value: {schema: Schema, formState: FormData};
}

// Function types conflict with SetStateAction type, so this is everything but
type ValidValues =
  | object
  | string
  | boolean
  | symbol
  | number
  | null
  | undefined;

export const consumeAction = <T extends ValidValues>(
  previous: T,
  action: SetStateAction<T>
): T => {
  if (typeof action === 'function') {
    return action(previous);
  }
  return previous;
};

/**
 * Slot attributes should make it easy to control what can be slotted where. 
 * Otherwise if we add a new component that can go into a container we would 
 * have to update all containers to accept this component.
 * 
 * A components' attributes need to all be included in a slots' attributes
 */
export enum SlotAttributes {
  CONTAINER = "CONTAINER",
  RENDERABLE = "RENDERABLE",
}



export type Slot<T extends SlotAttributes[]> = {
  _accepts: Array<T[number]>;
  subcomponent: ExtractSchema<CompatibleModuleTypes<T>> | null
};