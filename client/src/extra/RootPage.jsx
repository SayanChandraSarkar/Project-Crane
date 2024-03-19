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
      <div className="flex flex-col md:flex-row justify-center items-center p-4 ">
        <div
          className="flex  items-center flex-col gap-8 "
          onClick={handlefirstcrane}
        >
          <img className="w-[50%] " src="/images/crane1.jpg" alt="crane1" />

          <h2 className="text-xl font-medium">crane1</h2>
        </div>
        <div
          className="flex  items-center flex-col gap-8 mt-2"
          onClick={handlesecondcrane}
        >
          <img className="w-[50%]" src="/images/crane2.jpg" alt="crane2" />

          <h2 className="text-xl font-medium">crane2</h2>
        </div>
        <div
          className="flex  items-center flex-col gap-8 mt-4"
          onClick={handlethirdcrane}
        >
          <img className="w-[50%]" src="/images/crane3.png" alt="crane3" />

          <h2 className="text-xl font-medium">crane3</h2>
        </div>
      </div>
    </>
  );
};
