import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star,
  ArrowLeft,
} from "lucide-react";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { ContactSidebar } from "./ContactSidebar";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    let owner;
    try {
      owner = await api.getOwnerBySlug(slug);
    } catch {
      owner = await api.getOwnerById(slug);
    }
    return {
      title: owner.metaTitle || owner.businessName,
      description: owner.metaDescription || owner.description.substring(0, 160),
      openGraph: {
        images: owner.ogImage ? [owner.ogImage] : undefined,
      },
    };
  } catch {
    return {
      title: "Professional Not Found | Owner Directory",
    };
  }
}

export default async function OwnerPage({ params }: Props) {
  const { slug } = await params;
  let owner;

  try {
    owner = await api.getOwnerBySlug(slug);
  } catch {
    // slug lookup failed — try treating it as a MongoDB ID
    try {
      owner = await api.getOwnerById(slug);
    } catch {
      notFound();
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Top action bar */}
      <div className="py-6 flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium text-sm bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Directory
        </Link>
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
  );
}
