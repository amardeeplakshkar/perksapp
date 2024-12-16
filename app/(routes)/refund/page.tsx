'use client';

import React, { useState } from 'react';
import { Button } from 'components/ui/button'; 
import { Loader } from 'lucide-react';

const SendInvoicePage = () => {
  const [loading, setLoading] = useState(false);
  const [paymentId, setPaymentId] = useState(''); // State for input value

  const handleSendInvoice = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/refund-stars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentId }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Payment Done");
      } else {
        alert(`Failed to Refund: ${data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong!');
    }

    setLoading(false);
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Enter Payment ID"
        value={paymentId} 
        onChange={(e) => setPaymentId(e.target.value)} 
        className="border border-gray-300 rounded text-black p-2 w-full"
      />
      <Button 
        onClick={handleSendInvoice} 
        className="mt-4 w-full" 
        disabled={loading || !paymentId} 
      >
        {loading ? <Loader className="animate-spin" /> : 'Submit'}
      </Button>
    </div>
  );
};

export default SendInvoicePage;
