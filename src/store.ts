import { configureStore } from '@reduxjs/toolkit'
import formsReducer from './features/formsSlice'

export const store = configureStore({
  reducer: { forms: formsReducer }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
