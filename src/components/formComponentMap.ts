import {module as ExampleComponentModule} from './ExampleComponent' 
import {module as ParentComponentModule} from './ParentComponent' 

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