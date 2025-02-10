"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { NavItem as NavItemType, NavSection } from "../config/index";

export function NavLink({
  item,
  isActive,
}: {
  item: NavItemType;
  isActive: boolean;
}) {
  return (
    <div className="flex w-full items-center">
      <div className="w-4" /> {/* Spacer to align with items with chevrons */}
      <Link
        href={item.href}
        className={cn(
          "flex-1 rounded-md p-2 hover:bg-muted",
          isActive && "bg-muted font-medium text-foreground"
        )}
      >
        {item.name}
      </Link>
    </div>
  );
}

export function NavFolder({
  item,
  isExpanded,
  onToggleAction,
  level = 0,
}: {
  item: NavItemType | NavSection;
  isExpanded: boolean;
  onToggleAction: () => void;
  level?: number;
}) {
  const pathname = usePathname();
  const isTopLevel = level === 0;

  return (
    <div className="flex flex-col">
      {isTopLevel ? (
        <h4 className="mb-1 px-2 text-sm font-semibold tracking-tight">
          {item.name}
        </h4>
      ) : (
        <div className="flex flex-col">
          <div className="group flex w-full items-center">
            <button
              onClick={onToggleAction}
              className="h-6 w-4 rounded-sm hover:bg-muted-foreground/10"
              aria-label={isExpanded ? "Collapse section" : "Expand section"}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            {item.href ? (
              <Link
                href={item.href}
                className={cn(
                  "flex-1 rounded-md p-2 hover:bg-muted",
                  pathname === item.href &&
                    "bg-muted font-medium text-foreground"
                )}
              >
                {item.name}
              </Link>
            ) : (
              <span className="flex-1 p-2">{item.name}</span>
            )}
          </div>
        </div>
      )}
      {(isTopLevel || isExpanded) && item.children && (
        <div className={cn("flex flex-col gap-1", !isTopLevel && "ml-4")}>
          {item.children.map((child) => (
            <NavItem key={child.id} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function NavItem({
  item,
  level = 0,
}: {
  item: NavItemType | NavSection;
  level?: number;
}) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(
    pathname.startsWith(item.href || "") || level === 0
  );

  if (item.children?.length) {
    return (
      <NavFolder
        item={item}
        isExpanded={isExpanded}
        onToggleAction={() => setIsExpanded(!isExpanded)}
        level={level}
      />
    );
  }

  return (
    <NavLink item={item as NavItemType} isActive={pathname === item.href} />
  );
}
