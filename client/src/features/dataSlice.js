import { createSlice } from '@reduxjs/toolkit'
const initialState = {
    // Define initial state here
    shockAbsorber:2,
    kineticEnergy:null,
    potentialEnergy:null,
    totalEnergy:null,
    energyPerHour:null,
    Vd:null,
    emassMin:null,
    dollar:false

}
const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    // Define action creators here
    addData(state, action) {
      // Add data to state
        state.shockAbsorber = action.payload.shockAbsorber;
        state.kineticEnergy = action.payload.kineticEnergy;
        state.potentialEnergy = action.payload.potentialEnergy;
        state.totalEnergy = action.payload.totalEnergy;
        state.energyPerHour = action.payload.energyPerHour;
        state.Vd = action.payload.Vd;
        state.emassMin = action.payload.emassMin;
        state.dollar = action.payload.dollar;

    }
  },
})
export const { addData } = dataSlice.actions
export default dataSlice.reducer