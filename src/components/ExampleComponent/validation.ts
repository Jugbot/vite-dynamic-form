import { FormState, ErrorID } from "./types";
import { Schema } from "./schema";
import { FormDataType, ProblemLabels } from "../../types";

export function valueIsError(schema: Schema): FormState[ErrorID.VALUE_ERROR] {
  if (schema.value === 'error') {
    return {
      _type: FormDataType.STATUS,
      labels: [ProblemLabels.ERROR],
      reason: 'This is a test error',
    };
  }
  return null
}

export function colorFormat(schema: Schema): FormState[ErrorID.COLOR_FORMAT_ERROR] {
  if (!/^#[0-9A-Fa-f]{6}$/i.test(schema.color)) {
    return {
      _type: FormDataType.STATUS,
      labels: [ProblemLabels.ERROR],
      reason: 'Invalid format, must be a color hash of size 6 e.g. #abc123',
    };
  }
  return null
}

export function colorRequired(schema: Schema): FormState[ErrorID.COLOR_REQUIRED_ERROR] {
  if (!schema.color.length) {
    return {
      _type: FormDataType.STATUS,
      labels: [ProblemLabels.ERROR],
      reason: 'This field is required',
    };
  }
  return null
}

export function defaults(schema: Schema): FormState {
  return {
    [ErrorID.VALUE_ERROR]: valueIsError(schema),
    [ErrorID.COLOR_REQUIRED_ERROR]: colorFormat(schema),
    [ErrorID.COLOR_FORMAT_ERROR]: colorRequired(schema),
    showFormatError: true
  }
}