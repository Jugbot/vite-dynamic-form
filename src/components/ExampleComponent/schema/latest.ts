import {
  addMigrationPlan,
  ComponentID,
  LATEST_GLOBAL_VERSION,
  Tagged,
} from '../../../types';
import { combine, prune } from '../../../utils';

import * as Last from './v1';

export const VERSION = LATEST_GLOBAL_VERSION;

export type Schema = Tagged<
  {
    value: string;
    color: string;
  },
  typeof VERSION,
  ComponentID.ExampleComponent
>;

export const defaults: Schema = {
  _version: VERSION,
  _id: ComponentID.ExampleComponent,
  value: '',
  color: '#cde',
};

export type AnySchema = Last.AnySchema | Schema;

export const migrationPlan = addMigrationPlan(
  Last.migrationPlan,
  (oldSchema): Schema => {
    return {
      ...combine(prune(oldSchema, { _version: null }), defaults),
      _version: VERSION,
    };
  },
  VERSION
);
