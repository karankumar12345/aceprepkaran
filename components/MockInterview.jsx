import React from "react";
import Link from "next/link";
import { HoverEffect } from "../components/ui/card-hover-effect";

function MockInterveiew({ data }) {
  return (
    <div className="">
      <HoverEffect
        items={data?.map((webinar) => ({
          title: webinar.name,
          description: webinar.jobDesc,
          difficulty: webinar.level,
          language: webinar.language,
          link: `dashboard/developmentmcq/${webinar.mockId }/feedback`, // Adjust the ID field accordingly
        }))}
      />
    </div>
  );
}

export default MockInterveiew
