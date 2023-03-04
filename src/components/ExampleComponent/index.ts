import {ExampleComponent} from './ExampleComponent' 
import {Schema, AnySchema, defaults as SchemaDefaults} from './schema'
import {defaults as FormDefaults } from './validation'
import {attributes as Attributes, FormState} from './types'
import { makeModule, SlotAttributes } from '../../types'

export const module = makeModule({
  Component: ExampleComponent, 
  SchemaDefaults,
  FormDefaults,
  Attributes
})

export {
  ExampleComponent, 
  SchemaDefaults,
  FormDefaults
}

export type {
  Schema, 
  AnySchema,
  FormState
}