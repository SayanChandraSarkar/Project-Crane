import { useEffect, useState } from "react";
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

const Type = ["ED", "EI", "SB"];
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

export const CraneThird = () => {
  const [mValue, setMValue] = useState("");
  const [v1Value, setV1Value] = useState("");
  const [cValue, setCValue] = useState("");
  const [fValue, setFValue] = useState("");
  const [sValue, setSValue] = useState("");
  const [v2Value, setV2Value] = useState("");
  const [m2Value, setM2Value] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [top5ModelNames, setTop5ModelNames] = useState([]);
  const [showModelOutput, setShowModelOutput] = useState(false);
  const [shockAbsorber, setShockAbsorber] = useState("");

  const [calculatedResults, setCalculatedResults] = useState({
    kineticEnergy: "",
    potentialEnergy: "",
    totalEnergy: "",
    energyPerHour: "",
    emassMin: "",
  });

  const [content, setContent] = useState("Initial Content");
  const defaultContactFormData = {
    username: "",
    email: "",
    phone: "",
    company: "",
  };
  const [contact, setContact] = useState(defaultContactFormData);

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

  //Textarea Autosize
  // const Textarea = styled(BaseTextareaAutosize)(
  //   ({ theme }) => `
  //   box-sizing: border-box;
  //   width: 320px;
  //   font-family: 'IBM Plex Sans', sans-serif;
  //   font-size: 0.875rem;
  //   font-weight: 400;
  //   line-height: 1.5;
  //   padding: 8px 12px;
  //   border-radius: 8px;
  //   color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  //   background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  //   border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
  //   box-shadow: 0px 2px 2px ${
  //     theme.palette.mode === "dark" ? grey[900] : grey[50]
  //   };

  //   &:hover {
  //     border-color: ${blue[400]};
  //   }

  //   &:focus {
  //     border-color: ${blue[400]};
  //     box-shadow: 0 0 0 3px ${
  //       theme.palette.mode === "dark" ? blue[600] : blue[200]
  //     };
  //   }

  //   // firefox
  //   &:focus-visible {
  //     outline: 0;
  //   }
  // `
  // );

  const handleInput = (e) => {
    // console.log(e);

    let name = e.target.name;
    let value = e.target.value;
    setContact({
      ...contact,
      [name]: value,
    });
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

  //Type
  const handleTypeChange = (event, value) => {
    setSelectedType(value);
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
    const Vd = (Number(v1Value) + Number(v2Value)) / 2;
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

        console.log(data);

        // Filter the data based on the conditions
        const filteredData = data.filter((item) => {
          return (
            item.nmperstroke > calculatedResults.totalEnergy &&
            item.nmperhr > calculatedResults.energyPerHour &&
            item["MODEL TYPE"] === selectedType
          );
        });

        console.log(filteredData);
        // Extract the "Model" property from each object in the array
        const modelNames = filteredData.map((item) => item.Model);
        console.log(modelNames);
        const top5ModelNames = modelNames.slice(0, 5);
        console.log(top5ModelNames);

        setTop5ModelNames(top5ModelNames);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(contact);
    try {
      const formData = {
        ...contact,
        model: top5ModelNames.join(",  "),
        shockAbsorber: shockAbsorber,
        section: content,
        type: selectedType,
      };
      const response = await fetch("http://localhost:5000/api/form/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      console.log(response);
      if (response.ok) {
        setContact(defaultContactFormData);
        const data = await response.json();
        console.log(data);
        alert("Message sent successfully");

        window.location.reload();
      }
    } catch (error) {
      alert("Message not sent Successfully");

      console.log(error);
    }
  };

  useEffect(() => {
    if (showModelOutput) {
      getData();
    }
  }, [showModelOutput]);

  return (
    <>
      <div className="Crane2 inputFields">
        <DynamicHeading
          className="forMobile"
          initialContent="Wagon against Wagon 2 shock absorber"
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
                  onChange={handleV1Change}
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
                  v<sub>1</sub>
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
                <div>
                  <FormControl
                    variant="outlined"
                    className="fromMobile"
                    autoComplete="off"
                  >
                    <Autocomplete
                      onChange={handleSChange}
                      id="controllable-states-demo"
                      options={option}
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

                  <FormControl variant="outlined" className="fromMobile">
                    <OutlinedInput
                      id="outlined-adornment-weight"
                      onChange={handleV2Change}
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
                      v<sub>2</sub>
                    </FormHelperText>
                  </FormControl>

                  <FormControl variant="outlined" className="fromMobile">
                    <OutlinedInput
                      id="outlined-adornment-weight"
                      onChange={handleM2Change}
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
                      m<sub>2</sub>
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
                      onChange={handleAbsorberChange}
                      options={option2}
                      name="shockAbsorber"
                      // value={contact.shockAbsorber}
                      // sx={{ width: 480, marginLeft: "8px", marginRight: "8px" }}
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
                      name="shockAbsorber"
                      // value={contact.shockAbsorber}
                      // sx={{ width: 480, marginLeft: "8px", marginRight: "8px" }}
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

                <div className="btn">
                  <button onClick={handleCalculate}>Calculate</button>
                </div>
              </div>
              <div className="model">
                {/* <Textarea
                  name="model"
                  aria-label="minimum height"
                  minRows={17}
                  placeholder="Model"
                  readOnly={true}
                  // value={top5ModelNames.join(",  ")}'
                  className="fromMobile"
                  style={{ caretColor: "transparent" }}
                  // onChange={handleTextareaChange}
                /> */}

                {top5ModelNames.map((model, index) => (
                  <button key={index} className="model-button">
                    {model}
                  </button>
                ))}
              </div>
            </div>
          </Box>
        </div>

        {/* Form submission */}

        <div className="form">
          <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <TextField
              type="text"
              name="username"
              id="username"
              required
              autoComplete="off"
              // value={contact.username}
              label="Enter your name"
              variant="outlined"
              className="input"
              onChange={handleInput}
            />

            <TextField
              type="email"
              name="email"
              id="email"
              required
              autoComplete="off"
              // value={contact.email}
              label="Enter your Email"
              variant="outlined"
              className="input"
              onChange={handleInput}
            />

            <TextField
              type="number"
              name="phone"
              id="phone"
              required
              autoComplete="off"
              // value={contact.phone}
              label="Enter your Phone Number"
              variant="outlined"
              className="input"
              onChange={handleInput}
            />

            <TextField
              type="text"
              name="company"
              id="company"
              required
              autoComplete="off"
              // value={contact.company}
              label="Enter your Co Name"
              variant="outlined"
              className="input"
              onChange={handleInput}
            />

            <div className="submitBtn">
              <button type="submit">Submit</button>
            </div>
          </Box>
        </div>
      </div>
    </>
  );
};