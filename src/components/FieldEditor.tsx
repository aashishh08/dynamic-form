import React, { useState, useEffect } from "react";
import { Field, FieldType } from "../types";
import {
  TextField,
  Stack,
  FormControlLabel,
  Switch,
  Button,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  Snackbar,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

export default function FieldEditor({
  field,
  onChange,
}: {
  field: Field;
  onChange: (p: Partial<Field>) => void;
}) {
  const [local, setLocal] = useState(field);
  const [showSuccess, setShowSuccess] = useState(false);
  useEffect(() => setLocal(field), [field]);

  function save() {
    onChange(local);
    setShowSuccess(true);
    // Auto-hide success message after 2 seconds
    setTimeout(() => setShowSuccess(false), 2000);
  }

  const isSelectType =
    local.type === "select" ||
    local.type === "radio" ||
    local.type === "checkbox";
  const isNumberType = local.type === "number";

  return (
    <Stack spacing={2} sx={{ mt: 2 }}>
      <Typography variant="h6">Field Configuration</Typography>

      <TextField
        label="Label"
        value={local.label}
        onChange={(e) => setLocal({ ...local, label: e.target.value })}
        size="small"
        fullWidth
      />

      <TextField
        label="Placeholder"
        value={local.placeholder || ""}
        onChange={(e) => setLocal({ ...local, placeholder: e.target.value })}
        size="small"
        fullWidth
      />

      <TextField
        label="Default value"
        value={local.defaultValue || ""}
        onChange={(e) => setLocal({ ...local, defaultValue: e.target.value })}
        size="small"
        fullWidth
      />

      {isSelectType && (
        <TextField
          label="Options (comma separated)"
          value={(local.options || []).join(", ")}
          onChange={(e) =>
            setLocal({
              ...local,
              options: e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s),
            })
          }
          size="small"
          fullWidth
          helperText="Enter options separated by commas"
        />
      )}

      <Divider />
      <Typography variant="subtitle1">Validation Rules</Typography>

      <Stack direction="row" spacing={2} alignItems="center">
        <FormControlLabel
          control={
            <Switch
              checked={local.validation?.required || false}
              onChange={(e) =>
                setLocal({
                  ...local,
                  validation: {
                    ...local.validation,
                    required: e.target.checked,
                  },
                })
              }
            />
          }
          label="Required"
        />
      </Stack>

      {local.type === "text" || local.type === "textarea" ? (
        <Stack direction="row" spacing={2}>
          <TextField
            label="Min Length"
            type="number"
            value={local.validation?.minLength || ""}
            onChange={(e) =>
              setLocal({
                ...local,
                validation: {
                  ...local.validation,
                  minLength: e.target.value
                    ? parseInt(e.target.value)
                    : undefined,
                },
              })
            }
            size="small"
            sx={{ width: 120 }}
          />
          <TextField
            label="Max Length"
            type="number"
            value={local.validation?.maxLength || ""}
            onChange={(e) =>
              setLocal({
                ...local,
                validation: {
                  ...local.validation,
                  maxLength: e.target.value
                    ? parseInt(e.target.value)
                    : undefined,
                },
              })
            }
            size="small"
            sx={{ width: 120 }}
          />
        </Stack>
      ) : null}

      {local.type === "number" && (
        <Stack direction="row" spacing={2}>
          <TextField
            label="Min Value"
            type="number"
            value={local.validation?.min || ""}
            onChange={(e) =>
              setLocal({
                ...local,
                validation: {
                  ...local.validation,
                  min: e.target.value ? parseFloat(e.target.value) : undefined,
                },
              })
            }
            size="small"
            sx={{ width: 120 }}
          />
          <TextField
            label="Max Value"
            type="number"
            value={local.validation?.max || ""}
            onChange={(e) =>
              setLocal({
                ...local,
                validation: {
                  ...local.validation,
                  max: e.target.value ? parseFloat(e.target.value) : undefined,
                },
              })
            }
            size="small"
            sx={{ width: 120 }}
          />
        </Stack>
      )}

      {local.type === "text" && (
        <Stack direction="row" spacing={2}>
          <FormControlLabel
            control={
              <Switch
                checked={local.validation?.email || false}
                onChange={(e) =>
                  setLocal({
                    ...local,
                    validation: {
                      ...local.validation,
                      email: e.target.checked,
                    },
                  })
                }
              />
            }
            label="Email format"
          />
          <FormControlLabel
            control={
              <Switch
                checked={local.validation?.passwordRule || false}
                onChange={(e) =>
                  setLocal({
                    ...local,
                    validation: {
                      ...local.validation,
                      passwordRule: e.target.checked,
                    },
                  })
                }
              />
            }
            label="Password rule (min 8 chars, must contain number)"
          />
        </Stack>
      )}

      <Divider />
      <Typography variant="subtitle1">Derived Field</Typography>

      <FormControlLabel
        control={
          <Switch
            checked={local.derived || false}
            onChange={(e) => setLocal({ ...local, derived: e.target.checked })}
          />
        }
        label="Derived Field"
      />

      {local.derived && (
        <Stack spacing={2}>
          <TextField
            label="Parent Fields (comma separated field labels)"
            value={(local.parents || []).join(", ")}
            onChange={(e) =>
              setLocal({
                ...local,
                parents: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter((s) => s),
              })
            }
            size="small"
            fullWidth
            helperText="Enter the labels of parent fields separated by commas"
          />
          <TextField
            label="Formula (JavaScript expression)"
            value={local.formula || ""}
            onChange={(e) => setLocal({ ...local, formula: e.target.value })}
            size="small"
            fullWidth
            multiline
            rows={3}
            helperText="Use parent field labels as variables. Example: age = 2024 - birthYear"
          />
        </Stack>
      )}

      <Stack direction="row" spacing={1}>
        <Button
          size="small"
          variant="contained"
          onClick={save}
          startIcon={showSuccess ? <CheckIcon /> : null}
          color={showSuccess ? "success" : "primary"}
        >
          {showSuccess ? "Field Saved!" : "Save Changes"}
        </Button>
      </Stack>

      {showSuccess && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Field "{local.label}" has been saved successfully!
        </Alert>
      )}
    </Stack>
  );
}
