import {ExampleComponent} from './ExampleComponent' 
import {Schema, AnySchema, defaults as SchemaDefaults} from './schema'
import {defaults as FormDefaults } from './validation'
import {FormState} from './types'
import { makeModule } from '../../types'

export const module = makeModule({
  Component: ExampleComponent, 
  SchemaDefaults,
  FormDefaults
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