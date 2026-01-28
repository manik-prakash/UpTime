import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function SettingsPage() {
    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold text-primary">Settings</h1>
                <p className="text-secondary">Manage your account settings</p>
            </div>

            {/* Profile Settings */}
            <Card>
                <h2 className="text-lg font-semibold text-primary mb-4">Profile</h2>
                <form className="space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        defaultValue="user@example.com"
                        disabled
                    />
                    <Input
                        label="Name"
                        type="text"
                        placeholder="Your name"
                    />
                    <Button type="submit">Save Changes</Button>
                </form>
            </Card>

            {/* Password Settings */}
            <Card>
                <h2 className="text-lg font-semibold text-primary mb-4">Change Password</h2>
                <form className="space-y-4">
                    <Input
                        label="Current Password"
                        type="password"
                        placeholder="••••••••"
                    />
                    <Input
                        label="New Password"
                        type="password"
                        placeholder="••••••••"
                    />
                    <Input
                        label="Confirm New Password"
                        type="password"
                        placeholder="••••••••"
                    />
                    <Button type="submit">Update Password</Button>
                </form>
            </Card>

            {/* Notification Settings */}
            <Card>
                <h2 className="text-lg font-semibold text-primary mb-4">Notifications</h2>
                <div className="space-y-4">
                    <label className="flex items-center justify-between">
                        <div>
                            <div className="font-medium text-primary">Email Notifications</div>
                            <div className="text-sm text-secondary">Receive alerts via email when a site goes down</div>
                        </div>
                        <input
                            type="checkbox"
                            defaultChecked
                            className="w-5 h-5 rounded border-light text-accent focus:ring-accent"
                        />
                    </label>
                    <label className="flex items-center justify-between">
                        <div>
                            <div className="font-medium text-primary">Weekly Reports</div>
                            <div className="text-sm text-secondary">Receive weekly uptime summary reports</div>
                        </div>
                        <input
                            type="checkbox"
                            className="w-5 h-5 rounded border-light text-accent focus:ring-accent"
                        />
                    </label>
                </div>
            </Card>

            {/* Danger Zone */}
            <Card className="border-down/30">
                <h2 className="text-lg font-semibold text-down mb-4">Danger Zone</h2>
                <p className="text-secondary mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button variant="outline" className="text-down border-down hover:bg-down hover:text-white">
                    Delete Account
                </Button>
            </Card>
        </div>
    );
}
