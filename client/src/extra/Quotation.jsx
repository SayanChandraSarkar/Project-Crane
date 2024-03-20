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
  // const modelprice = useSelector((state) => state.data.price);
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);

  // console.log(kineticEnergy);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://calculation.cranebuffer.com/api/data/quotation/${userId}`
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
    // price,
    series,
    spare,
    currency,
    originalPrice,
    AdditionalAccessories,
  } = userData;
  const originalPrices = originalPrice;
  const rows = [
    {
      model: model,
      Quantity: shockAbsorber,
      Price: originalPrices,
      Series: series,
      // Amount: shockAbsorber * originalPrice,
      Spare: spare,
      // OriginalPrice: originalPrice,

      AdditionalAccessories: AdditionalAccessories,
    },
  ];

  console.log(shockAbsorber);
  console.log(originalPrice);
  console.log(model);
  console.log(series);
  console.log(AdditionalAccessories);

  // const [Amount] = rows.map((row) => row.Amount);

  // const spareAmount = rows.map((row) =>
  //   row.Spare.map((spare) => spare.price * spare.quantity)
  // );
  // console.log(spareAmount);
  const totalSpareAmount = rows.reduce(
    (total, row) =>
      total +
      row.Spare.reduce((subtotal, spareItem) => {
        const itemTotal = spareItem.price * spareItem.quantity;
        console.log(subtotal);
        console.log(itemTotal);
        return subtotal + itemTotal;
      }, 0),
    0
  );

  const totalPrice = rows.reduce((total, row) => {
    const itemTotal = row.Price * row.Quantity;
    return total + itemTotal;
  }, 0);

  const Amount = totalSpareAmount + totalPrice;

  const freight = Math.round(Amount * 0.02);
  const amountFreight = Amount + freight;
  const gst = Math.round(amountFreight * 0.18);
  const total = Amount + gst + freight;
  const totalUsd = total - gst - freight;
  console.log(total);
  console.log(totalUsd);
  console.log(Amount);

  const packaging = Math.round(Amount * 0.02);
  const totalPack = Amount + packaging;
  console.log(gst);
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
              <span className="mb-8 flex">
                <p className="mr-2">GSTN:</p>
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
                <p>
                  {" "}
                  {currency === "INR"
                    ? `₹ ${originalPrice}`
                    : `$ ${originalPrice / 80}`}
                </p>
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
              {/* {rows.map((row, index) => {
                // Calculate the total price for the current row
                const totalPriceForRow = row.Price * row.Quantity;

                return (
                  <Fragment key={row.model}>
                    <TableRow>
                      <TableCell align="right">{index + 1}</TableCell>
                      <TableCell align="right">{row.Series}</TableCell>
                      <TableCell align="right">{row.Quantity}</TableCell>
                      <TableCell align="right">
                        {currency === "INR"
                          ? `₹ ${totalPriceForRow}`
                          : `$ ${totalPriceForRow / 80}`}
                      </TableCell>
                    </TableRow>
                    {row.Spare.map((spareItem, spareIndex) => {
                      const totalSparePrice =
                        spareItem.price * spareItem.quantity;
                      return (
                        <TableRow key={spareItem._id.$oid}>
                          <TableCell align="right">
                            {index + 1 + spareIndex + 1}
                          </TableCell>
                          <TableCell align="right">{spareItem.name}</TableCell>
                          <TableCell align="right">
                            {spareItem.quantity}
                          </TableCell>
                          <TableCell align="right">
                            {currency === "INR"
                              ? `₹ ${totalSparePrice}`
                              : `$ ${totalSparePrice / 80}`}
                          </TableCell>
                        </TableRow>
                      );
                    })}

                    {row.AdditionalAccessories.map(
                      (accessory, accessoryIndex, spareIndex) => {
                        const totalAccessoryPrice =
                          accessory.price * accessory.quantity;

                        return (
                          <TableRow key={accessory.name}>
                            <TableCell align="right">
                              {index + 1 + spareIndex + 1 + accessoryIndex + 1}
                            </TableCell>
                            <TableCell align="right">
                              {accessory.name}
                            </TableCell>
                            <TableCell align="right">
                              {accessory.quantity}
                            </TableCell>
                            <TableCell align="right">
                              {currency === "INR"
                                ? `₹ ${totalAccessoryPrice}`
                                : `$ ${totalAccessoryPrice / 80}`}
                            </TableCell>
                          </TableRow>
                        );
                      }
                    )}
                  </Fragment>
                );
              })} */}

              {rows.map((row, index) => {
                // Calculate the total price for the current row
                const totalPriceForRow = row.Price * row.Quantity;

                // Check if the first row is 'ED', 'EI', or 'SB'
                const isFirstRowSpecial = ["ED", "EI", "SB"].includes(
                  row.Series
                );

                let serialNumber = index + 1; // Initialize serial number for the current row

                return (
                  <Fragment key={row.model}>
                    <TableRow>
                      <TableCell align="right">{serialNumber}</TableCell>
                      <TableCell align="right">{row.Series}</TableCell>
                      <TableCell align="right">{row.Quantity}</TableCell>
                      <TableCell align="right">
                        {currency === "INR"
                          ? `₹ ${totalPriceForRow}`
                          : `$ ${totalPriceForRow / 80}`}
                      </TableCell>
                    </TableRow>
                    {isFirstRowSpecial && row.Spare.length > 0 && (
                      <>
                        {row.Spare.map((spareItem) => {
                          const totalSparePrice =
                            spareItem.price * spareItem.quantity;
                          serialNumber++;

                          return (
                            <TableRow key={serialNumber}>
                              <TableCell align="right">
                                {serialNumber}
                              </TableCell>
                              <TableCell align="right">
                                {spareItem.name}
                              </TableCell>
                              <TableCell align="right">
                                {spareItem.quantity}
                              </TableCell>
                              <TableCell align="right">
                                {currency === "INR"
                                  ? `₹ ${totalSparePrice}`
                                  : `$ ${totalSparePrice / 80}`}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </>
                    )}
                    {isFirstRowSpecial &&
                      row.AdditionalAccessories.length > 0 && (
                        <>
                          {row.AdditionalAccessories.map((accessory) => {
                            serialNumber++;

                            return (
                              <TableRow key={serialNumber}>
                                <TableCell align="right">
                                  {serialNumber}
                                </TableCell>
                                <TableCell align="right">
                                  {accessory.name}
                                </TableCell>
                                <TableCell align="right">
                                  {accessory.quantity}
                                </TableCell>
                                <TableCell align="right">N/A</TableCell>
                              </TableRow>
                            );
                          })}
                        </>
                      )}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer>
          <Table className="border-2">
            <TableBody>
              <TableRow>
                <TableCell colSpan={2}>Amount</TableCell>
                <TableCell align="right">
                  {currency === "INR" ? `₹ ${Amount}` : `$ ${Amount / 80}`}
                </TableCell>
              </TableRow>
              {currency !== "USD" && (
                <TableRow>
                  <TableCell colSpan={2}>Freight 2%</TableCell>
                  <TableCell align="right">
                    {currency === "INR" ? `₹ ${freight}` : `$ ${freight / 80}`}
                  </TableCell>
                </TableRow>
              )}

              {currency !== "USD" && (
                <TableRow>
                  <TableCell colSpan={2}>Gst 18%</TableCell>
                  <TableCell align="right">{`₹ ${gst}`}</TableCell>
                </TableRow>
              )}

              {currency == "USD" && (
                <TableRow>
                  <TableCell colSpan={2}>Packaging 2%</TableCell>
                  <TableCell align="right">
                    {currency === "INR"
                      ? `₹ ${packaging}`
                      : `$ ${packaging / 80}`}
                  </TableCell>
                </TableRow>
              )}

              <TableRow className="border-t-4   border-gray-300">
                <TableCell colSpan={2} className="!font-medium ">
                  Total
                </TableCell>

                {currency === "INR" ? (
                  <TableCell
                    align="right"
                    className="!text-green-600 !font-semibold"
                  >
                    {`₹ ${total}`}
                  </TableCell>
                ) : (
                  <TableCell
                    align="right"
                    className="!text-green-600 !font-semibold"
                  >
                    {currency === "INR"
                      ? `₹ ${totalPack}`
                      : `$ ${totalPack / 80}`}
                  </TableCell>
                )}
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
