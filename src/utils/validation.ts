import { Field, FormValues, FormErrors } from "../types";

// For derived evaluation, we provide a safe-ish evaluator.
// We map parent labels to values and eval the formula in a sandboxed Function.
export function evaluateDerived(
  fields: Field[],
  values: FormValues
): FormValues {
  const derived: FormValues = {};

  fields.forEach((field) => {
    if (!field.derived || !field.formula) return;

    try {
      const context: Record<string, any> = {};

      // Map parent fields to their values
      (field.parents || []).forEach((parentLabel) => {
        const parentField = fields.find(
          (f) => f.label === parentLabel || f.id === parentLabel
        );
        if (parentField) {
          const value =
            values[parentField.id] ?? parentField.defaultValue ?? "";
          // Normalize label to JS variable name: replace spaces and special chars with _
          const key = parentField.label.replace(/[^a-zA-Z0-9]/g, "_");
          context[key] = value;
        }
      });

      // Build and execute the function safely
      const fn = new Function(
        ...Object.keys(context),
        `return (${field.formula})`
      );
      const result = fn(...Object.values(context));
      derived[field.id] = result;
    } catch (error) {
      console.warn(`Error evaluating derived field ${field.label}:`, error);
      derived[field.id] = "";
    }
  });

  return derived;
}

export function validateField(field: Field, value: any): string | null {
  const val = value ?? field.defaultValue ?? "";

  // Required validation
  if (field.validation?.required) {
    // Special handling for different field types
    if (field.type === "checkbox") {
      if (val !== true) {
        return "This field is required";
      }
    } else if (
      val === undefined ||
      val === null ||
      val === "" ||
      (Array.isArray(val) && val.length === 0)
    ) {
      return "This field is required";
    }
  }

  // Skip other validations if value is empty and not required (but not for checkboxes)
  if (
    field.type !== "checkbox" &&
    (val === "" || val === null || val === undefined)
  ) {
    return null;
  }

  // Min/Max length validation
  if (typeof val === "string") {
    if (
      field.validation?.minLength &&
      val.length < field.validation.minLength
    ) {
      return `Minimum length is ${field.validation.minLength} characters`;
    }
    if (
      field.validation?.maxLength &&
      val.length > field.validation.maxLength
    ) {
      return `Maximum length is ${field.validation.maxLength} characters`;
    }
  }

  // Number validation
  if (field.type === "number") {
    const numVal = typeof val === "string" ? parseFloat(val) : val;
    if (!isNaN(numVal) && typeof numVal === "number") {
      if (
        field.validation?.min !== undefined &&
        numVal < field.validation.min
      ) {
        return `Minimum value is ${field.validation.min}`;
      }
      if (
        field.validation?.max !== undefined &&
        numVal > field.validation.max
      ) {
        return `Maximum value is ${field.validation.max}`;
      }
    }
  }

  // Email validation
  if (field.validation?.email && typeof val === "string") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      return "Please enter a valid email address";
    }
  }

  // Password validation
  if (field.validation?.passwordRule && typeof val === "string") {
    const passwordRegex = /^(?=.*\d).{8,}$/;
    if (!passwordRegex.test(val)) {
      return "Password must be at least 8 characters long and contain at least one number";
    }
  }

  return null;
}

export function validateForm(fields: Field[], values: FormValues): FormErrors {
  const errors: FormErrors = {};

  fields.forEach((field) => {
    if (field.derived) return; // Skip validation for derived fields

    const error = validateField(field, values[field.id]);
    if (error) {
      errors[field.id] = error;
    }
  });

  return errors;
}
