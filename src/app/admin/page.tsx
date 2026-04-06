import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { MessageList } from "@/components/admin/MessageList";

export default async function AdminPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-svh bg-base">
      <header className="border-b border-border px-5 py-4 print:hidden">
        <h1 className="font-cormorant text-[18px] tracking-[0.1em] text-text">
          Admin &mdash; Messages
        </h1>
      </header>
      <main className="mx-auto max-w-[800px] px-5 py-8">
        <MessageList />
      </main>
    </div>
  );
}
