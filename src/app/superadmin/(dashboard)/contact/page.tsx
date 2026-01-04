"use client";

import React from "react";
import {
  useSuperAdminContactMessages,
  useSuperAdminDeleteContactMessage,
} from "@/hooks/super-admin/use-contact";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Mail, Phone, Calendar, User } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

import { ContactMessage } from "@/types/super-admin/contact";

export default function ContactMessagesPage() {
  const { data: messages, isLoading, isError } = useSuperAdminContactMessages();
  const { mutate: deleteMessage, isPending: isDeleting } =
    useSuperAdminDeleteContactMessage();

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      deleteMessage(id, {
        onSuccess: () => {
          toast.success("Message deleted successfully");
        },
        onError: () => {
          toast.error("Failed to delete message");
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="border-primary text-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        <p className="text-red-500">Failed to load messages</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Contact Messages
          </h1>
          <p className="text-muted-foreground">
            Manage and respond to messages submitted through the contact form.
          </p>
        </div>
        <div className="bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium">
          {messages?.length || 0} Total Messages
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {messages?.map((message: ContactMessage) => (
          <Card
            key={message.id}
            className="overflow-hidden border-slate-200 transition-all hover:shadow-md"
          >
            <CardHeader className="bg-slate-50/50 pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center text-sm font-medium text-slate-900">
                    <User className="mr-2 h-4 w-4 text-slate-400" />
                    {message.name}
                  </div>
                  <div className="flex items-center text-xs text-slate-500">
                    <Calendar className="mr-2 h-3 w-3" />
                    {format(new Date(message.created_at), "PPP p")}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 transition-colors hover:text-red-500"
                  onClick={() => handleDelete(message.id)}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-slate-600">
                  <Mail className="text-primary/70 mr-3 h-4 w-4" />
                  <a
                    href={`mailto:${message.email}`}
                    className="truncate hover:underline"
                  >
                    {message.email}
                  </a>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Phone className="text-primary/70 mr-3 h-4 w-4" />
                  <a
                    href={`tel:${message.phone_number}`}
                    className="hover:underline"
                  >
                    {message.phone_number}
                  </a>
                </div>
              </div>
              <div className="relative rounded-lg bg-slate-50 p-3 text-sm whitespace-pre-wrap text-slate-700 italic">
                "{message.message}"
              </div>
            </CardContent>
          </Card>
        ))}

        {messages?.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-20">
            <Mail className="mb-4 h-12 w-12 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-900">
              No messages yet
            </h3>
            <p className="text-slate-500">
              Messages will appear here when customers contact you.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
