import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export const Technical = () => {
  const navigate = useNavigate();
  const { modelName, userId } = useParams();

  const kineticEnergy = useSelector((state) => state.data.kineticEnergy);
  const potentialEnergy = useSelector((state) => state.data.potentialEnergy);
  const totalEnergy = useSelector((state) => state.data.totalEnergy);
  const energyPerHour = useSelector((state) => state.data.energyPerHour);
  const Vd = useSelector((state) => state.data.Vd);
  const emassMin = useSelector((state) => state.data.emassMin);
  return (
    <>
      <div className="p-4">
        <div className="h-[10vh] w-[100%] flex justify-between ">
          <div>
            <img className="w-[60%]" src="/images/logo.png" />
          </div>
          <div>
            <h2 className="text-l font-medium">Technical Report</h2>
          </div>
        </div>

        <div className="quotation-by-section w-[90%] flex flex-col  gap-[8%] md:flex-row m-auto">
          <div className="">
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
