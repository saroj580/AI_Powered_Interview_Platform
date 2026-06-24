import { CodeEditorLayout } from "@/components/coding/editor-layout";

export default async function CodingChallengePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <CodeEditorLayout slug={id} />;
}
