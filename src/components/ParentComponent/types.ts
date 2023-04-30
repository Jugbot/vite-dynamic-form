import { SlotAttributes, ValidationInfo } from "../../types";
import {module as exampleComponentModule} from '../ExampleComponent';
import { ExtractFormState } from "../formComponentModule";

export enum ErrorID {
  ERROR = 'ERROR',
}

type SubComponent = {
  CHILD_COMPONENT: ExtractFormState<typeof exampleComponentModule>
}

export type FormState = Record<ErrorID, ValidationInfo | null> & SubComponent

export const attributes = [
  SlotAttributes.RENDERABLE
] as const