import React from 'react';
import { Volume2 } from 'lucide-react';

const Question = ({ questions, activeQuestionIndex, selectedOption, onOptionSelect }) => {
  const texttospeech = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis not supported');
    }
  };

  if (!questions || questions?.length === 0) {
    return <p className="text-gray-500">No questions available.</p>;
  }

  const currentQuestion = questions[activeQuestionIndex]; // Correctly reference the current question
console.log(currentQuestion)
  return (
    <div className="p-5 border rounded-lg  animate-fadeIn">
      <h2 className="text-lg font-semibold mb-3">Question #{activeQuestionIndex + 1}</h2>
      <div className="flex items-center space-x-2 mb-3">
        <h3 className="text-lg font-semibold">{currentQuestion?.question}</h3>
        <Volume2 onClick={() => texttospeech(currentQuestion?.question)} className='cursor-pointer text-blue-500' />
      </div>

      {/* Example Section */}
      <div className=" p-4 rounded-lg shadow-md mt-4">
        <h4 className="text-md font-semibold mb-2">Examples:</h4>
        {currentQuestion?.input_examples?.map((example, index) => (
          <div key={index} className="mb-4">
            <p className="text-gray-200">
              <span className="font-bold">Input:</span> {JSON.stringify(example.input)}
            </p>
            <p className="text-gray-200">
              <span className="font-bold">Output:</span> {JSON.stringify(example.output)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Question;
