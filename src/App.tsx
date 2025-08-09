import React from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { Button, Stack, Typography } from '@mui/material'
import Create from './pages/Create'
import Preview from './pages/Preview'
import MyForms from './pages/MyForms'

export default function App(){
  const nav = useNavigate()
  return (
    <div>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h5">Dynamic Form Builder</Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={() => nav('/create')}>Create</Button>
          <Button variant="outlined" onClick={() => nav('/preview')}>Preview</Button>
          <Button variant="outlined" onClick={() => nav('/myforms')}>My Forms</Button>
        </Stack>
      </Stack>
      <Routes>
        <Route path="/" element={<Create />} />
        <Route path="/create" element={<Create />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/myforms" element={<MyForms />} />
      </Routes>
    </div>
  )
}
