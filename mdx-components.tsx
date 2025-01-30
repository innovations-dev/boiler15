import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import { highlight } from "sugar-high";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { cn } from "./lib/utils";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props: React.ComponentPropsWithoutRef<"h1">) => (
      <h1
        className={cn(
          "mb-4 mt-12 scroll-m-20 text-3xl font-semibold tracking-tight",
          "after:mt-4 after:block after:h-[1px] after:w-full after:bg-border/60"
        )}
        {...props}
      />
    ),
    h2: (props: React.ComponentPropsWithoutRef<"h2">) => (
      <h2
        className={cn(
          "mb-4 mt-12 scroll-m-20 text-3xl font-semibold tracking-tight",
          "after:mt-4 after:block after:h-[1px] after:w-full after:bg-border/60"
        )}
        {...props}
      />
    ),
    h3: (props: React.ComponentPropsWithoutRef<"h3">) => (
      <h3
        className={cn(
          "mb-4 mt-12 scroll-m-20 text-3xl font-semibold tracking-tight",
          "after:mt-4 after:block after:h-[1px] after:w-full after:bg-border/60"
        )}
        {...props}
      />
    ),
    h4: (props: React.ComponentPropsWithoutRef<"h4">) => (
      <h4
        className={cn(
          "mb-4 mt-12 scroll-m-20 text-3xl font-semibold tracking-tight",
          "after:mt-4 after:block after:h-[1px] after:w-full after:bg-border/60"
        )}
        {...props}
      />
    ),
    p: (props: React.ComponentPropsWithoutRef<"p">) => (
      <p className="mb-4 leading-7" {...props} />
    ),
    em: (props: React.ComponentPropsWithoutRef<"em">) => (
      <em className="font-medium" {...props} />
    ),
    strong: (props: React.ComponentPropsWithoutRef<"strong">) => (
      <strong className="font-medium" {...props} />
    ),
    blockquote: (props: React.ComponentPropsWithoutRef<"blockquote">) => (
      <blockquote className="mb-6 mt-6 border-l-2 pl-6 italic" {...props} />
    ),
    table: ({
      children,
      ...props
    }: React.ComponentPropsWithoutRef<"table">) => (
      <div className="my-6 w-full overflow-y-auto rounded-lg border">
        <Table {...props}>{children}</Table>
      </div>
    ),

    // Table header cell
    th: ({ children, ...props }: React.ComponentPropsWithoutRef<"th">) => (
      <TableHead className="border-b bg-muted/50 font-medium" {...props}>
        {children}
      </TableHead>
    ),

    // Table data cell
    td: ({ children, ...props }: React.ComponentPropsWithoutRef<"td">) => (
      <TableCell className="border-b p-4" {...props}>
        {children}
      </TableCell>
    ),

    // Table row
    tr: ({ children, ...props }: React.ComponentPropsWithoutRef<"tr">) => (
      <TableRow {...props}>{children}</TableRow>
    ),

    // Table header wrapper
    thead: ({
      children,
      ...props
    }: React.ComponentPropsWithoutRef<"thead">) => (
      <TableHeader {...props}>{children}</TableHeader>
    ),

    // Table body wrapper
    tbody: ({
      children,
      ...props
    }: React.ComponentPropsWithoutRef<"tbody">) => (
      <TableBody {...props}>{children}</TableBody>
    ),

    ul: (props: React.ComponentPropsWithoutRef<"ul">) => (
      <ul
        className="my-6 ml-6 list-disc space-y-2 [&>li]:leading-7"
        {...props}
      />
    ),
    ol: (props: React.ComponentPropsWithoutRef<"ol">) => (
      <ol
        className="my-6 ml-6 list-decimal space-y-2 [&>li]:leading-7"
        {...props}
      />
    ),
    li: (props: React.ComponentPropsWithoutRef<"li">) => (
      <li className="marker:text-foreground" {...props} />
    ),
    code: ({ children, ...props }: React.ComponentPropsWithoutRef<"code">) => {
      if (typeof children !== "string") {
        return (
          <code
            className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm"
            {...props}
          >
            {children}
          </code>
        );
      }

      const isBlock = children.includes("\n");

      if (isBlock) {
        const formattedCode = children.trim();
        const codeHTML = highlight(formattedCode);

        return (
          <div className="relative my-4">
            <div className="overflow-hidden rounded-lg border border-border/40 bg-zinc-950">
              <pre className="overflow-x-auto p-4">
                <code
                  className="relative block font-mono text-sm text-zinc-50"
                  dangerouslySetInnerHTML={{ __html: codeHTML }}
                  {...props}
                />
              </pre>
            </div>
          </div>
        );
      }

      return (
        <code
          className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm"
          {...props}
        >
          {children}
        </code>
      );
    },
    lead: (props: React.ComponentPropsWithoutRef<"p">) => (
      <p
        className="mb-6 text-xl text-muted-foreground sm:text-2xl"
        {...props}
      />
    ),
    small: (props: React.ComponentPropsWithoutRef<"small">) => (
      <small className="text-sm font-medium leading-none" {...props} />
    ),
    hr: () => (
      <div className="relative mt-4 inline-block w-full">
        <hr className="my-8 h-px border-0 bg-gray-200 dark:bg-gray-600" />
      </div>
    ),
    a: (props: React.ComponentPropsWithoutRef<"a">) => {
      const className = "text-blue-500 hover:text-blue-700";
      if (props.href?.startsWith("/")) {
        return (
          <Link href={props.href} className={className} {...props}>
            {props.children}
          </Link>
        );
      }
      if (props.href?.startsWith("#")) {
        return (
          <a href={props.href} className={className} {...props}>
            {props.children}
          </a>
        );
      }
      return (
        <a
          href={props.href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
          {...props}
        >
          {props.children}
        </a>
      );
    },

    ...components,
  };
}
