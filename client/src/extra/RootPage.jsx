import { useNavigate } from "react-router-dom";

export const RootPage = () => {
  const navigate = useNavigate();
  const handlefirstcrane = () => {
    navigate("/Wagon against 2 shock absorbers");
  };
  const handlesecondcrane = () => {
    navigate("/Wagon against Wagon");
  };
  const handlethirdcrane = () => {
    navigate("/Wagon against Wagon 2 shock absorber");
  };
  const handlefourthcrane = () => {
    navigate("/Wagon against 1 shock absorbers");
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-center items-center p-4 h-[100%] md:h-[84vh] gap-8 md:gap-14">
        <div
          className="flex  items-center flex-col gap-2 cursor-pointer"
          onClick={handlefourthcrane}
        >
          <img
            className="w-full h-40 "
            src="/images/crane4.jpg"
            alt="Wagon against 1 shock absorbers"
          />

          <h2 className="text-sm font-medium">
            Wagon against 1 shock absorbers
          </h2>
        </div>
        <div
          className="flex  items-center flex-col gap-2 cursor-pointer"
          onClick={handlefirstcrane}
        >
          <img
            className="w-full h-40 "
            src="/images/crane1.jpg"
            alt="Wagon against 2 shock absorbers"
          />

          <h2 className="text-sm font-medium">
            Wagon against 2 shock absorbers
          </h2>
        </div>
        <div
          className="flex  items-center flex-col gap-2 mt-2 cursor-pointer"
          onClick={handlesecondcrane}
        >
          <img
            className="w-full h-40 object-cover"
            src="/images/crane2.jpg"
            alt="Wagon against wagon"
          />

          <h2 className="text-sm font-medium">Wagon against wagon</h2>
        </div>
        <div
          className="flex  items-center flex-col gap-2 mt-4 cursor-pointer"
          onClick={handlethirdcrane}
        >
          <img
            className="w-full h-40 object-cover"
            src="/images/crane3.jpg"
            alt="Wagon against wagon 2 shock absorbers"
          />

          <h2 className="text-sm font-medium">
            Wagon against wagon 2 shock absorbers
          </h2>
        </div>
      </div>
    </>
  );
};
