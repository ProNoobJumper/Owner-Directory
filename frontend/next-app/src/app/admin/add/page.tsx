"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { OwnerForm } from "@/components/admin/OwnerForm";
import { Owner } from "@/types/owner";
import { toast } from "sonner";
import { RequireAuth } from "@/components/auth/RequireAuth";

function AddOwnerContent() {
  const router = useRouter();

  const handleSubmit = async (data: Omit<Owner, "id" | "createdAt">) => {
    try {
      await api.createOwner(data);
      toast.success(`${data.businessName} has been added successfully!`);
      router.refresh();
      router.push("/admin");
    } catch (err) {
      console.error(err);
      toast.error(`Failed to add ${data.businessName}`);
    }
  };

  return (
    <div
      className="px-6 sm:px-8 max-w-3xl mx-auto pt-10 pb-20"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Back link */}
      <button
        onClick={() => router.push("/admin")}
        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-8 transition-colors"
        style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-sans)" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--foreground)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--muted-foreground)"; }}
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Dashboard
      </button>

      {/* Page header */}
      <div
        className="mb-8 pb-6"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <p
          className="text-xs font-bold uppercase tracking-[0.3em] mb-2"
          style={{ color: "var(--primary)" }}
        >
          New Entry
        </p>
        <h1
          className="font-display font-black leading-none mb-2"
          style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", color: "var(--foreground)", letterSpacing: "-0.03em" }}
        >
          Add Professional
        </h1>
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          Create a new business profile. All fields required unless marked optional.
        </p>
      </div>

      {/* Form container — flat, on-surface, no card */}
      <OwnerForm onSubmit={handleSubmit} />
    </div>
  );
}

export default function AddOwner() {
  return (
    <RequireAuth requiredRole="admin">
      <AddOwnerContent />
    </RequireAuth>
  );
}
