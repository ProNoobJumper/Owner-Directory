"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, Star, ShieldAlert } from "lucide-react";
import { api } from "@/lib/api";
import { Owner } from "@/types/owner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useAuth } from "@/context/AuthContext";

function AdminOwnerListContent() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  const loadOwners = async () => {
    try {
      setLoading(true);
      const res = await api.getOwners(0, 100);
      setOwners(res.content);
    } catch (err) {
      toast.error("Failed to load owners");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOwners();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    try {
      await api.deleteOwner(id);
      setOwners(owners.filter((o) => o.id !== id));
      toast.success(`${name} has been deleted successfully`);
    } catch (err) {
      toast.error(`Failed to delete ${name}`);
      console.error(err);
    }
  };

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
          <p className="text-sm font-medium">Loading records…</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="px-6 sm:px-8 max-w-7xl mx-auto pb-20 pt-10"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Page header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-8 pb-6"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div>
          <p
            className="text-xs font-bold uppercase tracking-[0.3em] mb-2"
            style={{ color: "var(--primary)" }}
          >
            Management
          </p>
          <h1
            className="font-display font-black leading-none mb-2"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", color: "var(--foreground)", letterSpacing: "-0.03em" }}
          >
            Admin Dashboard
          </h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            Manage the provider directory entries.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!isAdmin && (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider"
              style={{
                color: "var(--primary)",
                border: "1px solid var(--primary)",
                backgroundColor: "transparent",
              }}
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              View Only
            </div>
          )}
          {isAdmin && (
            <Link href="/admin/add">
              <button
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-85"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "var(--primary-foreground)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                <Plus className="h-3.5 w-3.5" />
                Add New Professional
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Table */}
      <div
        className="overflow-hidden"
        style={{ border: "1px solid var(--border)", backgroundColor: "var(--card)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ backgroundColor: "var(--secondary)", borderBottom: "1px solid var(--border)" }}>
                {["Business Name", "Owner", "Category", "Location", "Rating", "Actions"].map((h, i) => (
                  <th
                    key={h}
                    className={`py-3.5 text-xs font-bold uppercase tracking-widest ${i === 0 ? "pl-6 pr-4" : i === 5 ? "pr-6 pl-4 text-right" : "px-4"} ${i === 3 ? "hidden md:table-cell" : i === 4 ? "hidden sm:table-cell" : ""}`}
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {owners.map((owner, idx) => (
                <tr
                  key={owner.id}
                  style={{
                    borderBottom: idx < owners.length - 1 ? "1px solid var(--border)" : "none",
                    backgroundColor: "var(--card)",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--secondary)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--card)"; }}
                >
                  <td className="py-4 pl-6 pr-4">
                    <div className="font-bold text-sm" style={{ color: "var(--foreground)" }}>
                      {owner.businessName}
                    </div>
                    <div className="text-xs mt-0.5 hidden md:block truncate max-w-[180px]" style={{ color: "var(--muted-foreground)" }}>
                      {owner.email}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                      {owner.name}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5"
                      style={{
                        backgroundColor: "var(--accent)",
                        color: "var(--accent-foreground)",
                      }}
                    >
                      {owner.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 hidden md:table-cell text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>
                    {owner.city}, {owner.state}
                  </td>
                  <td className="py-4 px-4 hidden sm:table-cell">
                    <div className="flex items-center gap-1 text-sm font-bold" style={{ color: "var(--foreground)" }}>
                      {owner.rating}
                      <Star className="h-3 w-3" style={{ fill: "var(--primary)", color: "var(--primary)" }} />
                    </div>
                  </td>
                  <td className="py-4 pr-6 pl-4">
                    <div className="flex justify-end gap-1">
                      <Link href={`/owner/${owner.slug || owner.id}`}>
                        <IconBtn title="View">
                          <Eye className="h-3.5 w-3.5" />
                        </IconBtn>
                      </Link>
                      {isAdmin && (
                        <>
                          <Link href={`/admin/edit/${owner.id}`}>
                            <IconBtn title="Edit">
                              <Pencil className="h-3.5 w-3.5" />
                            </IconBtn>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <IconBtn title="Delete" danger>
                                <Trash2 className="h-3.5 w-3.5" />
                              </IconBtn>
                            </AlertDialogTrigger>
                            <AlertDialogContent
                              className="border p-0 overflow-hidden max-w-sm"
                              style={{
                                backgroundColor: "var(--card)",
                                borderColor: "var(--border)",
                                borderRadius: 0,
                                boxShadow: "0 20px 60px -10px oklch(0 0 0 / 0.4)",
                              }}
                            >
                              <div
                                className="h-0.5 w-full"
                                style={{ backgroundColor: "var(--destructive)" }}
                              />
                              <AlertDialogHeader className="p-7 pb-4">
                                <AlertDialogTitle
                                  className="font-display font-bold text-xl"
                                  style={{ color: "var(--foreground)" }}
                                >
                                  Delete Entry?
                                </AlertDialogTitle>
                                <AlertDialogDescription
                                  className="text-sm leading-relaxed"
                                  style={{ color: "var(--muted-foreground)" }}
                                >
                                  Remove <strong style={{ color: "var(--foreground)" }}>{owner.businessName}</strong> permanently. This cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter
                                className="px-7 pb-7 gap-2"
                                style={{ borderTop: "1px solid var(--border)", paddingTop: "1.25rem", marginTop: "1rem" }}
                              >
                                <AlertDialogCancel
                                  className="rounded-none text-xs font-bold uppercase tracking-wider px-5 h-9"
                                  style={{ border: "1px solid var(--border)", backgroundColor: "transparent", color: "var(--foreground)" }}
                                >
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(owner.id, owner.businessName)}
                                  className="rounded-none text-xs font-bold uppercase tracking-wider px-5 h-9"
                                  style={{ backgroundColor: "var(--destructive)", color: "#fff", border: "none" }}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {owners.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-20 text-center" style={{ color: "var(--muted-foreground)" }}>
                    <p className="font-display font-bold text-lg mb-1" style={{ color: "var(--foreground)" }}>
                      No entries yet
                    </p>
                    <p className="text-sm">Add the first professional to get started.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function IconBtn({
  children,
  title,
  danger,
  onClick,
}: {
  children: React.ReactNode;
  title?: string;
  danger?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-8 h-8 flex items-center justify-center transition-colors"
      style={{ color: "var(--muted-foreground)", backgroundColor: "transparent" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = danger ? "oklch(0.97 0.02 27)" : "var(--secondary)";
        (e.currentTarget as HTMLElement).style.color = danger ? "var(--destructive)" : "var(--foreground)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
        (e.currentTarget as HTMLElement).style.color = "var(--muted-foreground)";
      }}
    >
      {children}
    </button>
  );
}

export default function AdminOwnerList() {
  return (
    <RequireAuth>
      <AdminOwnerListContent />
    </RequireAuth>
  );
}
