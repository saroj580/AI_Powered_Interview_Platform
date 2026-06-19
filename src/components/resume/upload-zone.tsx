"use client";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ResumeUploadZone() {
    const [file, setFile] = useState<File | null>(null);
    const [analyzing, setAnalyzing] = useState(false);

    const onDrop = useCallback((accepted: File[]) => {
        if (accepted[0]) { setFile(accepted[0]); }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop, accept: { "application/pdf": [".pdf"], "application/msword": [".doc", ".docx"] }, maxFiles: 1, maxSize: 10 * 1024 * 1024,
    });

    function handleAnalyze() {
        setAnalyzing(true);
        setTimeout(() => setAnalyzing(false), 2000);
    }

    return (
        <Card>
            <CardContent className="p-6">
                {!file ? (
                    <div
                        {...getRootProps()}
                        className={cn(
                            "border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all",
                            isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"
                        )}
                    >
                        <input {...getInputProps()} />
                        <motion.div animate={{ y: isDragActive ? -8 : 0 }} className="flex flex-col items-center gap-3">
                            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <Upload className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold text-base mb-1">
                                    {isDragActive ? "Drop your resume here" : "Drop your resume or click to browse"}
                                </p>
                                <p className="text-muted-foreground text-sm">PDF or DOCX — max 10MB</p>
                            </div>
                        </motion.div>
                    </div>
                ) : (
                    <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/20">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium text-sm">{file.name}</p>
                                <p className="text-muted-foreground text-xs">{(file.size / 1024).toFixed(0)} KB</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button size="sm" onClick={handleAnalyze} disabled={analyzing} className="bg-gradient-primary text-white border-0 hover:opacity-90 gap-2">
                                {analyzing ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Analyzing…</> : "Analyze Resume"}
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setFile(null)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}