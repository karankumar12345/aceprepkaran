"use client";
import dayjs from "dayjs";
import Link from "next/link";
import React from "react";

const Card = ({ data, linkto }) => {
  console.log(data);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 p-4 justify-center">
      {data?.map((item, index) => {
        const formattedDate = dayjs(item.createdAt).format("YYYY-MM-DD");

        return (
          <div
            key={index}
            className="w-full border hover:scale-[1.02] border-yellow-100 rounded-xl  p-4 flex flex-col justify-between  hover:shadow-xl transition-shadow  shadow-[0px_0px_48px_-6px_#ff24e1b3] duration-300"
          >
            {/* Tag */}
            <div className="flex justify-end">
              <span className="bg-yellow-500 text-white px-3 py-1 text-sm font-semibold rounded">
                {item.difficulty ||item.level }
              </span>
            </div>

            {/* Title & Category */}
            <div className="mt-4">
              <h2 className="text-xl font-semibold text-gray-200"> {item.category ||item.jobPosition ||`Topic ${item.dsaTopics}`}</h2>
              <h3 className="text-lg text-gray-300">Interview</h3>
            </div>

            {/* Meta Info */}
            <div className="mt-4 text-sm text-gray-200 space-y-1">
              <p>Date: {formattedDate}</p>
              <p>Language: {item.language}</p>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
              <Link
                href={`dashboard/${linkto}/${item.interviewId|| item.DSAMCQId||item.DevelopmentMCQId||item.mockId}/start`}
                className="bg-slate-500 hover:bg-slate-600 text-white text-sm w-full sm:w-[48%] text-center px-4 py-2 rounded-full"
              >
                Take Interview
              </Link>
              <Link
                href={`dashboard/${linkto}/${item.interviewId|| item.DSAMCQId||item.DevelopmentMCQId||item.mockId}/feedback`}
                className="bg-slate-500 hover:bg-slate-600 text-white text-sm w-full sm:w-[48%] text-center px-4 py-2 rounded-full"
              >
                View Interview
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Card;
