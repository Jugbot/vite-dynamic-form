import { useState } from 'react'
import './components/formComponentMap'
import { AnySchema, FormDefaults, SlotComponent } from './components/SlotComponent'
import { migrationPlan } from './components/SlotComponent/schema'

import './App.css'
import { DraggableSources } from './components/DraggableSources'


const initialSchema: AnySchema = {}
const migratedSchema = migrationPlan(initialSchema)

function formHasError(o: unknown): boolean {
  if (typeof o !== "object" || o === null || Array.isArray(o)) {
    return false
  } 
  for (const key in o) {
    if (key === "_type") {
      return true
    }
    if (formHasError((o as Record<string, unknown>)[key])) {
      return true
    }
  }
  return false
}

function App() {
  const [value, onChange] = useState({
    formState: FormDefaults(migratedSchema),
    schema: migratedSchema
  })

  const hasError = formHasError(
    value.formState
  )

  const handleSubmit = () => {
    alert("submit")
    console.log(value.schema)
  }

  return (
    <div className="App">
      <DraggableSources/>
      <hr style={{width: '100%', margin: '0'}}/>
      <SlotComponent value={value} onChange={onChange}/>
      <button type="button" disabled={hasError} onClick={handleSubmit}>Submit</button>
    </div>
  )
}

export default App
