export type FieldType =
  | "text"
  | "number"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "date";

export interface Validation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  email?: boolean;
  passwordRule?: boolean;
  min?: number; // for number fields
  max?: number; // for number fields
}

export interface Field {
  id: string;
  type: FieldType;
  label: string;
  defaultValue?: any;
  options?: string[]; // for select/radio/checkbox
  validation?: Validation;
  derived?: boolean;
  parents?: string[]; // parent field ids
  formula?: string; // simple JS expression using parent ids as variables
  placeholder?: string;
}

export interface FormSchema {
  id: string;
  name: string;
  createdAt: string;
  fields: Field[];
}

export interface FormValues {
  [fieldId: string]: any;
}

export interface FormErrors {
  [fieldId: string]: string;
}
