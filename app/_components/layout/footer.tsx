import * as React from "react";
import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { Container } from "@/components/container";
import { navigationRoutes } from "@/config/routes.config";
import { cn } from "@/lib/utils";

const footerVariants = cva("w-full border-t", {
  variants: {
    variant: {
      default: "bg-background/95 border-border",
      transparent: "bg-transparent border-transparent",
      contrast: "bg-muted/50 border-muted",
      floating:
        "bg-background/60 border shadow-sm mx-auto max-w-7xl rounded-b-lg",
    },
    size: {
      default: "py-12 md:py-16",
      sm: "py-8 md:py-12",
      lg: "py-16 md:py-20",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

interface FooterRootProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof footerVariants> {
  as?: React.ElementType;
  containerClassName?: string;
  isFullWidth?: boolean;
}

interface FooterElementProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const FooterRoot = React.forwardRef<HTMLElement, FooterRootProps>(
  (
    {
      className,
      as: Component = "footer",
      containerClassName,
      variant,
      size,
      isFullWidth = false,
      children,
      ...props
    },
    ref
  ) => {
    const Wrapper = isFullWidth ? React.Fragment : Container;
    const wrapperProps = isFullWidth ? {} : { className: containerClassName };

    return (
      <Component
        ref={ref}
        className={cn(footerVariants({ variant, size }), className)}
        {...props}
      >
        <Wrapper {...wrapperProps}>
          <div className="px-4">{children}</div>
        </Wrapper>
      </Component>
    );
  }
);
FooterRoot.displayName = "Footer";

const FooterBrand = React.forwardRef<HTMLDivElement, FooterElementProps>(
  ({ asChild, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn(
          "col-span-2 flex flex-col gap-4 md:col-span-1 md:max-w-[280px]",
          className
        )}
        {...props}
      />
    );
  }
);
FooterBrand.displayName = "Footer.Brand";

const FooterNav = React.forwardRef<HTMLDivElement, FooterElementProps>(
  ({ asChild, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn(
          "grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]",
          className
        )}
        {...props}
      />
    );
  }
);
FooterNav.displayName = "Footer.Nav";

const FooterNavSection = React.forwardRef<
  HTMLDivElement,
  FooterElementProps & { title: string }
>(({ asChild, className, title, ...props }, ref) => {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp ref={ref} className={cn("space-y-3", className)} {...props}>
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="space-y-3" aria-label={`${title} links`}>
        {props.children}
      </ul>
    </Comp>
  );
});
FooterNavSection.displayName = "Footer.NavSection";

const FooterLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<typeof Link>
>(({ className, ...props }, ref) => {
  return (
    <Link
      ref={ref}
      className={cn(
        "text-sm text-muted-foreground transition-colors hover:text-foreground",
        className
      )}
      {...props}
    />
  );
});
FooterLink.displayName = "Footer.Link";

const FooterBottom = React.forwardRef<HTMLDivElement, FooterElementProps>(
  ({ asChild, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn("mt-12 border-t pt-8 text-center", className)}
        {...props}
      />
    );
  }
);
FooterBottom.displayName = "Footer.Bottom";

const Footer = Object.assign(FooterRoot, {
  Brand: FooterBrand,
  Nav: FooterNav,
  NavSection: FooterNavSection,
  Link: FooterLink,
  Bottom: FooterBottom,
});

export { Footer, footerVariants };

export function SiteFooter() {
  return (
    <Footer
      variant="floating"
      size="default"
      className="mx-auto max-w-7xl px-4"
    >
      <Footer.Nav>
        <Footer.Brand>
          <Footer.Link href="/" className="text-xl font-bold">
            Your Logo
          </Footer.Link>
          <p className="text-sm text-muted-foreground">
            Production-ready template with everything you need to build fast,
            modern, and scalable web applications.
          </p>
        </Footer.Brand>

        {Object.entries(navigationRoutes).map(([section, links]) => (
          <Footer.NavSection key={section} title={section}>
            {links.map((link) => (
              <li key={link.name}>
                <Footer.Link href={link.href}>{link.name}</Footer.Link>
              </li>
            ))}
          </Footer.NavSection>
        ))}
      </Footer.Nav>

      <Footer.Bottom>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Your Company, Inc. All rights reserved.
        </p>
      </Footer.Bottom>
    </Footer>
  );
}
