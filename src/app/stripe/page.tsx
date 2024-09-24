'use client'

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Toaster, toast } from 'react-hot-toast';
import { ChevronDown, CheckCircle, XCircle } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const countries = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
  { code: 'PK', name: 'Pakistan' },
];

const StripeCheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setPaymentStatus('idle');

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (cardElement) {
      try {
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
          billing_details: {
            name: formData.name,
            email: formData.email,
            address: {
              line1: formData.address,
              city: formData.city,
              country: formData.country,
              postal_code: formData.postalCode,
            },
          },
        });

        if (error) {
          throw error;
        }

        console.log('Payment successful:', paymentMethod);
        setPaymentStatus('success');
        toast.success('Payment processed successfully!');
        setFormData(prev => ({
          ...prev,
          name: '',
          email: '',
          address: '',
          city: '',
          country: '',
          postalCode: '',
        }));
      } catch (error: any) {
        console.error('Payment failed:', error);
        setPaymentStatus('error');
        toast.error(error.message ?? 'An unknown error occurred');
      }
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white shadow-xl rounded-xl p-8">
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="col-span-2 sm:col-span-1">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="Full Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="col-span-2">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input
            id="address"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleInputChange}
            required
            placeholder="Address"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input
            id="city"
            name="city"
            type="text"
            value={formData.city}
            onChange={handleInputChange}
            required
            placeholder="City"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
          <div className="relative">
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>
        <div>
          <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
          <input
            id="postalCode"
            name="postalCode"
            type="text"
            value={formData.postalCode}
            onChange={handleInputChange}
            required
            placeholder="Postal Code"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="mb-8">
        <label htmlFor="card-element" className="block text-sm font-medium text-gray-700 mb-1">Card Details</label>
        <div className="border border-gray-300 p-4 rounded-lg bg-white shadow-sm">
          <CardElement id="card-element" options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }} />
        </div>
      </div>
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
      {paymentStatus !== 'idle' && (
        <div className={`mt-4 p-4 rounded-lg ${paymentStatus === 'success' ? 'bg-green-100' : 'bg-red-100'} flex items-center`}>
          {paymentStatus === 'success' ? (
            <>
              <CheckCircle className="text-green-500 mr-2" size={24} />
              <span className="text-green-700">Payment successful! Thank you for your purchase.</span>
            </>
          ) : (
            <>
              <XCircle className="text-red-500 mr-2" size={24} />
              <span className="text-red-700">Payment failed. Please try again or contact support.</span>
            </>
          )}
        </div>
      )}
    </form>
  );
};

const StripePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 flex flex-col justify-center items-center p-4">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Secure Payment</h1>
        <p className="text-gray-600">Complete your purchase securely with Stripe</p>
      </div>
      <Elements stripe={stripePromise}>
        <StripeCheckoutForm />
      </Elements>
      <p className="mt-8 text-sm text-gray-500">
        Powered by <span className="font-semibold">Stripe</span>
      </p>
    </div>
  );
};

export default StripePage;