"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { api } from "@/lib/api";
import { OwnerForm } from "@/components/admin/OwnerForm";
import { Button } from "@/components/ui/button";
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
      <div className="flex justify-center py-24 text-slate-400">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
          <p className="font-medium">Loading details...</p>
        </div>
      </div>
    );
  }

  if (!owner) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Professional Not Found
          </h2>
          <p className="text-slate-500 mb-8">
            The directory entry you are attempting to edit could not be located.
          </p>
          <Button
            variant="outline"
            className="rounded-full px-8 shadow-sm"
            onClick={() => router.push("/admin")}
          >
            Return to Dashboard
          </Button>
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
    <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/admin")}
          className="text-slate-500 hover:text-slate-900 gap-2 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Admin Dashboard
        </Button>
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
            <Pencil className="h-6 w-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Edit Professional
          </h1>
        </div>
        <p className="text-slate-500 font-medium">
          Update the directory entry for {owner.businessName}.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg shadow-slate-200/40 border border-slate-100">
        <OwnerForm initialData={owner} onSubmit={handleSubmit} />
      </div>
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
