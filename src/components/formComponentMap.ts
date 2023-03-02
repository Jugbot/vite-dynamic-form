import { ComponentID } from "../types"
import {module as ExampleComponentModule} from './ExampleComponent' 
import {module as ParentComponentModule} from './ParentComponent' 

// Each form component should export a "module" that contains info that we will need for click to edit / drag and drop
export type FormComponentModule<P, S, F> = {
  Component: React.FunctionComponent<P>
  SchemaDefaults: S,
  FormDefaults: (schema: S) => F
}

// Used so we can infer the generic parts (Props, Schema, FormState)
export function makeModule<P, S, F>(options: FormComponentModule<P, S, F>) {
  return options
}

// When creating a new form component it is necessary to add the module here
const modules = [
  ExampleComponentModule,
  ParentComponentModule
]

// Helper function. `Object.fromEntries` does not preserve enum keys.
function fromEntries<K extends string, V>(entries: [key: K, value: V][]): Record<K, V> {
  return Object.fromEntries(entries) as Record<K, V>
}

// The id will automatically be pulled from the schema and put into a map of Record<id, module>
export const componentMap = fromEntries(modules.map(m => [m.SchemaDefaults._id, m]))