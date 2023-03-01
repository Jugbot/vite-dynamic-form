import { ValidationInfo } from "../../types";

export enum ErrorID {
  VALUE_ERROR = 'VALUE_ERROR',
  COLOR_FORMAT_ERROR = 'COLOR_FORMAT_ERROR',
  COLOR_REQUIRED_ERROR = 'COLOR_REQUIRED_ERROR',
}

// The shape of form state here is fairly arbitrary
export type FormState = Record<ErrorID, ValidationInfo | null>

/**
 * Here is another approach
 * The only downside here is that there is no way to keep the structure up-to-date with the 
 * schema structure whereas using unique ids separates the validation purpose from schema 
 * structure wich I prefer
 */
type AnotherFormStateExample = {
  value: {
    change: ValidationInfo
  },
  color: {
    change: ValidationInfo,
    blur: ValidationInfo
  }
}