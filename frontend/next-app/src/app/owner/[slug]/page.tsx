import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { ContactSidebar } from "./ContactSidebar";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    let owner;
    try { owner = await api.getOwnerBySlug(slug); }
    catch { owner = await api.getOwnerById(slug); }
    return {
      title: owner.metaTitle || owner.businessName,
      description: owner.metaDescription || owner.description.substring(0, 160),
      openGraph: { images: owner.ogImage ? [owner.ogImage] : undefined },
    };
  } catch {
    return { title: "Professional Not Found | Owner Directory" };
  }
}

export default async function OwnerPage({ params }: Props) {
  const { slug } = await params;
  let owner;

  try { owner = await api.getOwnerBySlug(slug); }
  catch {
    try { owner = await api.getOwnerById(slug); }
    catch { notFound(); }
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Top bar */}
      <div
        className="border-b"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors"
            style={{ color: "var(--muted-foreground)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--foreground)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--muted-foreground)"; }}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Directory
          </Link>
          <span
            className="text-[11px] font-bold uppercase tracking-[0.25em] px-2.5 py-0.5"
            style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            {owner.category}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main content */}
          <div className="lg:col-span-2 flex flex-col gap-0">
            {/* Hero image — full bleed, no card */}
            <div
              className="w-full overflow-hidden"
              style={{ aspectRatio: "16/7", backgroundColor: "var(--secondary)" }}
            >
              <img
                src={owner.image}
                alt={owner.businessName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Business header */}
            <div
              className="p-7 sm:p-10"
              style={{
                backgroundColor: "var(--card)",
                borderLeft: "1px solid var(--border)",
                borderRight: "1px solid var(--border)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-7">
                <div className="flex-1">
                  <h1
                    className="font-display font-black mb-2 leading-none"
                    style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", color: "var(--foreground)", letterSpacing: "-0.03em" }}
                  >
                    {owner.businessName}
                  </h1>
                  <p className="text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>
                    Owned by {owner.name}
                  </p>
                </div>
                <div
                  className="flex items-center gap-2 px-4 py-3 shrink-0"
                  style={{ border: "1px solid var(--border)", backgroundColor: "var(--secondary)" }}
                >
                  <Star
                    className="h-5 w-5"
                    style={{ fill: "var(--primary)", color: "var(--primary)" }}
                  />
                  <div>
                    <div className="text-lg font-black leading-none" style={{ color: "var(--foreground)" }}>
                      {owner.rating}
                    </div>
                    <div className="text-[11px] font-medium mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                      {owner.reviewCount} reviews
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: "1px", backgroundColor: "var(--border)", marginBottom: "1.75rem" }} />

              {/* Description */}
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-[0.25em] mb-4"
                  style={{ color: "var(--primary)" }}
                >
                  About the Business
                </p>
                <p
                  className="text-sm leading-relaxed whitespace-pre-line"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {owner.description}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <ContactSidebar
            phone={owner.phone}
            email={owner.email}
            website={owner.website}
            address={owner.address}
            city={owner.city}
            state={owner.state}
            zipCode={owner.zipCode}
            createdAt={owner.createdAt}
          />
        </div>
      </div>
    </div>
  );
}
