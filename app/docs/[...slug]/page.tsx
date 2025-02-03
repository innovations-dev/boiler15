import { notFound } from "next/navigation";

import { generateStaticParams } from "../_utils/generate-static-params";

export { generateStaticParams };

// Enable static generation
export const dynamic = "force-static";
export const revalidate = false;

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function DocPage({ params }: PageProps) {
  const resolvedParams = await params;
  if (!resolvedParams?.slug?.length) {
    notFound();
  }

  try {
    const { default: MDXContent, metadata } = await import(
      `../../../content/docs/${resolvedParams.slug.join("/")}/page.mdx`
    );

    return (
      <>
        {metadata?.title && (
          <h1 className="mb-6 text-3xl font-bold">{metadata.title}</h1>
        )}
        <MDXContent />
      </>
    );
  } catch (error) {
    console.error("Failed to import MDX:", error);
    notFound();
  }
}
