import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const PaymentFailed = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <XCircle className="mx-auto text-red-500 mb-4" size={64} />
      <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
      <p className="text-gray-600 mb-8">
        Something went wrong while processing your payment. Please try again.
      </p>
      <Link
        to="/"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default PaymentFailed;
