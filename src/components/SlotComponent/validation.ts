import { ModuleID, FormDataType, ProblemLabels } from "../../types";
import { Schema } from "./schema";
import { FormState } from "./types";
import { componentMap } from "../formComponentMap";


export function defaults(schema: Schema): FormState {
  let CHILD_COMPONENT = null
  const slottedComponent = schema.someSlot.subcomponent
  if (slottedComponent) {
    const module = componentMap[slottedComponent._id]
    // FIXME: ts doesn't know that form defaults is compatible with component
    CHILD_COMPONENT = module.formDefaults(slottedComponent as never)
  }
  return {
    CHILD_COMPONENT,
  };
}
