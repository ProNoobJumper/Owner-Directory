"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { OwnerForm } from "@/components/admin/OwnerForm";
import { Owner } from "@/types/owner";
import { toast } from "sonner";
import { RequireAuth } from "@/components/auth/RequireAuth";

function EditOwnerContent({ id }: { id: string }) {
  const router = useRouter();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api
        .getOwnerById(id)
        .then(setOwner)
        .catch((err) => {
          console.error(err);
          toast.error("Failed to fetch owner details");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div
        className="flex justify-center py-24"
        style={{ color: "var(--muted-foreground)" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="h-7 w-7 animate-spin rounded-full border-2 border-t-transparent"
            style={{ borderColor: "var(--border)", borderTopColor: "var(--primary)" }}
          />
          <p className="text-sm font-medium">Loading details…</p>
        </div>
      </div>
    );
  }

  if (!owner) {
    return (
      <div
        className="max-w-lg mx-auto px-6 py-24 text-center"
        style={{ backgroundColor: "var(--background)" }}
      >
        <div
          className="p-10"
          style={{ border: "1px solid var(--border)", backgroundColor: "var(--card)" }}
        >
          <h2
            className="font-display font-bold text-xl mb-3"
            style={{ color: "var(--foreground)" }}
          >
            Entry Not Found
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--muted-foreground)" }}>
            The directory entry you are attempting to edit could not be located.
          </p>
          <button
            onClick={() => router.push("/admin")}
            className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-80"
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
              fontFamily: "var(--font-sans)",
            }}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (data: Omit<Owner, "id" | "createdAt">) => {
    if (!id) return;
    try {
      await api.updateOwner(id, data);
      toast.success(`${data.businessName} has been updated successfully!`);
      router.refresh();
      router.push("/admin");
    } catch (err) {
      console.error(err);
      toast.error(`Failed to update ${data.businessName}`);
    }
  };

  return (
    <div
      className="px-6 sm:px-8 max-w-3xl mx-auto pt-10 pb-20"
      style={{ backgroundColor: "var(--background)" }}
    >
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

      <div
        className="mb-8 pb-6"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <p
          className="text-xs font-bold uppercase tracking-[0.3em] mb-2"
          style={{ color: "var(--primary)" }}
        >
          Edit Entry
        </p>
        <h1
          className="font-display font-black leading-none mb-2"
          style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", color: "var(--foreground)", letterSpacing: "-0.03em" }}
        >
          Edit Professional
        </h1>
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          Updating the directory entry for {owner.businessName}.
        </p>
      </div>

      <OwnerForm initialData={owner} onSubmit={handleSubmit} />
    </div>
  );
}

export default function EditOwner({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <RequireAuth requiredRole="admin">
      <EditOwnerContent id={id} />
    </RequireAuth>
  );
}
