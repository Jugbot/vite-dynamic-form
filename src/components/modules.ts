import type {
  LatestVersionTag,
  LegacyVersionTag,
  SlotAttributes,
  VersionTag,
} from '../types';
import { module as exampleComponentModule } from './ExampleComponent';
import { ExtractSchema } from './formComponentModule';
import { module as parentComponentModule } from './ParentComponent';
import { module as slotComponentModule } from './SlotComponent';
import { migrationPlan } from './SlotComponent/schema';

// The root component of the form can just be any component
export const formRootModule = slotComponentModule
export type FormRootModule = typeof slotComponentModule
export const formMigrationPlan = migrationPlan

// When creating a new form component it is necessary to add the module here
export const modules = [
  exampleComponentModule,
  parentComponentModule,
  slotComponentModule,
];

export type AllModules = typeof modules[number];

export type ModuleMap = { [Module in AllModules as Module["id"]]: Module };

export type ModuleTypeMap = {
  [Module in AllModules as ExtractSchema<Module>["_id"]]: Module;
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
