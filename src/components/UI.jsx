
import { useRef, useState } from "react";
import { useChat } from "../hooks/useChat";

export const UI = ({ hidden, ...props }) => {
  const input = useRef();
  const { chat, loading, cameraZoomed, setCameraZoomed, message } = useChat();
  const [listening, setListening] = useState(false);

  const startListening = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);
    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      sendMessage(speechToText); // Automatically send message
    };

    recognition.onend = () => setListening(false);
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };

    recognition.start();
  };

  const sendMessage = (text) => {
    if (!loading && text) {
      chat(text); // Send the text message to the chat function
    }
  };

  if (hidden) {
    return null;
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-between p-4 flex-col pointer-events-none">
        <div className="self-start backdrop-blur-md bg-white bg-opacity-50 p-4 rounded-lg">
          <h1 className="font-black text-xl">PLUTO</h1>
          <p>Your Smart, Friendly Assistant for Instant Support!</p>
        </div>
        <div className="flex items-center gap-2 pointer-events-auto max-w-screen-sm w-full mx-auto">
          <input
            className="w-full placeholder:text-gray-800 placeholder:italic p-4 rounded-md bg-opacity-50 bg-white backdrop-blur-md"
            placeholder="Type or speak a message..."
            ref={input}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage(input.current.value);
                input.current.value = ""; // Clear input field
              }
            }}
          />
          <button
            onClick={startListening}
            className="pointer-events-auto bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-md"
            disabled={listening}
          >
            🎙
          </button>
        </div>
      </div>
    </>
  );
};

