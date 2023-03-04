import { SlotAttributes } from "../../types";
import { AllModuleTypes, CompatibleModule } from "../formComponentMap";
import { Schema } from "./schema";

export type FormState = {
  CHILD_COMPONENT: AllModuleTypes["FormState"] | null
}

export const attributes = [
  SlotAttributes.CONTAINER,
  SlotAttributes.RENDERABLE
] as const
