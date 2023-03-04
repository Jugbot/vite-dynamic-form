import { ComponentID, ComponentIDTag, FormComponentModule, SlotAttributes } from "../types";
import { module as ExampleComponentModule } from "./ExampleComponent";
import { module as ParentComponentModule } from "./ParentComponent";
import { module as SlotComponentModule } from "./SlotComponent";

// When creating a new form component it is necessary to add the module here
export const modules = [
  ExampleComponentModule,
  ParentComponentModule,
  SlotComponentModule,
] as const satisfies readonly FormComponentModule<any, any, any, any>[];

export type AllModules = typeof modules[number];
type AllSchemas = AllModules["SchemaDefaults"]

type ComponentMap = {[Module in AllModules as Module["SchemaDefaults"]["_id"]]: Module}

// The id will automatically be pulled from the schema and put into a map of Record<id, module>
export const componentMap = Object.fromEntries(
  modules.map((m) => [m.SchemaDefaults._id, m])
) as ComponentMap;


/**
 * Union of all components modules that contain the given attributes.
 * You can narrow the search/test a single module by suplying a union of modules to `Test`
 */
export type CompatibleComponent<
  A extends readonly SlotAttributes[],
  Test = AllModules
> = Test extends AllModules
  ? A[number] extends Test["Attributes"][number]
    ? Test
    : never
  : never;
