import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FormSchema } from '../types'

const LS_KEY = 'upliance_forms_v1'

const initialState: { current: FormSchema | null, saved: FormSchema[] } = {
  current: {
    id: 'current',
    name: 'Untitled',
    createdAt: new Date().toISOString(),
    fields: []
  },
  saved: JSON.parse(localStorage.getItem(LS_KEY) || '[]')
}

const slice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    setCurrent(state, action: PayloadAction<FormSchema>) { state.current = action.payload },
    updateCurrent(state, action: PayloadAction<Partial<FormSchema>>) {
      if (!state.current) return
      state.current = { ...state.current, ...action.payload }
    },
    saveForm(state, action: PayloadAction<{ name: string }>) {
      if (!state.current) return
      const form = { ...state.current, name: action.payload.name, id: `form_${Date.now()}`, createdAt: new Date().toISOString() }
      state.saved.push(form)
      localStorage.setItem(LS_KEY, JSON.stringify(state.saved))
      // reset current
      state.current = { id: 'current', name: 'Untitled', createdAt: new Date().toISOString(), fields: [] }
    },
    loadFormToCurrent(state, action: PayloadAction<string>) {
      const f = state.saved.find(s => s.id === action.payload)
      if (f) state.current = { ...f, id: 'current' }
    },
    deleteForm(state, action: PayloadAction<string>) {
      state.saved = state.saved.filter(s => s.id !== action.payload)
      localStorage.setItem(LS_KEY, JSON.stringify(state.saved))
    },
    setSaved(state, action: PayloadAction<FormSchema[]>) {
      state.saved = action.payload
      localStorage.setItem(LS_KEY, JSON.stringify(state.saved))
    },
    replaceCurrentFields(state, action: PayloadAction<any[]>) {
      if (!state.current) return
      state.current.fields = action.payload
    }
  }
})

export const { setCurrent, updateCurrent, saveForm, loadFormToCurrent, deleteForm, setSaved, replaceCurrentFields } = slice.actions
export default slice.reducer
