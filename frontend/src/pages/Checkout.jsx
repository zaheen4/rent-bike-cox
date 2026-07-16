import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { CreditCard } from 'lucide-react';

const formatDateTime = (date) => {
  const d = new Date(date);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
};

const Checkout = () => {
  const { bikeId } = useParams();
  const [bike, setBike] = useState(null);
  const [settings, setSettings] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    const fetchBike = async () => {
      try {
        const [bikeRes, settingsRes] = await Promise.all([
          api.get(`/dashboard/bikes/${bikeId}`),
          api.get('/dashboard/settings')
        ]);
        setBike(bikeRes.data);
        setSettings(settingsRes.data);
        const now = new Date();
        const later = new Date(now.getTime() + 5 * 60 * 60 * 1000);
        setStartTime(formatDateTime(now));
        setEndTime(formatDateTime(later));
      } catch (err) {
        console.error(err);
      }
    };
    fetchBike();
  }, [bikeId]);

  useEffect(() => {
    if (!startTime || !endTime) return;
    const createBooking = async () => {
      try {
        setError('');
        const res = await api.post('/booking', {
          bikeId,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          couponCode,
          packageName: selectedPackage || undefined
        });
        setBookingData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to create booking');
        setBookingData(null);
      }
    };
    createBooking();
  }, [startTime, endTime, couponCode, selectedPackage, bikeId]);

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg.name);
    const now = new Date();
    let end;
    if (pkg.name === '1 Day') {
      end = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    } else if (pkg.name === '2 Days') {
      end = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    } else if (pkg.name === '1 Week') {
      end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    }
    setStartTime(formatDateTime(now));
    setEndTime(formatDateTime(end));
  };

  const handleCustomDuration = () => {
    setSelectedPackage('');
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      const response = await api.post('/payment/init', {
        bookingId: bookingData.booking._id
      });
      if (response.data.url) {
        window.location.replace(response.data.url);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment initialization failed');
      setLoading(false);
    }
  };

  const formatDisplayDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-BD', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  if (!bike) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        {/* Bike Info */}
        <div className="border-b pb-4">
          <h2 className="text-xl font-bold">{bike.model}</h2>
          <p className="text-gray-600">{bike.brand} - {bike.category}</p>
          <p className="text-blue-600 font-semibold mt-1">{bike.pricePerHour} TK / Hour</p>
        </div>

        {/* Package Selection */}
        {settings?.packages?.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select a Package (optional)</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {settings.packages.map((pkg) => (
                <button
                  key={pkg.name}
                  onClick={() => handlePackageSelect(pkg)}
                  className={`p-3 rounded border text-center transition ${
                    selectedPackage === pkg.name
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="font-bold">{pkg.name}</div>
                  <div className="text-lg">{pkg.price} TK</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Duration Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => { setStartTime(e.target.value); handleCustomDuration(); }}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => { setEndTime(e.target.value); handleCustomDuration(); }}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>
        {selectedPackage && (
          <p className="text-sm text-blue-600">Package selected: {selectedPackage}</p>
        )}

        {/* Coupon */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code (optional)</label>
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="e.g. WELCOME10"
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Price Breakdown */}
        {bookingData && (
          <>
            <div className="flex justify-between border-b pb-4">
              <span className="text-gray-600">Total Price:</span>
              <span className="font-bold text-xl">{bookingData.booking.totalPrice} TK</span>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center text-blue-800">
              <span className="font-medium">Advance Required:</span>
              <span className="font-bold text-2xl">{bookingData.minAdvance} TK</span>
            </div>

            <div className="text-sm text-gray-500 space-y-1">
              <p>Duration: {formatDisplayDate(startTime)} to {formatDisplayDate(endTime)}</p>
              {selectedPackage && (
                <p className="text-green-600">Package discount applied</p>
              )}
              {couponCode && (
                <p className="text-green-600">Coupon applied: {couponCode}</p>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-bold text-sm mb-2">Terms & Conditions</h4>
              <ul className="text-xs text-gray-600 space-y-1 mb-3">
                <li>• Petrol cost is not included in the rental price</li>
                <li>• 1,000 TK fine for taking the bike on beach sand</li>
                <li>• 2,000 TK fine for lost or damaged helmet</li>
                <li>• 5,000 TK fine for crossing the designated boundary</li>
                <li>• You are liable for any physical damage to the vehicle</li>
              </ul>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1"
                />
                <span className="text-sm">I have read and agree to the Terms & Conditions</span>
              </label>
            </div>

            {/* Payment */}
            <div className="space-y-4 pt-4">
              <h3 className="font-bold flex items-center">
                <CreditCard className="mr-2" /> Pay with SSLCommerz (bKash/Nagad/Bank)
              </h3>
              <p className="text-sm text-gray-500">You will be redirected to the secure payment gateway.</p>

              <button
                onClick={handlePayment}
                disabled={loading || !termsAccepted}
                className={`w-full p-4 rounded font-bold text-white transition bg-blue-600 hover:bg-blue-700 ${(loading || !termsAccepted) && 'opacity-50 cursor-not-allowed'}`}
              >
                {loading ? 'Initializing Payment...' : 'Proceed to Payment'}
              </button>
              {!termsAccepted && (
                <p className="text-xs text-red-500 text-center">Please accept the Terms & Conditions to proceed</p>
              )}
            </div>
          </>
        )}

        <p className="text-center text-amber-600 text-sm mt-4 italic">
          Note: Your booking will only be confirmed after a successful advance payment.
        </p>
      </div>
    </div>
  );
};

export default Checkout;
