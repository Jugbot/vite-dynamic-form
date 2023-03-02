import {
  FormPackage
} from "../../types";
import { createNestingAdapter } from "../../utils";
import { ValidationInfoDisplay } from "../Error";
import { ExampleComponent } from "../ExampleComponent";
import { Schema } from "./schema";
import { ErrorID, FormState } from "./types";
import * as validator from './validation';
 

export const ParentComponent = (props: FormPackage<Schema, FormState>) => {
  const {
    value: { schema, formState },
    onChange,
  } = props;

  const passProps = createNestingAdapter<Schema, FormState, FormPackage<Schema, FormState>>(props)

  const handleSomeValueChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const newValue = event.currentTarget.value;
    onChange((old) => {
      const newSchema = { ...old.schema, color: newValue };
      return {
        schema: newSchema,
        formState: {
          ...old.formState,
          [ErrorID.ERROR]: validator.valueIsError(newSchema),
        },
      };
    });
  };

  return (<>
    <input value={schema.someValue} onChange={handleSomeValueChange} />
    <ValidationInfoDisplay info={formState.ERROR} />
    <ExampleComponent
      {...passProps('subcomponent', 'CHILD_COMPONENT')}
    />
    </>
  );
};
