import {ParentComponent} from './ParentComponent' 
import {Schema, AnySchema, defaults as SchemaDefaults} from './schema'
import {defaults as FormDefaults } from './validation'
import {attributes as Attributes, FormState} from './types'
import { makeModule } from '../../types'

export const module = makeModule({
  Component: ParentComponent, 
  SchemaDefaults,
  FormDefaults,
  Attributes
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