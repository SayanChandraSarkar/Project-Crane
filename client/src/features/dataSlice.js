import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  // Define initial state here
  shockAbsorber: 2,
  kineticEnergy: null,
  potentialEnergy: null,
  totalEnergy: null,
  energyPerHour: null,
  Vd: null,
  emassMin: null,
  currency: "INR",
  data: [],
  spare: [],
  totalPrice: null,
  addAdditionalPriceData: [],
  mass: null,
  velocity: null,
  cycle: null,
  force: null,
  stroke: null,
};
const dataSlice = createSlice({
  name: "data",
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
      state.currency = action.payload.currency;
      state.data = action.payload.data;
      state.spare = action.payload.spare;
      state.totalPrice = action.payload.totalPrice;
      state.addAdditionalPriceData = action.payload.addAdditionalPriceData;
      state.mass = action.payload.mass;
      state.velocity = action.payload.velocity;
      state.cycle = action.payload.cycle;
      state.force = action.payload.force;
      state.stroke = action.payload.stroke;
    },
  },
});
export const { addData } = dataSlice.actions;
export default dataSlice.reducer;
