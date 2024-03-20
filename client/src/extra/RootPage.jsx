import { useNavigate } from "react-router-dom";

export const RootPage = () => {
  const navigate = useNavigate();
  const handlefirstcrane = () => {
    navigate("/crane-1");
  };
  const handlesecondcrane = () => {
    navigate("/crane-2");
  };
  const handlethirdcrane = () => {
    navigate("/crane-3");
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-center items-center p-4 h-[100%] md:h-[84vh] gap-8 md:gap-14">
        <div
          className="flex  items-center flex-col gap-2 "
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
          className="flex  items-center flex-col gap-2 mt-2"
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
          className="flex  items-center flex-col gap-2 mt-4"
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
