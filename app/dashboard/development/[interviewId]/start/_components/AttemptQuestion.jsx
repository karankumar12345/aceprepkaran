// AttemptQuestion.jsx
import React from 'react';

const AttemptQuestion = ({ questions, attemptedQuestions }) => {
  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold">Attempted Questions</h2>
      <ul className="list-none p-0">
        {questions?.map((question, index) => (
          <li
            key={index}
            className={`p-2 rounded-md my-1 ${
              attemptedQuestions[index] ? "bg-green-200" : "bg-red-200"
            }`}
          >
            <span className="font-medium">{`Q${index + 1}: `}</span>
            {question.question}
            <span className="ml-2 font-light text-sm">
              {attemptedQuestions[index] ? "(Attempted)" : "(Not Attempted)"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AttemptQuestion;
