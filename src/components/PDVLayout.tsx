import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PDVLayoutProps {
  children: ReactNode;
  className?: string;
}

export const PDVLayout = ({ children, className }: PDVLayoutProps) => {
  return (
    <div className={cn(
      "min-h-screen bg-background",
      className
    )}>
      {children}
    </div>
  );
};