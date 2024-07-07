import React, { useState, useEffect } from 'react';
import RecordIcon from './RecordIcon';
import { useReactMediaRecorder } from 'react-media-recorder';

interface Props {
  handleStop: any;
}

/*Create a RecordMessage component to record a message with the user's microphone*/
const RecordMessage = ({ handleStop }: Props) => {
  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({
    audio: true,
  });

  /*Add the localMediaBlobUrl state to store the mediaBlobUrl*/
  const [localMediaBlobUrl, setLocalMediaBlobUrl] = useState<string | null>(null);

  /*Set the localMediaBlobUrl to the mediaBlobUrl when the mediaBlobUrl is defined*/
  useEffect(() => {
    setLocalMediaBlobUrl(mediaBlobUrl !== undefined ? mediaBlobUrl : null);
  }, [mediaBlobUrl]);

  /*Add the isRecording and handleStopCalled states*/
  const [isRecording, setIsRecording] = useState(false);
  const [handleStopCalled, setHandleStopCalled] = useState(false);
  const [lastCommandTime, setLastCommandTime] = useState<number>(0);

  useEffect(() => {
    if (localMediaBlobUrl && mediaBlobUrl && !isRecording && !handleStopCalled) {
      handleStop(localMediaBlobUrl);
      setLocalMediaBlobUrl(null);
      setHandleStopCalled(true); // Ensure handleStop is only called once
    }
  }, [localMediaBlobUrl, mediaBlobUrl, isRecording, handleStopCalled, handleStop]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Speech Recognition API is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();
      console.log('Transcription: ', transcript);

      const now = Date.now();
      if (now - lastCommandTime < 1000) { // Ignore commands that come within 1 second of each other
        return;
      }

      if (transcript.toLowerCase() === 'hey jack') {
        console.log('Commande détectée : hey jack');
        startRecording();
        setIsRecording(true);
        setLastCommandTime(now);
      } else if (transcript.toLowerCase() === 'stop') {
        console.log('Commande détectée : stop');
        stopRecording();
        setIsRecording(false);
        setLastCommandTime(now);
        setTimeout(() => {
          console.log('Lancement de recognition.start');
          recognition.start();
        }, 1000); // Restart recognition after 1 second
      }
    };

    recognition.start();
    console.log('Lancement initial de recognition.start');

    return () => {
      recognition.stop();
    };
  }, [startRecording, stopRecording, lastCommandTime]);

  const handleMouseDown = () => {
    startRecording();
    setIsRecording(true);
  };

  const handleMouseUp = () => {
    stopRecording();
    setIsRecording(false);
  };

  useEffect(() => {
    if (isRecording) {
      setHandleStopCalled(false);
    }
  }, [isRecording]);

  return (
    <div className='mt-2'>
      <button
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className='bg-white p-4 rounded-full shadow-lg'
      >
        <RecordIcon
          classText={status === 'recording' ? 'animate-pulse text-red-500' : 'text-sky-500'}
        />
      </button>
      <p className='mt-2 text-white font-light'>{status}</p>
    </div>
  );
};

export default RecordMessage;
