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
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
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

// const Type = ["ED", "EI", "SB"];
const Currency = ["USD", "INR"];

// import { useNavigate } from "react-router-dom";
import { TableBody, TableHead } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const CraneFirst = () => {
  const navigate = useNavigate();

  const [mValue, setMValue] = useState("");
  const [vValue, setVValue] = useState("");
  const [cValue, setCValue] = useState("");
  const [fValue, setFValue] = useState("");
  const [sValue, setSValue] = useState("");
  // const [model, setModel] = useState(null);
  // const [selectedType, setSelectedType] = useState("");
  const [top5ModelNames, setTop5ModelNames] = useState({
    ED: [],
    EI: [],
    SB: [],
  });
  const [shockAbsorber, setShockAbsorber] = useState("2");
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
  const [showTable, setShowTable] = useState(false);

  const dispatch = useDispatch();

  const [content, setContent] = useState("Initial Content");
  const [value, setValue] = useState("ED");

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
  // const handleTypeChange = (event, value) => {
  //   setSelectedType(value);
  // };
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
  };

  //Fetching Data
  const getData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/data/data", {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();

        const filteredData = {
          ED: data.filter((item) => {
            return (
              item.nmperstroke > calculatedResults.totalEnergy &&
              item.nmperhr > calculatedResults.energyPerHour &&
              item["MODEL TYPE"] === "ED"
            );
          }),
          EI: data.filter((item) => {
            return (
              item.nmperstroke > calculatedResults.totalEnergy &&
              item.nmperhr > calculatedResults.energyPerHour &&
              item["MODEL TYPE"] === "EI"
            );
          }),
          SB: data.filter((item) => {
            return (
              item.nmperstroke > calculatedResults.totalEnergy &&
              item.nmperhr > calculatedResults.energyPerHour &&
              item["MODEL TYPE"] === "SB"
            );
          }),
        };

        console.log(filteredData);
        const top5ModelNames = {
          ED: filteredData.ED.slice(0, 5).map((item) => ({
            model: item.Model,
            stroke: item.Stroke,
            nmperstroke: item.nmperstroke,
            nmperhr: item.nmperhr,
          })),
          EI: filteredData.EI.slice(0, 5).map((item) => ({
            model: item.Model,
            stroke: item.Stroke,
            nmperstroke: item.nmperstroke,
            nmperhr: item.nmperhr,
          })),
          SB: filteredData.SB.slice(0, 5).map((item) => ({
            model: item.Model,
            stroke: item.Stroke,
            nmperstroke: item.nmperstroke,
            nmperhr: item.nmperhr,
          })),
        };

        setTop5ModelNames(top5ModelNames);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (mValue && vValue && cValue && fValue && sValue) {
      getData();
      handleCalculate();
      setShowTable(true);
    } else {
      setShowTable(false);
      setCalculatedResults({
        kineticEnergy: "",
        potentialEnergy: "",
        totalEnergy: "",
        energyPerHour: "",
        emassMin: "",
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    mValue,
    vValue,
    cValue,
    fValue,
    sValue,
    calculatedResults.emassMin,
    calculatedResults.energyPerHour,
    calculatedResults.kineticEnergy,
    calculatedResults.potentialEnergy,
    calculatedResults.totalEnergy,
  ]);

  // const fetchPricesForModels = async (models) => {
  //   try {
  //     console.log(models);
  //     // Fetch prices for each model
  //     const pricePromises = models.map(async (model) => {
  //       const response = await fetch(
  //         `https://calculation.cranebuffer.com/prices/${model}`,
  //         {
  //           method: "GET",
  //         }
  //       );
  //       console.log(response);
  //       if (response.ok) {
  //         const data = await response.json();
  //         console.log(data);
  //         return { [model]: data.price };
  //       }
  //     });

  //     // Wait for all price fetch requests to complete
  //     const prices = await Promise.all(pricePromises);
  //     const priceMap = Object.assign({}, ...prices);
  //     setModelPrices(priceMap);
  //   } catch (error) {
  //     console.error("Error fetching prices:", error);
  //   }
  // };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
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
          className="forMobile text-center text-2xl font-bold m-4 "
          initialContent="Wagon against 2 shock absorbers"
          content={content}
          setContent={setContent}
        />
        <div className="mobileIndex">
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            <div className="firstLine ">
              <FormControl variant="outlined" className="fromMobile ">
                <OutlinedInput
                  className=""
                  id="outlined-adornment-weight"
                  value={mValue}
                  onChange={handleMChange}
                  autoComplete="off"
                  endAdornment={
                    <InputAdornment position="end">kg</InputAdornment>
                  }
                  aria-describedby="outlined-weight-helper-text"
                />
                <FormHelperText
                  className=""
                  id="outlined-weight-helper-text"
                  sx={{ fontSize: "1.1rem" }}
                >
                  m
                </FormHelperText>
              </FormControl>

              <FormControl variant="outlined" className="fromMobile">
                <OutlinedInput
                  className=""
                  id="outlined-adornment-weight"
                  value={vValue}
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
                  className=""
                  id="outlined-adornment-weight"
                  value={cValue}
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
                  className=""
                  id="outlined-adornment-weight"
                  value={fValue}
                  onChange={handleFChange}
                  autoComplete="off"
                  endAdornment={
                    <InputAdornment position="end">N</InputAdornment>
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
                <div className="lineBox">
                  <FormControl
                    variant="outlined"
                    className="fromMobile"
                    autoComplete="off"
                  >
                    <Autocomplete
                      onChange={handleSChange}
                      id="controllable-states-demo"
                      value={sValue}
                      options={option1}
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

                  {/* <FormControl
                    variant="outlined"
                    className="fromMobile"
                    autoComplete="off"
                  >
                    <Autocomplete
                      id="controllable-states-demo"
                      className="autocomplete "
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
                  </FormControl> */}

                  <FormControl
                    variant="outlined"
                    className="fromMobile "
                    autoComplete="off"
                  >
                    <Autocomplete
                      id="controllable-states-demo "
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
                      className=""
                      id="outlined-weight-helper-text"
                      sx={{ fontSize: "1rem" }}
                    >
                      Currency
                    </FormHelperText>
                  </FormControl>
                </div>
                {/* <div className="btn md:w-[10%] md:bg-blue-500 text-white md:rounded-lg md:p-3 md:m-auto text-center md:mb-4 md:mt-6">
                  <button onClick={handleCalculate}>Calculate</button>
                </div> */}
                <div className="resultOutput">
                  <FormControl variant="outlined" className="fromMobile">
                    <OutlinedInput
                      className="md:mx-4"
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
                      className="md:mx-4"
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
                      className="md:mx-4"
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
                      className="md:mx-4"
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
                      className="md:mx-4"
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
            </div>
          </Box>
        </div>
        {showTable && (
          <Box
            sx={{
              border: "1px solid #ccc",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleTabChange}
                  aria-label="lab API tabs example"
                  className="flex flex-wrap justify-center sm:justify-start"
                >
                  <Tab label="ED" value="ED" />
                  <Tab label="EI" value="EI" />
                  <Tab label="SB" value="SB" />
                </TabList>
              </Box>
              <TabPanel value="ED">
                <Table
                  className="table-auto w-full"
                  sx={{ minWidth: 400, overflow: "hidden" }}
                >
                  <TableHead>
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": {
                          border: "1px solid rgba(0, 0, 0, 0.2)",
                          backgroundColor: "#eeee",
                        },
                      }}
                    >
                      <TableCell align="right">Model</TableCell>
                      <TableCell align="right">Energy Capacity</TableCell>
                      <TableCell align="right">Stroke</TableCell>
                      <TableCell align="right">
                        Rate of Utilization/stroke
                      </TableCell>
                      <TableCell align="right">
                        Rate of Utilization/hr
                      </TableCell>
                      <TableCell align="right">Deceleration Rate</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody
                    sx={{
                      "&:last-child td, &:last-child th": {
                        border: "1px solid rgba(0, 0, 0, 0.2)",
                      },
                    }}
                  >
                    {top5ModelNames.ED.map((model, index) => (
                      <TableRow key={index}>
                        <TableCell
                          align="right"
                          onClick={() => handleModelClick(model.model)}
                          className="md:cursor-pointer md:hover:scale-125 md:duration-300"
                        >
                          {model.model}
                        </TableCell>
                        <TableCell align="right">{model.nmperstroke}</TableCell>
                        <TableCell align="right">{model.stroke}</TableCell>
                        <TableCell align="right">
                          {(
                            (calculatedResults.totalEnergy /
                              model.nmperstroke) *
                            100
                          ).toFixed(2)}
                          %
                        </TableCell>
                        <TableCell align="right">
                          {(
                            (calculatedResults.energyPerHour / model.nmperhr) *
                            100
                          ).toFixed(2)}
                          %
                        </TableCell>
                        <TableCell align="right">
                          {(0.75 * calculatedResults.Vd ** 2) / model.stroke}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabPanel>
              <TabPanel value="EI">
                <Table style={{ borderCollapse: "collapse", width: "100%" }}>
                  <TableHead>
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": {
                          border: "1px solid rgba(0, 0, 0, 0.2)",
                        },
                      }}
                    >
                      <TableCell align="right">Model</TableCell>
                      <TableCell align="right">Energy Capacity</TableCell>
                      <TableCell align="right">Stroke</TableCell>
                      <TableCell align="right">
                        Rate of Utilization/stroke
                      </TableCell>
                      <TableCell align="right">
                        Rate of Utilization/hr
                      </TableCell>
                      <TableCell align="right">Deceleration Rate</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody
                    sx={{
                      "&:last-child td, &:last-child th": {
                        border: "1px solid rgba(0, 0, 0, 0.2)",
                      },
                    }}
                  >
                    {top5ModelNames.EI.map((model, index) => (
                      <TableRow key={index}>
                        <TableCell
                          align="right"
                          onClick={() => handleModelClick(model.model)}
                          className="md:cursor-pointer md:hover:scale-125 md:duration-300"
                        >
                          {model.model}
                        </TableCell>
                        <TableCell align="right">{model.nmperstroke}</TableCell>
                        <TableCell align="right">{model.stroke}</TableCell>
                        <TableCell align="right">
                          {(
                            (calculatedResults.totalEnergy /
                              model.nmperstroke) *
                            100
                          ).toFixed(2)}
                          %
                        </TableCell>
                        <TableCell align="right">
                          {(
                            (calculatedResults.energyPerHour / model.nmperhr) *
                            100
                          ).toFixed(2)}
                          %
                        </TableCell>
                        <TableCell align="right">
                          {(0.75 * calculatedResults.Vd ** 2) / model.stroke}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabPanel>
              <TabPanel value="SB">
                <Table style={{ borderCollapse: "collapse", width: "100%" }}>
                  <TableHead>
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": {
                          border: "1px solid rgba(0, 0, 0, 0.2)",
                        },
                      }}
                    >
                      <TableCell align="right">Model</TableCell>
                      <TableCell align="right">Energy Capacity</TableCell>
                      <TableCell align="right">Stroke</TableCell>
                      <TableCell align="right">
                        Rate of Utilization/stroke
                      </TableCell>
                      <TableCell align="right">
                        Rate of Utilization/hr
                      </TableCell>
                      <TableCell align="right">Deceleration Rate</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody
                    sx={{
                      "&:last-child td, &:last-child th": {
                        border: "1px solid rgba(0, 0, 0, 0.2)",
                      },
                    }}
                  >
                    {top5ModelNames.SB.map((model, index) => (
                      <TableRow key={index}>
                        <TableCell
                          align="right"
                          onClick={() => handleModelClick(model.model)}
                          className="md:cursor-pointer md:hover:scale-125 md:duration-300"
                        >
                          {model.model}
                        </TableCell>
                        <TableCell align="right">{model.nmperstroke}</TableCell>
                        <TableCell align="right">{model.stroke}</TableCell>
                        <TableCell align="right">
                          {(
                            (calculatedResults.totalEnergy /
                              model.nmperstroke) *
                            100
                          ).toFixed(2)}
                          %
                        </TableCell>
                        <TableCell align="right">
                          {(
                            (calculatedResults.energyPerHour / model.nmperhr) *
                            100
                          ).toFixed(2)}
                          %
                        </TableCell>
                        <TableCell align="right">
                          {(0.75 * calculatedResults.Vd ** 2) / model.stroke}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabPanel>
            </TabContext>
          </Box>
        )}
      </div>
    </>
  );
};
