import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";

import Autocomplete from "@mui/material/Autocomplete";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";

import "../scss/Crane-3.scss";

const option = [
  "0.015",
  "0.020",
  "0.025",
  "0.030",
  "0.035",
  "0.050",
  "0.070",
  "0.075",
  "0.100",
  "0.102",
  "0.125",
  "0.127",
  "0.150",
  "0.165",
  "0.200",
];
const option2 = ["1", "2", "3", "4"];

const Currency = ["USD", "INR"];

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addData } from "../features/dataSlice";
import { TableBody, TableHead } from "@mui/material";

export const CraneThird = () => {
  const [mValue, setMValue] = useState("");
  const [v1Value, setV1Value] = useState("");
  const [cValue, setCValue] = useState("");
  const [fValue, setFValue] = useState("");
  const [sValue, setSValue] = useState("");
  const [v2Value, setV2Value] = useState("");
  const [m2Value, setM2Value] = useState("");
  const [top5ModelNames, setTop5ModelNames] = useState({
    ED: [],
    EI: [],
    SB: [],
  });
  const [shockAbsorber, setShockAbsorber] = useState("2");
  const [selectedCurrency, setSelectedCurrency] = useState("INR");
  const [calculatedResults, setCalculatedResults] = useState({
    kineticEnergy: "",
    potentialEnergy: "",
    totalEnergy: "",
    energyPerHour: "",
    emassMin: "",
  });

  const [content, setContent] = useState("Initial Content");
  const [value, setValue] = useState("ED");
  const [showTable, setShowTable] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const handleV1Change = (event) => {
    setV1Value(event.target.value);
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

  const handleV2Change = (event) => {
    setV2Value(event.target.value);
  };
  const handleM2Change = (event) => {
    setM2Value(event.target.value);
  };

  const handleAbsorberChange = (event, value) => {
    setShockAbsorber(value);
  };
  //Handle Calculated Data

  const handleCalculate = () => {
    const kineticEnergy =
      ((mValue * m2Value) / (Number(mValue) + Number(m2Value))) *
      (Number(v1Value) + Number(v2Value)) ** 2 *
      0.5;
    const potentialEnergy = fValue * sValue;
    const totalEnergy = kineticEnergy / 2 + potentialEnergy;
    const energyPerHour = totalEnergy * cValue;
    const Vd = Number(v1Value) + Number(v2Value);
    const emassMin = Math.round((2 * totalEnergy) / Vd ** 2);

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
      const response = await fetch(
        "https://calculation.cranebuffer.com/api/data/data",
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();
        const calculateDifference = (item) =>
          Math.abs(item.nmperstroke - calculatedResults.totalEnergy);

        const filteredData = {
          ED: data
            .filter(
              (item) =>
                item.nmperstroke > calculatedResults.totalEnergy &&
                item.nmperhr > calculatedResults.energyPerHour &&
                item["MODEL TYPE"] === "ED"
            )
            .map((item) => ({
              ...item,
              difference: calculateDifference(item),
            })),
          EI: data
            .filter(
              (item) =>
                item.nmperstroke > calculatedResults.totalEnergy &&
                item.nmperhr > calculatedResults.energyPerHour &&
                item["MODEL TYPE"] === "EI"
            )
            .map((item) => ({
              ...item,
              difference: calculateDifference(item),
            })),
          SB: data
            .filter(
              (item) =>
                item.nmperstroke > calculatedResults.totalEnergy &&
                item.nmperhr > calculatedResults.energyPerHour &&
                item["MODEL TYPE"] === "SB"
            )
            .map((item) => ({
              ...item,
              difference: calculateDifference(item),
            })),
        };

        const sortedData = {
          ED: filteredData.ED.sort((a, b) => a.difference - b.difference).slice(
            0,
            5
          ),
          EI: filteredData.EI.sort((a, b) => a.difference - b.difference).slice(
            0,
            5
          ),
          SB: filteredData.SB.sort((a, b) => a.difference - b.difference).slice(
            0,
            5
          ),
        };

        // Extract required fields for the top 5 models
        const top5ModelNames = {
          ED: sortedData.ED.map((item) => ({
            model: item.Model,
            stroke: item.Stroke,
            nmperstroke: item.nmperstroke,
            nmperhr: item.nmperhr,
          })),
          EI: sortedData.EI.map((item) => ({
            model: item.Model,
            stroke: item.Stroke,
            nmperstroke: item.nmperstroke,
            nmperhr: item.nmperhr,
          })),
          SB: sortedData.SB.map((item) => ({
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

  // useEffect(() => {
  //   if (mValue && v1Value && v2Value && m2Value && cValue && fValue && sValue) {
  //     getData();
  //     handleCalculate();
  //     setShowTable(true);
  //   } else {
  //     setShowTable(false);
  //     setCalculatedResults({
  //       kineticEnergy: "",
  //       potentialEnergy: "",
  //       totalEnergy: "",
  //       energyPerHour: "",
  //       emassMin: "",
  //     });
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [
  //   mValue,
  //   v1Value,
  //   m2Value,
  //   v2Value,
  //   cValue,
  //   fValue,
  //   sValue,
  //   calculatedResults.emassMin,
  //   calculatedResults.energyPerHour,
  //   calculatedResults.kineticEnergy,
  //   calculatedResults.potentialEnergy,
  //   calculatedResults.totalEnergy,
  // ]);

  useEffect(() => {
  
      getData();
      handleCalculate();
      setShowTable(true);
  

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    mValue,
    v1Value,
    m2Value,
    v2Value,
    cValue,
    fValue,
    sValue,
    calculatedResults.emassMin,
    calculatedResults.energyPerHour,
    calculatedResults.kineticEnergy,
    calculatedResults.potentialEnergy,
    calculatedResults.totalEnergy,
  ]);

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

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <div className="Crane3 inputFields">
        <DynamicHeading
          className="forMobile text-center text-2xl font-bold"
          initialContent="Wagon against Wagon 2 shock absorber"
          content={content}
          setContent={setContent}
        />
        <div className="mobileIndex">
          <Card
            className="mb-7 md:p-6  p-4 md:border border-gray-300"
            sx={{
              boxShadow: "none",
            }}
          >
            <div className="firstLine">
              <FormControl variant="outlined" className="fromMobile">
                <TextField
                  size="small"
                  id="outlined-adornment-weight"
                  label="Mass"
                  onChange={handleMChange}
                  autoComplete="off"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">Kg</InputAdornment>,
                  }}
                  aria-describedby="outlined-weight-helper-text"
                />
           
              </FormControl>
              <FormControl variant="outlined" className="fromMobile">
                <TextField
                  size="small"
                  id="outlined-adornment-weight"
                  label="Velocity 1"
                  onChange={handleV1Change}
                  autoComplete="off"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">m/s</InputAdornment>,
                  }}
                  aria-describedby="outlined-weight-helper-text"
                />
           
              </FormControl>
              <FormControl variant="outlined" className="fromMobile">
                <TextField
                  size="small"
                  id="outlined-adornment-weight"
                  label="Cycles per hour"
                  onChange={handleCChange}
                  autoComplete="off"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">/hr</InputAdornment>,
                  }}
                  aria-describedby="outlined-weight-helper-text"
                />
              
              </FormControl>
              <FormControl variant="outlined" className="fromMobile">
                <TextField
                  size="small"
                  label="Force"
                  id="outlined-adornment-weight"
                  onChange={handleFChange}
                  autoComplete="off"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">N</InputAdornment>,
                  }}
                  aria-describedby="outlined-weight-helper-text"
                />
               
              </FormControl>
            </div>
            <div className="secondLine">
              <div className="lineBox">
                <FormControl
                  variant="outlined"
                  className="fromMobile"
                  autoComplete="off"
                >
                  <Autocomplete
                    size="small"
                    onChange={handleSChange}
                    id="controllable-states-demo"
                    options={option}
                    className="autoComplete"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Value"
                        InputLabelProps={{
                          style: {
                            fontSize: "0.9rem",
                            marginTop: "2px",
                          }, //
                        }}
                      />
                    )}
                  />
                  <FormHelperText
                    id="outlined-weight-helper-text"
                    sx={{ fontSize: "0.9rem" }}
                  >
                    Stroke
                  </FormHelperText>
                </FormControl>
                <FormControl variant="outlined" className="fromMobile">
                  <TextField
                    size="small"
                    label="Velocity 2"
                    id="outlined-adornment-weight"
                    onChange={handleV2Change}
                    autoComplete="off"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">m/s</InputAdornment>,
                    }}
                    aria-describedby="outlined-weight-helper-text"
                  />
                
                </FormControl>
                <FormControl variant="outlined" className="fromMobile">
                  <TextField
                    label="Mass 2"
                    size="small"
                    id="outlined-adornment-weight"
                    onChange={handleM2Change}
                    autoComplete="off"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">m/s</InputAdornment>,
                    }}
                    aria-describedby="outlined-weight-helper-text"
                  />
              
                </FormControl>
                <FormControl
                  variant="outlined"
                  className="fromMobile"
                  autoComplete="off"
                >
                  <Autocomplete
                    size="small"
                    id="controllable-states-demo"
                    className="autocomplete"
                    onChange={handleAbsorberChange}
                    value={shockAbsorber}
                    options={option2}
                    name="shockAbsorber"
                    getOptionLabel={(option) => option.toString()}
                    isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => (
                      <TextField {...params} label="Shock Absorbers" />
                    )}
                  />
                  <FormHelperText
                    id="outlined-weight-helper-text"
                    sx={{ fontSize: "0.9rem" }}
                  >
                    Numb. of absorbers in parallel
                  </FormHelperText>
                </FormControl>

                <FormControl
                  variant="outlined"
                  className="fromMobile"
                  autoComplete="off"
                >
                  <Autocomplete
                    size="small"
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
                    sx={{ fontSize: "0.9rem" }}
                  >
                    Currency
                  </FormHelperText>
                </FormControl>
              </div>
            </div>
          </Card>

          <Card
            className="mb-10 md:p-6 p-4  border-0 md:border md:border-gray-300"
            variant="outlined"
            sx={{ backgroundColor: " #ffff" }}
          >
            <div className="resultOutput">
              <FormControl variant="outlined" className="fromMobile">
                <TextField
                  size="small"
                  disabled
                  label="Kinetic Energy"
                  id="outlined-adornment-weight"
                  value={calculatedResults.kineticEnergy}
                  readOnly={true}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">Kg</InputAdornment>,
                  }}
                  aria-describedby="outlined-weight-helper-text"
                />
             
              </FormControl>
              <FormControl variant="outlined" className="fromMobile">
                <TextField
                 disabled
                  size="small"
                  label="Potential Energy"
                  id="outlined-adornment-weight"
                  value={calculatedResults.potentialEnergy}
                  readOnly={true}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">Nm</InputAdornment>,
                  }}
                  aria-describedby="outlined-weight-helper-text"
                />
              
              </FormControl>
              <FormControl variant="outlined" className="fromMobile">
                <TextField
                disabled
                  size="small"
                  label="Total Energy"
                  id="outlined-adornment-weight"
                  value={calculatedResults.totalEnergy}
                  readOnly={true}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">m/s</InputAdornment>,
                  }}
                  aria-describedby="outlined-weight-helper-text"
                />
               
              </FormControl>
              <FormControl variant="outlined" className="fromMobile">
                <TextField
                  size="small"
                  disabled
                  label="Energy per hour"
                  id="outlined-adornment-weight"
                  value={calculatedResults.energyPerHour}
                  readOnly={true}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">Nm/hr</InputAdornment>,
                  }}
                  aria-describedby="outlined-weight-helper-text"
                />
             
              </FormControl>
              <FormControl variant="outlined" className="fromMobile">
                <TextField
                  size="small"
                  disabled
                  label="Impact Velocity at shock absorber"
                  id="outlined-adornment-weight"
                  value={calculatedResults.Vd}
                  readOnly={true}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">m/s</InputAdornment>,
                  }}
                  aria-describedby="outlined-weight-helper-text"
                />
               
              </FormControl>
              <FormControl variant="outlined" className="fromMobile">
                <TextField
                  size="small"
                  disabled
                  label="Emass min"
                  id="outlined-adornment-weight"
                  value={calculatedResults.emassMin}
                  readOnly={true}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">Kg</InputAdornment>,
                  }}
                  aria-describedby="outlined-weight-helper-text"
                />
             
              </FormControl>
            </div>
          </Card>

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
                    <Tab label="ED" value="ED" className="w-4/12" />
                    <Tab label="EI" value="EI" className="w-4/12" />
                    <Tab label="SB" value="SB" className="w-4/12" />
                  </TabList>
                </Box>
                <TabPanel value="ED" className="">
                  <Box sx={{ overflowX: "auto" }}>
                    <Table
                      className="table-auto w-full"
                      sx={{ minWidth: 500, overflow: "hidden" }}
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
                          <TableCell
                            align="right"
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            Model
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            Energy Capacity
                          </TableCell>
                          <TableCell align="right">Stroke</TableCell>
                          <TableCell
                            align="right"
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            Rate of Utilization/stroke
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            Rate of Utilization/hr
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            Deceleration Rate
                          </TableCell>
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
                              sx={{ whiteSpace: "nowrap" }}
                            >
                              {model.model}
                            </TableCell>
                            <TableCell align="right">
                              {model.nmperstroke}
                            </TableCell>
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
                                (calculatedResults.energyPerHour /
                                  model.nmperhr) *
                                100
                              ).toFixed(2)}
                              %
                            </TableCell>
                            <TableCell align="right">
                              {(0.75 * calculatedResults.Vd ** 2) /
                                model.stroke}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </TabPanel>
                <TabPanel value="EI">
                  <Box sx={{ overflowX: "auto" }}>
                    <Table
                      className="table-auto w-full"
                      sx={{ minWidth: 500, overflow: "hidden" }}
                    >
                      <TableHead>
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": {
                              border: "1px solid rgba(0, 0, 0, 0.2)",
                            },
                          }}
                        >
                          <TableCell
                            align="right"
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            Model
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            Energy Capacity
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            Stroke
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            Rate of Utilization/stroke
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            Rate of Utilization/hr
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            Deceleration Rate
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody
                        sx={{
                          "&:last-child td, &:last-child th": {
                            border: "1px solid rgba(0, 0, 0, 0.2)",
                          },
                        }}
                      >
                        {/* Example table rows */}
                        {top5ModelNames.EI.map((model, index) => (
                          <TableRow key={index}>
                            <TableCell
                              align="right"
                              onClick={() => handleModelClick(model.model)}
                              className="md:cursor-pointer md:hover:scale-125 md:duration-300"
                              sx={{ whiteSpace: "nowrap" }}
                            >
                              {model.model}
                            </TableCell>
                            <TableCell align="right">
                              {model.nmperstroke}
                            </TableCell>
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
                                (calculatedResults.energyPerHour /
                                  model.nmperhr) *
                                100
                              ).toFixed(2)}
                              %
                            </TableCell>
                            <TableCell align="right">
                              {(0.75 * calculatedResults.Vd ** 2) /
                                model.stroke}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </TabPanel>
                <TabPanel value="SB">
                  <Box sx={{ overflowX: "auto" }}>
                    <Table
                      className="table-auto w-full"
                      sx={{ minWidth: 500, overflow: "hidden" }}
                    >
                      <TableHead>
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": {
                              border: "1px solid rgba(0, 0, 0, 0.2)",
                            },
                          }}
                        >
                          <TableCell
                            align="right"
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            Model
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            Energy Capacity
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            Stroke
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            Rate of Utilization/stroke
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            Rate of Utilization/hr
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            Deceleration Rate
                          </TableCell>
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
                              sx={{ whiteSpace: "nowrap" }}
                            >
                              {model.model}
                            </TableCell>
                            <TableCell align="right">
                              {model.nmperstroke}
                            </TableCell>
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
                                (calculatedResults.energyPerHour /
                                  model.nmperhr) *
                                100
                              ).toFixed(2)}
                              %
                            </TableCell>
                            <TableCell align="right">
                              {(0.75 * calculatedResults.Vd ** 2) /
                                model.stroke}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </TabPanel>
              </TabContext>
            </Box>
          )}
        </div>
      </div>
    </>
  );
};
