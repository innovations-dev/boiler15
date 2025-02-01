"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { FloatingLabelInput } from "@/components/floating-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInviteMember } from "@/hooks/organization/use-invite-member";

const inviteMemberSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["admin", "member"], {
    required_error: "Please select a role",
  }),
});

type InviteMemberFormData = z.infer<typeof inviteMemberSchema>;

export function InviteMemberButton() {
  const [open, setOpen] = useState(false);
  const { mutate: inviteMember, isPending } = useInviteMember();

  const form = useForm<InviteMemberFormData>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: "",
      role: "member",
    },
  });

  const onSubmit = (data: InviteMemberFormData) => {
    inviteMember(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        aria-label="Open invite member dialog"
      >
        <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
        Invite Member
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription className="text-sm">
              Send an invitation email to add a new member to your team.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              aria-label="Invite member form"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FloatingLabelInput
                    {...field}
                    label="Email"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    placeholder="member@example.com"
                    aria-label="Member's email address"
                    aria-describedby="email-description"
                    disabled={isPending}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger
                          aria-label="Select member role"
                          aria-describedby="role-description"
                        >
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage id="role-description" aria-live="polite" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isPending}
                aria-label={
                  isPending ? "Sending invitation..." : "Send invitation"
                }
                className="w-full"
              >
                {isPending ? (
                  <>
                    <Loader2
                      className="mr-2 h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                    <span>Sending Invitation...</span>
                  </>
                ) : (
                  "Send Invitation"
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
