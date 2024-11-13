import React from "react";
import Link from "next/link";
import { HoverEffect } from "../components/ui/card-hover-effect";

function DsaCard({ data }) {
  return (
    <div className="mt-10">
      <HoverEffect
        items={data?.map((webinar) => ({
          title: webinar.name,
          description: webinar.dsaTopics,
          difficulty: webinar.level,
          language: webinar.language,
          link: `dashboard/dsa/${webinar.interviewId }/feedback`, // Adjust the ID field accordingly
        }))}
      />
    </div>
  );
}

export default DsaCard
