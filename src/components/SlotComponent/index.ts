import {SlotComponent} from './SlotComponent' 
import {Schema, AnySchema, defaults as SchemaDefaults} from './schema'
import {defaults as FormDefaults } from './validation'
import {attributes as Attributes, FormState} from './types'
import { makeModule } from '../../types'

export const module = makeModule({
  Component: SlotComponent, 
  SchemaDefaults,
  FormDefaults,
  Attributes
})

export {
  SlotComponent,
  SchemaDefaults,
  FormDefaults
}

export type {
  Schema, 
  AnySchema,
  FormState
}