import {ParentComponent} from './ParentComponent' 
import {Schema, AnySchema, defaults as SchemaDefaults} from './schema'
import {defaults as FormDefaults } from './validation'
import {FormState} from './types'
import { makeModule } from '../formComponentMap'

export const module = makeModule({
  Component: ParentComponent, 
  SchemaDefaults,
  FormDefaults
})

export {
  ParentComponent,
  SchemaDefaults,
  FormDefaults
}

export type {
  Schema, 
  AnySchema,
  FormState
}