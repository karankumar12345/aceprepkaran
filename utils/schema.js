import { pgTable, serial, text, varchar, timestamp } from 'drizzle-orm/pg-core';

// Mock Interview Table
export const MockInterview = pgTable('mockInterview', {
  id: serial('id').primaryKey(),
  jsonMockResp: text('jsonMockResp').notNull(),
  jobPosition: varchar('jobPosition', 255).notNull(), // Fixed the variable name
  jobDesc: varchar('jobDesc', 255).notNull(),
  level: varchar('level', 255).notNull(),
  name: varchar('name', 255).notNull(),
  language: varchar('language', 255).notNull(),
  createdBy: varchar('createdBy', 255).notNull(),
  createdOn: timestamp('createdOn').defaultNow().notNull(),
  mockId: varchar('mockId', 255).notNull(),
});

// Interview Table
export const Interview = pgTable('interview', {
  id: serial('id').primaryKey(),
  jsoninterResp: text('jsoninterResp').notNull(),
  dsaTopics: varchar('dsaTopics', 255).notNull(),
  language: varchar('language', 255).notNull(),
  experience: varchar('experience', 255).notNull(),
  name: varchar('name', 255).notNull(),
  level: varchar('level', 255).notNull(),
  createdBy: varchar('createdBy', 255).notNull(),
  createdOn: timestamp('createdOn').defaultNow().notNull(),
  interviewId: varchar('interviewId', 255).notNull(),
});

// Development MCQ Table
export const DevelopmentMCQ = pgTable('development_mcqs', {
  id: serial('id').primaryKey(),
  jsondevmcqResp: text('jsondevmcqResp').notNull(),
  name: varchar('name', 255).notNull(),
  language: varchar('language', 255).notNull(),
  difficulty: varchar('difficulty', { length: 20 }).default('medium'),
  category: varchar('category', { length: 50 }).default('development'),
  createdAt: timestamp('createdAt').defaultNow(),
  createdBy: varchar('createdBy', 255).notNull(),
  DevelopmentMCQId: varchar('DevelopmentMCQId', 255).notNull(),
});

// DSA MCQ Table
export const DsaMcq = pgTable('Dsa_Mcq', {
  id: serial('id').primaryKey(),
  jsondsaResp: text('jsondsaResp').notNull(),
  name: varchar('name', 255).notNull(),
  language: varchar('language', 255).notNull(),
  difficulty: varchar('difficulty', { length: 20 }).default('medium'),
  category: varchar('category', { length: 50 }).default('Dsa'),
  createdAt: timestamp('createdAt').defaultNow(),
  createdBy: varchar('createdBy', 255).notNull(),
  DSAMCQId: varchar('DSAMCQId', 255).notNull(),
});

// Development MCQ Answer Table
export const DeveMCQAnswer = pgTable('DeveMCQAnswer', {
  id: serial('id').primaryKey(),
  interviewIdRef: varchar('interviewIdRef', 255).notNull(),
  DevelopmentMCQId: varchar('deveIdRef', 255).notNull(),
  questions: varchar('question', 255).notNull(),
  correctAnswers: varchar('correctAnswer', 255).notNull(),
  userAnswers: text('userAnswer').notNull(),
  userEmail: varchar('userEmail', 255).notNull(),
  createdBy: varchar('createdBy', 255).notNull(),
  createdOn: timestamp('createdOn').defaultNow().notNull(),

});

// DSA MCQ Answer Table
export const DSAMCQAnswer = pgTable('DSAMCQAnswer', {
  id: serial('id').primaryKey(),
  interviewIdRef: varchar('interviewIdRef', 255).notNull(),
  DSAMCQId: varchar('dsaIdRef', 255).notNull(),
  question: varchar('question', 255).notNull(),
  correctAnswer: varchar('correctAnswer', 255).notNull(),
  userAnswer: text('userAnswer'), // Nullable
  userEmail: varchar('userEmail', 255).notNull(),
  createdBy: varchar('createdBy', 255).notNull(),
  createdOn: timestamp('createdOn').defaultNow().notNull(),
 
});

// User Answer Table

export const Answer = pgTable('userAnswer', {
  id: serial('id').primaryKey(),
  interviewIdRef: varchar('interviewIdRef', 255).notNull(),
  interviewId: varchar('interviewId', 255).notNull(),
  question: varchar('question', 255).notNull(),
  correctAnswer: varchar('correctAnswer', 255).notNull(),
  userAnswer: text('userAnswer').notNull(),  // Corrected this line
  feedback: text('feedback').notNull(),
  rating: varchar('rating', 255).notNull(),
  userAnswerCode: text('userAnswerCode').notNull(), // Assuming you want to keep user code separately
  codeFeedback: text('codeFeedback').notNull(), // Add a field for code feedback

  userEmail: varchar('userEmail', 255).notNull(),
  createdBy: varchar('createdBy', 255).notNull(),
  createdOn: timestamp('createdOn').defaultNow().notNull(),
});


// Mock Interview Answer Table
export const MockInterviewAnswer = pgTable('mockInterviewAnswer', {
  id: serial('id').primaryKey(),
  interviewIdRef: varchar('interviewIdRef', 255).notNull(),
  interviewId: varchar('interviewId', 255).notNull(),
  question: varchar('question', 255).notNull(),
  correctAnswer: varchar('correctAnswer', 255).notNull(),
  userAnswer: text('userAnswer').notNull(),
  feedback: text('feedback').notNull(),
  rating: varchar('rating', 255).notNull(),
  userEmail: varchar('userEmail', 255).notNull(),
  createdBy: varchar('createdBy', 255).notNull(),
  createdOn: timestamp('createdOn').defaultNow().notNull(),
});
