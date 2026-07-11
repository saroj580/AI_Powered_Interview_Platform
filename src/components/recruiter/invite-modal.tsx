"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, UserPlus, Loader2, Plus, Mail } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  assessmentId: string;
  assessmentTitle: string;
  onClose: () => void;
}

export function InviteModal({ assessmentId, assessmentTitle, onClose }: Props) {
  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [sending, setSending] = useState(false);

  function addEmail() {
    const email = emailInput.trim().toLowerCase();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) return toast.error("Enter a valid email address");
    if (emails.includes(email)) return toast.error("Already added");
    setEmails((prev) => [...prev, email]);
    setEmailInput("");
  }

  function removeEmail(email: string) {
    setEmails((prev) => prev.filter((e) => e !== email));
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addEmail(); }
  }

  async function sendInvites() {
    if (!emails.length) return toast.error("Add at least one email");
    setSending(true);
    try {
      const res = await fetch(`/api/v1/recruiter/assessments/${assessmentId}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails }),
      });
      const data = await res.json();
      toast.success(data.message ?? "Invites sent!");
      onClose();
    } catch {
      toast.error("Failed to send invites");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold">Invite Candidates</h2>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{assessmentTitle}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7 -mt-1 -mr-1" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Email addresses</Label>
          <div className="flex gap-2">
            <Input
              placeholder="candidate@example.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown={onKeyDown}
              type="email"
              className="flex-1"
            />
            <Button variant="outline" size="icon" onClick={addEmail} className="h-9 w-9 shrink-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Press Enter or comma to add. Multiple emails supported.</p>
        </div>

        {emails.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {emails.map((email) => (
              <Badge key={email} variant="secondary" className="gap-1.5 pl-2 pr-1 py-1">
                <Mail className="h-3 w-3" />
                <span className="text-xs">{email}</span>
                <button onClick={() => removeEmail(email)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button
            onClick={sendInvites}
            disabled={sending || emails.length === 0}
            className="flex-1 bg-gradient-primary text-white border-0 hover:opacity-90 gap-1.5"
          >
            {sending
              ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
              : <><UserPlus className="h-4 w-4" /> Send {emails.length > 0 ? `${emails.length} ` : ""}Invite{emails.length !== 1 ? "s" : ""}</>}
          </Button>
        </div>
      </div>
    </div>
  );
}
