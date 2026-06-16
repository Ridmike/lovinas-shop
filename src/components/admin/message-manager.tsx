"use client";

import { useState } from "react";
import { CheckCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { AdminMessage } from "@/types/admin";
import { Pagination } from "@/components/ui/pagination";
import { usePagination } from "@/components/ui/use-pagination";

const PAGE_SIZE = 8;

export function MessageManager({ messages }: { messages: AdminMessage[] }) {
  const [items, setItems] = useState(messages);
  const { page, setPage, totalPages, pageItems } = usePagination(items, PAGE_SIZE);

  async function markRead(id: string) {
    const response = await fetch("/admin/api/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) {
      toast.error("Unable to update message");
      return;
    }
    setItems((current) => current.map((message) => (message.id === id ? { ...message, status: "read", readAt: new Date().toISOString() } : message)));
    toast.success("Message marked read");
  }

  async function remove(id: string) {
    const response = await fetch(`/admin/api/messages?id=${id}`, { method: "DELETE" });
    if (!response.ok) {
      toast.error("Unable to delete message");
      return;
    }
    setItems((current) => current.filter((message) => message.id !== id));
    toast.success("Message deleted");
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
      {pageItems.map((message) => (
        <article key={message.id} className="rounded-[1.5rem] border border-black/5 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="font-semibold text-[#20303d]">{message.subject}</p>
              <p className="text-sm text-slate-500">{message.name} · {message.email}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{message.message}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => markRead(message.id)} className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-2 text-sm font-semibold">
                <CheckCheck className="h-4 w-4" />
                Mark read
              </button>
              <button type="button" onClick={() => remove(message.id)} className="inline-flex items-center gap-2 rounded-full bg-destructive-bg px-3 py-2 text-sm font-semibold text-destructive transition hover:bg-destructive hover:text-white">
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </article>
      ))}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}