import React, { SetStateAction } from 'react';
import { DeepReadonly } from './utils';

export enum ComponentID {
  ExampleComponent = "ExampleComponent",
  ParentCompoennt = "ParentComponent"
}

/** Component id used for attributing data to the component that uses it (get rid of form configs) */
export interface ComponentIDTag<UID extends ComponentID> {
  _id: UID
}

export interface VersionTag<Version extends number> {
  _version: Version;
}

export type Tagged<Schema, Version extends number, UID extends ComponentID> = Schema &
  VersionTag<Version> &
  ComponentIDTag<UID>;

export const LATEST_GLOBAL_VERSION = 2;

/** Legacy schemas (schemas before versioning was implemented) */
interface LegacyVersionTag {
  _version: never;
}

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

enum GlobalValidationIds {
  // We may not need this
  PLACEHOLDER = '',
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

// Not sure if this is needed, probably not
interface NestedInfo<Data> extends TagFormData<FormDataType.DATA> {
  nested: Data
}

type FormEvents = 'change' | 'validation'
type EventPayload<Schema, FormData> = {
  change: Schema, 
  validation: FormData
}
type EventToPaylod<Tuple extends readonly [...FormEvents[]], Schema, FormData> = {
  [Index in keyof Tuple]: EventPayload<Schema, FormData>[Tuple[Index]];
} & {length: Tuple['length']}

type EventHandler = <T extends [...FormEvents[]], Schema, FormData>(actions: T, callback: SetStateAction<EventToPaylod<T, Schema, FormData>>) => void

export interface FormPackage<
  Schema extends VersionTag<typeof LATEST_GLOBAL_VERSION>,
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
