import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addData } from "../features/dataSlice";

const PricePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currency = useSelector((state) => state.data.currency);
  const shockAbsorber = useSelector((state) => state.data.shockAbsorber);

  const [selectedParts, setSelectedParts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const { modelName } = useParams();
  const [prices, setPrices] = useState({});
  // Fetch spare parts data
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        console.log("fetching ", modelName);
        if (!modelName) {
          return;
        }
        const response = await fetch(
          `http://localhost:5000/prices/${modelName}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          // Assuming data is an array of prices
          setPrices(data.price);
          dispatch(
            addData({
              data: data.price,
              currency: currency,
              shockAbsorber: shockAbsorber,
            })
          );
        }
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    };

    fetchPrices();
  }, [modelName]);

  // Calculate total price whenever selectedParts changes
  useEffect(() => {
    let total = prices.NEWPRICE || 0;
    selectedParts.forEach((part) => {
      total += part.price * part.quantity || 0;
    });
    setTotalPrice(total);
  }, [selectedParts, prices]);

  console.log(selectedParts);
  const handlePartSelection = (part) => {
    const existingPartIndex = selectedParts.findIndex(
      (selectedPart) => selectedPart.name === part.name
    );
    if (existingPartIndex !== -1) {
      const updatedSelectedParts = [...selectedParts];
      updatedSelectedParts[existingPartIndex].quantity++;
      setSelectedParts(updatedSelectedParts);
    } else {
      setSelectedParts([
        ...selectedParts,
        { ...part, quantity: 1 }, // Initialize quantity to 1
      ]);
    }
  };

  const handleQuantityChange = (index, quantity) => {
    const updatedSelectedParts = [...selectedParts];
    updatedSelectedParts[index].quantity = quantity;
    setSelectedParts(updatedSelectedParts);
  };

  const filteredParts = Object.keys(prices).filter(
    (part) =>
      part === "Foot Mounting" ||
      part === "Front Flange" ||
      part === "Rear Flange"
  );

  const handleNextButtonClick = () => {
    dispatch(
      addData({
        totalPrice: totalPrice,
        spare: selectedParts,
        shockAbsorber: shockAbsorber,
        data: prices,
        currency: currency,
      })
    );
    // Navigate to the next page
    navigate(`/price/${modelName}/info`);
  };
  return (
    <div className="max-w-screen-lg mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4 ml-2">Choose Spare Parts</h1>
      <div className="mb-20">
        {/* <h2 className="text-xl font-semibold mb-2">Spare Parts</h2> */}
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-4">
          {filteredParts.map((part, index) => (
            <li key={index} className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  // value={part}
                  checked={selectedParts.some(
                    (selectedPart) => selectedPart.name === part
                  )}
                  onChange={() =>
                    handlePartSelection({ name: part, price: prices[part] })
                  }
                  className="form-checkbox h-5 w-5 text-green-600 mr-2"
                />
                <span className="text-gray-800">
                  {part} -{" "}
                  {currency === "INR"
                    ? `₹ ${prices[part]}`
                    : ` $ ${prices[part] / 80}`}
                </span>
              </label>
            </li>
          ))}
        </ul>
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
        <ul className="mb-4">
          {selectedParts.map((part, index) => (
            <li key={index} className="flex items-center justify-between mb-2">
              <span className="text-blue-600 mr-2">{part.name}</span>

              {part.quantity && ( // Check if quantity exists
                <select
                  value={part.quantity}
                  onChange={(e) =>
                    handleQuantityChange(index, parseInt(e.target.value))
                  }
                  className="border border-gray-400 rounded px-2 py-1 ml-2 text-sm"
                >
                  {[...Array(10).keys()].map((num) => (
                    <option key={num} value={num + 1}>
                      {num + 1}
                    </option>
                  ))}
                </select>
              )}

              <span className="text-gray-800">
                {currency === "INR"
                  ? `₹ ${part.price * part.quantity}`
                  : `$ ${(part.price * part.quantity) / 80}`}
              </span>
            </li>
          ))}
        </ul>
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
