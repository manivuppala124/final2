import React, { useState, useEffect, useRef, useCallback } from 'react';
import { debounce } from 'lodash';
import './ChatScreen.css';

const COHERE_API_KEY = '4DXFsPiFWGRBusJhGMRWSw6VO848SKbliQ09CCz0';
const API_URL = 'https://api.cohere.ai/v1/generate';
const SUMMARIZE_URL = 'https://api.cohere.ai/v1/summarize';
const CHAT_API_URL = 'https://b610-34-125-14-52.ngrok-free.app/api/model';

function ChatScreen() {
  const [inputText, setInputText] = useState('');
  const [conversation, setConversation] = useState(() => {
    const saved = localStorage.getItem('chatHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [isTyping, setIsTyping] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [query, setQuery] = useState('');
  const [responseSource, setResponseSource] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(conversation));
    scrollToBottom();
  }, [conversation]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const summarizeText = async (text) => {
    try {
      const response = await fetch(SUMMARIZE_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          length: 'short',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.summary) {
        throw new Error('Invalid response format');
      }

      return data.summary;
    } catch (error) {
      console.error('Error summarizing data:', error);
      return text;
    }
  };

  const debouncedApiCall = useCallback(
    debounce(async (messageText) => {
      try {
        setIsTyping(true);
        console.log('Sending request to Cohere API:', messageText);
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${COHERE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: messageText,
            max_tokens: 500,
            temperature: 0.7,
            stop_sequences: [],
            return_likelihoods: 'NONE',
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!data.generations || !data.generations[0] || !data.generations[0].text) {
          throw new Error('Invalid response format');
        }

        const summarizedText = await summarizeText(data.generations[0].text.trim());

        console.log('Received response from Cohere API:', summarizedText);
        const botMessage = {
          id: generateUniqueKey(),
          sender: 'bot',
          text: `Answer from Cohere API: ${summarizedText}`,
        };
        setConversation((prev) => [...prev, botMessage]);
      } catch (error) {
        console.error('Error fetching data from Cohere API:', error);
        const errorMessage = {
          id: generateUniqueKey(),
          sender: 'bot',
          text: 'Error fetching data. Please try again later.',
        };
        setConversation((prev) => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    }, 300),
    []
  );

  const handleChatResponse = useCallback(
    debounce(async (messageText) => {
      try {
        setIsTyping(true);
        console.log('Sending request to RAG API:', messageText);
        const response = await fetch(CHAT_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: messageText }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!data.response) {
          throw new Error('Invalid response format');
        }

        console.log('Received response from RAG API:', data.response);
        const botMessage = {
          id: generateUniqueKey(),
          sender: 'bot',
          text: `Answer from RAG: ${data.response}`,
        };
        setConversation((prev) => [...prev, botMessage]);
      } catch (error) {
        console.error('Error fetching data from RAG API:', error);
        const errorMessage = {
          id: generateUniqueKey(),
          sender: 'bot',
          text: 'Error fetching data. Please try again later.',
        };
        setConversation((prev) => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    }, 300),
    []
  );

  const handleGreeting = (messageText) => {
    const greetings = ['hello', 'hi', 'hey'];
    if (greetings.includes(messageText.toLowerCase().trim())) {
      const botMessage = {
        id: generateUniqueKey(),
        sender: 'bot',
        text: 'Hello! How can I help you today?',
      };
      setConversation((prev) => [...prev, botMessage]);
      return true;
    }
    return false;
  };

  const handleOptionSelection = (option) => {
    if (option === 1) {
      setResponseSource('cohere');
      setShowOptions(false);
      debouncedApiCall(query);
    } else if (option === 2) {
      setResponseSource('rag');
      setShowOptions(false);
      handleChatResponse(query);
    }
  };

  const handleSubmit = () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: generateUniqueKey(),
      sender: 'user',
      text: inputText,
    };
    setConversation((prev) => [...prev, userMessage]);
    setQuery(inputText);
    setInputText('');

    if (!handleGreeting(inputText)) {
      setShowOptions(true);
    }
  };

  const handleClearChat = () => {
    setConversation([]);
    localStorage.removeItem('chatHistory');
  };

  const renderMessage = (msg) => (
    <div key={msg.id} className={`message ${msg.sender}`}>
      <div className="message-text">{msg.text}</div>
    </div>
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const generateUniqueKey = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
  };

  return (
    <div className={`chat-popup ${scrolled ? 'scrolled' : ''}`}>
      <div className="chat-container">
        <header className="chat-header">
          <h1>Chat Assistant</h1>
          <button className="clear-chat-button" onClick={handleClearChat}>
            Clear Chat
          </button>
        </header>
        <div className="chat-box">
          {conversation.map(renderMessage)}
          {isTyping && (
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {!showOptions && (
          <div className="input-container">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here..."
            />
            <button onClick={handleSubmit}>Send</button>
          </div>
        )}
        {showOptions && (
          <div className="option-buttons">
            <button onClick={() => handleOptionSelection(1)}>Response 1</button>
            <button onClick={() => handleOptionSelection(2)}>Response 2</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatScreen;
