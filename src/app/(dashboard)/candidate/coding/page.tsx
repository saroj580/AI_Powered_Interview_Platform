import { CodingChallengesList } from "@/components/coding/challenges-list";

export default function CodingPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Coding Challenges</h1>
                <p className="text-muted-foreground text-sm mt-1">Practice DSA, algorithms, and system design problems</p>
            </div>
            <CodingChallengesList />
        </div>
    );
}