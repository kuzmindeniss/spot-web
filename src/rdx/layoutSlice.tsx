import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IlayoutState {
    showAside: boolean;
    scrollMain: number;
}

const initialState: IlayoutState = {
    showAside: false,
    scrollMain: 0,
}

export const layoutSlice = createSlice({
    name: 'layout',
    initialState,
    reducers: {
        toggleShowAside: (state) => {
            state.showAside = !state.showAside;
            return state;
        },
        setScrollMain: (state, action: PayloadAction<number>) => {
            state.scrollMain = action.payload;
            return state;
        }
    }
});

export const {toggleShowAside, setScrollMain } = layoutSlice.actions;
export default layoutSlice.reducer;