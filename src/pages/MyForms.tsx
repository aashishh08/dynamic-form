import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import {
  List,
  ListItem,
  Paper,
  Stack,
  Button,
  Typography,
  Box,
  Chip,
  IconButton,
  Alert,
} from "@mui/material";
import { deleteForm, loadFormToCurrent } from "../features/formsSlice";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import dayjs from "dayjs";

export default function MyForms() {
  const saved = useSelector((s: RootState) => s.forms.saved);
  const dispatch = useDispatch();
  const nav = useNavigate();

  function handleOpenForm(formId: string) {
    dispatch(loadFormToCurrent(formId));
    nav("/preview");
  }

  function handleDeleteForm(formId: string, formName: string) {
    if (
      window.confirm(
        `Are you sure you want to delete "${formName}"? This action cannot be undone.`
      )
    ) {
      dispatch(deleteForm(formId));
    }
  }

  if (saved.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          No saved forms yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Create your first form by going to the Create page and adding some
          fields.
        </Typography>
        <Button variant="contained" onClick={() => nav("/create")}>
          Create New Form
        </Button>
      </Paper>
    );
  }

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h5">My Forms ({saved.length})</Typography>
        <Button variant="contained" onClick={() => nav("/create")}>
          Create New Form
        </Button>
      </Stack>

      <List>
        {saved.map((form) => (
          <ListItem key={form.id} sx={{ mb: 2, p: 0 }}>
            <Paper sx={{ p: 3, width: "100%" }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {form.name}
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    <Chip
                      label={`${form.fields.length} field${
                        form.fields.length !== 1 ? "s" : ""
                      }`}
                      size="small"
                      variant="outlined"
                    />
                    {form.fields.some((f) => f.derived) && (
                      <Chip
                        label="Has derived fields"
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    )}
                    {form.fields.some((f) => f.validation?.required) && (
                      <Chip
                        label="Has required fields"
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    )}
                  </Stack>

                  <Typography variant="body2" color="text.secondary">
                    Created:{" "}
                    {dayjs(form.createdAt).format("MMMM D, YYYY [at] h:mm A")}
                  </Typography>

                  {form.fields.length > 0 && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Field types:{" "}
                      {Array.from(new Set(form.fields.map((f) => f.type))).join(
                        ", "
                      )}
                    </Typography>
                  )}
                </Box>

                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleOpenForm(form.id)}
                  >
                    Preview
                  </Button>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteForm(form.id, form.name)}
                    title="Delete form"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Stack>
            </Paper>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
