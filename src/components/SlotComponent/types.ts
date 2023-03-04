import { SlotAttributes } from "../../types";
import { CompatibleComponent } from "../formComponentMap";
import { Schema } from "./schema";

export type FormState = {
  CHILD_COMPONENT: ReturnType<CompatibleComponent<Schema["someSlot"]["_accepts"]>["FormDefaults"]> | null
}

export const attributes = [
  SlotAttributes.CONTAINER,
  SlotAttributes.RENDERABLE
] as const
