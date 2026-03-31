import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Navigation,
} from "lucide-react";
import { api } from "../lib/api";
import { Owner } from "../types/owner";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

export function OwnerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api
        .getOwnerById(id)
        .then(setOwner)
        .catch(console.error)
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
            The directory entry you are looking for does not exist or has been
            removed.
          </p>
          <Link to="/">
            <Button className="rounded-full px-8 shadow-sm">
              Return to Directory
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Top action bar */}
      <div className="py-6 flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium text-sm bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Results
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg shadow-slate-200/40 border border-slate-100 overflow-hidden relative">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-8 relative z-10">
              <div>
                <Badge className="mb-4 bg-blue-50 text-blue-700 hover:bg-blue-100 border-none px-3 py-1 font-semibold rounded-lg">
                  {owner.category}
                </Badge>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-2">
                  {owner.businessName}
                </h1>
                <p className="text-xl font-medium text-slate-500">
                  Owned by {owner.name}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="flex items-center gap-1.5 text-blue-600 font-bold text-2xl">
                  <Star className="h-6 w-6 fill-blue-600" />
                  <span>{owner.rating}</span>
                </div>
                <div className="text-sm font-medium text-slate-500">
                  {owner.reviewCount} verified reviews
                </div>
              </div>
            </div>

            <div className="aspect-[21/9] w-full overflow-hidden rounded-2xl bg-slate-100 mb-8 z-10 relative shadow-inner">
              <img
                src={owner.image}
                alt={owner.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="prose prose-slate max-w-none">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                About the Business
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
                {owner.description}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Contact Card */}
          <div className="bg-white rounded-3xl p-8 shadow-lg shadow-slate-200/40 border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6">
              Contact Information
            </h3>
            <div className="space-y-5">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(owner.phone);
                  alert('Phone number copied to clipboard!');
                }}
                className="flex items-center gap-4 text-slate-600 hover:text-blue-600 transition-colors group w-full text-left cursor-pointer"
                title="Click to copy phone number"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                  <Phone className="h-5 w-5" />
                </div>
                <span className="font-medium">{owner.phone}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(owner.email);
                  alert('Email copied to clipboard!');
                }}
                className="flex items-center gap-4 text-slate-600 hover:text-blue-600 transition-colors group w-full text-left cursor-pointer"
                title="Click to copy email"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <span className="font-medium break-all">{owner.email}</span>
              </button>

              {owner.website && (
                <a
                  href={owner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-slate-600 hover:text-blue-600 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                    <Globe className="h-5 w-5" />
                  </div>
                  <span className="font-medium break-all">Visit Website</span>
                </a>
              )}
            </div>
            <a href={`tel:${owner.phone}`} className="block w-full mt-8">
              <Button className="w-full rounded-xl py-6 text-base font-semibold shadow-md shadow-blue-600/20 group">
                <Phone className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                Contact Now
              </Button>
            </a>
          </div>

          {/* Location Card */}
          <div className="bg-white rounded-3xl p-8 shadow-lg shadow-slate-200/40 border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Location</h3>
            <div className="flex items-start gap-4 text-slate-600">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5 text-slate-400" />
              </div>
              <div className="pt-2 font-medium leading-relaxed">
                <p className="text-slate-900">{owner.address}</p>
                <p>
                  {owner.city}, {owner.state} {owner.zipCode}
                </p>
              </div>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${owner.address}, ${owner.city}, ${owner.state} ${owner.zipCode}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full mt-6"
            >
              <Button
                variant="outline"
                className="w-full rounded-xl group hover:border-slate-300"
              >
                <Navigation className="mr-2 h-4 w-4 text-slate-400 group-hover:text-slate-600" />
                Get Directions
              </Button>
            </a>
          </div>

          {/* Meta Info */}
          <div className="text-center">
            <p className="text-sm font-medium text-slate-400">
              Member since{" "}
              {new Date(owner.createdAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
