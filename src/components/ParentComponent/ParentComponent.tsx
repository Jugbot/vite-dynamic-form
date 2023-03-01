import { FormPackage, LATEST_GLOBAL_VERSION, ValidationRecord, VersionTag } from '../../types';
import { ExampleComponent, ExampleComponentProps } from '../ExampleComponent';
import { Schema } from './schema';

function passthrough<
  ParentSchema extends FormPackage<infer U, infer F>
>(
  props: FormPackage<ParentSchema, ParentValidationIds, "CHILD_KEY", ValidationRecord<>>,
  value: ChildSchema
): FormPackage<ChildSchema, ChildValidationIds> {
  return {
    value,
    onChange: (action) => {},
    onValidation: () => {},
    validation: props.validation,
  };
}

enum ErrorID {
  ERROR = 'ERROR',
}

export const ParentComponent = (props: FormPackage<Schema, ErrorID, "SUBCOMPONENT_ID", ExampleComponentProps["validation"]>) => {
  const {
    value: { subcomponent },
    onChange,
    onValidation,
    validation,
  } = props;
  return <ExampleComponent />;
};
