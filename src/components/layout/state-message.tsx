import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import type { ReactNode } from "react";

interface StateMessageProps {
  icon: ReactNode;
  title: string;
  description: string;
  children?: ReactNode;
}

export function StateMessage({
  icon,
  title,
  description,
  children,
}: StateMessageProps) {
  return (
    <div className="shell">
      <Empty className="state-message">
        <EmptyHeader className="max-w-none">
          <EmptyMedia variant="icon">{icon}</EmptyMedia>
          <EmptyTitle>
            <h1 className="state-message__title">{title}</h1>
          </EmptyTitle>
          <EmptyDescription className="state-message__text">
            {description}
          </EmptyDescription>
        </EmptyHeader>
        {children && (
          <EmptyContent className="state-message__actions max-w-none">
            {children}
          </EmptyContent>
        )}
      </Empty>
    </div>
  );
}
