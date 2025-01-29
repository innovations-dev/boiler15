"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

interface NotFoundAnimationProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function NotFoundAnimation({
  className,
  ...props
}: NotFoundAnimationProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  const numberRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const circle = circleRef.current;
    const number = numberRef.current;

    if (!circle || !number) return;

    // Simple floating animation
    const floatAnimation = () => {
      let y = 0;
      let direction = 1;

      const animate = () => {
        y += 0.5 * direction;
        if (y > 10) direction = -1;
        if (y < 0) direction = 1;

        number.setAttribute("transform", `translate(0, ${y})`);
        requestAnimationFrame(animate);
      };

      animate();
    };

    floatAnimation();
  }, []);

  return (
    <svg
      viewBox="0 0 200 200"
      className={cn("text-primary", className)}
      {...props}
    >
      {/* Background circle */}
      <circle
        ref={circleRef}
        cx="100"
        cy="100"
        r="90"
        fill="currentColor"
        fillOpacity="0.1"
        className="animate-pulse"
      />

      {/* 404 Text */}
      <g ref={numberRef}>
        <text
          x="100"
          y="120"
          fontSize="48"
          fontWeight="bold"
          textAnchor="middle"
          fill="currentColor"
        >
          404
        </text>
      </g>

      {/* Decorative elements */}
      <circle
        cx="100"
        cy="100"
        r="95"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="8 8"
        className="animate-spin-slow"
      />
    </svg>
  );
}
