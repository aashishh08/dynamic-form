import React, { useState } from "react";
import { Field } from "../types";
import {
  List,
  ListItem,
  Paper,
  IconButton,
  Stack,
  Typography,
  Collapse,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import FieldEditor from "./FieldEditor";

export default function FieldList({
  fields,
  onChange,
}: {
  fields: Field[];
  onChange: (f: Field[]) => void;
}) {
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set());

  function updateField(idx: number, patch: Partial<Field>) {
    const copy = [...fields];
    copy[idx] = { ...copy[idx], ...patch };
    onChange(copy);
  }

  function deleteField(idx: number) {
    const copy = [...fields];
    copy.splice(idx, 1);
    onChange(copy);
  }

  function moveField(fromIdx: number, toIdx: number) {
    if (toIdx < 0 || toIdx >= fields.length) return;
    const copy = [...fields];
    const [movedField] = copy.splice(fromIdx, 1);
    copy.splice(toIdx, 0, movedField);
    onChange(copy);
  }

  function toggleFieldExpansion(fieldId: string) {
    const newExpanded = new Set(expandedFields);
    if (newExpanded.has(fieldId)) {
      newExpanded.delete(fieldId);
    } else {
      newExpanded.add(fieldId);
    }
    setExpandedFields(newExpanded);
  }

  if (fields.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary">
          No fields added yet. Click "Add Field" to get started.
        </Typography>
      </Paper>
    );
  }

  return (
    <List>
      {fields.map((field, i) => (
        <ListItem key={field.id} sx={{ mb: 2, p: 0 }}>
          <Paper sx={{ p: 2, width: "100%" }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <IconButton
                  size="small"
                  disabled={i === 0}
                  onClick={() => moveField(i, i - 1)}
                  title="Move up"
                >
                  <DragIndicatorIcon sx={{ transform: "rotate(-90deg)" }} />
                </IconButton>
                <IconButton
                  size="small"
                  disabled={i === fields.length - 1}
                  onClick={() => moveField(i, i + 1)}
                  title="Move down"
                >
                  <DragIndicatorIcon sx={{ transform: "rotate(90deg)" }} />
                </IconButton>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1}>
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {field.label || `${field.type} field`}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {field.type}
                    {field.derived && " • Derived"}
                    {field.validation?.required && " • Required"}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1}>
                <IconButton
                  size="small"
                  onClick={() => toggleFieldExpansion(field.id)}
                >
                  {expandedFields.has(field.id) ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => deleteField(i)}
                  color="error"
                  title="Delete field"
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </Stack>

            <Collapse in={expandedFields.has(field.id)}>
              <FieldEditor field={field} onChange={(p) => updateField(i, p)} />
            </Collapse>
          </Paper>
        </ListItem>
      ))}
    </List>
  );
}
