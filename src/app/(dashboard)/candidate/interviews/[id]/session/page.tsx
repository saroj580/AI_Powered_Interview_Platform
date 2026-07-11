import { InterviewSession } from "@/components/interview/session-layout";

export default async function InterviewSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <InterviewSession interviewId={id} />;
}
