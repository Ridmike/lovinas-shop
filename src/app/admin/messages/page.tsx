import type { Metadata } from "next";
import { MessageManager } from "@/components/admin/message-manager";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminSession } from "@/lib/admin-auth";
import { listMessages } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Messages", description: "Customer messages", robots: { index: false, follow: false } };

export default async function AdminMessagesPage() {
  const session = await requireAdminSession();
  const messages = await listMessages();
  return (
    <AdminShell session={session}>
      <MessageManager messages={messages} />
    </AdminShell>
  );
}