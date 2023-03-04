import { SlotAttributes, ValidationInfo } from "../../types";

export enum ErrorID {
  VALUE_ERROR = 'VALUE_ERROR',
  COLOR_FORMAT_ERROR = 'COLOR_FORMAT_ERROR',
  COLOR_REQUIRED_ERROR = 'COLOR_REQUIRED_ERROR',
}

// The shape of form state here is fairly arbitrary
export type FormState = Record<ErrorID, ValidationInfo | null> & {
  // Here we control the visibility of a certain error separately since we still want the error to exist even if we don't show it.
  showFormatError: boolean
}

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

export const attributes = [
  SlotAttributes.RENDERABLE
] as const