import { SlotAttributes } from "../../types";
import { CompatibleModuleTypes } from "../modules";
import { Schema } from "./schema";

export type FormState = {
  CHILD_COMPONENT: CompatibleModuleTypes<Schema["someSlot"]["_accepts"]>["FormState"] | null
}

export const attributes = [
  SlotAttributes.CONTAINER,
  SlotAttributes.RENDERABLE
] as const
