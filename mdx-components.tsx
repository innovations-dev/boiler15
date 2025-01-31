import React, { Fragment } from "react";
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
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// Wrapper to handle whitespace in table elements
function TableWrapper({ children }: { children: React.ReactNode }) {
  if (typeof children === "string") return null;
  return <Fragment>{children}</Fragment>;
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Headers
    h1: ({ className, ...props }: React.ComponentPropsWithoutRef<"h1">) => (
      <h1
        className={cn(
          "mb-4 mt-12 scroll-m-20 text-3xl font-semibold tracking-tight",
          "after:mt-4 after:block after:h-[1px] after:w-full after:bg-border/60",
          className
        )}
        {...props}
      />
    ),
    h2: ({ className, ...props }: React.ComponentPropsWithoutRef<"h2">) => (
      <h2
        className={cn(
          "mb-4 mt-12 scroll-m-20 text-2xl font-semibold tracking-tight",
          "after:mt-4 after:block after:h-[1px] after:w-full after:bg-border/60",
          className
        )}
        {...props}
      />
    ),
    h3: ({ className, ...props }: React.ComponentPropsWithoutRef<"h3">) => (
      <h3
        className={cn(
          "mb-4 mt-12 scroll-m-20 text-xl font-semibold tracking-tight",
          className
        )}
        {...props}
      />
    ),
    h4: ({ className, ...props }: React.ComponentPropsWithoutRef<"h4">) => (
      <h4
        className={cn(
          "mb-4 mt-12 scroll-m-20 text-lg font-semibold tracking-tight",
          className
        )}
        {...props}
      />
    ),
    // Basic elements
    p: ({ className, ...props }: React.ComponentPropsWithoutRef<"p">) => (
      <p className={cn("mb-4 leading-7", className)} {...props} />
    ),
    em: ({ className, ...props }: React.ComponentPropsWithoutRef<"em">) => (
      <em className={cn("italic", className)} {...props} />
    ),
    strong: ({
      className,
      ...props
    }: React.ComponentPropsWithoutRef<"strong">) => (
      <strong className={cn("font-bold", className)} {...props} />
    ),
    del: ({ className, ...props }: React.ComponentPropsWithoutRef<"del">) => (
      <del className={cn("line-through", className)} {...props} />
    ),
    hr: ({ className, ...props }: React.ComponentPropsWithoutRef<"hr">) => (
      <hr className={cn("my-8 border-border", className)} {...props} />
    ),
    // Lists
    ul: ({ className, ...props }: React.ComponentPropsWithoutRef<"ul">) => (
      <ul
        className={cn(
          "my-6 ml-6 list-disc space-y-2 [&>li]:leading-7",
          className
        )}
        {...props}
      />
    ),
    ol: ({ className, ...props }: React.ComponentPropsWithoutRef<"ol">) => (
      <ol
        className={cn(
          "my-6 ml-6 list-decimal space-y-2 [&>li]:leading-7",
          className
        )}
        {...props}
      />
    ),
    li: ({ className, ...props }: React.ComponentPropsWithoutRef<"li">) => (
      <li className={cn("marker:text-foreground", className)} {...props} />
    ),
    // Blockquotes
    blockquote: ({
      className,
      ...props
    }: React.ComponentPropsWithoutRef<"blockquote">) => (
      <blockquote
        className={cn(
          "mt-6 border-l-2 pl-6 italic [&>*]:text-muted-foreground",
          className
        )}
        {...props}
      />
    ),
    // Tables
    table: ({
      className,
      children,
      ...props
    }: React.ComponentPropsWithoutRef<"table">) => {
      const childArray = React.Children.toArray(children).filter(
        (child) => typeof child !== "string" || child.trim() !== ""
      );
      return (
        <div className="my-6 w-full overflow-y-auto">
          <Table className={className} {...props}>
            {childArray}
          </Table>
        </div>
      );
    },
    tr: ({
      className,
      children,
      ...props
    }: React.ComponentPropsWithoutRef<"tr">) => {
      const childArray = React.Children.toArray(children).filter(
        (child) => typeof child !== "string" || child.trim() !== ""
      );
      return (
        <TableRow
          className={cn("border-b transition-colors", className)}
          {...props}
        >
          {childArray}
        </TableRow>
      );
    },
    thead: ({
      className,
      children,
      ...props
    }: React.ComponentPropsWithoutRef<"thead">) => {
      const childArray = React.Children.toArray(children).filter(
        (child) => typeof child !== "string" || child.trim() !== ""
      );
      return (
        <TableHeader className={className} {...props}>
          {childArray}
        </TableHeader>
      );
    },
    tbody: ({
      className,
      children,
      ...props
    }: React.ComponentPropsWithoutRef<"tbody">) => {
      const childArray = React.Children.toArray(children).filter(
        (child) => typeof child !== "string" || child.trim() !== ""
      );
      return (
        <TableBody className={className} {...props}>
          {childArray}
        </TableBody>
      );
    },
    th: ({ className, ...props }: React.ComponentPropsWithoutRef<"th">) => (
      <TableHead
        className={cn(
          "h-12 px-4 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0",
          className
        )}
        {...props}
      />
    ),
    td: ({ className, ...props }: React.ComponentPropsWithoutRef<"td">) => (
      <TableCell
        className={cn(
          "p-4 align-middle [&:has([role=checkbox])]:pr-0",
          className
        )}
        {...props}
      />
    ),
    // Code blocks
    code: ({ className, ...props }: React.ComponentPropsWithoutRef<"code">) => {
      const isInline = !props.children?.toString().includes("\n");
      if (isInline) {
        return (
          <code
            className={cn(
              "rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm",
              className
            )}
            {...props}
          />
        );
      }

      const content = props.children?.toString() || "";
      const codeHTML = highlight(content);

      return (
        <div className="relative my-4">
          <div className="overflow-hidden rounded-lg border bg-zinc-950">
            <pre className="overflow-x-auto p-4">
              <code
                className={cn(
                  "relative block font-mono text-sm text-zinc-50",
                  className
                )}
                dangerouslySetInnerHTML={{ __html: codeHTML }}
              />
            </pre>
          </div>
        </div>
      );
    },
    // Links
    a: ({ className, href, ...props }: React.ComponentPropsWithoutRef<"a">) => {
      if (href?.startsWith("/")) {
        return (
          <Link
            className={cn(
              "font-medium underline underline-offset-4",
              className
            )}
            href={href}
            {...props}
          />
        );
      }
      return (
        <a
          className={cn("font-medium underline underline-offset-4", className)}
          target="_blank"
          rel="noopener noreferrer"
          href={href}
          {...props}
        />
      );
    },
    ...components,
  };
}
