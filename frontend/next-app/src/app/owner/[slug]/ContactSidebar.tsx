"use client";

import { Phone, Mail, Globe, MapPin, Navigation } from "lucide-react";
import { toast } from "sonner";

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

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };

  const sectionStyle: React.CSSProperties = {
    border: "1px solid var(--border)",
    backgroundColor: "var(--card)",
  };

  const rowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "0.875rem 0",
    borderBottom: "1px solid var(--border)",
    color: "var(--foreground)",
    cursor: "pointer",
    transition: "color 0.15s",
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Contact section */}
      <div style={sectionStyle}>
        <div
          className="px-6 py-4"
          style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--secondary)" }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: "var(--muted-foreground)" }}>
            Contact Information
          </p>
        </div>

        <div className="px-6">
          <button
            type="button"
            onClick={() => copyToClipboard(phone, "Phone")}
            className="w-full text-left group"
            style={rowStyle}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--primary)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--foreground)"; }}
            title="Click to copy"
          >
            <Phone className="h-4 w-4 shrink-0" style={{ color: "var(--primary)" }} />
            <span className="text-sm font-medium">{phone}</span>
          </button>

          <button
            type="button"
            onClick={() => copyToClipboard(email, "Email")}
            className="w-full text-left"
            style={rowStyle}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--primary)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--foreground)"; }}
            title="Click to copy"
          >
            <Mail className="h-4 w-4 shrink-0" style={{ color: "var(--primary)" }} />
            <span className="text-sm font-medium break-all">{email}</span>
          </button>

          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 text-sm font-medium transition-colors"
              style={{ ...rowStyle, borderBottom: "none" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--primary)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--foreground)"; }}
            >
              <Globe className="h-4 w-4 shrink-0" style={{ color: "var(--primary)" }} />
              Visit Website
            </a>
          )}
          {!website && <div style={{ height: "0.25rem" }} />}
        </div>

        {/* CTA */}
        <div className="px-6 pb-6">
          <a href={`tel:${phone}`} className="block">
            <button
              className="w-full py-3 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-85"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
                fontFamily: "var(--font-sans)",
              }}
            >
              <Phone className="inline h-3.5 w-3.5 mr-2" />
              Contact Now
            </button>
          </a>
        </div>
      </div>

      {/* Location section */}
      <div style={sectionStyle}>
        <div
          className="px-6 py-4"
          style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--secondary)" }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: "var(--muted-foreground)" }}>
            Location
          </p>
        </div>
        <div className="px-6 py-5">
          <div className="flex items-start gap-3 mb-5">
            <MapPin className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--primary)" }} />
            <div className="text-sm font-medium leading-relaxed" style={{ color: "var(--foreground)" }}>
              <p>{address}</p>
              <p style={{ color: "var(--muted-foreground)" }}>
                {city}, {state} {zipCode}
              </p>
            </div>
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              className="w-full py-2.5 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors"
              style={{
                border: "1px solid var(--border)",
                backgroundColor: "transparent",
                color: "var(--foreground)",
                fontFamily: "var(--font-sans)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)";
                (e.currentTarget as HTMLElement).style.color = "var(--primary)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLElement).style.color = "var(--foreground)";
              }}
            >
              <Navigation className="h-3.5 w-3.5" />
              Get Directions
            </button>
          </a>
        </div>
      </div>

      {/* Meta */}
      <p className="text-xs text-center font-medium" style={{ color: "var(--muted-foreground)" }}>
        Member since{" "}
        {new Date(createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
      </p>
    </div>
  );
}
