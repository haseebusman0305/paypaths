'use client'

import { useState } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function RazorpayPage() {
  const [loading, setLoading] = useState(false)

  const handlePayment = () => {
    setLoading(true)

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: 50000, // Amount in paise (500 INR)
      currency: 'INR',
      name: 'Your Company Name',
      description: 'Test Transaction',
      handler: function (response: any) {
        console.log('Payment successful:', response)
        // Here you would typically verify the payment on your server
      },
      prefill: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#3399cc'
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <h1 className="text-3xl font-bold mb-8">Razorpay Payment</h1>
      <button
        onClick={handlePayment}
        disabled={loading}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-48 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Pay with Razorpay'}
      </button>
    </div>
  )
}