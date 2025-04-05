import React from 'react';

const Feature = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 mt-6">
      {/* Feedback Section */}
      <div className="bg-gray-900 rounded-lg p-5 m-3 flex justify-between items-center max-[600px]:flex-col max-[600px]:gap-4">
        <div className="w-[50%] max-[600px]:w-[90%] max-[600px]:mb-[20px]">
          <h3 className="text-xl font-semibold text-green-800">Feedback</h3>
          <p className="text-gray-300">
            After completing each mock interview, our intelligent feedback system kicks in.
            Using advanced AI models, we analyze your responses for clarity, confidence,
            tone, pace, and keyword relevance. This enables you to identify patterns in your
            answers — highlighting strengths while pointing out specific areas for
            improvement. Whether it’s body language, filler words, or technical gaps, the feedback is
            tailored just for you. Get actionable suggestions that can help you improve with
            every single session.
          </p>
        </div>

        <div className="w-[30%] max-[600px]:w-[50%]">
          <img
            src="https://t4.ftcdn.net/jpg/04/80/32/91/360_F_480329143_udbywRAkIk8LObNgwFnLhWqbOyjenXca.jpg"
            alt="Feedback"
            className="w-full h-auto rounded-lg shadow-[0px_0px_48px_-6px_#ff24e1b3]"
          />
        </div>
      </div>

      {/* Mock Interview Section */}
      <div className="bg-gray-900 rounded-lg p-5 m-3 items-center flex justify-between max-[600px]:flex-col">
        <div className="w-[50%] max-[600px]:w-[90%] max-[600px]:mb-[20px]">
          <h3 className="text-xl font-semibold text-green-800">Mock Interview</h3>
          <p className="text-gray-300">
            Simulate real-world interview environments by choosing from various domains and difficulty levels.
            Each mock interview session is designed to mirror the real-time experience — from introductory
            HR questions to domain-specific technical queries. With a time-bound structure and randomized
            questions, these mock interviews help you stay sharp, prepare under pressure, and refine your
            articulation. The more you practice, the more confident and job-ready you become.
          </p>
        </div>

        <div className="shadow-[0px_0px_48px_-6px_#ff24e1b3] w-[30%] max-[600px]:w-[50%]">
          <img
            src="https://chanakyaiasacademy.com/wp-content/uploads/2023/01/Mock-interview.jpg"
            alt="Mock Interview"
            className="w-full h-auto rounded-lg"
          />
        </div>
      </div>

      {/* AI Agent Section */}
      <div className="bg-gray-900 rounded-lg p-5 m-3 flex justify-between items-center max-[600px]:flex-col">
        <div className="w-[50%] max-[600px]:w-[90%] max-[600px]:mb-[20px]">
          <h3 className="text-xl font-semibold text-green-800">AI Agent for Mock Interviews</h3>
          <p className="text-gray-300">
            Our AI agent serves as your intelligent virtual interviewer — trained on thousands
            of real interview transcripts and behavioral patterns. It doesn't just ask
            questions; it listens to your tone, identifies hesitation, evaluates the
            structure of your answers, and instantly provides constructive feedback.
            Whether you're preparing for a tech job, business role, or academic interview,
            the AI adjusts its behavior accordingly. With every session, it learns your
            style and offers better insights — just like a personal interview coach.
          </p>
        </div>

        <div className="shadow-[0px_0px_48px_-6px_#ff24e1b3] w-[30%] max-[600px]:w-[50%]">
          <img
            src="https://cdn.prod.website-files.com/5d9bdb47e33988bf5815bfed/66918605796492296fd34fe0_What-are-AI-agents.jpg"
            alt="AI Agent"
            className="w-full h-auto rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Feature;
