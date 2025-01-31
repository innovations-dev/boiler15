import Introduction, {
  metadata as introMetadata,
} from "./getting-started/introduction/page.mdx";

export default function DocsPage() {
  console.log("Introduction metadata:", introMetadata);
  return (
    <div className="mx-auto max-w-3xl py-10">
      <h1 className="mb-6 text-3xl font-bold">{introMetadata.title}</h1>
      <Introduction />
    </div>
  );
}
