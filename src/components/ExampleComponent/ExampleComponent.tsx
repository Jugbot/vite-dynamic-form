import React from 'react';

import { FormPackage } from '../../types';
import { ValidationInfoDisplay } from '../Error';
import { Schema } from './schema';
import {
  ErrorID,
  FormState,
} from './types';
import * as validator from './validation';

export const ExampleComponent = ({
  value: { schema, formState },
  onChange,
}: FormPackage<Schema, FormState>) => {
  const { value, color } = schema;

  const handleValueChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const newValue = event.currentTarget.value;
    onChange((old) => {
      const newSchema = { ...old.schema, value: newValue };
      return {
        schema: newSchema,
        formState: {
          ...old.formState,
          [ErrorID.VALUE_ERROR]: validator.valueIsError(newSchema),
        },
      };
    });
  };

  const handleColorBlur: React.FocusEventHandler<HTMLInputElement> = (
    event
  ) => {
    onChange((old) => ({
      ...old,
      formState: {
        ...old.formState,
        showFormatError: true,
      },
    }));
  };

  const handleColorChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const newValue = event.currentTarget.value;
    onChange((old) => {
      const newSchema = { ...old.schema, color: newValue };
      return {
        schema: newSchema,
        formState: {
          ...old.formState,
          showFormatError: false,
          [ErrorID.COLOR_FORMAT_ERROR]: validator.colorFormat(newSchema),
          [ErrorID.COLOR_REQUIRED_ERROR]: validator.colorRequired(newSchema),
        },
      };
    });
  };

  return (
    <div style={{ display: "flex", gap: "4px", flexDirection: "column" }}>
      <input
        value={value}
        onChange={handleValueChange}
        placeholder="Type 'error' to trigger an error!"
      />
      <ValidationInfoDisplay info={formState.VALUE_ERROR} />
      <input
        value={color}
        onBlur={handleColorBlur}
        onChange={handleColorChange}
      />
      {formState.showFormatError ? (
        <ValidationInfoDisplay info={formState.COLOR_FORMAT_ERROR} />
      ) : null}
      <ValidationInfoDisplay info={formState.COLOR_REQUIRED_ERROR} />
    </div>
  );
};
