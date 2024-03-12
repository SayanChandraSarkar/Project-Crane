import React from 'react'

const Quotation = () => {
  return (
    <>
    <div className='p-4' >
        <div className='h-[10vh] w-[100%] flex justify-between items-center'>
            <div>
                <img className='w-[80%]' src='/images/logo.png'/>
            </div>
            <div>
                <h2 className='text-3xl font-medium'>Quotation</h2>

            </div>

        </div>
        <div className='w-[100%] flex flex-col gap-[8%] md:flex-row'>
            <div>
                <h2 className='font-medium'>Quotation by</h2>
                <p className='my-2'>adoniTech</p>
                <p className='mb-8'>Sharda, 1st floor, Jeevan Chaya Housing Society, Opp. Civil Hospital, Satara 415001. India.</p>

            </div>
            <div className=''>
                <h2 className='font-medium'>Quotation to</h2>
                <p className='my-2'>adoniTech</p>
                <p className='mb-8'>Sharda, 1st floor, Jeevan Chaya Housing Society, Opp. Civil Hospital, Satara 415001. India.</p>
            </div>
            <div className='md:w-[40%] flex flex-col gap-2' >
                <div className='flex gap-2 md:justify-between'>
                <h2 className='font-medium'>Invoice No:</h2>
                <p>003</p>
                </div>
                <div className='flex gap-2 md:justify-between'>
                <h2 className='font-medium'>Invoive Date:</h2>
                <p>Feb 19,2020</p>
                </div>
                <div className='flex gap-2 md:justify-between'>
                <h2 className='font-medium'>Due Date:</h2>
                <p>Feb 19,2020</p>
                </div>
                <div className='flex gap-2 md:justify-between'>
                <h2 className='font-medium'>Country of supply:</h2>
                <p>India</p>
                </div>
                <div className='flex gap-2 md:justify-between'>
                <h2 className='font-medium'>Place of supply:</h2>
                <p>Satara</p>
                </div>
                
             
            </div>
        </div>

    </div>
    </>
  )
}

export default Quotation