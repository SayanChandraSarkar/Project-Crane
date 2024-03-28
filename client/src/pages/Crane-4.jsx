import { useEffect, useState } from "react";
import { addData } from "../features/dataSlice";
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
import { Card, TableBody, TableHead } from "@mui/material";

import "../scss/Crane-4.scss";

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

const Currency = ["USD", "INR"];

import { useNavigate } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";

const CraneFourth = () => {
  const navigate = useNavigate();
   //Redux
   const mass = useSelector((state) => state.data.mass);
   const velocity = useSelector((state) => state.data.velocity);
   const cycle = useSelector((state) => state.data.cycle);
   const force = useSelector((state) => state.data.force);
   const stroke = useSelector((state) => state.data.stroke);
   const power = useSelector((state) => state.data.power);
    const stallFactor = useSelector((state) => state.data.stallFactor);
   
  const [mValue, setMValue] = useState("");
  const [vValue, setVValue] = useState("");
  const [cValue, setCValue] = useState("");
  const [pValue, setPValue] = useState("");
  const [stvalue, setStValue] = useState("2.5");
  const [sValue, setSValue] = useState("");

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
  const [showTable, setShowTable] = useState(false);

  const [content, setContent] = useState("Initial Content");
  const [value, setValue] = useState("ED");
  const dispatch = useDispatch();
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

  const handleMChange = (event) => {
    setMValue(event.target.value);
  };

  const handleVChange = (event) => {
    setVValue(event.target.value);
  };

  const handleCChange = (event) => {
    setCValue(event.target.value);
  };
  const handlestChange = (event) => {
    setStValue(event.target.value);
  };

  const handlePChange = (event) => {
    setPValue(event.target.value);
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

  const handleCalculate = () => {
    const kineticEnergy = Math.round(mValue * vValue ** 2 * 0.5);
    const potentialEnergy = Math.round(
      (1000 * pValue * stvalue * sValue) / vValue
    );
    const totalEnergy = kineticEnergy + potentialEnergy;
    const energyPerHour = totalEnergy * cValue;
    const Vd = vValue;
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
        // Filter the data based on the conditions for each type
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
  //   if (mValue && vValue && cValue && pValue && sValue && stvalue) {
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
  //   vValue,
  //   cValue,
  //   pValue,
  //   sValue,
  //   stvalue,
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
    vValue,
    cValue,
    pValue,
    sValue,
    stvalue,
    calculatedResults.emassMin,
    calculatedResults.energyPerHour,
    calculatedResults.kineticEnergy,
    calculatedResults.potentialEnergy,
    calculatedResults.totalEnergy,
  ]);
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleModelClick = (model) => {
    dispatch(
      addData({
        mass: mValue,
        velocity: vValue,
        cycle: cValue,
        stroke: sValue,
        power: pValue,
        stallFactor: stvalue,
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

  useEffect(() => {
    if (mass !== null) {
      setMValue(`${mass}`);
    }
    if (velocity !== null) {
      setVValue(`${velocity}`);
    }
    if (cycle !== null) {
      setCValue(`${cycle}`);
    }
  
    if (stroke !== null) {
      setSValue(`${stroke}`);
    }
    if (power !== null) {
      setPValue(`${power}`);
    }
    if (stallFactor !== null) {
      setStValue(`${stallFactor}`);
    }


  }, [mass, velocity, cycle, force, stroke, power, stallFactor]);

  return (
    <>
      <div className="Crane4 inputFields">
        <DynamicHeading
          className="forMobile text-center text-2xl font-bold"
          initialContent="Wagon against 1 shock absorbers"
          content={content}
          setContent={setContent}
        />
        <div className="mobileIndex">
          <Card
            sx={{
              boxShadow: "none",
            }}
            className="mb-7 md:p-6  p-4 md:border border-gray-300
            "
          >
            <div className="firstLine ">
              <FormControl variant="outlined" className="fromMobile ">
                <TextField
                  size="small"
                  label="Mass"
                  className=""
                  id="outlined-adornment-weight"
                  value={mValue}
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
                  label="Velocity"
                  className=""
                  id="outlined-adornment-weight"
                  value={vValue}
                  onChange={handleVChange}
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
                  className=""
                  id="outlined-adornment-weight"
                  label="Cycles per hour"
                  value={cValue}
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
                  className=""
                  label="Motor Power"
                  id="outlined-adornment-weight"
                  value={pValue}
                  onChange={handlePChange}
                  autoComplete="off"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">kW</InputAdornment>,
                  }}
                  aria-describedby="outlined-weight-helper-text"
                />
             
              </FormControl>
              <FormControl variant="outlined" className="fromMobile">
                <TextField
                  size="small"
                  label="Stall torque factor"
                  className=""
                  id="outlined-adornment-weight"
                  value={stvalue}
                  onChange={handlestChange}
                  autoComplete="off"
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
                  sx={{ fontSize: "0.9rem" }}
                >
                  Stroke
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
                  sx={{ fontSize: "0.9rem" }}
                >
                  Numb. of absorbers in parallel
                </FormHelperText>
              </FormControl>
              <FormControl
                variant="outlined"
                className="fromMobile "
                autoComplete="off"
              >
                <Autocomplete
                  size="small"
                  id="controllable-states-demo "
                  className="autocomplete"
                  value={selectedCurrency} // Set default currency
                  onChange={(event, newValue) => setSelectedCurrency(newValue)}
                  options={Currency}
                  name="selectedCurrency"
                  renderInput={(params) => (
                    <TextField {...params} label="Choose your currency" />
                  )}
                />
                <FormHelperText
                  className=""
                  id="outlined-weight-helper-text"
                  sx={{ fontSize: "0.9rem" }}
                >
                  Currency
                </FormHelperText>
              </FormControl>
            </div>
          </Card>

          <Card
            className="mb-10 md:p-6 p-4  border-0 md:border md:border-gray-300"
            variant="outlined"
            sx={{ backgroundColor: "#ffff" }}
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
                    endAdornment: <InputAdornment position="end">Nm</InputAdornment>,
                  }}
                  aria-describedby="outlined-weight-helper-text"
                />
               
              </FormControl>
              <FormControl variant="outlined" className="fromMobile">
                <TextField
                  size="small"
                  disabled
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
                  size="small"
                  label="Total Energy"
                  disabled
                  id="outlined-adornment-weight"
                  value={calculatedResults.totalEnergy}
                  readOnly={true}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">Nm</InputAdornment>,
                  }}
                  aria-describedby="outlined-weight-helper-text"
                />
                <FormHelperText
                  id="outlined-weight-helper-text"
                  sx={{ fontSize: "0.9rem" }}
                >
                  Total Energy
                </FormHelperText>
              </FormControl>
              <FormControl variant="outlined" className="fromMobile">
                <TextField
                  size="small"
                  label="Energy per hour"
                  disabled
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
                  label='Emass min'
                  disabled
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
          {/* </Box> */}
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
                        <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                          Model
                        </TableCell>
                        <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                          Energy Capacity
                        </TableCell>
                        <TableCell align="right">Stroke</TableCell>
                        <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                          Rate of Utilization/stroke
                        </TableCell>
                        <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                          Rate of Utilization/hr
                        </TableCell>
                        <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
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
                            {(0.75 * calculatedResults.Vd ** 2) / model.stroke}
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
                        <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                          Model
                        </TableCell>
                        <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                          Energy Capacity
                        </TableCell>
                        <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                          Stroke
                        </TableCell>
                        <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                          Rate of Utilization/stroke
                        </TableCell>
                        <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                          Rate of Utilization/hr
                        </TableCell>
                        <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
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
                            {(0.75 * calculatedResults.Vd ** 2) / model.stroke}
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
                        <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                          Model
                        </TableCell>
                        <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                          Energy Capacity
                        </TableCell>
                        <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                          Stroke
                        </TableCell>
                        <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                          Rate of Utilization/stroke
                        </TableCell>
                        <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                          Rate of Utilization/hr
                        </TableCell>
                        <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
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
                          <TableCell align="right">
                            {Number(model.stroke)}
                          </TableCell>
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
                            {(0.75 * calculatedResults.Vd ** 2) / model.stroke}
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
    </>
  );
};

export default CraneFourth;
