import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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

  const handleDownloadPDF = () => {
    const button = document.querySelector(".btn button");
    button.style.display = "none"; // Hide the button temporarily

    const element = document.querySelector(".quotation");
    const scrollHeight = element.scrollHeight;
    const scrollWidth = element.scrollWidth; // Get the scrollable width as well
    element.scrollTo(0, scrollHeight);
    element.scrollTo(0, scrollWidth);
    html2canvas(element, { width: scrollWidth, height: scrollHeight }).then(
      (canvas) => {
        button.style.display = "block"; // Restore the button's display property
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF({
          orientation: "p",
          unit: "mm",
          format: [scrollWidth, scrollHeight], // Set PDF size to match canvas size
          putOnlyUsedFonts: true,
        });
        const imgWidth = pdf.internal.pageSize.getWidth();
        let imgHeight = (canvas.height * imgWidth) / canvas.width;
        imgHeight += 1.2;

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save("quotation.pdf");
      }
    );
  };
  return (
    <>
      <div className="p-4 quotation">
        <div className="">
          <div className="h-[10vh] w-[100%] flex justify-between ">
            <div>
              <img className="w-[80%]" src="/images/logo.png" />
            </div>
            <div>
              <h2 className="text-3xl font-medium">Quotation</h2>
            </div>
          </div>
          <div className="w-[100%] flex flex-col gap-[8%] md:flex-row">
            <div>
              <h2 className="font-medium">Quotation by</h2>
              <p className="my-2">adoniTech</p>
              <p className="mb-8">
                Sharda, 1st floor, Jeevan Chaya Housing Society, Opp. Civil
                Hospital, Satara 415001. India.
              </p>
            </div>
            <div className="">
              <h2 className="font-medium">Quotation to</h2>
              <p className="my-2">Company: {userData.company}</p>
              <p className="my-2">Name: {userData.username}</p>
              <p className="my-2">Email: {userData.email}</p>
              <p className="mb-8">
                Sharda, 1st floor, Jeevan Chaya Housing Society, Opp. Civil
                Hospital, Satara 415001. India.
              </p>
            </div>
            <div className="md:w-[40%] flex flex-col gap-2">
              <div className="flex gap-2 md:justify-between">
                <h2 className="font-medium">Invoice No:</h2>
                <p>003</p>
              </div>
              <div className="flex gap-2 md:justify-between">
                <h2 className="font-medium">Invoive Date:</h2>
                <p>{formattedDate}</p>
              </div>
              <div className="flex gap-2 md:justify-between">
                <h2 className="font-medium">Due Date:</h2>
                <p>{formattedDate}</p>
              </div>
              {/* <div className="flex gap-2 md:justify-between">
              <h2 className="font-medium">Country of supply:</h2>
              <p>India</p>
            </div>
            <div className="flex gap-2 md:justify-between">
              <h2 className="font-medium">Place of supply:</h2>
              <p>Satara</p>
            </div> */}
            </div>
          </div>
        </div>

        <div className="btn mt-8">
          <button
            onClick={handleDownloadPDF}
            className="submitBtn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-[auto]"
          >
            Get Quotation
          </button>
        </div>
      </div>
    </>
  );
};

export default Quotation;
