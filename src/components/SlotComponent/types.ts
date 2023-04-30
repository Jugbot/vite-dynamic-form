import { SlotAttributes } from "../../types";
import { ExtractFormState } from "../formComponentModule";
import { CompatibleModuleTypes } from "../modules";
import { Schema } from "./schema";

export type FormState = {
  CHILD_COMPONENT: ExtractFormState<CompatibleModuleTypes<Schema["someSlot"]["_accepts"]>> | null
}

export const attributes = [
  SlotAttributes.CONTAINER,
  SlotAttributes.RENDERABLE
] as const
