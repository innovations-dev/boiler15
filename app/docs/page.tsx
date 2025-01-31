import { default as MDXContent } from "../../content/docs/getting-started/introduction/page.mdx";

// Enable static generation
export const dynamic = "force-static";
export const revalidate = false;

export default function DocsPage() {
  return (
    <article className="mx-auto max-w-3xl py-10">
      <MDXContent />
    </article>
  );
}
