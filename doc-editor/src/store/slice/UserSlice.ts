import { createSlice } from "@reduxjs/toolkit";

const initialState: {
    docMemebers: [{
        email: string,
        avator: string
    }]
} = {
    docMemebers: [{
        email: '',
        avator: '',
    }]
}
const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        addLiveDocMemebers: (state, action) => {
            state.docMemebers.push(action.payload)
        },
    }

})
export const { addLiveDocMemebers } = UserSlice.actions
export default UserSlice