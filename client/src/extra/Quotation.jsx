import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const Quotation = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);

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

  // const handleDownloadPDF = () => {
  //   const button = document.querySelector(".btn button");
  //   button.style.display = "none"; // Hide the button temporarily

  //   const element = document.querySelector(".quotation");
  //   const scrollHeight = element.scrollHeight;
  //   const scrollWidth = element.scrollWidth; // Get the scrollable width as well
  //   element.scrollTo(0, scrollHeight);
  //   element.scrollTo(0, scrollWidth);
  //   html2canvas(element, { width: scrollWidth, height: scrollHeight }).then(
  //     (canvas) => {
  //       button.style.display = "block"; // Restore the button's display property
  //       const imgData = canvas.toDataURL("image/png");

  //       const pdf = new jsPDF({
  //         orientation: "p",
  //         unit: "mm",
  //         format: [scrollWidth, scrollHeight], // Set PDF size to match canvas size
  //         putOnlyUsedFonts: true,
  //       });
  //       const imgWidth = pdf.internal.pageSize.getWidth();
  //       let imgHeight = (canvas.height * imgWidth) / canvas.width;
  //       imgHeight += 1.2;

  //       pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  //       pdf.save("quotation.pdf");
  //     }
  //   );
  // };
  const { model, shockAbsorber, price, front, rear, foot } = userData;
  const prices = price + front + rear + foot;
  const rows = [
    {
      model: model,
      Quantity: shockAbsorber,
      Price: prices,
      Amount: shockAbsorber * prices,
      front,
      rear,
      foot,
    },
  ];
  const [Amount] = rows.map((row) => row.Amount);
  const gst = Math.round(Amount * 0.18);
  const total = Amount + gst;
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
            <div className="md:w-[33%]">
              <h2 className="font-medium text-xl">Quotation by</h2>
              <p className="my-2">adoniTech</p>
            </div>
            <div className="md:w-[33%]">
              <h2 className="font-medium text-xl">Quotation to</h2>
              <p className="my-2">Company: {userData.company}</p>
              <p className="my-2">Name: {userData.username}</p>
              <p className="my-2">Email: {userData.email}</p>
              <p className="mb-8">Contact:{userData.phone}</p>
            </div>
            <div className="md:w-[33%] flex flex-col gap-2">
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
                <p>{`₹ ${price}`}</p>
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
        <TableContainer className="mt-[4%] " component={Paper}>
          <Table sx={{ minWidth: 750 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="right">Model</TableCell>
                <TableCell align="right">Front Flange</TableCell>
                <TableCell align="right">Rear Flange</TableCell>
                <TableCell align="right">Foot Mounting</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Quantity</TableCell>

                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.model}
                  sx={{ "&:last-child td, &:last-child th": { border: 1 } }}
                >
                  <TableCell align="right">{row.model}</TableCell>
                  <TableCell align="right">{`₹ ${row.front}`}</TableCell>
                  <TableCell align="right">{`₹ ${row.rear}`}</TableCell>
                  <TableCell align="right">{`₹ ${row.foot}`}</TableCell>
                  <TableCell align="right">{`₹ ${row.Price}`}</TableCell>
                  <TableCell align="right">{row.Quantity}</TableCell>

                  <TableCell align="right">{`₹ ${row.Amount}`}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer>
          <Table className="border-2">
            <TableBody>
              {/* <TableRow>
                <TableCell colSpan={2}>Amount</TableCell>
                <TableCell align="right">{`₹ ${Amount}`}</TableCell>
              </TableRow> */}
              <TableRow>
                <TableCell colSpan={2}>Gst 18%</TableCell>
                <TableCell align="right">{`₹ ${gst}`}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell align="right">{`₹ ${total}`}</TableCell>
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
            justify-content: space-between;
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
