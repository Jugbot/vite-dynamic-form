import { Schema } from "./schema";
import { FormState } from "./types";
import { moduleMap } from "../modules";

function getNestedFormState(schema: Schema) {
  const slottedComponent = schema.someSlot.subcomponent;
  if (slottedComponent) {
    const module = moduleMap[slottedComponent._id];
    // FIXME: ts doesn't know that form defaults is compatible with component
    return module.formDefaults(slottedComponent as never);
  }
  return null;
}

export function defaults(schema: Schema): FormState {
  return {
    CHILD_COMPONENT: getNestedFormState(schema),
  };
}
