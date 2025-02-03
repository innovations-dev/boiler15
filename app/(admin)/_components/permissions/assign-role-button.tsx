"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBaseMutation } from "@/hooks/query/use-base-mutation";
import { authClient } from "@/lib/auth/auth-client";
import { USER_ROLE_LABELS, USER_ROLES } from "@/lib/constants/roles";
import { queryKeys } from "@/lib/query/keys";

const assignRoleSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  role: z.string().min(1, "Role is required"),
});

type AssignRoleInput = z.infer<typeof assignRoleSchema>;

export function AssignRoleButton() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<AssignRoleInput>({
    resolver: zodResolver(assignRoleSchema),
    defaultValues: {
      userId: "",
      role: "",
    },
  });

  const { mutate: assignRole, isPending } = useBaseMutation({
    mutationFn: (data: AssignRoleInput) => authClient.admin.setRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.list() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.permissions(10),
      });
      setOpen(false);
      form.reset();
    },
    errorMessage: "Failed to assign role",
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Assign Role
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Role to User</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => assignRole(data))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User ID</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    disabled={isPending}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(USER_ROLES).map(([key]) => (
                        <SelectItem key={key} value={key}>
                          {USER_ROLE_LABELS[key as keyof typeof USER_ROLES]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Assign Role
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
