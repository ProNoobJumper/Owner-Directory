"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Building2 } from "lucide-react";
import { api } from "@/lib/api";
import { OwnerForm } from "@/components/admin/OwnerForm";
import { Button } from "@/components/ui/button";
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
            <Building2 className="h-6 w-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Add New Professional
          </h1>
        </div>
        <p className="text-slate-500 font-medium">
          Create a new business profile in the directory. All fields are
          required unless marked otherwise.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg shadow-slate-200/40 border border-slate-100">
        <OwnerForm onSubmit={handleSubmit} />
      </div>
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
