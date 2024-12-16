// 'use client';

// import React, { useState } from 'react';
// import { Button } from 'components/ui/button'; 
// import { useUserData } from 'components/hooks/useUserData';
// import  WebApp  from '@twa-dev/sdk';
// import { Loader } from 'lucide-react';

// const SendInvoicePage = () => {
//   const [loading, setLoading] = useState(false);
//   const [invoiceLink, setInvoiceLink] = useState(null); 
//   const { userData, error, userId } = useUserData();

//   const handleSendInvoice = async (candidate) => {
//     setLoading(true);

//     try {
//       const telegramId = userId; 
//       const response = await fetch('/api/send-invoice', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ telegramId, candidate }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         setInvoiceLink(data.link); // Save the invoice link
//         WebApp.openInvoice(invoiceLink, (status) => {
//           if (status === "paid") {
//             WebApp.showAlert("Payment Successful")
//           }
//         });
//       } else {
//         alert(`Failed to create invoice: ${data.error}`);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       alert('Something went wrong!');
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-xl mb-4">Vote for Your Favorite Candidate</h1>
//       <div className="flex flex-col gap-2">
//         <Button onClick={() => handleSendInvoice('Tomarket')} disabled={loading}>
//           {loading ? 
//           <>
//           <Loader className='animate-spin'/>
//           </> : 'Pay 1 XTR to Vote for Tomarket'}
//         </Button>
//         <Button onClick={() => handleSendInvoice('XEmpire')} disabled={loading}>
//           {loading ? <>
//           <Loader className='animate-spin'/>
//           </> : 'Pay 1 XTR to Vote for X Empire'}
//         </Button>
//         <Button onClick={() => handleSendInvoice('DuckChain')} disabled={loading}>
//           {loading ? <>
//           <Loader className='animate-spin'/>
//           </> : 'Pay 1 XTR to Vote for DuckChain'}
//         </Button>
//       </div>
//       {invoiceLink && (
//         <div className="mt-4">
//           <p className="text-green-500">Invoice created! Open it using the link below:</p>
//           <a href={invoiceLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
//             {invoiceLink}
//           </a>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SendInvoicePage;
import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page