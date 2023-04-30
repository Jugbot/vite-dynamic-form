import {SlotComponent} from './SlotComponent' 
import {Schema, AnySchema, defaults as schemaDefaults, migrationPlan} from './schema'
import {defaults as formDefaults } from './validation'
import {attributes, FormState} from './types'
import { FormComponentModule } from '../formComponentModule'
import { ModuleID } from '../../types'

export const module: FormComponentModule<
  ModuleID.SlotComponent,
  AnySchema,
  Schema,
  FormState,
  typeof attributes
> = {
  id: schemaDefaults._id,
  Component: SlotComponent, 
  schemaDefaults,
  migrationPlan,
  formDefaults,
  attributes
}