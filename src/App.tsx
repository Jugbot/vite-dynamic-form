import { useState } from 'react'

import { formRootModule, FormRootModule, formMigrationPlan } from './components/modules'

import './App.css'
import { DraggableSources } from './components/DraggableSources'
import { ExtractAnySchema } from './components/formComponentModule'

const {formDefaults, Component: FormRoot} = formRootModule

const initialSchema: ExtractAnySchema<FormRootModule> = {}
const migratedSchema = formMigrationPlan(initialSchema)

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
    formState: formDefaults(migratedSchema),
    schema: migratedSchema
  })

  const hasError = formHasError(
    value.formState
  )

  const handleSubmit = () => {
    alert("submit")
    console.info(value.schema)
  }

  return (
    <div className="App">
      <DraggableSources/>
      <hr style={{width: '100%', margin: '0'}}/>
      <FormRoot value={value} onChange={onChange}/>
      <button type="button" disabled={hasError} onClick={handleSubmit}>Submit</button>
    </div>
  )
}

export default App
