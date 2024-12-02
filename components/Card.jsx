import React from "react";
import Link from "next/link";
import { HoverEffect } from "../components/ui/card-hover-effect";

function Card({ data,linkto }) {
  return (
    <div className="">
      <HoverEffect
        items={data?.map((webinar) => ({
          title: webinar.name,
          description: webinar.category,
          difficulty: webinar.difficulty,
          language: webinar.language,
          link: `dashboard/development/${webinar.DevelopmentMCQId || webinar.DsaMcqId}/feedback`, // Adjust the ID field accordingly
        }))}
      />
    </div>
  );
}

export default Card;
