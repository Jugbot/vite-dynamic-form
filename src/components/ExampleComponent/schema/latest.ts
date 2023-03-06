import {
  addMigrationPlan,
  LATEST_GLOBAL_VERSION,
  ModuleID,
  Tagged,
} from '../../../types';
import {
  cloneReadonly,
  combine,
  prune,
} from '../../../utils';
import * as Last from './v1';

/**
 * To upgrade this version: 
 * 1. Duplicate this file and name it v2
 * 2. In v2 set the version to whatever the latest version is (i.e. `VERSION = 2`)
 * 3. Bump the latest version 
 * 4. Edit latest.ts schema, defauls, migration plan
 */
export const VERSION = LATEST_GLOBAL_VERSION;

export type Schema = Tagged<
  {
    value: string;
    color: string;
  },
  typeof VERSION,
  ModuleID.ExampleComponent
>;

export const defaults = {
  _version: VERSION,
  _id: ModuleID.ExampleComponent,
  value: '',
  color: '#cde',
} as const

export type AnySchema = Last.AnySchema | Schema;

export const migrationPlan = addMigrationPlan(
  Last.migrationPlan,
  (oldSchema): Schema => {
    return {
      ...combine(prune(oldSchema, { _version: null }), cloneReadonly<Schema>(defaults)),
      _version: VERSION,
    };
  },
  VERSION
);
