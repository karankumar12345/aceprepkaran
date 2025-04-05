import React from 'react';

const AskedQuestion = () => {
  const faqs = [
    {
      question: "Is it free to use?",
      answer: "Yes, AcePrep is completely free to use. No hidden charges!",
    },
    {
      question: "Is my data safe?",
      answer: "Yes, your data is safe and secure. We respect your privacy.",
    },
    {
      question: "What is AcePrep?",
      answer: "AcePrep is a platform where you can practice mock interviews powered by AI.",
    },
  ];

  return (
    <div className="flex flex-wrap gap-4 justify-center items-start p-4">
      {faqs.map((faq, index) => (
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

export default AskedQuestion;
