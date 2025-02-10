import MDXLayout from "../docs/_components/mdx-layout";

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MDXLayout>{children}</MDXLayout>;
}
