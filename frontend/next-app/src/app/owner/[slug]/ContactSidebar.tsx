"use client";

import { Phone, Mail, Globe, MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContactSidebarProps {
  phone: string;
  email: string;
  website?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  createdAt: string;
}

export function ContactSidebar({
  phone,
  email,
  website,
  address,
  city,
  state,
  zipCode,
  createdAt,
}: ContactSidebarProps) {
  const fullAddress = `${address}, ${city}, ${state} ${zipCode}`;

  return (
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
              navigator.clipboard.writeText(phone);
              alert("Phone number copied to clipboard!");
            }}
            className="flex items-center gap-4 text-slate-600 hover:text-blue-600 transition-colors group w-full text-left cursor-pointer"
            title="Click to copy phone number"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
              <Phone className="h-5 w-5" />
            </div>
            <span className="font-medium">{phone}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(email);
              alert("Email copied to clipboard!");
            }}
            className="flex items-center gap-4 text-slate-600 hover:text-blue-600 transition-colors group w-full text-left cursor-pointer"
            title="Click to copy email"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
              <Mail className="h-5 w-5" />
            </div>
            <span className="font-medium break-all">{email}</span>
          </button>

          {website && (
            <a
              href={website}
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
        <a href={`tel:${phone}`} className="block w-full mt-8">
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
            <p className="text-slate-900">{address}</p>
            <p>
              {city}, {state} {zipCode}
            </p>
          </div>
        </div>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`}
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
          {new Date(createdAt).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}
