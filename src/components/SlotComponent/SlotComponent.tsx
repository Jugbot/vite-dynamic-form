import { ComponentProps } from "react";
import { FormPackage, ModuleID, SlotAttributes } from "../../types";
import { cloneReadonly, combine, createNestingAdapter } from "../../utils";
import { DragTarget } from "../DragTarget";
import { CompatibleModule, componentMap } from "../formComponentMap";
import { Schema } from "./schema";
import { FormState } from "./types";

export const SlotComponent = (props: FormPackage<Schema, FormState>) => {
  const {
    value: { schema, formState },
    onChange,
  } = props;

  const subcomponent = schema.someSlot.subcomponent;
  let SlotComponent: React.ReactNode = "Slot is empty";
  if (subcomponent) {
    const passProps = createNestingAdapter<
      Schema,
      FormState,
      FormPackage<Schema, FormState>
    >(props);
    const Component = componentMap[subcomponent._id].Component;
    // FIXME: Fix unions breaking function types
    SlotComponent = (
      <Component {...passProps("someSlot.subcomponent", "CHILD_COMPONENT") as any} />
    );
  }

  const accepts = [
    SlotAttributes.RENDERABLE,
    SlotAttributes.CONTAINER,
  ] as const;
  const handleSlot = (module: CompatibleModule<typeof accepts>) => {
    onChange((prev) => ({
      schema: {
        ...prev.schema,
        someSlot: {
          ...prev.schema.someSlot,
          // FIXME: the defaults need to be deepcloned and made readonly
          subcomponent: cloneReadonly(module.schemaDefaults),
        },
      },
      formState: {
        ...prev.formState,
        CHILD_COMPONENT: module.formDefaults(module.schemaDefaults as never),
      },
    }));
  };

  return (
    <div style={{ display: "flex", gap: "4px", flexDirection: "column" }}>
      <DragTarget accepts={accepts} onSlotted={handleSlot} />
      {SlotComponent}
    </div>
  );
};