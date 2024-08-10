import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Title from './Title';
import axios from 'axios';
import Select, { SingleValue } from 'react-select';
import { ActionMeta } from 'react-select';

const Mute = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('Jack');
  const [selectedGame, setSelectedGame] = useState(null);
  const [isDisabilityMenuOpen, setIsDisabilityMenuOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const disabilityMenuRef = useRef<HTMLDivElement>(null);

  const availableVoices = [
    { id: 'Jack', name: 'Jack' },
    { id: 'Shaun', name: 'Shaun' },
    { id: 'Antoni', name: 'Antoni' },
    { id: 'Sarah', name: 'Sarah' },
  ];

  const availableGames = [
    { value: 'game1', label: 'Riddles and Puzzles' },
    { value: 'game2', label: '20 Questions' },
    { value: 'game3', label: 'Quiz' },
    { value: 'game4', label: 'Collaborative Storytelling' },
    { value: 'game5', label: 'Hangman' },
    { value: 'game6', label: 'Find the Synonym or Antonym' },
    { value: 'game7', label: 'Word Games' },
    { value: 'game8', label: 'Charades' },
  ];

  const handleVoiceChange = (voiceID: string) => {
    setSelectedVoice(voiceID);
  };

  const handleGameSelection = async (
    newValue: SingleValue<{ value: string; label: string } | null>,
    actionMeta: ActionMeta<{ value: string; label: string } | null>
  ) => {
    if (!newValue) return;

    setIsLoading(true);
    try {
      const text = `let's play ${newValue.label} together`;
      const voice = selectedVoice;

      const response = await axios.post(
        'http://localhost:8000/post-text-game/',
        { text, voice },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          responseType: 'json', // Ensure we expect a JSON response
        }
      );

      const textResponse = response.data.response; // Ensure response data structure is correct
      const textMessage = { sender: 'Jack', content: textResponse };
      setMessages((prevMessages) => [...prevMessages, textMessage]);
    } catch (error) {
      console.error('Error occurred during game selection post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSubmit = async () => {
    if (!inputText) return;

    setIsLoading(true);

    // Add user's message to the message list
    const userMessage = { sender: 'Me', content: inputText };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const voice = selectedVoice;

      const response = await axios.post(
        'http://localhost:8000/post-text-to-text/',
        { text: inputText, voice },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          responseType: 'json',
        }
      );

      const textResponse = response.data.response;
      const textMessage = { sender: 'Jack', content: textResponse };
      setMessages((prevMessages) => [...prevMessages, textMessage]);

      setInputText(''); // Clear the input field after sending the message
    } catch (error) {
      console.error('Error occurred during text submission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleTextSubmit();
    }
  };

  const toggleDisabilityMenu = () => {
    setIsDisabilityMenuOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      disabilityMenuRef.current &&
      !disabilityMenuRef.current.contains(event.target as Node)
    ) {
      setIsDisabilityMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleDisabilityOption = (option: string) => {
    console.log('Selected disability option:', option);
  };

  const handleSourdMalentendantOption = (option: string) => {
    if (option === 'deaf') {
      navigate('/deaf');
    } 
    if(option === 'mute-audio')
    {
      navigate('/mute-audio');
    }
    else if (option === 'mute-text') {
      navigate('/mute-text');
    }
  };

  return (
    <div className='h-screen overflow-y-hidden'>
      <Title setMessages={setMessages} selectedVoice={selectedVoice} />
      <p className='font-bold text-gray-800 text-center text-3xl'>
        Mute and Speech-Impaired / Text
      </p>

      <div className='absolute top-0 right-12 m-2'>
        <Select
          options={availableGames}
          onChange={handleGameSelection}
          value={selectedGame}
          placeholder='Choose a game'
          className='w-64'
        />
      </div>

      <div className='text-center mt-3'>
        {availableVoices.map((voice) => (
          <button
            key={voice.id}
            onClick={() => handleVoiceChange(voice.id)}
            className={`mx-2 px-4 py-2 transition duration-300 ease-in-out ${
              selectedVoice === voice.id
                ? voice.name === 'Sarah'
                  ? 'bg-pink-500 text-white hover:bg-pink-600'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
                : voice.name === 'Sarah'
                ? 'bg-gray-300 hover:bg-pink-300 text-black '
                : 'bg-gray-300 text-black hover:bg-sky-300'
            }`}
          >
            {voice.name}
          </button>
        ))}
      </div>

      <div className='flex flex-col justify-between h-full overflow-y-scroll pb-96'>
        <div className='mt-5 px-5'>
          {messages?.map((message, index) => (
            <div
              key={index}
              className={`flex flex-col ${message.sender === 'Jack' ? 'items-end' : 'items-start'}`}
            >
              <div className='mt-4'>
                {message.sender === 'Jack' ? (
                  <div className='text-right mr-2 italic text-pink-500'>
                    {message.sender}
                  </div>
                ) : (
                  <div className='ml-2 italic text-blue-500'>
                    {message.sender}
                  </div>
                )}
                <p className='ml-2'>{message.content}</p>
              </div>
            </div>
          ))}

          {messages.length === 0 && !isLoading && (
            <div className='text-center font-light italic mt-10'>
              Send {selectedVoice} a message...
            </div>
          )}

          {isLoading && (
            <div className='text-center font-light italic mt-10 animate-pulse'>
              Wait a few seconds...
            </div>
          )}
        </div>

        <div className='fixed bottom-0 w-full py-6 border-t text-center bg-gradient-to-r from-sky-500 to-indigo-500'>
          <div className='flex justify-center items-center w-full'>
            <div className='flex flex-col items-center w-full px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto'>
              <input
                type='text'
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown} // Add this line to handle Enter key press
                className='border rounded px-4 py-2 mb-2 w-full'
                placeholder='Type your message here...'
              />
              <button
                onClick={handleTextSubmit}
                className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full'
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
        <div
          className='fixed left-0 top-1/2 transform -translate-y-1/2 ml-2'
          ref={disabilityMenuRef}
        >
          <button
            onClick={toggleDisabilityMenu}
            className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50'
          >
            <img
              src='https://media.istockphoto.com/id/1459736320/vector/disabled-sign-and-symbol-vector-illustration-handicap-parking-sign.jpg?s=612x612&w=0&k=20&c=dCoZ5kX3837N1I2HvkJtkmLs4S7fenTh0ZzpsLzzjI4='
              alt='Handicap'
              className='w-6 h-6 rounded-full mr-2'
            />
          </button>
          {isDisabilityMenuOpen && (
            <div className='absolute left-full top-1/2 transform -translate-y-1/2 ml-2 bg-white p-2 rounded-lg shadow-md'>
              <button
                onClick={() => handleSourdMalentendantOption('deaf')}
                className='block w-full text-left px-4 py-2 hover:bg-gray-100'
              >
                <img
                  src='https://stickair.com/38341-large_default/sourds-et-malentendants.jpg'
                  alt='Sourds et malentendants'
                  className='w-12 h-12 rounded-full mr-2'
                />
                Deaf
              </button>
              <button
                onClick={() => handleSourdMalentendantOption('mute-text')}
                className='block w-full text-left px-4 py-2 hover:bg-gray-100'
              >
                <img
                  src='https://www.virages.com/Images/Categorie_A8/27819-500.gif'
                  alt='Personnes muettes'
                  className='w-12 h-12 rounded-full mr-2'
                />
                Mute Text Response
              </button>
              <button
                onClick={() => handleSourdMalentendantOption('mute-audio')}
                className='block w-full text-left px-4 py-2 hover:bg-gray-100'
              >
                <img
                  src='https://www.virages.com/Images/Categorie_A8/27819-500.gif'
                  alt='Personnes muettes'
                  className='w-12 h-12 rounded-full mr-2'
                />
                Mute Audio Response
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mute;
