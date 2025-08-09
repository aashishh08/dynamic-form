import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import {
  TextField,
  Stack,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  RadioGroup,
  Radio,
  Typography,
  Paper,
  Alert,
  Box,
} from "@mui/material";
import {
  evaluateDerived,
  validateForm,
  validateField,
} from "../utils/validation";
import { FormValues, FormErrors } from "../types";
import dayjs from "dayjs";

export default function Preview() {
  const form = useSelector((s: RootState) => s.forms.current)!;
  const [values, setValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  // Initialize values with default values
  useEffect(() => {
    const initialValues: FormValues = {};
    form.fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        initialValues[field.id] = field.defaultValue;
      }
    });
    setValues(initialValues);
  }, [form.fields]);

  // Compute derived values on-the-fly instead of storing them in state
  const computedValues = React.useMemo(() => {
    const derivedValues = evaluateDerived(form.fields, values);
    return { ...values, ...derivedValues };
  }, [values, form.fields]);

  function handleChange(fieldId: string, value: any) {
    const newValues = { ...values, [fieldId]: value };
    setValues(newValues);

    // Mark field as touched
    setTouched((prev) => new Set([...prev, fieldId]));

    // Validate the field
    const field = form.fields.find((f) => f.id === fieldId);
    if (field) {
      const error = validateField(field, value);
      setErrors((prev) => {
        const newErrors = { ...prev };
        if (error) {
          newErrors[fieldId] = error;
        } else {
          delete newErrors[fieldId];
        }
        return newErrors;
      });
    }
  }

  function handleBlur(fieldId: string) {
    setTouched((prev) => new Set([...prev, fieldId]));
  }

  function validateAll() {
    const newErrors = validateForm(form.fields, computedValues);
    setErrors(newErrors);
    // Mark all fields as touched for validation display
    const allFieldIds = form.fields.map((f) => f.id);
    setTouched(new Set(allFieldIds));
    return newErrors;
  }

  function handleSubmit() {
    const validationErrors = validateAll();
    if (Object.keys(validationErrors).length === 0) {
      alert("Form submitted successfully!");
    } else {
      alert("Please fix the validation errors before submitting.");
    }
  }

  function renderField(field: any) {
    const value = computedValues[field.id] ?? field.defaultValue ?? "";
    const error = errors[field.id];
    const isTouched = touched.has(field.id);
    const showError = isTouched && error;

    if (field.derived) {
      return (
        <TextField
          key={field.id}
          label={field.label}
          value={value}
          size="small"
          fullWidth
          InputProps={{ readOnly: true }}
          helperText="This field is automatically calculated"
        />
      );
    }

    const commonProps = {
      key: field.id,
      label: field.label,
      value: value,
      onChange: (e: any) => handleChange(field.id, e.target.value),
      onBlur: () => handleBlur(field.id),
      error: !!showError,
      helperText: showError ? error : field.placeholder,
      size: "small" as const,
      fullWidth: true,
      placeholder: field.placeholder,
    };

    switch (field.type) {
      case "text":
        return <TextField {...commonProps} type="text" />;

      case "number":
        return (
          <TextField
            {...commonProps}
            type="number"
            inputProps={{
              min: field.validation?.min,
              max: field.validation?.max,
            }}
          />
        );

      case "textarea":
        return <TextField {...commonProps} multiline minRows={3} maxRows={6} />;

      case "date":
        return (
          <TextField
            {...commonProps}
            type="date"
            InputLabelProps={{ shrink: true }}
          />
        );

      case "select":
        return (
          <TextField {...commonProps} select>
            {field.options?.map((option: string) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        );

      case "radio":
        return (
          <Box key={field.id}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {field.label}
              {field.validation?.required && (
                <span style={{ color: "red" }}> *</span>
              )}
            </Typography>
            <RadioGroup
              value={value}
              onChange={(e) => handleChange(field.id, e.target.value)}
            >
              {field.options?.map((option: string) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
            {showError && (
              <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                {error}
              </Typography>
            )}
          </Box>
        );

      case "checkbox":
        return (
          <FormControlLabel
            key={field.id}
            control={
              <Checkbox
                checked={!!value}
                onChange={(e) => handleChange(field.id, e.target.checked)}
                onBlur={() => handleBlur(field.id)}
              />
            }
            label={
              <Box>
                <Typography variant="body2">
                  {field.label}
                  {field.validation?.required && (
                    <span style={{ color: "red" }}> *</span>
                  )}
                </Typography>
                {showError && (
                  <Typography variant="caption" color="error">
                    {error}
                  </Typography>
                )}
              </Box>
            }
          />
        );

      default:
        return null;
    }
  }

  if (!form.fields.length) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          No fields to preview. Please add some fields in the Create page.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {form.name}
      </Typography>

      <Stack spacing={3}>
        {form.fields.map(renderField)}

        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={Object.keys(errors).length > 0}
          >
            Submit Form
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setValues({});
              setErrors({});
              setTouched(new Set());
            }}
          >
            Reset Form
          </Button>
        </Stack>

        {Object.keys(errors).length > 0 && (
          <Alert severity="error">
            Please fix the validation errors before submitting the form.
          </Alert>
        )}
      </Stack>
    </Paper>
  );
}
