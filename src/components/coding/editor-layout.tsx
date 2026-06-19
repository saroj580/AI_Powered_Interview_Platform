"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Send, ChevronLeft, CheckCircle, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false, loading: () => <div className="flex items-center justify-center h-full text-muted-foreground text-sm">Loading editor…</div> });

const STARTER_CODE: Record<string, string> = {
    javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  const map = {};
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map[complement] !== undefined) return [map[complement], i];
    map[nums[i]] = i;
  }
  return [];
}`,
    python: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }
}`,
};

const TEST_RESULTS = [
    { input: "[2,7,11,15], 9", expected: "[0,1]", output: "[0,1]", passed: true },
    { input: "[3,2,4], 6", expected: "[1,2]", output: "[1,2]", passed: true },
    { input: "[3,3], 6", expected: "[0,1]", output: "[0,1]", passed: true },
];

export function CodeEditorLayout() {
    const [language, setLanguage] = useState("javascript");
    const [code, setCode] = useState(STARTER_CODE.javascript);
    const [running, setRunning] = useState(false);
    const [ran, setRan] = useState(false);

    function handleRun() {
        setRunning(true);
        setTimeout(() => { setRunning(false); setRan(true); }, 1500);
    }

    return (
        <div className="h-[calc(100vh-64px)] flex flex-col">
            {/* Toolbar */}
            <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-card/50">
                <Link href="/candidate/coding">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronLeft className="h-4 w-4" /></Button>
                </Link>
                <div className="flex-1">
                    <span className="font-semibold text-sm">Two Sum</span>
                    <Badge className="ml-2 text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200">EASY</Badge>
                </div>
                <Select value={language} onValueChange={(v) => { if (v) { setLanguage(v); setCode(STARTER_CODE[v] || ""); } }}>
                    <SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                    </SelectContent>
                </Select>
                <Button size="sm" variant="outline" onClick={handleRun} disabled={running} className="h-8 text-xs gap-1.5">
                    <Play className="h-3.5 w-3.5" />{running ? "Running…" : "Run"}
                </Button>
                <Button size="sm" className="bg-gradient-primary text-white border-0 hover:opacity-90 h-8 text-xs gap-1.5">
                    <Send className="h-3.5 w-3.5" />Submit
                </Button>
            </div>

            {/* Split layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Problem Panel */}
                <div className="w-[40%] border-r border-border overflow-y-auto p-5">
                    <Tabs defaultValue="problem">
                        <TabsList className="mb-4 h-8">
                            <TabsTrigger value="problem" className="text-xs">Problem</TabsTrigger>
                            <TabsTrigger value="solution" className="text-xs">Hints</TabsTrigger>
                        </TabsList>
                        <TabsContent value="problem" className="space-y-4 text-sm">
                            <p>Given an array of integers <code className="bg-muted px-1 py-0.5 rounded text-xs">nums</code> and an integer <code className="bg-muted px-1 py-0.5 rounded text-xs">target</code>, return indices of the two numbers such that they add up to target.</p>
                            <p>You may assume that each input would have exactly one solution, and you may not use the same element twice.</p>
                            <div className="space-y-3">
                                <p className="font-semibold">Examples:</p>
                                {[
                                    { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", exp: "nums[0] + nums[1] = 9" },
                                    { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
                                ].map((ex, i) => (
                                    <div key={i} className="bg-muted/50 rounded-lg p-3 font-mono text-xs space-y-1">
                                        <p><span className="text-muted-foreground">Input: </span>{ex.input}</p>
                                        <p><span className="text-muted-foreground">Output: </span>{ex.output}</p>
                                        {ex.exp && <p><span className="text-muted-foreground">Explanation: </span>{ex.exp}</p>}
                                    </div>
                                ))}
                            </div>
                            <div>
                                <p className="font-semibold mb-2">Constraints:</p>
                                <ul className="space-y-1 text-muted-foreground text-xs font-mono">
                                    <li>2 ≤ nums.length ≤ 10<sup>4</sup></li>
                                    <li>-10<sup>9</sup> ≤ nums[i] ≤ 10<sup>9</sup></li>
                                </ul>
                            </div>
                        </TabsContent>
                        <TabsContent value="solution" className="text-sm text-muted-foreground space-y-2">
                            <p>💡 Think about using a hash map to store complement values.</p>
                            <p>💡 For each number, check if (target - number) exists in your map.</p>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Editor + Output */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-hidden">
                        <MonacoEditor
                            height="100%"
                            language={language}
                            value={code}
                            onChange={(v) => setCode(v || "")}
                            theme="vs-dark"
                            options={{ fontSize: 13, minimap: { enabled: false }, scrollBeyondLastLine: false, lineNumbers: "on", padding: { top: 16 }, fontFamily: "JetBrains Mono, monospace" }}
                        />
                    </div>

                    {/* Test Results */}
                    {ran && (
                        <div className="border-t border-border p-4 max-h-40 overflow-y-auto bg-card/50">
                            <p className="text-xs font-semibold mb-3 flex items-center gap-2">
                                Test Results
                                <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 text-[10px]">3/3 Passed</Badge>
                            </p>
                            <div className="space-y-2">
                                {TEST_RESULTS.map((t, i) => (
                                    <div key={i} className={cn("flex items-center gap-3 text-xs p-2 rounded-lg", t.passed ? "bg-emerald-50/50 dark:bg-emerald-950/20" : "bg-red-50/50 dark:bg-red-950/20")}>
                                        {t.passed ? <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> : <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />}
                                        <span className="font-mono text-muted-foreground">Input: {t.input}</span>
                                        <span className="font-mono">→ {t.output}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}