import { ModuleID, ComponentIDTag, LatestVersionTag, SlotAttributes, FormPackage } from "../types";
import { DeepReadonly } from "../utils";


// Each form component should export a "module" that contains info that we will need for click to edit / drag and drop
export interface FormComponentModule<
  ID extends ModuleID,
  AnySchema,
  Schema extends ComponentIDTag<ID> & LatestVersionTag,
  FormState,
  Attributes extends readonly SlotAttributes[],
> {
  id: ID;
  Component: React.FunctionComponent<FormPackage<Schema, FormState>>;
  schemaDefaults: DeepReadonly<Schema>, // Causes recursion issues with types that have circular references
  migrationPlan: (schema: AnySchema) => Schema
  formDefaults: (schema: Schema) => FormState;
  attributes: Attributes;
};

// Utilities used to extract types from a module
export type ExtractAnySchema<T> = T extends FormComponentModule<any, infer AnySchema, any, any, any> ? AnySchema : never
export type ExtractSchema<T> = T extends FormComponentModule<any, any, infer Schema, any, any> ? Schema : never
export type ExtractFormState<T> = T extends FormComponentModule<any, any, any, infer FormState, any> ? FormState : never
export type ExtractAttributes<T> = T extends FormComponentModule<any, any, any, any, infer Attributes> ? Attributes : never