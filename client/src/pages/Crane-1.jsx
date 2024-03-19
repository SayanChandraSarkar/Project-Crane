import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addData } from "../features/dataSlice";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
// import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
// import { styled } from "@mui/system";
import PropTypes from "prop-types";

import "../scss/Crane-1.scss";

const option1 = [
  "0.015",
  "0.020",
  "0.025",
  "0.030",
  "0.035",
  "0.050",
  "0.070",
  "0.075",
  "0.100",
  "0.125",
  "0.127",
  "0.150",
  "0.165",
  "0.200",
];
const option2 = ["1", "2", "3", "4"];

const Type = ["ED", "EI", "SB"];
const Currency = ["USD", "INR"];
// const blue = {
//   100: "#DAECFF",
//   200: "#b6daff",
//   400: "#3399FF",
//   500: "#007FFF",
//   600: "#0072E5",
//   900: "#003A75",
// };

// const grey = {
//   50: "#F3F6F9",
//   100: "#E5EAF2",
//   200: "#DAE2ED",
//   300: "#C7D0DD",
//   400: "#B0B8C4",
//   500: "#9DA8B7",
//   600: "#6B7A90",
//   700: "#434D5B",
//   800: "#303740",
//   900: "#1C2025",
// };
import { useNavigate } from "react-router-dom";
export const CraneFirst = () => {
  const navigate = useNavigate();

  const [mValue, setMValue] = useState("");
  const [vValue, setVValue] = useState("");
  const [cValue, setCValue] = useState("");
  const [fValue, setFValue] = useState("");
  const [sValue, setSValue] = useState("");
  // const [model, setModel] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [top5ModelNames, setTop5ModelNames] = useState([]);
  const [showModelOutput, setShowModelOutput] = useState(false);
  const [shockAbsorber, setShockAbsorber] = useState("2");
  const [modelPrices, setModelPrices] = useState({});
  const [selectedCurrency, setSelectedCurrency] = useState("INR");
  // console.log(modelPrices);
  // console.log(modelPrices);
  const [calculatedResults, setCalculatedResults] = useState({
    kineticEnergy: "",
    potentialEnergy: "",
    totalEnergy: "",
    energyPerHour: "",
    emassMin: "",
  });
  const dispatch = useDispatch();

  const [content, setContent] = useState("Initial Content");

  //Dynamic heading
  const DynamicHeading = ({
    className,
    initialContent,
    content,
    setContent,
  }) => {
    const [dynamicContent, setDynamicContent] = useState(initialContent);

    useEffect(() => {
      setDynamicContent(content);
    }, [content]);

    useEffect(() => {
      setContent(dynamicContent);
    }, [dynamicContent, setContent]);
    return <h2 className={className}>{dynamicContent}</h2>;
  };

  DynamicHeading.propTypes = {
    className: PropTypes.string,
    initialContent: PropTypes.string.isRequired,
    content: PropTypes.string,
    setContent: PropTypes.func.isRequired,
  };

  // Event handlers for form controls
  const handleMChange = (event) => {
    setMValue(event.target.value);
  };

  const handleVChange = (event) => {
    setVValue(event.target.value);
  };

  const handleCChange = (event) => {
    setCValue(event.target.value);
  };

  const handleFChange = (event) => {
    setFValue(event.target.value);
  };

  const handleSChange = (event, value) => {
    setSValue(value);
  };

  //Type
  const handleTypeChange = (event, value) => {
    setSelectedType(value);
  };
  const handleAbsorberChange = (event, value) => {
    setShockAbsorber(value);
  };

  //Handle Calculated Data

  const handleCalculate = () => {
    const kineticEnergy = mValue * vValue ** 2 * 0.25; //0.5 * (emassMin * 1000) * v**2
    const potentialEnergy = fValue * sValue;
    const totalEnergy = kineticEnergy + potentialEnergy;
    const energyPerHour = totalEnergy * cValue;
    const Vd = vValue * 0.5;
    const emassMin = (2 * totalEnergy) / Vd ** 2;

    // Update state with calculated results
    setCalculatedResults({
      kineticEnergy,
      potentialEnergy,
      totalEnergy,
      energyPerHour,
      Vd,
      emassMin,
    });

    fetchPricesForModels(top5ModelNames);
    setShowModelOutput(true);
  };

  //Fetching Data
  const getData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/data/data", {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();

        // Filter the data based on the conditions
        const filteredData = data.filter((item) => {
          return (
            item.nmperstroke > calculatedResults.totalEnergy &&
            item.nmperhr > calculatedResults.energyPerHour &&
            item["MODEL TYPE"] === selectedType
          );
        });

        // console.log(filteredData);
        // Extract the "Model" property from each object in the array
        const modelNames = filteredData.map((item) => item.Model);
        console.log(modelNames);
        const top5ModelNames = modelNames.slice(0, 5);
        console.log(top5ModelNames);

        setTop5ModelNames(top5ModelNames);
        fetchPricesForModels(top5ModelNames);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (showModelOutput) {
      getData();
      // fetchPricesForModels(top5ModelNames);
    }
  }, [showModelOutput]);

  const fetchPricesForModels = async (models) => {
    try {
      console.log(models);
      // Fetch prices for each model
      const pricePromises = models.map(async (model) => {
        const response = await fetch(`http://localhost:5000/prices/${model}`);
        if (response.ok) {
          const data = await response.json();
          return { [model]: data.price };
        }
      });

      // Wait for all price fetch requests to complete
      const prices = await Promise.all(pricePromises);
      const priceMap = Object.assign({}, ...prices);
      setModelPrices(priceMap);
    } catch (error) {
      console.error("Error fetching prices:", error);
    }
  };
  const handleModelClick = (model) => {
    dispatch(
      addData({
        currency: selectedCurrency,
        shockAbsorber: shockAbsorber,
        kineticEnergy: calculatedResults.kineticEnergy,
        potentialEnergy: calculatedResults.potentialEnergy,
        totalEnergy: calculatedResults.totalEnergy,
        energyPerHour: calculatedResults.energyPerHour,
        Vd: calculatedResults.Vd,
        emassMin: calculatedResults.emassMin,
      })
    );
    navigate(`/price/${model}`);
  };

  return (
    <>
      <div className="Crane1 inputFields">
        <DynamicHeading
          className="forMobile"
          initialContent="Wagon against 2 shock absorbers"
          content={content}
          setContent={setContent}
        />
        <div className="mobileIndex">
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            <div className="firstLine">
              <FormControl variant="outlined" className="fromMobile">
                <OutlinedInput
                  id="outlined-adornment-weight"
                  onChange={handleMChange}
                  autoComplete="off"
                  endAdornment={
                    <InputAdornment position="end">kg</InputAdornment>
                  }
                  aria-describedby="outlined-weight-helper-text"
                />
                <FormHelperText
                  id="outlined-weight-helper-text"
                  sx={{ fontSize: "1.1rem" }}
                >
                  m
                </FormHelperText>
              </FormControl>

              <FormControl variant="outlined" className="fromMobile">
                <OutlinedInput
                  id="outlined-adornment-weight"
                  onChange={handleVChange}
                  autoComplete="off"
                  endAdornment={
                    <InputAdornment position="end">m/s</InputAdornment>
                  }
                  aria-describedby="outlined-weight-helper-text"
                />
                <FormHelperText
                  id="outlined-weight-helper-text"
                  sx={{ fontSize: "1.1rem" }}
                >
                  v
                </FormHelperText>
              </FormControl>

              <FormControl variant="outlined" className="fromMobile">
                <OutlinedInput
                  id="outlined-adornment-weight"
                  onChange={handleCChange}
                  autoComplete="off"
                  endAdornment={
                    <InputAdornment position="end">/hr</InputAdornment>
                  }
                  aria-describedby="outlined-weight-helper-text"
                />
                <FormHelperText
                  id="outlined-weight-helper-text"
                  sx={{ fontSize: "1.1rem" }}
                >
                  c
                </FormHelperText>
              </FormControl>

              <FormControl variant="outlined" className="fromMobile">
                <OutlinedInput
                  id="outlined-adornment-weight"
                  onChange={handleFChange}
                  autoComplete="off"
                  endAdornment={
                    <InputAdornment position="end">M</InputAdornment>
                  }
                  aria-describedby="outlined-weight-helper-text"
                />
                <FormHelperText
                  id="outlined-weight-helper-text"
                  sx={{ fontSize: "1.1rem" }}
                >
                  F
                </FormHelperText>
              </FormControl>
            </div>

            <div className="secondLine">
              <div>
                <div>
                  <FormControl
                    variant="outlined"
                    className="fromMobile"
                    autoComplete="off"
                  >
                    <Autocomplete
                      onChange={handleSChange}
                      id="controllable-states-demo"
                      options={option1}
                      // sx={{ width: 250, marginLeft: "8px", marginRight: "8px" }}
                      className="autoComplete"
                      renderInput={(params) => (
                        <TextField {...params} label="Select Value" />
                      )}
                    />
                    <FormHelperText
                      id="outlined-weight-helper-text"
                      sx={{ fontSize: "1rem" }}
                    >
                      S
                    </FormHelperText>
                  </FormControl>

                  <FormControl
                    variant="outlined"
                    className="fromMobile"
                    autoComplete="off"
                  >
                    <Autocomplete
                      id="controllable-states-demo"
                      className="autocomplete"
                      value={shockAbsorber}
                      onChange={handleAbsorberChange}
                      options={option2}
                      getOptionLabel={(option) => option.toString()}
                      isOptionEqualToValue={(option, value) => option === value}
                      name="shockAbsorber"
                      renderInput={(params) => (
                        <TextField {...params} label="Shock Absorbers" />
                      )}
                    />
                    <FormHelperText
                      id="outlined-weight-helper-text"
                      sx={{ fontSize: "1rem" }}
                    >
                      N
                    </FormHelperText>
                  </FormControl>

                  <FormControl
                    variant="outlined"
                    className="fromMobile"
                    autoComplete="off"
                  >
                    <Autocomplete
                      id="controllable-states-demo"
                      className="autocomplete"
                      onChange={handleTypeChange}
                      options={Type}
                      name="Type"
                      renderInput={(params) => (
                        <TextField {...params} label="Choose your type" />
                      )}
                    />
                    <FormHelperText
                      id="outlined-weight-helper-text"
                      sx={{ fontSize: "1rem" }}
                    >
                      Type
                    </FormHelperText>
                  </FormControl>

                  <FormControl
                    variant="outlined"
                    className="fromMobile"
                    autoComplete="off"
                  >
                    <Autocomplete
                      id="controllable-states-demo"
                      className="autocomplete"
                      value={selectedCurrency} // Set default currency
                      onChange={(event, newValue) =>
                        setSelectedCurrency(newValue)
                      }
                      options={Currency}
                      name="selectedCurrency"
                      renderInput={(params) => (
                        <TextField {...params} label="Choose your currency" />
                      )}
                    />
                    <FormHelperText
                      id="outlined-weight-helper-text"
                      sx={{ fontSize: "1rem" }}
                    >
                      Currency
                    </FormHelperText>
                  </FormControl>
                </div>
                <div className="btn">
                  <button onClick={handleCalculate}>Calculate</button>
                </div>
                <div className="resultOutput">
                  <FormControl variant="outlined" className="fromMobile">
                    <OutlinedInput
                      id="outlined-adornment-weight"
                      value={calculatedResults.kineticEnergy}
                      readOnly={true}
                      endAdornment={
                        <InputAdornment position="end">Nm</InputAdornment>
                      }
                      aria-describedby="outlined-weight-helper-text"
                    />
                    <FormHelperText
                      id="outlined-weight-helper-text"
                      sx={{ fontSize: "1rem" }}
                    >
                      Kinetic Energy
                    </FormHelperText>
                  </FormControl>

                  <FormControl variant="outlined" className="fromMobile">
                    <OutlinedInput
                      id="outlined-adornment-weight"
                      value={calculatedResults.potentialEnergy}
                      readOnly={true}
                      endAdornment={
                        <InputAdornment position="end">Nm</InputAdornment>
                      }
                      aria-describedby="outlined-weight-helper-text"
                    />
                    <FormHelperText
                      id="outlined-weight-helper-text"
                      sx={{ fontSize: "1rem" }}
                    >
                      Potential Energy
                    </FormHelperText>
                  </FormControl>

                  <FormControl variant="outlined" className="fromMobile">
                    <OutlinedInput
                      id="outlined-adornment-weight"
                      value={calculatedResults.totalEnergy}
                      readOnly={true}
                      endAdornment={
                        <InputAdornment position="end">Nm</InputAdornment>
                      }
                      aria-describedby="outlined-weight-helper-text"
                    />
                    <FormHelperText
                      id="outlined-weight-helper-text"
                      sx={{ fontSize: "1rem" }}
                    >
                      Total Energy
                    </FormHelperText>
                  </FormControl>
                  <FormControl variant="outlined" className="fromMobile">
                    <OutlinedInput
                      id="outlined-adornment-weight"
                      value={calculatedResults.energyPerHour}
                      readOnly={true}
                      endAdornment={
                        <InputAdornment position="end">Nm/hr</InputAdornment>
                      }
                      aria-describedby="outlined-weight-helper-text"
                    />
                    <FormHelperText
                      id="outlined-weight-helper-text"
                      sx={{ fontSize: "1rem" }}
                    >
                      Energy per hour
                    </FormHelperText>
                  </FormControl>

                  <FormControl variant="outlined" className="fromMobile">
                    <OutlinedInput
                      id="outlined-adornment-weight"
                      value={calculatedResults.Vd}
                      readOnly={true}
                      endAdornment={
                        <InputAdornment position="end">m/s</InputAdornment>
                      }
                      aria-describedby="outlined-weight-helper-text"
                    />
                    <FormHelperText
                      id="outlined-weight-helper-text"
                      sx={{ fontSize: "1rem" }}
                    >
                      Vd
                    </FormHelperText>
                  </FormControl>

                  <FormControl variant="outlined" className="fromMobile">
                    <OutlinedInput
                      id="outlined-adornment-weight"
                      value={calculatedResults.emassMin}
                      readOnly={true}
                      endAdornment={
                        <InputAdornment position="end">kg</InputAdornment>
                      }
                      aria-describedby="outlined-weight-helper-text"
                    />
                    <FormHelperText
                      id="outlined-weight-helper-text"
                      sx={{ fontSize: "1rem" }}
                    >
                      Emass min
                    </FormHelperText>
                  </FormControl>
                </div>
              </div>
              <div className="text-center m-auto mt-8  w-[100%] text-xl">
                {showModelOutput &&
                  top5ModelNames.map((model, index) => (
                    <div key={index} className="model-button-container">
                      <div
                        onClick={() => handleModelClick(model)}
                        className="w-[90%] flex items-center justify-center mx-auto bg-emerald-900 h-[10vh] text-white mb-4  rounded-2xl"
                      >
                        {modelPrices[model] !== undefined
                          ? selectedCurrency === "INR"
                            ? `Rs ${modelPrices[model].NEWPRICE}`
                            : `$ ${modelPrices[model].NEWPRICE / 80}`
                          : "Loading..."}

                        <button className=" text-center ml-8  text-white font-bold">
                          {model}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </Box>
        </div>

        {/* {model && <ModelPricePage modelName={model} />} */}
      </div>
    </>
  );
};
