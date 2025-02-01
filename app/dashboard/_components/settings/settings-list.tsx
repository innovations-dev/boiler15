"use client";

import { useState } from "react";
import {
  Bell,
  Lock,
  Mail,
  Moon,
  Palette,
  Shield,
  User,
  Webhook,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const settings = [
  {
    title: "Email Notifications",
    description: "Receive email notifications for important updates",
    icon: Mail,
    defaultEnabled: true,
    key: "emailNotifications",
    category: "notifications",
  },
  {
    title: "Push Notifications",
    description: "Get browser push notifications for activities",
    icon: Bell,
    defaultEnabled: false,
    key: "pushNotifications",
    category: "notifications",
  },
  {
    title: "Dark Mode",
    description: "Enable dark mode for the dashboard interface",
    icon: Moon,
    defaultEnabled: false,
    key: "darkMode",
    category: "appearance",
  },
  {
    title: "Color Theme",
    description: "Use custom color theme for the interface",
    icon: Palette,
    defaultEnabled: false,
    key: "customTheme",
    category: "appearance",
  },
  {
    title: "Two-Factor Auth",
    description: "Enable two-factor authentication for your account",
    icon: Shield,
    defaultEnabled: false,
    key: "twoFactorAuth",
    category: "security",
  },
  {
    title: "Password Requirements",
    description: "Enforce strong password policy",
    icon: Lock,
    defaultEnabled: true,
    key: "strongPassword",
    category: "security",
  },
  {
    title: "Profile Privacy",
    description: "Control your profile visibility",
    icon: User,
    defaultEnabled: true,
    key: "profilePrivacy",
    category: "privacy",
  },
  {
    title: "API Access",
    description: "Enable API access for your account",
    icon: Webhook,
    defaultEnabled: false,
    key: "apiAccess",
    category: "developer",
  },
] as const;

type SettingCategory = (typeof settings)[number]["category"];

export function SettingsList() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
    settings.reduce(
      (acc, setting) => ({
        ...acc,
        [setting.key]: setting.defaultEnabled,
      }),
      {}
    )
  );

  const handleToggle = (key: string) => {
    setEnabled((prev) => {
      const newState = { ...prev, [key]: !prev[key] };
      toast.success("Setting updated successfully");
      return newState;
    });
  };

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  const groupedSettings = settings.reduce(
    (acc, setting) => {
      const category = setting.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(setting);
      return acc;
    },
    {} as Record<SettingCategory, (typeof settings)[number][]>
  );

  return (
    <div className="space-y-8">
      {Object.entries(groupedSettings).map(([category, categorySettings]) => (
        <div key={category} className="space-y-4">
          <h2 className="text-lg font-semibold capitalize">{category}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {categorySettings.map((setting) => {
              const Icon = setting.icon;
              return (
                <Card key={setting.key}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      {setting.title}
                    </CardTitle>
                    <CardDescription>{setting.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {enabled[setting.key] ? "Enabled" : "Disabled"}
                    </span>
                    <Switch
                      checked={enabled[setting.key]}
                      onCheckedChange={() => handleToggle(setting.key)}
                      aria-label={`Toggle ${setting.title}`}
                    />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}
