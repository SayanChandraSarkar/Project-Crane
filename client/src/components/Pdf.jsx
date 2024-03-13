import React from 'react'

const Pdf = () => {
    const handleprint = () => {
        window.print();
    }
    
    
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
          <div className="w-[100%] flex  gap-[8%] md:flex-row">
            <div>
              <h2 className="font-medium text-xl">Quotation by</h2>
              <p className="my-2">adoniTech</p>
              <p className="mb-8">
                Sharda, 1st floor, Jeevan Chaya Housing Society, Opp. Civil
                Hospital, Satara 415001. India.
              </p>
            </div>
            <div className="">
              <h2 className="font-medium text-xl">Quotation to</h2>
              <p className="my-2">Company: domething</p>
              <p className="my-2">Name: fhaaag</p>
              <p className="my-2">Email: everything</p>
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
                <p>82782</p>
              </div>
              <div className="flex gap-2 md:justify-between">
                <h2 className="font-medium">Due Date:</h2>
                <p>0978</p>
              </div>
              <div className="flex gap-2 md:justify-between">
              <h2 className="font-medium">Model:</h2>
              <p>something</p>
            </div>
            <div className="flex gap-2 md:justify-between">
              <h2 className="font-medium">shockAbsorber:</h2>
              <p>2</p>
            </div>
            </div>
          </div>
        </div>
        <button onClick={handleprint}>Print</button>
       
      </div>
    
    </>
  )
}

export default Pdf