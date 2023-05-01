import { ModuleID, Tagged, addMigrationPlan } from '../../../types';

import * as Last from './v0';

export const VERSION = 1;

export type Schema = Tagged<
{
  value: string;
},
typeof VERSION,
ModuleID.ExampleComponent
>;

export const defaults: Schema = {
  _version: VERSION,
  _id: ModuleID.ExampleComponent,
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
