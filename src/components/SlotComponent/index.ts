import {SlotComponent} from './SlotComponent' 
import {Schema, AnySchema, defaults as schemaDefaults, migrationPlan} from './schema'
import {defaults as formDefaults } from './validation'
import {attributes, FormState} from './types'
import { makeModule, ModuleTypes } from '../modules'

export const module = makeModule({
  id: schemaDefaults._id,
  Component: SlotComponent, 
  schemaDefaults,
  migrationPlan,
  formDefaults,
  attributes
})

export type Module = ModuleTypes<
  Schema, 
  AnySchema,
  FormState>

export {
  SlotComponent,
  schemaDefaults,
  formDefaults
}

export type {
  Schema, 
  AnySchema,
  FormState
}