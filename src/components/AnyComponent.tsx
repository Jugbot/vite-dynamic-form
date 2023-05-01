import { ComponentProps } from "react";
import { ModuleID } from "../types";
import { ModuleMap, moduleMap } from "./modules";

type AnyComponentsProps<M extends ModuleID> = ComponentProps<
  ModuleMap[M]["Component"]
>;

/**
 * Wrapper for rendering multiple possible form components
 */
export const AnyComponent = <M extends ModuleID>(
  props: AnyComponentsProps<M>
) => {
  const {
    value: { schema },
  } = props;

  const { Component } = moduleMap[schema._id];

  return Component(props as never);
};
