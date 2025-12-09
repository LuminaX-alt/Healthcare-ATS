import React from 'react';
import { MessageCircle, Phone, Mail, Clock, HelpCircle } from 'lucide-react';

const CustomerSupport: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <MessageCircle className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Customer Support</h1>
          </div>
          <p className="text-gray-600">We're here to help you 24/7. Choose your preferred support channel below.</p>
        </div>

        {/* Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Live Chat */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <MessageCircle className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold">Live Chat</h3>
            </div>
            <p className="text-gray-600 mb-4">Chat with our support team in real-time</p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Start Chat
            </button>
          </div>

          {/* Phone Support */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <Phone className="w-6 h-6 text-green-600 mr-3" />
              <h3 className="text-xl font-semibold">Phone Support</h3>
            </div>
            <p className="text-gray-600 mb-4">Call us: +1 (800) 123-4567</p>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
              Call Now
            </button>
          </div>

          {/* Email Support */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <Mail className="w-6 h-6 text-purple-600 mr-3" />
              <h3 className="text-xl font-semibold">Email Support</h3>
            </div>
            <p className="text-gray-600 mb-4">support@luminax.hospital</p>
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
              Send Email
            </button>
          </div>

          {/* Help Center */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <HelpCircle className="w-6 h-6 text-orange-600 mr-3" />
              <h3 className="text-xl font-semibold">Help Center</h3>
            </div>
            <p className="text-gray-600 mb-4">Browse FAQs and guides</p>
            <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors">
              View FAQs
            </button>
          </div>
        </div>

        {/* Business Hours */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Clock className="w-6 h-6 text-blue-600 mr-3" />
            <h3 className="text-xl font-semibold">Support Hours</h3>
          </div>
          <div className="space-y-2 text-gray-600">
            <p><strong>Live Chat & Phone:</strong> 24/7 Available</p>
            <p><strong>Email Response:</strong> Within 2-4 hours</p>
            <p><strong>Emergency Support:</strong> Immediate response</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupport;
