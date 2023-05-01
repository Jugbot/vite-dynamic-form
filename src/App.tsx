import { ComponentProps, useState } from "react";
import { AllModules, loadSchema, moduleMap } from "./components/modules";
import "./App.css";
import { DraggableSources } from "./components/DraggableSources";
import { ExtractAnySchema } from "./components/formComponentModule";
import { ModuleID } from "./types";
import { AnyComponent } from "./components/AnyComponent";


const initialSchema: Record<string, unknown> = {
  _id: ModuleID.SlotComponent,
} satisfies ExtractAnySchema<AllModules>;

const migratedSchema = loadSchema(initialSchema);
const rootModule = moduleMap[migratedSchema._id];

function formHasError(o: unknown): boolean {
  if (typeof o !== "object" || o === null || Array.isArray(o)) {
    return false;
  }
  for (const key in o) {
    if (key === "_type") {
      return true;
    }
    if (formHasError((o as Record<string, unknown>)[key])) {
      return true;
    }
  }
  return false;
}

function App() {
  const [value, onChange] = useState({
    formState: rootModule.formDefaults(migratedSchema as never),
    schema: migratedSchema,
  } as ComponentProps<AllModules["Component"]>["value"]);
  const hasError = formHasError(value.formState);
  const handleSubmit = () => {
    alert("submit");
    console.info(value.schema);
  };
  return (
    <div className="App">
      <DraggableSources />
      <hr style={{ width: "100%", margin: "0" }} />
      {AnyComponent({value, onChange} as ComponentProps<AllModules["Component"]>)}
      <button type="button" disabled={hasError} onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}

export default App;
