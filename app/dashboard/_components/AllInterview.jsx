import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { db } from '@/utils/db';
import { eq } from 'drizzle-orm'; // Import the eq function for the query
import Card from '../../../components/Card';
import DsaCard from '../../../components/DsaALL';
import MockInterveiew from '../../../components/MockInterview';
import DsCard from '../../../components/dsamcq';
import { DevelopmentMCQ, DsaMcq, Interview, MockInterview } from '@/utils/schema';

const InterviewList = () => {
    const [developmentMCQ, setDevelopmentMCQ] = useState([]);
    const [interviewDetails, setInterviewDetails] = useState([]);
    const [mock, setMock] = useState([]);
    const [dsa, setDsa] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useUser();

    const getDevelopmentMcq = async () => {
        setLoading(true);
        setError(null);
        try {
            if (user?.primaryEmailAddress?.emailAddress) {
                const result = await db
                    .select()
                    .from(DevelopmentMCQ)
                    .where(eq(DevelopmentMCQ.createdBy, user.primaryEmailAddress.emailAddress));

                if (result.length > 0) {
                    setDevelopmentMCQ(result);
                } else {
                    setError("No development MCQ data found.");
                }
            }
        } catch (error) {
            console.error("Error fetching development MCQ:", error);
            setError("Error fetching development MCQ data.");
        } finally {
            setLoading(false);
        }
    };

    const getDsaMcq = async () => {
        setLoading(true);
        setError(null);
        try {
            if (user?.primaryEmailAddress?.emailAddress) {
                const result = await db
                    .select()
                    .from(DsaMcq)
                    .where(eq(DsaMcq.createdBy, user.primaryEmailAddress.emailAddress));

                if (result.length > 0) {
                    setInterviewDetails(result);
                } else {
                    setError("No DSA MCQ data found.");
                }
            }
        } catch (error) {
            console.error("Error fetching DSA MCQ:", error);
            setError("Error fetching DSA MCQ data.");
        } finally {
            setLoading(false);
        }
    };

    const getDsa = async () => {
        setLoading(true);
        setError(null);
        try {
            if (user?.primaryEmailAddress?.emailAddress) {
                const result = await db
                    .select()
                    .from(Interview)
                    .where(eq(Interview.createdBy, user.primaryEmailAddress.emailAddress));

                if (result.length > 0) {
                    setDsa(result);
                } else {
                    setError("No DSA data found.");
                }
            }
        } catch (error) {
            console.error("Error fetching DSA:", error);
            setError("Error fetching DSA data.");
        } finally {
            setLoading(false);
        }
    };

    const getMock = async () => {
        setLoading(true);
        setError(null);
        try {
            if (user?.primaryEmailAddress?.emailAddress) {
                const result = await db
                    .select()
                    .from(MockInterview)
                    .where(eq(MockInterview.createdBy, user.primaryEmailAddress.emailAddress));

                if (result.length > 0) {
                    setMock(result);
                } else {
                    setError("No Mock Interview data found.");
                }
            }
        } catch (error) {
            console.error("Error fetching Mock Interview:", error);
            setError("Error fetching Mock Interview data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            getDevelopmentMcq();
            getDsaMcq();
            getDsa();
            getMock();
        }
    }, [user]);

    return (
        <div className="p-12 bg-gray-900">
            <div className="text-center">
                <h2 className="text-base text-teal-600 font-semibold tracking-wide uppercase">AcePrep</h2>
                <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
                    Enhance Your Coding Skills
                </p>
            </div>

            {/* Conditionally render headings and data without margins */}
            {developmentMCQ.length > 0 && (
                <div>
                    <h3 className="text-xl text-white">Development MCQ</h3>
                    <Card data={developmentMCQ} linkto="development" />
                </div>
            )}

            {interviewDetails.length > 0 && (
                <div>
                    <h3 className="text-xl text-white">DSA MCQ</h3>
                    <DsCard data={interviewDetails} linkto="dsamcq" />
                </div>
            )}

            {dsa.length > 0 && (
                <div>
                    <h3 className="text-xl text-white">DSA Interview</h3>
                    <DsaCard data={dsa} />
                </div>
            )}

            {mock.length > 0 && (
                <div>
                    <h3 className="text-xl text-white">Mock Interviews</h3>
                    <MockInterveiew data={mock} />
                </div>
            )}

            {/* Show error if no data is found */}
            {error && (
                <div className="text-red-500 mt-8 text-center">
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
};

export default InterviewList;
