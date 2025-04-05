"use client";
import dayjs from "dayjs";
import Link from "next/link";
import React from "react";

const Card = ({ data, linkto }) => {
  return (
    
    <div className="w-full max-w-7xl mx-auto px-0">
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {data?.map((item, index) => {
        const formattedDate = dayjs(item.createdAt).format("YYYY-MM-DD");
  
        return (
          <div
            key={index}
            className="min-w-[200px] w-full max-w-sm mr-auto border border-yellow-100 rounded-2xl p-4 flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 hover:shadow-xl shadow-[0px_0px_48px_-6px_#ff24e1b3]"
          >
            {/* Tag */}
            <div className="flex justify-end">
              <span className="bg-yellow-500 text-white px-3 py-1 text-xs font-semibold rounded">
                {item.difficulty || item.level}
              </span>
            </div>
  
            {/* Title & Category */}
            <div className="mt-4 space-y-1">
              <h2 className="text-lg font-semibold text-gray-200 break-words">
                {item.category || item.jobPosition || `Topic ${item.dsaTopics}`}
              </h2>
              <h3 className="text-base text-gray-300">Interview</h3>
            </div>
  
            {/* Meta Info */}
            <div className="mt-4 text-xs text-gray-200 space-y-1">
              <p>Date: {formattedDate}</p>
              <p>Language: {item.language}</p>
            </div>
  
            {/* Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row justify-between gap-3">
              <Link
                href={`dashboard/${linkto}/${item.interviewId || item.DSAMCQId || item.DevelopmentMCQId || item.mockId}/start`}
                className="bg-slate-500 hover:bg-slate-600 text-white text-sm text-center px-4 py-2 rounded-full w-full sm:w-[48%]"
              >
                Take Interview
              </Link>
              <Link
                href={`dashboard/${linkto}/${item.interviewId || item.DSAMCQId || item.DevelopmentMCQId || item.mockId}/feedback`}
                className="bg-slate-500 hover:bg-slate-600 text-white text-sm text-center px-4 py-2 rounded-full w-full sm:w-[48%]"
              >
                View Interview
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  </div>
  
  );
};

export default Card;
