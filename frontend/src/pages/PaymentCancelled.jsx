import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const PaymentCancelled = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <AlertTriangle className="mx-auto text-amber-500 mb-4" size={64} />
      <h1 className="text-2xl font-bold mb-2">Payment Cancelled</h1>
      <p className="text-gray-600 mb-8">
        You cancelled the payment process. Your booking has not been confirmed.
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

export default PaymentCancelled;
