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
    if (!interviewId) {
      toast({ title: "Error", description: "Interview ID is missing.", status: "error" });
      return;
    }

    try {
      const feedbackPrompt = `Question: ${mockInterviewQuestion[activeQuestionIndex].question}, User answer: "${userAnswer}", User code: "${userCode}". Please provide feedback on the answer and areas for improvement. Return only in this JSON format:`;

      const result = await chatSession.sendMessage(feedbackPrompt);
      const responseText = await result.response.text();
      const jsonFeedbackResp = JSON.parse(cleanResponse(responseText));
      console.log(jsonFeedbackResp); // Debugging
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
      correctAnswer: mockInterviewQuestion[activeQuestionIndex].code_solutions || "",
      userAnswer: userAnswer || "",
      feedback: jsonFeedbackResp.feedback || "",
      rating: jsonFeedbackResp.rating || "",
      userAnswerCode: userCode || "",
      codeFeedback: jsonFeedbackResp.code_feedback || "",
      userEmail: user?.primaryEmailAddress?.emailAddress,
      createdOn: new Date(),
      createdBy: user?.primaryEmailAddress?.emailAddress,
    };

    if (!insertData.interviewId) {
      throw new Error("Interview ID cannot be null");
    }

    try {
      // Correctly combine conditions using 'and'
      const existingAnswer = await db.select().from(Answer).where(
        and(
          eq(Answer.interviewId, insertData.interviewId),
          eq(Answer.question, insertData.question),
          eq(Answer.userEmail, insertData.userEmail)
        )
      );

      if (existingAnswer.length > 0) {
        // Exclude fields that should not be updated
        const updateData = {
          userAnswer: insertData.userAnswer,
          feedback: insertData.feedback,
          rating: insertData.rating,
          userAnswerCode: insertData.userAnswerCode,
          codeFeedback: insertData.codeFeedback,
          // Add modified fields if you have them in your schema
          modifiedOn: new Date(),
          modifiedBy: insertData.userEmail,
        };

        // Update the existing answer
        await db.update(Answer).set(updateData).where(
          and(
            eq(Answer.interviewId, insertData.interviewId),
            eq(Answer.question, insertData.question),
            eq(Answer.userEmail, insertData.userEmail)
          )
        );
        toast({ title: "Answer updated", description: "Your answer has been updated successfully!", status: "success" });
      } else {
        // Add interviewIdRef only when inserting
        const insertDataWithRef = {
          ...insertData,
          interviewIdRef: uuidv4(),
        };

        await db.insert(Answer).values(insertDataWithRef);
        toast({ title: "Answer saved", description: "Your answer has been saved successfully!", status: "success" });
      }
    } catch (error) {
      console.error("Error saving answer:", error);
      toast({ title: "Error", description: "Error saving your answer.", status: "error" });
    }

    // Clear the user answer and code after saving
    setUserAnswer("");
    setUserCode("");
  };

  const cleanResponse = (response) => {
    return response
      .replace(/^\s+|\s+$/g, '')
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .replace(/\n/g, '');
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

      <div className="mt-5 p-3 border border-gray-300 rounded-lg">
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
            border: '1px solid #ddd',
            borderRadius: '4px',
            overflow: 'auto',
          }}
        />
      </div>
      <Button onClick={updateUserAnswer} className="bg-purple-900 text-white">Submit Answer</Button>
    </div>
  );
};

export default RecordAnswer;
