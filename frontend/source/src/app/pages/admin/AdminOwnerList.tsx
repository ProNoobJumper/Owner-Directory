import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Plus, Pencil, Trash2, Eye, LayoutGrid, Star } from "lucide-react";
import { api } from "../../lib/api";
import { Owner } from "../../types/owner";
import { Button } from "../../components/ui/button";
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
} from "../../components/ui/alert-dialog";
import { toast } from "sonner";
import { Badge } from "../../components/ui/badge";

export function AdminOwnerList() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);

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
      <div className="flex justify-center py-24 text-slate-400">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
          <p className="font-medium">Loading records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-blue-100 text-blue-600 p-1.5 rounded-lg shadow-sm">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-slate-500 font-medium">
            Manage the provider directory entries.
          </p>
        </div>
        <Link to="/admin/add">
          <Button className="rounded-full px-6 shadow-md shadow-blue-600/20 font-semibold gap-2 transition-transform hover:-translate-y-0.5">
            <Plus className="h-4 w-4" />
            Add New Professional
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/40 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm font-semibold tracking-wide">
                <th className="p-5 pl-8">Business Name</th>
                <th className="p-5">Owner</th>
                <th className="p-5">Category</th>
                <th className="p-5 hidden md:table-cell">Location</th>
                <th className="p-5 hidden sm:table-cell">Rating</th>
                <th className="p-5 pr-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {owners.map((owner) => (
                <tr
                  key={owner.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="p-5 pl-8">
                    <div className="font-bold text-slate-900">
                      {owner.businessName}
                    </div>
                    <div className="text-sm text-slate-500 hidden md:block truncate max-w-[200px]">
                      {owner.email}
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="font-medium text-slate-700">
                      {owner.name}
                    </div>
                  </td>
                  <td className="p-5">
                    <Badge
                      variant="secondary"
                      className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-none font-semibold"
                    >
                      {owner.category}
                    </Badge>
                  </td>
                  <td className="p-5 hidden md:table-cell text-slate-600 text-sm font-medium">
                    {owner.city}, {owner.state}
                  </td>
                  <td className="p-5 hidden sm:table-cell">
                    <div className="flex items-center gap-1.5 font-bold text-slate-700">
                      <span>{owner.rating}</span>
                      <Star className="h-3.5 w-3.5 fill-blue-500 text-blue-500" />
                    </div>
                  </td>
                  <td className="p-5 pr-8">
                    <div className="flex justify-end gap-2 text-slate-400">
                      <Link to={`/owner/${owner.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 rounded-xl hover:bg-slate-100 hover:text-slate-900"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link to={`/admin/edit/${owner.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 rounded-xl hover:bg-blue-50 hover:text-blue-600"
                          title="Edit Record"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0 rounded-xl hover:bg-red-50 hover:text-red-600 focus:text-red-600"
                            title="Delete Record"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-3xl border-none shadow-2xl p-8 max-w-md">
                          <AlertDialogHeader className="mb-6">
                            <AlertDialogTitle className="text-2xl font-bold text-slate-900">
                              Delete Entry?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-base text-slate-600 mt-2">
                              Are you sure you want to remove{" "}
                              <strong className="text-slate-900">
                                {owner.businessName}
                              </strong>
                              ? This action cannot be undone and will
                              permanently delete this owner's data from our
                              servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="gap-3 sm:gap-0">
                            <AlertDialogCancel className="rounded-full px-6 border-slate-200 text-slate-700 font-medium">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleDelete(owner.id, owner.businessName)
                              }
                              className="rounded-full px-6 bg-red-600 text-white hover:bg-red-700 shadow-sm font-semibold"
                            >
                              Delete Entry
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
              {owners.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-16 text-center text-slate-500 font-medium"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <LayoutGrid className="w-12 h-12 text-slate-200 mb-4" />
                      <p>No professionals have been added yet.</p>
                    </div>
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
