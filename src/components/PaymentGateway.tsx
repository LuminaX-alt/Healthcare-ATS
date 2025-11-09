import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { X } from 'lucide-react';

const stripePromise = loadStripe('pk_test_51Hh9Z2K9sL1c2Z0g2fX6E8d7f6gH5i4j3k2l1m0nO9p8q7r6s5t4u3v2w1xY');

interface PaymentGatewayProps {
  amount: number;
  onClose: () => void;
  onPaymentSuccess: (paymentDetails: any) => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ amount, onClose, onPaymentSuccess }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-center mb-6">Complete Your Payment</h2>
        <Elements stripe={stripePromise}>
          <CheckoutForm amount={amount} onPaymentSuccess={onPaymentSuccess} />
        </Elements>
      </div>
    </div>
  );
};

export default PaymentGateway;
