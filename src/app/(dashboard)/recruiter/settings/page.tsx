"use client";
import { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { User, Bell, Shield, Palette, Building2 } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function RecruiterSettingsPage() {
    const { user } = useAuthStore();
    const [name, setName] = useState(user?.name ?? "");
    const [email] = useState(user?.email ?? "");
    const [emailNotifs, setEmailNotifs] = useState(true);

    function handleSaveProfile(e: React.FormEvent) {
        e.preventDefault();
        toast.success("Profile updated successfully!");
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-muted-foreground text-sm mt-1">Manage your recruiter account</p>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center gap-2 pb-4">
                    <User className="h-5 w-5 text-primary" />
                    <div>
                        <CardTitle className="text-base">Profile</CardTitle>
                        <CardDescription className="text-xs">Your personal information</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-6">
                        <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                            <AvatarImage src={user?.image ?? undefined} />
                            <AvatarFallback className="bg-gradient-primary text-white text-lg">
                                {user ? getInitials(user.name) : "?"}
                            </AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="sm">Change Photo</Button>
                    </div>
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input value={email} disabled className="bg-muted/50" />
                        </div>
                        <Button type="submit" className="bg-gradient-primary text-white border-0 hover:opacity-90">Save Changes</Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center gap-2 pb-4">
                    <Building2 className="h-5 w-5 text-primary" />
                    <div>
                        <CardTitle className="text-base">Organization</CardTitle>
                        <CardDescription className="text-xs">Your company settings</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Company Name</Label>
                        <Input placeholder="Acme Corp" />
                    </div>
                    <div className="space-y-2">
                        <Label>Company Website</Label>
                        <Input placeholder="https://acme.com" type="url" />
                    </div>
                    <Button variant="outline" onClick={() => toast.success("Organization updated!")}>Save Organization</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center gap-2 pb-4">
                    <Palette className="h-5 w-5 text-primary" />
                    <div><CardTitle className="text-base">Appearance</CardTitle></div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Theme</p>
                        <ThemeToggle />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center gap-2 pb-4">
                    <Bell className="h-5 w-5 text-primary" />
                    <div><CardTitle className="text-base">Notifications</CardTitle></div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">Email notifications</p>
                            <p className="text-xs text-muted-foreground">Candidate updates, assessment completions</p>
                        </div>
                        <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
                    </div>
                    <Separator className="my-4" />
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">New candidate alert</p>
                            <p className="text-xs text-muted-foreground">Get notified when a candidate completes an assessment</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center gap-2 pb-4">
                    <Shield className="h-5 w-5 text-primary" />
                    <div><CardTitle className="text-base">Security</CardTitle></div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>New Password</Label>
                        <Input type="password" placeholder="Enter new password" />
                    </div>
                    <div className="space-y-2">
                        <Label>Confirm Password</Label>
                        <Input type="password" placeholder="Confirm new password" />
                    </div>
                    <Button variant="outline" onClick={() => toast.success("Password updated!")}>Update Password</Button>
                </CardContent>
            </Card>
        </div>
    );
}
