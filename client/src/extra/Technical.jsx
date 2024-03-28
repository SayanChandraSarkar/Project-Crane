import { useSelector,useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { addData } from "../features/dataSlice";

export const Technical = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { modelName, userId } = useParams();

  const kineticEnergy = useSelector((state) => state.data.kineticEnergy);
  const potentialEnergy = useSelector((state) => state.data.potentialEnergy);
  const totalEnergy = useSelector((state) => state.data.totalEnergy);
  const energyPerHour = useSelector((state) => state.data.energyPerHour);
  const Vd = useSelector((state) => state.data.Vd);
  const emassMin = useSelector((state) => state.data.emassMin);
  const mass = useSelector((state) => state.data.mass);
  const velocity = useSelector((state) => state.data.velocity);
  const cycle = useSelector((state) => state.data.cycle);
  const force = useSelector((state) => state.data.force);
  const stroke = useSelector((state) => state.data.stroke);
  const mass2 = useSelector((state) => state.data.mass2);
  const velocity2 = useSelector((state) => state.data.velocity2);
  const power = useSelector((state) => state.data.power);
  const stallFactor = useSelector((state) => state.data.stallFactor);
  const totalPrice = useSelector((state) => state.data.totalPrice);
  const selectedPartsData = useSelector((state) => state.data.spare);
  const shockAbsorber = useSelector((state) => state.data.shockAbsorber);
  const prices = useSelector((state) => state.data.data);
  const currency = useSelector((state) => state.data.currency);
  const addAdditionalPriceData = useSelector(
    (state) => state.data.addAdditionalPriceData
  );
  return (
    <>
      <div className="p-4 md:w-[50%]">
        <div className="h-[10vh] w-[100%] flex justify-between ">
          <div>
            <img className="w-[60%]" src="/images/logo.png" />
          </div>
          <div className="md:w-[20%]">
            <h2 className="text-l font-medium md:ml-[]">Technical Report</h2>
          </div>
        </div>

        <div className="quotation-by-section w-[90%] flex flex-col  gap-[8%] md:flex-row m-auto md:justify-center">
          <div className="md:justify-evenly md:w-[80%]">
            <span className="mb-8 flex justify-between ">
              <p className="mr-2 font-bold">Kinetic Energy:</p>
              <p className="">{kineticEnergy} Nm</p>
            </span>
            <span className="mb-8 flex justify-between">
              <p className="mr-2 font-bold">Potential Energy:</p>
              <p className="">{potentialEnergy} Nm</p>
            </span>

            <span className="mb-8 flex justify-between">
              <p className="mr-2 font-bold">Total Energy:</p>
              <p className="">{totalEnergy} Nm</p>
            </span>

            <span className="mb-8 flex justify-between">
              <p className="mr-2 font-bold">Energy Per Hour:</p>
              <p className="">{energyPerHour} Nm/hr</p>
            </span>
            <span className="mb-8 flex justify-between">
              <p className="mr-2 font-bold">Vd:</p>
              <p className="">{Vd} m/s</p>
            </span>
            <span className="mb-8 flex justify-between">
              <p className="mr-2 font-bold">EmassMin:</p>
              <p className="">{emassMin} kg</p>
            </span>
          </div>
        </div>

        <div className="btn mt-8 flex justify-between">
          <div>
            <button
              onClick={() => {
                window.print();
              }}
              className="submitBtn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-[auto]"
            >
              Get Report
            </button>
          </div>
          <div>
            <button
              onClick={() => {
                dispatch(
                  addData({
                    totalPrice: totalPrice,
                    spare: selectedPartsData,
                    shockAbsorber: shockAbsorber,
                    data: prices,
                    currency: currency,
                    addAdditionalPriceData,
                    kineticEnergy: kineticEnergy,
                    potentialEnergy: potentialEnergy,
                    totalEnergy: totalEnergy,
                    energyPerHour: energyPerHour,
                    Vd: Vd,
                    emassMin: emassMin,
                    mass: mass,
                    velocity: velocity,
                    cycle: cycle,
                    force: force,
                    stroke: stroke,
                    velocity2: velocity2,
                    mass2: mass2,
                    power: power,
                    stallFactor: stallFactor,
                  })
                );
                navigate(
                  `/price/${modelName}/info/${userId}/technical/quotation`
                );
              }}
              className="next bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-[auto]"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
         
          .submitBtn, .next {
            display: none;
          }
        }
      `}</style>
    </>
  );
};
