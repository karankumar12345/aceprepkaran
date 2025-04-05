import React, { useEffect, useState } from "react";
import { Mic } from "lucide-react";
import { chatSession } from "@/utils/GeminiAIModal";
import { db } from "@/utils/db";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { MockInterviewAnswer } from "@/utils/schema";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

const RecordAnswer = ({ activeQuestionIndex, mockInterviewQuestion, interviewId }) => {
  const { toast } = useToast();
  const { user } = useUser();
  const [userAnswer, setUserAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();

    recognitionInstance.interimResults = true; // Enable interim results
    recognitionInstance.lang = 'en-US'; // Set the language

    // Event handler when speech is recognized
    recognitionInstance.onresult = (event) => {
      const currentTranscript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      setUserAnswer(currentTranscript); // Update the user answer
    };

    setRecognition(recognitionInstance); // Store the recognition instance

    // Cleanup on component unmount
    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, []);

  const startRecording = () => {
    if (recognition) {
      recognition.start(); // Start the speech recognition
      setIsRecording(true); // Update recording state
    }
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop(); // Stop the speech recognition
      setIsRecording(false); // Update recording state
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording(); // Stop recording if currently recording
    } else {
      startRecording(); // Start recording if not currently recording
    }
  };

  const updateUserAnswer = async () => {
    try {
      if (!interviewId) throw new Error("Interview ID is missing.");
      const feedbackPrompt = `Question: ${mockInterviewQuestion[activeQuestionIndex].question}, User answer: "${userAnswer}". Please provide feedback on the answer and areas for improvement. Also, provide a rating out of 10. Return only in this JSON format:`;

      const result = await chatSession.sendMessage(feedbackPrompt);
      const responseText = await result.response.text();
      const jsonFeedbackResp = JSON.parse(cleanResponse(responseText));
      await saveAnswer(jsonFeedbackResp);
    } catch (error) {
      console.error("Error updating user answer:", error);
      toast({ title: "Error", description: error.message, status: "error" });
    }
  };

  const saveAnswer = async (jsonFeedbackResp) => {
    const insertData = {
      interviewId,
      question: mockInterviewQuestion[activeQuestionIndex].question,
      correctAnswer: mockInterviewQuestion[activeQuestionIndex].correctAnswer || "",
      userAnswer: userAnswer || "", // Save empty answer if the user didn't provide one
      feedback: jsonFeedbackResp.feedback || "",
      rating: jsonFeedbackResp.rating || "",
      userEmail: user?.primaryEmailAddress?.emailAddress,
      createdOn: new Date(),
      createdBy: user?.primaryEmailAddress?.emailAddress,
    };

    if (!insertData.interviewId) throw new Error("interviewId cannot be null");

    // Check if an existing answer exists for the current question
    const existingAnswer = await db
      .select()
      .from(MockInterviewAnswer)
      .where(
        and(
          eq(MockInterviewAnswer.interviewId, insertData.interviewId),
          eq(MockInterviewAnswer.question, insertData.question),
          eq(MockInterviewAnswer.userEmail, insertData.userEmail)
        )
      );

    if (existingAnswer.length > 0) {
      // Update the existing answer
      await db
        .update(MockInterviewAnswer)
        .set(insertData)
        .where(
          and(
            eq(MockInterviewAnswer.interviewId, insertData.interviewId),
            eq(MockInterviewAnswer.question, insertData.question),
            eq(MockInterviewAnswer.userEmail, insertData.userEmail)
          )
        );
      toast({ title: "Answer Updated", description: "Your answer has been updated successfully!", status: "success" });
    } else {
      // Create a new interviewIdRef if the answer does not exist
      insertData.interviewIdRef = uuidv4();
      await db.insert(MockInterviewAnswer).values(insertData);
      toast({ title: "Answer Saved", description: "Your answer has been saved successfully!", status: "success" });
    }

    // Clear the user answer
    setUserAnswer("");
  };

  const resetText=()=>{
    setUserAnswer("")
  }
  const cleanResponse = (response) => {
    return response
      .replace(/^\s+|\s+$/g, '') // Trim whitespace from both ends
      .replace(/```json/g, '') // Remove the starting ```json
      .replace(/```/g, '') // Remove ending ```
      .replace(/\n/g, ''); // Remove newlines
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
          <span>Start Recording Your Answer</span>
        )}
      </Button>
      <div className="mt-4">
      <input
  type="text"
  value={userAnswer}
  onChange={(e) => setUserAnswer(e.target.value)}
  placeholder="Type your answer..."
  className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200"
/>

        <p>{userAnswer || "No text recorded or Type yet."}</p>
      </div>

      <Button onClick={resetText} className="bg-purple-900 text-white">Record Again</Button>
      <Button onClick={updateUserAnswer} className="bg-purple-900 text-white">Submit Answer</Button>
    </div>
  );
};

export default RecordAnswer;
