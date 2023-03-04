import { FormDataType, ProblemLabels } from "../../types";
import { Schema } from "./schema";
import { ErrorID, FormState } from "./types";
import { formDefaults as childDefaults } from "../ExampleComponent";

export function valueIsError(schema: Schema): FormState[ErrorID.ERROR] {
  if (schema.someValue === "error") {
    return {
      _type: FormDataType.STATUS,
      labels: [ProblemLabels.ERROR],
      reason: "This is a test error",
    };
  }
  return null;
}

export function defaults(schema: Schema): FormState {
  return {
    [ErrorID.ERROR]: valueIsError(schema),
    CHILD_COMPONENT: childDefaults(schema.subcomponent),
  };
}
