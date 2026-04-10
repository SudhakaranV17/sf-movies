import {
  useForm as useFormHook,
  type UseFormProps,
  type FieldValues,
  type Path,
  type PathValue,
} from "react-hook-form";
import { useCallback } from "react";

/**
 * Custom useForm wrapper
 * Provides an optimized setValue to prevent unnecessary re-renders and infinite loops.
 */
export default function useForm<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTransformedValues = TFieldValues,
>(formOptions?: UseFormProps<TFieldValues, TContext, TTransformedValues>) {
  const form = useFormHook(formOptions);

  const setFormValue = useCallback(
    (
      name: Path<TFieldValues>,
      value: PathValue<TFieldValues, Path<TFieldValues>>,
      defaultMethod: boolean = false,
      options?: any,
    ) => {
      const currentValue = form.getValues(name);

      if (defaultMethod) {
        form.setValue(name, value, options);
      } else {
        if (
          Array.isArray(value) ||
          typeof value === "object" ||
          typeof value === "boolean" ||
          typeof value === "number"
        ) {
          form.setValue(name, value, options);
        } else {
          // Optimization for primitive values to avoid redundant updates
          if (!currentValue || value === "" || currentValue !== value) {
            form.setValue(name, value, options);
          }
        }
      }
    },
    [form],
  );

  return {
    ...form,
    setValue: setFormValue as any,
  };
}
