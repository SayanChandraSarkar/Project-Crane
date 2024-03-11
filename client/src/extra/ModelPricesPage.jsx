// PricePage.js

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import "./ModelPricesPage.scss";
// import PropTypes from "prop-types";

const PricePage = () => {
  const { modelName } = useParams();
  const [prices, setPrices] = useState({});

  useEffect(() => {
    // Fetch prices for the modelName from your API
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

          // Assuming data is an array of prices
          setPrices(data.price);
        }
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    };

    fetchPrices();
  }, [modelName]);

  const handleDownloadPDF = () => {
    const button = document.querySelector(".btn button");
    button.style.display = "none"; // Hide the button temporarily

    const element = document.querySelector(".prices");

    html2canvas(element).then((canvas) => {
      button.style.display = "block"; // Restore the button's display property
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("quotation.pdf");
    });
  };

  return (
    <div className="prices">
      <h2>Price Details</h2>
      <ul>
        <li>
          Model:<span className="model-name"> {prices.Model}</span>
        </li>
        {/* <li>
          Old Price: <span className="old-price">{prices.OLDPRICE}</span>
        </li> */}
        <li>
          New Price: <span className="new-price">{prices.NEWPRICE}</span>
        </li>
        <li>
          Front Flange:{" "}
          <span className="new-price">{prices["Front Flange"]}</span>
        </li>
        <li>
          Rear Flange:{" "}
          <span className="new-price">{prices["Rear Flange"]}</span>
        </li>
        <li>
          Foot Mounting:{" "}
          <span className="new-price">{prices["Foot Mounting"]}</span>
        </li>
        <li className="total-price">
          Total New Price:
          <span className="new-price">
            {(!isNaN(parseFloat(prices.NEWPRICE))
              ? parseFloat(prices.NEWPRICE)
              : 0) +
              (!isNaN(parseFloat(prices["Front Flange"]))
                ? parseFloat(prices["Front Flange"])
                : 0) +
              (!isNaN(parseFloat(prices["Rear Flange"]))
                ? parseFloat(prices["Rear Flange"])
                : 0) +
              (!isNaN(parseFloat(prices["Foot Mounting"]))
                ? parseFloat(prices["Foot Mounting"])
                : 0)}
          </span>
        </li>
      </ul>
      <div className="btn">
        <button onClick={handleDownloadPDF}>Get Your Quotation</button>
      </div>
    </div>
  );
};

export default PricePage;

// PricePage.propTypes = {
//   modelName: PropTypes.string,
// };
