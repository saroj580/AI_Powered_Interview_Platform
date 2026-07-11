import { LiveInterview } from "@/components/interview/live-interview";

export default async function LiveInterviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LiveInterview interviewId={id} />;
}
