import {ParentComponent} from './ParentComponent' 
import {Schema, AnySchema, defaults as schemaDefaults} from './schema'
import {defaults as formDefaults } from './validation'
import {attributes , FormState} from './types'
import { makeModule, ModuleTypes } from '../formComponentMap'

export const module = makeModule({
  id: schemaDefaults._id,
  Component: ParentComponent, 
  schemaDefaults,
  formDefaults,
  attributes
})

export type Module = ModuleTypes<
  Schema, 
  AnySchema,
  FormState>

export {
  ParentComponent,
  schemaDefaults,
  formDefaults
}

export type {
  Schema, 
  AnySchema,
  FormState
}