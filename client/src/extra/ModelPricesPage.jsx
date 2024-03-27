import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addData } from "../features/dataSlice";

const PricePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currency = useSelector((state) => state.data.currency);
  const shockAbsorber = useSelector((state) => state.data.shockAbsorber);
  const kineticEnergy = useSelector((state) => state.data.kineticEnergy);
  const potentialEnergy = useSelector((state) => state.data.potentialEnergy);
  const totalEnergy = useSelector((state) => state.data.totalEnergy);
  const energyPerHour = useSelector((state) => state.data.energyPerHour);
  const Vd = useSelector((state) => state.data.Vd);
  const emassMin = useSelector((state) => state.data.emassMin);

  const [totalPrice, setTotalPrice] = useState(0);
  const { modelName } = useParams();
  const [prices, setPrices] = useState({});
  // const [quantityDisplay, setQuantityDisplay] = useState({});
  const [selectedSparePart, setSelectedSparePart] = useState(null);
  const [selectedAccessories, setSelectedAccessories] = useState([]);

  const modeldata = modelName.slice(0, 2);

  // Fetch spare parts data
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        if (!modelName) {
          return;
        }
        const response = await fetch(
          `https://calculation.cranebuffer.com/prices/${modelName}`,
          { method: "GET" }
        );
        if (response.ok) {
          const data = await response.json();
          // Assuming data is an array of prices
          setPrices(data.price);
          dispatch(
            addData({
              data: data.price,
              currency: currency,
              shockAbsorber: shockAbsorber,
              kineticEnergy: kineticEnergy,
              potentialEnergy: potentialEnergy,
              totalEnergy: totalEnergy,
              energyPerHour: energyPerHour,
              Vd: Vd,
              emassMin: emassMin,
            })
          );
        }
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    };

    fetchPrices();
  }, [modelName]);

  // useEffect(() => {
  //   const initialQuantityDisplay = Object.keys(prices).reduce((acc, part) => {
  //     acc[part] = 0;
  //     return acc;
  //   }, {});

  //   // Initialize quantities for parts in edassoc to 0
  //   edassoc.forEach((part) => {
  //     if (!(part in initialQuantityDisplay)) {
  //       initialQuantityDisplay[part] = 0;
  //     }
  //   });
  //   setQuantityDisplay(initialQuantityDisplay);
  // }, [prices]);

  // useEffect(() => {
  //   let total = prices.NEWPRICE || 0;
  //   Object.keys(quantityDisplay).forEach((part) => {
  //     total += prices[part] * quantityDisplay[part] || 0;
  //   });
  //   setTotalPrice(total);
  // }, [quantityDisplay, prices]);

  // const handleQuantityChange = (part, newQuantity) => {
  //   setQuantityDisplay((prevQuantityDisplay) => ({
  //     ...prevQuantityDisplay,
  //     [part]: newQuantity,
  //   }));
  // };

  const handleRadioChange = (part) => {
    setSelectedSparePart(part);
    setTotalPrice(prices.NEWPRICE || 0);
    setTotalPrice((prevTotalPrice) => prevTotalPrice + (prices[part] || 0));
  };

  const imagesection = {
    "Foot Mounting": "/images/mount (1).jpg",
    "Front Flange": "/images/front.jpg",
    "Rear Flange": "/images/rear.jpg",
  };

  const filteredParts = Object.keys(prices).filter(
    (part) =>
      part === "Foot Mounting" ||
      part === "Front Flange" ||
      part === "Rear Flange"
  );

  // const filteredParts = Object.keys(prices).filter(
  //   (part) =>
  //     part &&
  //     ((part === "Foot Mounting" &&
  //       quantityDisplay["Front Flange"] === 0 &&
  //       quantityDisplay["Rear Flange"] === 0) ||
  //       (part === "Front Flange" &&
  //         quantityDisplay["Foot Mounting"] === 0 &&
  //         quantityDisplay["Rear Flange"] === 0) ||
  //       (part === "Rear Flange" &&
  //         quantityDisplay["Foot Mounting"] === 0 &&
  //         quantityDisplay["Front Flange"] === 0))
  // );

  const edassoc = ["Bellows", "Piston Rod Sensor", "Ureathane Cap"];

  const handleAccessoryChange = (part, isChecked) => {
    setSelectedAccessories((prevSelectedAccessories) => {
      if (isChecked) {
        return [...prevSelectedAccessories, part];
      } else {
        return prevSelectedAccessories.filter(
          (selectedPart) => selectedPart !== part
        );
      }
    });
  };

  const handleNextButtonClick = () => {
    const selectedPartsData = selectedSparePart
      ? [
          {
            name: selectedSparePart,
            price: prices[selectedSparePart],
          },
        ]
      : [];

    const additionalPriceData = selectedAccessories.map((part) => ({
      name: part,
    }));

    dispatch(
      addData({
        totalPrice: totalPrice,
        spare: selectedPartsData,
        shockAbsorber: shockAbsorber,
        data: prices,
        currency: currency,
        addAdditionalPriceData: additionalPriceData,
        kineticEnergy: kineticEnergy,
        potentialEnergy: potentialEnergy,
        totalEnergy: totalEnergy,
        energyPerHour: energyPerHour,
        Vd: Vd,
        emassMin: emassMin,
      })
    );
    // Navigate to the next page
    navigate(`/price/${modelName}/info`);
  };
  return (
    <div className="max-w-screen-lg mx-auto px-4 py-2">
      <h1 className="text-2xl font-bold mb-4 ml-2">Choose Spare Parts</h1>
      <div className="mb-20">
        {/* <h2 className="text-xl font-semibold mb-2">Spare Parts</h2> */}
        <ul className="grid grid-cols-1 md:grid-cols-1 gap-y-6 gap-x-4 ">
          {filteredParts.map((part, index) => (
            <li key={index} className="flex items-center justify-between ">
              <img className="w-[10%]" src={imagesection[part]} alt={part} />
              <div className="mr-2 w-[30%]">{part}</div>
              <input
                type="radio"
                name="spareParts"
                onClick={() => handleRadioChange(part)}
                className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-gray-800">
                {currency === "INR"
                  ? `₹ ${prices[part]}`
                  : `$ ${prices[part] / 80}`}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h1 className="text-2xl font-bold mb-4 ml-2">Choose Accessories</h1>
        {(() => {
          if (modeldata === "ED") {
            return (
              <>
                {edassoc.map((part, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between mb-4 ml-2 "
                  >
                    <div className="mr-2 w-[50%]">{part}</div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        onChange={() =>
                          handleAccessoryChange(
                            part,
                            !selectedAccessories.includes(part)
                          )
                        }
                        checked={selectedAccessories.includes(part)}
                        className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                    </div>
                  </li>
                ))}
              </>
            );
          } else if (modeldata === "EI") {
            return (
              <li className="flex items-center justify-between mb-4 ml-2 ">
                <div className="mr-2 w-[50%]">Bellows</div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    onChange={() => {
                      // Toggle the selection of the accessory
                      if (selectedAccessories.includes("Bellows")) {
                        setSelectedAccessories(
                          selectedAccessories.filter(
                            (item) => item !== "Bellows"
                          )
                        );
                      } else {
                        setSelectedAccessories([
                          ...selectedAccessories,
                          "Bellows",
                        ]);
                      }
                    }}
                    checked={selectedAccessories.includes("Bellows")}
                    className="mr-2"
                  />
                </div>
              </li>
            );
          } else {
            return (
              <>
                <input className="mb-4" placeholder="customer request only" />
              </>
            );
          }
        })()}
      </div>

      <div className="border border-gray-200 p-4 ">
        <div className="originalPrice flex items-center justify-between mb-4">
          <div className="font-semibold">Original Price</div>
          <div className="text-green-600 font-semibold">
            {currency === "INR"
              ? `₹ ${prices.NEWPRICE}`
              : `$ ${prices.NEWPRICE / 80}`}
          </div>
        </div>

        {selectedSparePart && (
          <li className="flex items-center justify-between mb-2 ">
            <span className="text-blue-600 mr-2">{selectedSparePart}</span>
            <span className="text-gray-800">
              {currency === "INR"
                ? `₹ ${prices[selectedSparePart]}`
                : `$ ${prices[selectedSparePart] / 80}`}
            </span>
          </li>
        )}

        {selectedAccessories.map((part, index) => (
          <li key={index} className="flex items-center justify-between mb-2 ">
            <span className="text-blue-600 mr-2">{part}</span>
            <span className="text-gray-800">
              {prices[part] !== undefined
                ? currency === "INR"
                  ? `₹ ${prices[part]}`
                  : `$ ${prices[part] / 80}`
                : "N/A"}
            </span>
          </li>
        ))}

        <hr />
        <div className=" flex items-center justify-between mt-4">
          <span className="font-semibold  mr-2">Total Price:</span>
          <span className="text-green-600 font-semibold">
            {currency === "INR" ? `₹ ${totalPrice}` : `$ ${totalPrice / 80}`}
          </span>
        </div>
      </div>

      <div className="flex justify-center mt-10">
        <button
          onClick={handleNextButtonClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded"
        >
          Proceed to Next
        </button>
      </div>
    </div>
  );
};
export default PricePage;
