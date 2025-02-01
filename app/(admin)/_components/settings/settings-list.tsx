"use client";

import { useState } from "react";
import {
  Bell,
  Cloud,
  Database,
  Lock,
  Mail,
  Shield,
  User,
  Users,
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
  // TODO: add settings schema
  {
    title: "User Registration",
    description: "Allow new users to register accounts",
    icon: User,
    defaultEnabled: true,
    key: "userRegistration",
    category: "authentication",
  },
  {
    title: "Email Notifications",
    description: "Send email notifications for important events",
    icon: Mail,
    defaultEnabled: true,
    key: "emailNotifications",
    category: "notifications",
  },
  {
    title: "Push Notifications",
    description: "Enable browser push notifications",
    icon: Bell,
    defaultEnabled: false,
    key: "pushNotifications",
    category: "notifications",
  },
  {
    title: "Organization Features",
    description: "Enable organization creation and management",
    icon: Users,
    defaultEnabled: true,
    key: "organizationFeatures",
    category: "features",
  },
  {
    title: "API Access",
    description: "Allow API access and key management",
    icon: Webhook,
    defaultEnabled: false,
    key: "apiAccess",
    category: "api",
  },
  {
    title: "Two-Factor Auth",
    description: "Require 2FA for all admin accounts",
    icon: Shield,
    defaultEnabled: true,
    key: "requireAdminMfa",
    category: "security",
  },
  {
    title: "Database Backups",
    description: "Automatic daily database backups",
    icon: Database,
    defaultEnabled: true,
    key: "databaseBackups",
    category: "maintenance",
  },
  {
    title: "Cloud Storage",
    description: "Enable cloud storage integration",
    icon: Cloud,
    defaultEnabled: true,
    key: "cloudStorage",
    category: "features",
  },
  {
    title: "Password Policy",
    description: "Enforce strong password requirements",
    icon: Lock,
    defaultEnabled: true,
    key: "strongPasswords",
    category: "security",
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
      // In a real app, you would make an API call here to update the setting
      toast.success("Setting updated successfully");
      return newState;
    });
  };

  const handleSave = () => {
    // In a real app, you would make an API call here to save all settings
    toast.success("Settings saved successfully");
  };

  // Group settings by category
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                      className="data-[state=checked]:bg-primary"
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
