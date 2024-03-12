// PricePage.js

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import "./ModelPricesPage.scss";
// import PropTypes from "prop-types";

const PricePage = () => {
  const { modelName } = useParams();
  const [prices, setPrices] = useState({});

  const navigate = useNavigate();

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
        }
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    };

    fetchPrices();
  }, [modelName]);

  // const handleDownloadPDF = () => {
  //   const button = document.querySelector(".btn button");
  //   button.style.display = "none"; // Hide the button temporarily

  //   const element = document.querySelector(".prices");

  //   html2canvas(element).then((canvas) => {
  //     button.style.display = "block"; // Restore the button's display property
  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF();
  //     const imgWidth = pdf.internal.pageSize.getWidth();
  //     const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //     pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  //     pdf.save("quotation.pdf");
  //   });
  // };
  const { Model, NEWPRICE } = prices;

  const totalPrices =
    (!isNaN(parseFloat(prices.NEWPRICE)) ? parseFloat(prices.NEWPRICE) : 0) +
    (!isNaN(parseFloat(prices["Front Flange"]))
      ? parseFloat(prices["Front Flange"])
      : 0) +
    (!isNaN(parseFloat(prices["Rear Flange"]))
      ? parseFloat(prices["Rear Flange"])
      : 0) +
    (!isNaN(parseFloat(prices["Foot Mounting"]))
      ? parseFloat(prices["Foot Mounting"])
      : 0);

  const rows = [
    {
      Model: Model,
      NEWPRICE: NEWPRICE,
      Front: prices["Front Flange"],
      Rear: prices["Rear Flange"],
      Foot: prices["Foot Mounting"],
      total: totalPrices,
    },
  ];

  const handleNextButtonClick = () => {
    // Store shock absorber value in local storage
    localStorage.setItem("model", modelName);

    // Navigate to the next page
    navigate(`/price/${modelName}/info`);
  };

  return (
    <div className="prices">
      <h2>Price Details</h2>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 750 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Model</TableCell>
              <TableCell align="right">NewPrice</TableCell>
              <TableCell align="right">Front Flange</TableCell>
              <TableCell align="right">Rear Flange</TableCell>
              <TableCell align="right">Foot Mounting</TableCell>
              <TableCell align="right">Total Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.Model}
                </TableCell>
                <TableCell align="right">{row.NEWPRICE}</TableCell>
                <TableCell align="right">{row.Front}</TableCell>
                <TableCell align="right">{row.Rear}</TableCell>
                <TableCell align="right">{row.Foot}</TableCell>
                <TableCell align="right">{row.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="btn">
        <button onClick={handleNextButtonClick}>Next</button>
      </div>
    </div>
  );
};

export default PricePage;

// PricePage.propTypes = {
//   modelName: PropTypes.string,
// };
