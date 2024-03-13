import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const UserDetails = () => {
  const { modelName } = useParams();
  const navigate = useNavigate();
  const defaultContactFormData = {
    username: "",
    email: "",
    phone: "",
    company: "",
  };
  const [contact, setContact] = useState(defaultContactFormData);

  const handleInput = (e) => {
    // console.log(e);

    let name = e.target.name;
    let value = e.target.value;
    setContact({
      ...contact,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const shockAbsorber = localStorage.getItem("shockAbsorber");
      // Retrieve model name from local storage
      const model = localStorage.getItem("model");
      const price = localStorage.getItem("price");
      const front = localStorage.getItem("Front");
      const rear = localStorage.getItem("Rear");
      const foot = localStorage.getItem("Foot");
      console.log(shockAbsorber);
      console.log(model);
      console.log(front);
      console.log(rear);
      console.log(foot);
      const formData = {
        ...contact,
        shockAbsorber: shockAbsorber,
        model: model,
        price: price,
        front: front,
        rear: rear,
        foot: foot,
        // section: content,
        // type: selectedType,
      };
      console.log(formData);
      const response = await fetch("http://localhost:5000/api/form/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      console.log(response);
      if (response.ok) {
        const data = await response.json();
        setContact(defaultContactFormData);
        const userId = data.createdContact._id;
        navigate(`/price/${modelName}/info/quotation/${userId}`);
        alert("Message sent successfully");
        // Clear local storage keys after successful submission
        localStorage.removeItem("shockAbsorber");
        localStorage.removeItem("model");
        localStorage.removeItem("price");
        localStorage.removeItem("Front");
        localStorage.removeItem("Rear");
        localStorage.removeItem("Foot");
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
