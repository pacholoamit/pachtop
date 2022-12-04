import { createSlice } from '@reduxjs/toolkit'
import { Command, Process } from '@/lib/types'
import { invoke } from '@/lib'

interface ProcessesState {
    value: Process[]
}
const initialState = { value: [] } as ProcessesState

export const processesSlice = createSlice({
    name: 'processes',
    initialState,
    reducers: {
        update: (state: ProcessesState, action) => {
            state.value = action.payload
        }
    }
})



export const { update } = processesSlice.actions