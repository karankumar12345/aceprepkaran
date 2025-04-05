import React from 'react';

const HowItsWork = () => {
  const Howitswork = [
    {
      question: "1. Login First",
      answer: "   Start by signing in using your Google account. This helps us personalizeyour experience and save your interview progress, feedback history, and improvement reports securely in your profile",
    },
    {
      question: "2.Choose Interview Type",
      answer: "  Once you're logged in, select the kind of interview you want to practice —  technical, HR, managerial, or behavioral. The platform may ask you for your   skill level, domain preference, or job role so that we can simulate a relevant and   real-world interview experience",
    },
    {
      question: "Interview & Feedback<",
      answer: "  Your AI-powered interview begins! Answer questions in real time, just like in a real interview.Once you're done, you'll instantly get detailed feedback on your performance — including confidence score, speaking analysis, and suggestions to improve for your next attempt.",
    },
  ];

  return (
    <div className="flex flex-wrap gap-4 justify-center items-start p-4">
      {Howitswork.map((faq, index) => (
        <div
          key={index}
          className="bg-gray-900 text-gray-200 dark:bg-gray-900 shadow-[0px_0px_48px_-6px_#ff24e1b3] rounded-lg p-5 w-full sm:w-[300px] transition hover:scale-[1.02]"
        >
          <h2 className="text-lg font-semibold text-pink-600 mb-2">{faq.question}</h2>
          <p className="text-gray-200 dark:text-gray-300">{faq.answer}</p>
        </div>
      ))}
    </div>
  );
};

export default HowItsWork;
