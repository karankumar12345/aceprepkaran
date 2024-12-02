import { Button } from "@/components/ui/button";
import React, { useState } from "react";
// Make sure to import your editor component correctly
import Editor from "react-simple-code-editor"; // Adjust the import based on your setup
import { languages } from "prismjs"; // Adjust import if you are using a different syntax highlighter
import { useToast } from "@/hooks/use-toast"; // Assuming you have a toast hook for notifications
import { db } from "@/utils/db"; // Adjust import path as needed
import { Answer } from "@/utils/schema"; // Adjust import path as needed
import { chatSession } from "@/utils/GeminiAIModal"; 
import { v4 as uuidv4 } from "uuid";
// Adjust import path as needed
import { eq } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
 // Replace with your actual query library

const CodeEditor = ({language, activequestionindex, mockInterviewQuestion,interviewId,interviewIdRef  }) => {
  const [code, setCode] = useState("");
  const { toast } = useToast();
  const {user}=useUser()
  const highlight = (code) => Prism.highlight(code, Prism.languages.js, 'js');
  const updateUserAnswer = async () => {
    try {
     
      if (!interviewId) {
        throw new Error("Interview ID is missing.");
      }

      const feedbackPrompt = `Question: ${mockInterviewQuestion[activequestionindex].question}, 
        User code: "${code}". 
        lanuage:"${language}
        Please provide feedback on the answer and areas for improvement. 
        Also, provide a rating out of 10. Return only in this JSON format: 
        {
          "feedback": "Your feedback here",
          "rating": "Your rating here"
          "code":"Your code here optimized and brute force"
        }`;

      const result = await chatSession.sendMessage(feedbackPrompt);
      const responseText = await result.response.text();
      console.log("Feedback from AI:", responseText);
      const cleanResponse = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      const jsonFeedbackResp = JSON.parse(cleanResponse);

      const insertData = {
        interviewIdRef: interviewIdRef,
        interviewId:interviewId,
        question: mockInterviewQuestion[activequestionindex].question,
        correctAnswer: mockInterviewQuestion[activequestionindex].answer || "",
        userAnswertext: "", // Set user text answer if needed
        feedbacktext: jsonFeedbackResp.feedback || "",
        ratingtext: jsonFeedbackResp.rating || "",
        userAnswerCode: code,
        feedbackCode: jsonFeedbackResp.feedback || "",
        ratingCode: jsonFeedbackResp.rating || "",
        userEmail: user?.primaryEmailAddress?.emailAddress || "",
        createdBy: user?.primaryEmailAddress?.emailAddress || "",
        createdOn: new Date(),
      };

      // Check for existing answer
      const existingAnswer = await db.select()
        .from(Answer)
        .where(
          eq(Answer.interviewIdRef, insertData.interviewIdRef),
          eq(Answer.question, insertData.question),
          eq(Answer.userEmail, insertData.userEmail)
        );

      if (existingAnswer.length > 0) {
        // Update existing answer
        await db.update(Answer)
          .set({
            userAnswertext: insertData.userAnswertext,
            feedbacktext: insertData.feedbacktext,
            ratingtext: insertData.ratingtext,
            userAnswerCode: insertData.userAnswerCode,
            feedbackCode: insertData.feedbackCode,
            ratingCode: insertData.ratingCode,
            updatedOn: new Date(),
          })
          .where(
            eq(Answer.interviewIdRef, insertData.interviewIdRef),
            eq(Answer.question, insertData.question),
            eq(Answer.userEmail, insertData.userEmail)
          );

        toast({
          title: "Answer updated",
          description: "Your existing answer has been updated successfully!",
          status: "success",
        });
      } else {
        // Insert new answer
        await db.insert(Answer).values(insertData);

        toast({
          title: "Answer saved",
          description: "Your answer has been saved successfully!",
          status: "success",
        });
      }
    } catch (error) {
      console.error("Error getting feedback or database insertion:", error);
      toast({
        title: "Error",
        description: "There was an error processing the feedback or inserting data.",
        status: "error",
      });
    }
  };

  return (
<div className="p-5 border rounded-lg w-full h-[80vh] max-h-[80vh] overflow-hidden shadow-lg bg-white">
  <h3 className="mb-4 font-bold text-lg text-gray-800">Code Editor</h3>

  {/* Code Editor Component */}

</div>

  );
};

export default CodeEditor;
