"use client"
import React, { useEffect, useState } from "react";
import { Mic } from "lucide-react";
import { chatSession } from "@/utils/GeminiAIModal";
import { db } from "@/utils/db";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { Answer } from "@/utils/schema";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";

const RecordAnswer = ({ activeQuestionIndex, mockInterviewQuestion, interviewId }) => {
  const { toast } = useToast();
  const { user } = useUser();
  const [userAnswer, setUserAnswer] = useState("");
  const [userCode, setUserCode] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);

  // Initialize SpeechRecognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();

    recognitionInstance.interimResults = true;
    recognitionInstance.lang = "en-US";

    recognitionInstance.onresult = (event) => {
      const currentTranscript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join("");
      setUserAnswer(currentTranscript);
    };

    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance) recognitionInstance.stop();
    };
  }, []);

  const startRecording = () => {
    if (recognition) {
      recognition.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    isRecording ? stopRecording() : startRecording();
  };

  const updateUserAnswer = async () => {
    if (!interviewId) {
      toast({ title: "Error", description: "Interview ID is missing.", status: "error" });
      return;
    }

    try {
      const feedbackPrompt = `
      You are an expert evaluator for technical interview responses. Analyze the user's answer and code submission based on the given question. Provide detailed feedback on the quality of the answer and code, focusing on correctness, clarity, and areas for improvement.
  
      Respond strictly in the following JSON format:
      {
          "feedback": "Detailed feedback on the user's verbal or written response, including areas for improvement.",
          "rating": "Numerical rating for the answer on a scale of 1 to 10.",
          "code_feedback": "Specific feedback on the quality of the submitted code, including logic, efficiency, and best practices.",
          "overall_suggestions": "General suggestions to improve both answering and coding skills.",
          "correctAnswer": {
              "bruteForce": [
                give code language basis of user code language 
              ],
              "optimized": [
             give code language basis of user code language 
                  
              ]
          }
      }
  
      Here is the context:
      - Question: "${mockInterviewQuestion[activeQuestionIndex]?.question}"
      - User Answer: "${userAnswer}"
      - User Code: "${userCode}"
  
      Return only the JSON object with no additional text or formatting.
  `;
  

      const result = await chatSession.sendMessage(feedbackPrompt);
      console.log(result)
      const responseText = await result.response.text();
      console.log(responseText)
      const jsonFeedbackResp = JSON.parse(cleanResponse(responseText));

      await saveAnswer(jsonFeedbackResp);
    } catch (error) {
      console.error("Error updating user answer:", error);
      toast({ title: "Error", description: error.message || "Something went wrong.", status: "error" });
    }
  };

  const saveAnswer = async (jsonFeedbackResp) => {
    const insertData = {
      interviewId,
      question: mockInterviewQuestion[activeQuestionIndex]?.question || "",
      correctAnswer: jsonFeedbackResp.correctAnswer || "",
      userAnswer: userAnswer || "",
      feedback: jsonFeedbackResp.feedback || "",
      rating: jsonFeedbackResp.rating || "",
      userAnswerCode: userCode || "",
      codeFeedback: jsonFeedbackResp.code_feedback || "",
      userEmail: user?.primaryEmailAddress?.emailAddress,
      createdOn: new Date(),
      createdBy: user?.primaryEmailAddress?.emailAddress,
    };

    try {
      const existingAnswer = await db.select().from(Answer).where(
        and(
          eq(Answer.interviewId, insertData.interviewId),
          eq(Answer.question, insertData.question),
          eq(Answer.userEmail, insertData.userEmail)
        )
      );

      if (existingAnswer.length > 0) {
        const updateData = {
          ...insertData,
          modifiedOn: new Date(),
          modifiedBy: insertData.userEmail,
        };

        await db.update(Answer).set(updateData).where(
          and(
            eq(Answer.interviewId, insertData.interviewId),
            eq(Answer.question, insertData.question),
            eq(Answer.userEmail, insertData.userEmail)
          )
        );

        toast({ title: "Answer updated", description: "Your answer has been updated successfully!", status: "success" });
      } else {
        await db.insert(Answer).values({ ...insertData, interviewIdRef: uuidv4() });
        toast({ title: "Answer saved", description: "Your answer has been saved successfully!", status: "success" });
      }
    } catch (error) {
      console.error("Error saving answer:", error);
      toast({ title: "Error", description: "Error saving your answer.", status: "error" });
    }

    setUserAnswer("");
    setUserCode("");
  };
  
  const resetText=()=>{
    setUserAnswer("")
  }

  const cleanResponse = (response) => {
    return response
      .replace(/```json|```/g, "")
      .replace(/^\s+|\s+$/g, "")
      .replace(/\n/g, "");
  };

  return (
    <div className="flex flex-col items-center space-y-5 p-5">
      <Button onClick={toggleRecording} className="bg-purple-900 text-white">
        {isRecording ? (
          <div className="flex items-center space-x-2">
            <Mic className="animate-pulse h-5 w-5" />
            <span>Recording... Click to Stop</span>
          </div>
        ) : (
          <span>Start Recording Your Answer Approach</span>
        )}
      </Button>

      <div className="mt-5 p-3 rounded-lg">
      <input
  type="text"
  value={userAnswer}
  onChange={(e) => setUserAnswer(e.target.value)}
  placeholder="Type your answer..."
  className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200"
/>
        <h3 className="text-lg font-semibold">Your Answer:</h3>
        <p>{userAnswer || "No answer recorded yet."}</p>
      </div>

      <div className="mt-5 w-full">
        <h3 className="text-lg font-semibold">Your Code:</h3>
        <Editor
          value={userCode}
          onValueChange={setUserCode}
          highlight={code => highlight(code, languages.js)}
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 14,
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />
      </div>
      <Button onClick={resetText} className="bg-purple-900 text-white">Record Again</Button>
      <Button onClick={updateUserAnswer} className="bg-purple-900 text-white">
        Submit Answer
      </Button>
    </div>
  );
};

export default RecordAnswer;
