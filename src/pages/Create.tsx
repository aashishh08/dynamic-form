import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { v4 as uuid } from "uuid";
import { Field, FieldType } from "../types";
import {
  updateCurrent,
  replaceCurrentFields,
  saveForm,
} from "../features/formsSlice";
import {
  Box,
  Button,
  TextField,
  Stack,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Paper,
  Alert,
  Chip,
} from "@mui/material";
import FieldEditor from "../components/FieldEditor";
import FieldList from "../components/FieldList";

const fieldTypes: { value: FieldType; label: string; description: string }[] = [
  { value: "text", label: "Text Input", description: "Single line text input" },
  {
    value: "number",
    label: "Number Input",
    description: "Numeric input with validation",
  },
  {
    value: "textarea",
    label: "Text Area",
    description: "Multi-line text input",
  },
  {
    value: "select",
    label: "Dropdown Select",
    description: "Select from predefined options",
  },
  {
    value: "radio",
    label: "Radio Buttons",
    description: "Single choice from options",
  },
  {
    value: "checkbox",
    label: "Checkbox",
    description: "Boolean true/false input",
  },
  { value: "date", label: "Date Picker", description: "Date selection input" },
];

export default function Create() {
  const current = useSelector((s: RootState) => s.forms.current)!;
  const dispatch = useDispatch();
  const [adding, setAdding] = useState(false);
  const [type, setType] = useState<FieldType>("text");
  const [saveDialog, setSaveDialog] = useState(false);
  const [saveError, setSaveError] = useState("");

  function addField(t: FieldType) {
    const newField: Field = {
      id: uuid(),
      type: t,
      label: `${t.charAt(0).toUpperCase() + t.slice(1)} Field`,
      defaultValue: "",
      options: ["select", "radio", "checkbox"].includes(t)
        ? ["Option 1", "Option 2"]
        : undefined,
      validation: {},
      placeholder: `Enter ${t}...`,
    };
    dispatch(replaceCurrentFields([...(current.fields || []), newField]));
    setAdding(false);
  }

  function onFieldsUpdate(fields: Field[]) {
    dispatch(replaceCurrentFields(fields));
  }

  function handleSave() {
    if (!current.name.trim()) {
      setSaveError("Please enter a form name in the form name field above");
      return;
    }
    if (current.fields.length === 0) {
      setSaveError("Please add at least one field to the form");
      return;
    }

    dispatch(saveForm({ name: current.name.trim() }));
    setSaveDialog(false);
    setSaveError("");
  }

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <TextField
            label="Form Name"
            value={current.name}
            onChange={(e) => dispatch(updateCurrent({ name: e.target.value }))}
            sx={{ flexGrow: 1 }}
            placeholder="Enter form name..."
          />
          <Button
            variant="contained"
            onClick={() => setAdding(true)}
            disabled={!current.name.trim()}
          >
            Add Field
          </Button>
          <Button
            variant="outlined"
            onClick={() => setSaveDialog(true)}
            disabled={current.fields.length === 0}
          >
            Save Form
          </Button>
        </Stack>

        {current.fields.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Fields:
            </Typography>
            <Chip
              label={`${current.fields.length} field${
                current.fields.length !== 1 ? "s" : ""
              }`}
              size="small"
            />
            {current.fields.some((f) => f.derived) && (
              <Chip label="Has derived fields" size="small" color="primary" />
            )}
          </Stack>
        )}
      </Paper>

      <FieldList fields={current.fields} onChange={onFieldsUpdate} />

      {/* Add Field Dialog */}
      <Dialog
        open={adding}
        onClose={() => setAdding(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Field</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select the type of field you want to add:
          </Typography>
          <TextField
            select
            value={type}
            onChange={(e) => setType(e.target.value as FieldType)}
            label="Field Type"
            fullWidth
            sx={{ mb: 2 }}
          >
            {fieldTypes.map((ft) => (
              <MenuItem key={ft.value} value={ft.value}>
                <Box>
                  <Typography variant="body1">{ft.label}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {ft.description}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAdding(false)}>Cancel</Button>
          <Button onClick={() => addField(type)} variant="contained">
            Add Field
          </Button>
        </DialogActions>
      </Dialog>

      {/* Save Form Dialog */}
      <Dialog
        open={saveDialog}
        onClose={() => setSaveDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Save Form</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to save this form?
          </Typography>

          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Form Name: <strong>{current.name}</strong>
            </Typography>
            <Typography variant="body2">
              This form has {current.fields.length} field
              {current.fields.length !== 1 ? "s" : ""} and will be saved to
              localStorage.
            </Typography>
          </Alert>

          {saveError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {saveError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSaveDialog(false);
              setSaveError("");
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained">
            Save Form
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
