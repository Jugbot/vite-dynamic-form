import {ExampleComponent} from './ExampleComponent' 
import {Schema, AnySchema, defaults as schemaDefaults, migrationPlan} from './schema'
import {defaults as formDefaults } from './validation'
import {attributes, FormState} from './types'
import { ModuleID } from '../../types'
import { FormComponentModule } from '../formComponentModule'

export const module: FormComponentModule<
  ModuleID.ExampleComponent,
  AnySchema,
  Schema,
  FormState,
  typeof attributes
> = {
  id: schemaDefaults._id,
  Component: ExampleComponent, 
  schemaDefaults,
  migrationPlan,
  formDefaults,
  attributes
}