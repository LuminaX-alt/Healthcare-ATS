import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Phone,
  Monitor,
  Settings,
  X,
  AlertCircle,
  Clock,
  User
} from 'lucide-react';

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorName: string;
  callType: 'video' | 'audio';
}

const VideoCallModal: React.FC<VideoCallModalProps> = ({ isOpen, onClose, doctorName, callType }) => {
  const [isConnecting, setIsConnecting] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(callType === 'video');
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor'>('excellent');
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen) {
      initializeCall();
    }
    return () => {
      cleanupCall();
    };
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  const initializeCall = async () => {
    try {
      const constraints = {
        audio: true,
        video: callType === 'video' ? { width: 1280, height: 720 } : false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;
      
      if (localVideoRef.current && callType === 'video') {
        localVideoRef.current.srcObject = stream;
      }

      setTimeout(() => {
        setIsConnecting(false);
        setIsConnected(true);
      }, 2000);

    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Could not access camera/microphone. Please check permissions.');
      onClose();
    }
  };

  const cleanupCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsConnected(false);
    setIsConnecting(false);
    setCallDuration(0);
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current && callType === 'video') {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        });
        setIsScreenSharing(true);
      } else {
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('Screen share error:', error);
    }
  };

  const endCall = () => {
    cleanupCall();
    onClose();
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Dr. {doctorName}</h3>
            <p className="text-gray-400 text-sm flex items-center gap-2">
              {isConnecting && (
                <>
                  <span className="animate-pulse">●</span>
                  <span>Connecting...</span>
                </>
              )}
              {isConnected && (
                <>
                  <Clock className="h-3 w-3" />
                  <span>{formatDuration(callDuration)}</span>
                  <span className={`ml-2 ${
                    connectionQuality === 'excellent' ? 'text-green-400' :
                    connectionQuality === 'good' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    ● {connectionQuality}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
        <button 
          onClick={endCall}
          className="text-gray-400 hover:text-white"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative bg-gray-900">
        <div className="w-full h-full flex items-center justify-center">
          {isConnecting ? (
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <User className="h-10 w-10 text-white" />
              </div>
              <p className="text-white text-lg">Connecting to Dr. {doctorName}...</p>
              <p className="text-gray-400 text-sm mt-2">Please wait while we establish connection</p>
            </div>
          ) : (
            <>
              {callType === 'video' ? (
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                  poster="/doctor-placeholder.jpg"
                />
              ) : (
                <div className="text-center">
                  <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-16 w-16 text-white" />
                  </div>
                  <p className="text-white text-xl font-semibold">Dr. {doctorName}</p>
                  <p className="text-gray-400 mt-2">Audio Call</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Local Video (Self) */}
        {callType === 'video' && isVideoOn && (
          <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden shadow-2xl border-2 border-gray-700">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover mirror-video"
            />
            <div className="absolute bottom-2 left-2 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
              You
            </div>
          </div>
        )}

        {/* Recording Indicator */}
        {isConnected && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            Recording
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-900 p-6">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={toggleMute}
            className={`p-4 rounded-full transition-all ${
              isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <MicOff className="h-6 w-6 text-white" />
            ) : (
              <Mic className="h-6 w-6 text-white" />
            )}
          </button>

          {callType === 'video' && (
            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full transition-all ${
                !isVideoOn ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
            >
              {isVideoOn ? (
                <Video className="h-6 w-6 text-white" />
              ) : (
                <VideoOff className="h-6 w-6 text-white" />
              )}
            </button>
          )}

          <button
            onClick={endCall}
            className="p-5 bg-red-600 rounded-full hover:bg-red-700 transition-all shadow-lg"
            title="End Call"
          >
            <PhoneOff className="h-7 w-7 text-white" />
          </button>

          {callType === 'video' && (
            <button
              onClick={toggleScreenShare}
              className={`p-4 rounded-full transition-all ${
                isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
            >
              <Monitor className="h-6 w-6 text-white" />
            </button>
          )}

          <button
            className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition-all"
            title="Settings"
          >
            <Settings className="h-6 w-6 text-white" />
          </button>
        </div>

        {connectionQuality === 'poor' && isConnected && (
          <div className="mt-4 p-3 bg-yellow-900 border border-yellow-700 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
            <p className="text-yellow-200 text-sm">
              Poor connection quality. Video/audio may be affected.
            </p>
          </div>
        )}
      </div>

      <style>{`
        .mirror-video {
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  );
};

export default VideoCallModal;
