// types/form-field.model.ts (or inline if small project)

export interface FormField {
  name: string;
  label?: string;
  type: 'text' | 'email' | 'dropdown' | 'radio' | 'hidden';
  required?: boolean;
  options?: { label: string; value: any }[];  // <-- dropdown options
  optionLabel?: string;
  optionValue?: string;
  placeholder?: string;
  [key: string]: any; // allow other optional keys
}
