import { addMigrationPlan } from '../../../types';

import * as Last from './v0';

export const VERSION = 1;

export type Schema = {
  _version: typeof VERSION;
  value: string;
};

export const defaults: Schema = {
  _version: VERSION,
  value: ''
}

export type AnySchema = Last.AnySchema | Schema;

export const migrationPlan = addMigrationPlan(
  Last.migrationPlan,
  (oldSchema): Schema => {
    return {
      ...oldSchema,
      value: oldSchema.value ?? '(fallback)',
      _version: VERSION,
    };
  },
  VERSION
);
