import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { AnySchema, FormDefaults, ParentComponent } from './components/ParentComponent'
import './App.css'
import { migrationPlan } from './components/ParentComponent/schema'

const initialSchema: AnySchema = {} as {_version: never}
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
      <ParentComponent value={value} onChange={onChange}/>
      <button type="button" disabled={hasError} onClick={handleSubmit}>Submit</button>
    </div>
  )
}

export default App
