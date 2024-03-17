import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
// import { useSelector } from "react-redux";

const Quotation = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);

  // console.log(kineticEnergy);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/data/quotation/${userId}`
        ); // Fetch user data using the user ID
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        // console.log(data.user.username);
        setUserData(data.user); // Set the fetched user data in state
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [userId]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  //Todays date
  const today = new Date();

  // Extract the day, month, and year from the Date object
  const day = today.getDate();
  const month = today.toLocaleString("default", { month: "short" });
  const year = today.getFullYear();

  // Create a string representing the formatted date
  const formattedDate = `${month} ${day}, ${year}`;

  const {
    model,
    shockAbsorber,
    price,
    series,
    spare,
    currency,
    // originalPrice,
  } = userData;
  const prices = price;
  const rows = [
    {
      model: model,
      Quantity: shockAbsorber,
      Price: prices,
      Series: series,
      Amount: shockAbsorber * prices,
      Spare: spare,
      // OriginalPrice: originalPrice,
    },
  ];

  console.log(shockAbsorber);
  console.log(prices);
  console.log(model);
  console.log(series);
  console.log(spare);

  const [Amount] = rows.map((row) => row.Amount);
  const gst = Math.round(Amount * 0.18);
  const freight = Math.round(Amount * 0.02);
  const total = Amount + gst + freight;
  const [spareQnt] = rows.map((row) => row.Spare.quantity);
  // const originalPrice = console.log();
  console.log(Amount);
  console.log(spareQnt);
  return (
    <>
      <div className="p-4 quotation">
        <div className="">
          <div className="h-[10vh] w-[100%] flex justify-between ">
            <div>
              <img className="w-[100%]" src="/images/logo.png" />
            </div>
            <div>
              <h2 className="text-xl font-medium">Quotation</h2>
            </div>
          </div>
          <div className="quotation-by-section w-[100%] flex flex-col  gap-[8%] md:flex-row">
            <div className="md:w-[33%] ">
              <h2 className="font-medium text-xl">Quotation by</h2>
              <p className="my-2">adoniTech</p>
              <p className="mb-2 address">
                SLU - W - 39, Addl; MIDC, Kodoli, Satara - 415004. MH. 
              </p>
              <span className="mb-8 address">
                <p className="">GSTN:</p>
                <p className="">27AHAPA3555B1Z1</p>
              </span>
            </div>
            <div className="md:w-[33%] w-[65%]">
              <h2 className="font-medium text-xl">Quotation to</h2>
              <p className="my-2">Company: {userData.company}</p>
              <p className="my-2">Name: {userData.username}</p>
              <p className="my-2">Email: {userData.email}</p>
              <p className="mb-8">Contact:{userData.phone}</p>
            </div>
            <div className="md:w-[33%] w-[70%] flex flex-col gap-2">
              <div className="flex gap-2 md:justify-between">
                <h2 className="font-medium">Invoive Date:</h2>
                <p>{formattedDate}</p>
              </div>
              <div className="flex gap-2 md:justify-between">
                <h2 className="font-medium">Model:</h2>
                <p>{model}</p>
              </div>

              <div className="flex gap-2 md:justify-between">
                <h2 className="font-medium">price:</h2>
                <p> {currency === "INR" ? `₹ ${price}` : `$ ${price / 80}`}</p>
              </div>
              <div className="flex gap-2 md:justify-between">
                <h2 className="font-medium">shockAbsorber:</h2>
                <p>{shockAbsorber}</p>
              </div>
            </div>
          </div>
        </div>
        {/* <table border="" className="border-2">
          <tr>
            <th>Model Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Amount</th>
          </tr>
          <tr>
            <td>{userData.model}</td>
            <td>{userData.shockAbsorber}</td>
            <td>{userData.price}</td>
            <td>{userData.shockAbsorber * userData.price}</td>
          </tr>
        </table> */}
        <TableContainer className="mt-[10%] " component={Paper}>
          <Table sx={{ minWidth: 400 }} aria-label="simple table">
            <TableHead>
              <TableRow
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: "1px solid rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                <TableCell align="right">Sl</TableCell>
                <TableCell align="right">Item</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                "&:last-child td, &:last-child th": {
                  border: "1px solid rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              {rows.map((row, index) => (
                <Fragment key={row.model}>
                  <TableRow>
                    <TableCell align="right">{index + 1}</TableCell>
                    <TableCell align="right">{row.Series}</TableCell>
                    <TableCell align="right">{row.Quantity}</TableCell>
                    <TableCell align="right">{`₹ ${row.Price}`}</TableCell>
                  </TableRow>
                  {row.Spare.map((spareItem, spareIndex) => (
                    <TableRow key={spareItem._id.$oid}>
                      <TableCell align="right">
                        {index + 1 + spareIndex + 1}
                      </TableCell>
                      <TableCell align="right">{spareItem.name}</TableCell>
                      <TableCell align="right">{spareItem.quantity}</TableCell>
                      <TableCell align="right">{`₹ ${spareItem.price}`}</TableCell>
                    </TableRow>
                  ))}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer>
          <Table className="border-2">
            <TableBody>
              <TableRow>
                <TableCell colSpan={2}>Amount</TableCell>
                <TableCell align="right">{`₹ ${Amount}`}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>Gst 18%</TableCell>
                <TableCell align="right">{`₹ ${gst}`}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>Freight 2%</TableCell>
                <TableCell align="right">{`₹ ${freight}`}</TableCell>
              </TableRow>
              <TableRow className="border-t-4   border-gray-300">
                <TableCell colSpan={2} className="!font-medium ">
                  Total
                </TableCell>
                <TableCell
                  align="right"
                  className="!text-green-600 !font-semibold"
                >{`₹ ${total}`}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <div className="btn mt-8">
          <button
            onClick={() => {
              window.print();
            }}
            className="submitBtn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-[auto]"
          >
            Get Quotation
          </button>
        </div>
      </div>

      <style>{`
        @media print {
          .quotation-by-section {
            display: flex;
            flex-direction: row;
           
            

          }
          .address{
            width:65%;
          }
          .submitBtn{
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default Quotation;
