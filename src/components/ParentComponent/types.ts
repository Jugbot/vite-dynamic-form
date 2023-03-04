import { SlotAttributes, ValidationInfo } from "../../types";
import * as ExampleComponent from '../ExampleComponent';

export enum ErrorID {
  ERROR = 'ERROR',
}

type SubComponent = {
  CHILD_COMPONENT: ExampleComponent.FormState
}

export type FormState = Record<ErrorID, ValidationInfo | null> & SubComponent

export const attributes = [
  SlotAttributes.RENDERABLE
] as const