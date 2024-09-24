import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-8">Payment Gateway Practice</h1>
      <div className="space-y-4">
        <Link href="/stripe" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-block w-48 text-center">
          Stripe Payment
        </Link>
        <Link href="/razorpay" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-block w-48 text-center">
          Razorpay Payment
        </Link>
      </div>
    </div>
  )
}