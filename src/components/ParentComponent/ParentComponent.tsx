import { FormPackage } from "../../types";
import { createNestingAdapter } from "../../utils";
import { ValidationInfoDisplay } from "../Error";
import { module as exampleComponentModule } from "../ExampleComponent";
import { Schema } from "./schema";
import { ErrorID, FormState } from "./types";
import * as validator from "./validation";

export const ParentComponent = (props: FormPackage<Schema, FormState>) => {
  const {
    value: { schema, formState },
    onChange,
  } = props;

  const passProps = createNestingAdapter<
    Schema,
    FormState,
    FormPackage<Schema, FormState>
  >(props);

  const handleSomeValueChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const newValue = event.currentTarget.value;
    onChange((old) => {
      const newSchema: Schema = { ...old.schema, someValue: newValue };
      return {
        schema: newSchema,
        formState: {
          ...old.formState,
          [ErrorID.ERROR]: validator.valueIsError(newSchema),
        },
      };
    });
  };

  return (
    <div style={{ display: "flex", gap: "4px", flexDirection: "column" }}>
      <input
        value={schema.someValue}
        onChange={handleSomeValueChange}
        placeholder="I am a field in parent"
      />
      <ValidationInfoDisplay info={formState.ERROR} />
      <exampleComponentModule.Component {...passProps("subcomponent", "CHILD_COMPONENT")} />
    </div>
  );
};
