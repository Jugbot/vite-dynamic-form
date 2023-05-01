import type {
  LatestVersionTag,
  LegacyVersionTag,
  SlotAttributes,
  VersionTag,
} from '../types';
import { module as exampleComponentModule } from './ExampleComponent';
import { ExtractAnySchema, ExtractSchema } from './formComponentModule';
import { module as parentComponentModule } from './ParentComponent';
import { module as slotComponentModule } from './SlotComponent';


// When creating a new form component it is necessary to add the module here
export const modules = [
  exampleComponentModule,
  parentComponentModule,
  slotComponentModule,
];

export type AllModules = typeof modules[number];

export type ModuleMap = { [Module in AllModules as Module["id"]]: Module };

// The id will automatically be pulled from the schema and put into a map of Record<id, module>
export const moduleMap = Object.fromEntries(
  modules.map((m) => [m.id, m])
) as { [Module in AllModules as Module["id"]]: Module };

export function schemaModule<Schema extends ExtractAnySchema<AllModules>>(schema: Schema) {
  return moduleMap[schema._id] as ModuleMap[Schema["_id"]]
}

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
> = ModuleMap[CompatibleModule<A, Test>["id"]];

const isSchema = (obj: object): obj is ExtractAnySchema<AllModules> => "_id" in obj

export function mapSchemas<T>(obj: Record<string, unknown>, transform: (anySchema: ExtractAnySchema<AllModules>) => T) {
  for (const key in obj) {
    const value = obj[key]
    if (typeof value === "object" && value !== null) {
      obj[key] = mapSchemas(value as Record<string, unknown>, transform);
    }
  }
  return isSchema(obj) ? transform(obj) : obj
}

function migrateSchema<T extends AllModules>(anySchema: ExtractAnySchema<T>): ExtractSchema<T> {
  const module = moduleMap[anySchema._id]
  return module.migrationPlan(anySchema as never) as ExtractSchema<T>
}

export function loadSchema(obj: Record<string, unknown>): ExtractSchema<AllModules> {
  const migratedSchema = mapSchemas(obj, migrateSchema)
  if (!isSchema(migratedSchema)) {
    throw new Error("The root object is not a schema!")
  }
  return migratedSchema
}
