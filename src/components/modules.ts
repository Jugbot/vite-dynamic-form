import type { ComponentIDTag, LatestVersionTag, LegacyVersionTag, ModuleID, SlotAttributes, VersionTag } from "../types";
import { module as exampleComponentModule } from "./ExampleComponent";
import { module as parentComponentModule } from "./ParentComponent";
import { module as slotComponentModule } from "./SlotComponent";
import type { Module as ExampleComponentModule } from "./ExampleComponent";
import type { Module as ParentComponentModule } from "./ParentComponent";
import type { Module as SlotComponentModule } from "./SlotComponent";
import { migrationPlan } from "./SlotComponent/schema";

// The root component of the form can just be any component
export const formRootModule = slotComponentModule
export type FormRootModule = SlotComponentModule
export const formMigrationPlan = migrationPlan

// When creating a new form component it is necessary to add the module here
export const modules = [
  exampleComponentModule,
  parentComponentModule,
  slotComponentModule,
];

// Since it is impossible to bundle values and types together we also need to add the modules extra types here
type moduleTypes = [
  ExampleComponentModule,
  ParentComponentModule,
  SlotComponentModule
];

export type AllModules = typeof modules[number];

export type ModuleMap = { [Module in AllModules as Module["id"]]: Module };

export type AllModuleTypes = moduleTypes[number];

export type ModuleTypeMap = {
  [Module in AllModuleTypes as Module["Schema"]["_id"]]: Module;
};

// The id will automatically be pulled from the schema and put into a map of Record<id, module>
export const moduleMap = Object.fromEntries(
  modules.map((m) => [m.id, m])
) as ModuleMap;

// Template used to export the same types in all modules
export type ModuleTypes<Schema extends LatestVersionTag, AnySchema extends LegacyVersionTag | VersionTag<number>, FormState> = {
  Schema: Schema;
  AnySchema: AnySchema;
  FormState: FormState;
};

// Each form component should export a "module" that contains info that we will need for click to edit / drag and drop
export type FormComponentModule<
  P,
  N extends ModuleID,
  S extends ComponentIDTag<N>,
  F,
  A,
  R extends Readonly<ComponentIDTag<N>>
> = {
  id: N;
  Component: React.FunctionComponent<P>;
  schemaDefaults: R; // DeepReadonly<S>, // Causes recursion issues with types that have circular references
  formDefaults: (schema: S) => F;
  attributes: A;
};

// Used so we can infer the generic parts (Props, Schema, FormState)
export function makeModule<
  P,
  N extends ModuleID,
  S extends ComponentIDTag<N>,
  F,
  A,
  R extends Readonly<ComponentIDTag<N>>
>(options: FormComponentModule<P, N, S, F, A, R>) {
  return options;
}

/**
 * Union of all components modules that contain the given attributes.
 * You can narrow the search/test a single module by suplying a union of modules to `Test`
 */
export type CompatibleModule<
  A extends readonly SlotAttributes[],
  Test = AllModules
> = Test extends AllModules
  ? A[number] extends Test["attributes"][number]
    ? Test
    : never
  : never;

/**
 * ModuleTypes version of CompatibleModule
 */
export type CompatibleModuleTypes<
  A extends readonly SlotAttributes[],
  Test = AllModules
> = ModuleTypeMap[CompatibleModule<A, Test>["id"]];
