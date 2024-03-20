import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const UserDetails = () => {
  const { modelName } = useParams();
  const navigate = useNavigate();
  const totalPrice = useSelector((state) => state.data.totalPrice);
  const spare = useSelector((state) => state.data.spare);
  const shockAbsorber = useSelector((state) => state.data.shockAbsorber);
  const series = useSelector((state) => state.data.data.series);
  const originalPrice = useSelector((state) => state.data.data.NEWPRICE);
  const currency = useSelector((state) => state.data.currency);
  const addAdditionalPriceData = useSelector(
    (state) => state.data.addAdditionalPriceData
  );
  console.log(originalPrice);
  const defaultContactFormData = {
    username: "",
    email: "",
    phone: "",
    company: "",
  };
  const [contact, setContact] = useState(defaultContactFormData);
  const [currentModelName, setCurrentModelName] = useState("");

  useEffect(() => {
    setCurrentModelName(modelName);
  }, []);

  console.log(spare);
  const handleInput = (e) => {
    // console.log(e);

    let name = e.target.name;
    let value = e.target.value;
    setContact({
      ...contact,
      [name]: value,
    });
  };

  const handleSubmit = async (e, modelName) => {
    e.preventDefault();
    console.log(modelName);
    try {
      // Retrieve model name from local storage
      const formData = {
        ...contact,
        shockAbsorber: shockAbsorber,
        model: currentModelName,
        price: totalPrice,
        spare: spare,
        series: series,
        originalPrice: originalPrice,
        currency: currency,
        AdditionalAccessories: addAdditionalPriceData,
        // section: content,
        // type: selectedType,
      };

      const response = await fetch(
        "https://calculation.cranebuffer.com/api/form/contact",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      console.log(response);
      if (response.ok) {
        const data = await response.json();
        setContact(defaultContactFormData);
        const userId = data.createdContact._id;
        navigate(`/price/${modelName}/info/${userId}/technical`);
        alert("Message sent successfully");
        // Clear local storage keys after successful submission
      } else {
        throw new Error("Failed to send message"); // Throw an error to trigger the catch block
      }
    } catch (error) {
      alert("Message not sent Successfully");

      console.log(error);
    }
  };

  return (
    <>
      <div className="form  ">
        <Box
          className="  flex  flex-col  gap-4 p-4"
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={(e) => handleSubmit(e, modelName)}
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
            className="input "
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

          <button
            className="submitBtn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-[auto] "
            type="submit"
          >
            Submit
          </button>
        </Box>
      </div>
    </>
  );
};
export default UserDetails;
