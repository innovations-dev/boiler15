import { notFound } from "next/navigation";

import { generateStaticParams } from "../_utils/generate-static-params";

export { generateStaticParams };

// Enable static generation
export const dynamic = "force-static";
export const revalidate = false;

interface PageProps {
  params: {
    slug: string[];
  };
}

export default async function DocPage({ params }: PageProps) {
  const resolvedParams = await params;
  if (!resolvedParams?.slug?.length) {
    notFound();
  }

  try {
    const { default: MDXContent } = await import(
      `../../../content/docs/${resolvedParams.slug.join("/")}/page.mdx`
    );

    return (
      <article className="mx-auto max-w-3xl py-10">
        <MDXContent />
      </article>
    );
  } catch (error) {
    console.error("Failed to import MDX:", error);
    notFound();
  }
}
