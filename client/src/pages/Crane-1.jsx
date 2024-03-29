import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addData } from "../features/dataSlice";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
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
import Card from "@mui/material/Card";

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

const Currency = ["USD", "INR"];

import { useNavigate } from "react-router-dom";
import { TableBody, TableHead } from "@mui/material";

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
  const [hoveredRowIndex, setHoveredRowIndex] = useState(null);

  const [calculatedResults, setCalculatedResults] = useState({
    kineticEnergy: "",
    potentialEnergy: "",
    totalEnergy: "",
    energyPerHour: "",
    emassMin: "",
    Vd: "",
  });
  const [showTable, setShowTable] = useState(false);
  const dispatch = useDispatch();

  const [content, setContent] = useState("Initial Content");
  const [value, setValue] = useState("ED");

  //Redux
  const mass = useSelector((state) => state.data.mass);
  const velocity = useSelector((state) => state.data.velocity);
  const cycle = useSelector((state) => state.data.cycle);
  const force = useSelector((state) => state.data.force);
  const stroke = useSelector((state) => state.data.stroke);

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
      const response = await fetch(
        "https://calculation.cranebuffer.com/api/data/data",
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);

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
  //   if (mValue && vValue && cValue && fValue && sValue) {
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
  //   fValue,
  //   sValue,
  //   calculatedResults.emassMin,
  //   calculatedResults.energyPerHour,
  //   calculatedResults.kineticEnergy,
  //   calculatedResults.potentialEnergy,
  //   calculatedResults.totalEnergy,
  // ]);

  useEffect(() => {
    if ((mValue && vValue && cValue && fValue && sValue) || mValue || vValue) {
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
        Vd: "",
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
    calculatedResults.Vd,
  ]);

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
        mass: mValue,
        velocity: vValue,
        cycle: cValue,
        force: fValue,
        stroke: sValue,
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
    if (force !== null) {
      setFValue(`${force}`);
    }
    if (stroke !== null) {
      setSValue(`${stroke}`);
    }
  }, [mass, velocity, cycle, force, stroke]);

  return (
    <>
      <div className="Crane1 inputFields">
        <div className="images flex justify-center ">
          <img src="images/logo.png" className="md:w-48 mt-4" />
        </div>
        <div className="md:flex md:justify-between">
          <div className="text-lg  md:flex md:justify-center md:items-center  text-center font-bold">
            Selection of shock absorbers
          </div>
          <DynamicHeading
            className=" forMobile text-center text-2xl font-bold"
            initialContent="Wagon against 2 shock absorbers"
            content={content}
            setContent={setContent}
          />
        </div>
        <div className="mobileIndex">
          {/* <Box sx={{ display: "flex", flexWrap: "wrap" }}> */}
          <Card
            sx={{
              boxShadow: "none",
            }}
            className="mb-7 md:p-6 p-4 md:border border-gray-300
            "
          >
            <div className="firstLine ">
              <FormControl className="fromMobile">
                <TextField
                  size="small"
                  className=""
                  id="outlined-adornment-password"
                  label="Mass"
                  // value={
                  //   mValue
                  //     ? `${mValue}${mass !== null ? ` (${mass})` : ""}`
                  //     : ""
                  // }
                  // value={
                  //   mValue !== null
                  //     ? `${mValue}${mass !== null ? ` (${mass})` : ""}`
                  //     : ""
                  // }
                  value={mValue}
                  onChange={handleMChange}
                  autoComplete="off"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">Kg</InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    style: {
                      fontSize: "0.9rem",
                      marginTop: "2px",
                    }, //
                  }}
                  aria-describedby="outlined-weight-helper-text"
                />

                {/* <FormHelperText
                  className=""
                  id="outlined-weight-helper-text"
                  sx={{ fontSize: "0.9rem" }}
                >
                  Mass
                </FormHelperText> */}
              </FormControl>
              <FormControl variant="outlined" className="fromMobile">
                <TextField
                  size="small"
                  className=""
                  label="Velocity"
                  id="outlined-adornment-weight"
                  value={vValue}
                  onChange={handleVChange}
                  autoComplete="off"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">m/s</InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    style: {
                      fontSize: "0.9rem",
                      marginTop: "2px",
                    }, //
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
                    endAdornment: (
                      <InputAdornment position="end">/hr</InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    style: {
                      fontSize: "0.9rem",
                      marginTop: "2px",
                    }, //
                  }}
                  aria-describedby="outlined-weight-helper-text"
                />
              </FormControl>
              <FormControl variant="outlined" className="fromMobile">
                <TextField
                  size="small"
                  className=""
                  id="outlined-adornment-weight"
                  value={fValue}
                  label="Force"
                  onChange={handleFChange}
                  autoComplete="off"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">kg</InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    style: {
                      fontSize: "0.9rem",
                      marginTop: "2px",
                    }, //
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
                    onChange={handleSChange}
                    id="controllable-states-demo"
                    value={sValue}
                    options={option1}
                    className="autoComplete"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
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
                      <TextField
                        {...params}
                        size="small"
                        label="Shock Absorbers"
                      />
                    )}
                  />
                </FormControl>

                <FormControl
                  variant="outlined"
                  className="fromMobile"
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
                      <TextField
                        {...params}
                        size="small"
                        label="Choose your currency"
                      />
                    )}
                  />
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
                  label="Kinetic Energy"
                  disabled
                  size="small"
                  id="outlined-adornment-weight"
                  value={calculatedResults.kineticEnergy}
                  readOnly={true}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">Nm</InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    style: {
                      fontSize: "0.9rem",
                      marginTop: "2px",
                    }, //
                  }}
                  aria-describedby="outlined-weight-helper-text"
                />
              </FormControl>
              <FormControl variant="outlined" className="fromMobile">
                <TextField
                  disabled
                  label="Potential Energy"
                  size="small"
                  id="outlined-adornment-weight"
                  value={calculatedResults.potentialEnergy}
                  readOnly={true}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">Nm</InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    style: {
                      fontSize: "0.9rem",
                      marginTop: "2px",
                    }, //
                  }}
                  aria-describedby="outlined-weight-helper-text"
                />
              </FormControl>
              <FormControl variant="outlined" className="fromMobile">
                <TextField
                  label="Total Energy"
                  disabled
                  size="small"
                  id="outlined-adornment-weight"
                  value={calculatedResults.totalEnergy}
                  readOnly={true}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">Nm</InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    style: {
                      fontSize: "0.9rem",
                      marginTop: "2px",
                    }, //
                  }}
                  aria-describedby="outlined-weight-helper-text"
                />
              </FormControl>
              <FormControl variant="outlined" className="fromMobile">
                <TextField
                  disabled
                  label="Energy per hour"
                  size="small"
                  id="outlined-adornment-weight"
                  value={calculatedResults.energyPerHour}
                  readOnly={true}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">Nm/hr</InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    style: {
                      fontSize: "0.9rem",
                      marginTop: "2px",
                    }, //
                  }}
                  aria-describedby="outlined-weight-helper-text"
                />
              </FormControl>
              <FormControl variant="outlined" className="fromMobile">
                <TextField
                  disabled
                  label="Impact velocity at shock absorber "
                  size="small"
                  id="outlined-adornment-weight"
                  value={calculatedResults.Vd}
                  readOnly={true}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">m/s</InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    style: {
                      fontSize: "0.9rem",
                      marginTop: "2px",
                    }, //
                  }}
                  aria-describedby="outlined-weight-helper-text"
                />
              </FormControl>
              <FormControl variant="outlined" className="fromMobile ">
                <TextField
                  disabled
                  label="Emass Min"
                  size="small"
                  id="outlined-adornment-weight"
                  value={calculatedResults.emassMin}
                  readOnly={true}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">Kg</InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    style: {
                      fontSize: "0.9rem",
                      marginTop: "2px",
                    }, //
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
              <Box
                sx={{ borderBottom: 1, borderColor: "divider", width: "100%" }}
              >
                <TabList
                  onChange={handleTabChange}
                  aria-label="lab API tabs example"
                  className="flex flex-wrap justify-between w-full"
                  TabIndicatorProps={{ style: { display: "none" } }}
                >
                  <Tab
                    label="ED"
                    value="ED"
                    className="w-4/12 !max-w-[380px]"
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: "#E5E8E8",
                        color: "black", // Change the color to your desired color
                      },
                    }}
                  />
                  <Tab
                    label="EI"
                    value="EI"
                    className="w-4/12 !max-w-[380px]"
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: "#E5E8E8",
                        color: "black", // Change the color to your desired color
                      },
                    }}
                  />
                  <Tab
                    label="SB"
                    value="SB"
                    className="w-4/12 !max-w-[380px]"
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: "#E5E8E8",
                        color: "black", // Change the color to your desired color
                      },
                    }}
                  />
                </TabList>
              </Box>
              <TabPanel value="ED" className="">
                <Box sx={{ overflowX: "auto", backgroundColor: "#E5E8E8" }}>
                  <Table
                    className="table-auto w-full"
                    sx={{ minWidth: 500, overflow: "hidden" }}
                  >
                    <TableHead>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": {
                            border: "1px solid rgba(0, 0, 0, 0.2)",
                            backgroundColor: "#E5E8E8",
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
                        <TableRow
                          key={index}
                          className={
                            hoveredRowIndex === index ? "" : "opacity-80"
                          }
                          onMouseEnter={() => setHoveredRowIndex(index)}
                          onMouseLeave={() => setHoveredRowIndex(null)}
                        >
                          <TableCell
                            align="right"
                            onClick={() => handleModelClick(model.model)}
                            className="md:cursor-pointer  md:duration-300 md:hover:scale-110 hover:text-blue-900"
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
                          <TableCell
                            align="right"
                            className={
                              (0.75 * calculatedResults.Vd ** 2) /
                                model.stroke >
                              5
                                ? "!text-red-400"
                                : "!text-green-500"
                            }
                          >
                            {(
                              (0.75 * calculatedResults.Vd ** 2) /
                              model.stroke
                            ).toFixed(3)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </TabPanel>
              <TabPanel value="EI">
                <Box sx={{ overflowX: "auto", backgroundColor: "#E5E8E8" }}>
                  <Table
                    className="table-auto w-full"
                    sx={{ minWidth: 500, overflow: "hidden" }}
                  >
                    <TableHead>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": {
                            border: "1px solid rgba(0, 0, 0, 0.2)",
                            backgroundColor: "#E5E8E8",
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
                      {/* Example table rows */}
                      {top5ModelNames.EI.map((model, index) => (
                        <TableRow
                          key={index}
                          className={
                            hoveredRowIndex === index ? "" : "opacity-80"
                          }
                          onMouseEnter={() => setHoveredRowIndex(index)}
                          onMouseLeave={() => setHoveredRowIndex(null)}
                        >
                          <TableCell
                            align="right"
                            onClick={() => handleModelClick(model.model)}
                            className="md:cursor-pointer md:hover:scale-110 md:duration-300  hover:text-blue-900"
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
                          <TableCell
                            align="right"
                            className={
                              (0.75 * calculatedResults.Vd ** 2) /
                                model.stroke >
                              5
                                ? "!text-red-400"
                                : "!text-green-500"
                            }
                          >
                            {(
                              (0.75 * calculatedResults.Vd ** 2) /
                              model.stroke
                            ).toFixed(3)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </TabPanel>
              <TabPanel value="SB">
                <Box sx={{ overflowX: "auto", backgroundColor: "#E5E8E8" }}>
                  <Table
                    className="table-auto w-full"
                    sx={{ minWidth: 500, overflow: "hidden" }}
                  >
                    <TableHead>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": {
                            border: "1px solid rgba(0, 0, 0, 0.2)",
                            backgroundColor: "#E5E8E8",
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
                        <TableRow
                          key={index}
                          className={
                            hoveredRowIndex === index ? "" : "opacity-80"
                          }
                          onMouseEnter={() => setHoveredRowIndex(index)}
                          onMouseLeave={() => setHoveredRowIndex(null)}
                        >
                          <TableCell
                            align="right"
                            onClick={() => handleModelClick(model.model)}
                            className="md:cursor-pointer md:hover:scale-110 md:duration-300 hover:text-blue-900"
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
                          <TableCell
                            align="right"
                            className={
                              (0.75 * calculatedResults.Vd ** 2) /
                                model.stroke >
                              5
                                ? "!text-red-400"
                                : "!text-green-500"
                            }
                          >
                            {(
                              (0.75 * calculatedResults.Vd ** 2) /
                              model.stroke
                            ).toFixed(3)}
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
