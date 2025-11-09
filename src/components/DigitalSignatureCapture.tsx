import React, { useRef, useState, useEffect } from 'react';
import { Pen, RotateCcw, Check, X } from 'lucide-react';

interface DigitalSignatureCaptureProps {
  onSignatureCapture: (signature: string) => void;
  onClose: () => void;
  doctorName: string;
  licenseNumber: string;
}

const DigitalSignatureCapture: React.FC<DigitalSignatureCaptureProps> = ({
  onSignatureCapture,
  onClose,
  doctorName,
  licenseNumber
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set up canvas
    context.strokeStyle = '#1e40af';
    context.lineWidth = 2;
    context.lineCap = 'round';
    context.lineJoin = 'round';

    // Fill with white background
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.beginPath();
    context.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.lineTo(x, y);
    context.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) return;

    const signatureDataURL = canvas.toDataURL('image/png');
    onSignatureCapture(signatureDataURL);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center text-white">
            <Pen className="h-6 w-6 mr-3" />
            <div>
              <h2 className="text-xl font-semibold">Digital Signature</h2>
              <p className="text-blue-100 text-sm">Sign to authenticate prescription</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Doctor Info */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700">Dr. {doctorName}</p>
            <p className="text-xs text-gray-600">License: {licenseNumber}</p>
            <p className="text-xs text-gray-600">Date: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Signature Canvas */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Draw your signature below:
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-2">
              <canvas
                ref={canvasRef}
                width={400}
                height={150}
                className="w-full h-32 cursor-crosshair bg-white rounded"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Use your mouse to draw your signature in the box above
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              onClick={clearSignature}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear
            </button>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveSignature}
                disabled={!hasSignature}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  hasSignature
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Check className="h-4 w-4 mr-2" />
                Save Signature
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalSignatureCapture;
