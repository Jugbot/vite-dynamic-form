import { ComponentProps } from "react";
import { FormPackage, SlotAttributes } from "../../types";
import { combine, createNestingAdapter } from "../../utils";
import { DragTarget } from "../DragTarget";
import { CompatibleComponent, componentMap } from "../formComponentMap";
import { Schema } from "./schema";
import { FormState } from "./types";


export const SlotComponent = (props: FormPackage<Schema, FormState>) => {
  const {
    value: { schema, formState },
    onChange,
  } = props;


  const passProps = createNestingAdapter<
    Schema,
    FormState,
    FormPackage<Schema, FormState>
  >(props);

  const subcomponent = schema.someSlot.subcomponent;
  let SlotComponent: React.ReactNode = "Slot is empty";
  const {
    value: { schema: childSchema, formState: childFormState },
    onChange: onChildChange,
  } = passProps("someSlot.subcomponent", "CHILD_COMPONENT");
  console.log({subcomponent})
  if (subcomponent && childSchema && childFormState) {
    const Component = componentMap[subcomponent._id].Component;
    // FIXME: Fix unions breaking function types
    SlotComponent = (
      <Component
        value={{ schema: childSchema, formState: childFormState } as never}
        onChange={onChildChange as never}
      />
    );
  }

  const accepts = [SlotAttributes.RENDERABLE, SlotAttributes.CONTAINER] as const;
  const handleSlot = (module: CompatibleComponent<typeof accepts>) => {
    console.log("slotting", module)
    onChange((prev) => ({
      schema: {
        ...prev.schema,
        someSlot: {
          ...prev.schema.someSlot,
          // FIXME: the defaults need to be deepcloned and made readonly
          subcomponent: (module.SchemaDefaults),
        }
      },
      formState: {
        ...prev.formState,
        CHILD_COMPONENT: module.FormDefaults(module.SchemaDefaults as never)
      },
    }));
  };

  return (
    <div style={{display: 'flex', gap: '4px', flexDirection: 'column'}}>
      <DragTarget accepts={accepts} onSlotted={handleSlot} />
      {SlotComponent}
    </div>
  );
};
