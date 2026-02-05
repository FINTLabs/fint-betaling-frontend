import { Tag, Popover } from "@navikt/ds-react";
import { useState, useRef } from "react";
import { getStatusConfig, getStatusMessage } from "./OrderStatusConfig";

interface OrderStatusBadgeProps {
  claimStatus: string;
  statusMessage?: string;
  onClick?: (
    event: React.MouseEvent,
    statusMessage: string,
    statusValue: string,
  ) => void;
}

export function OrderStatusBadge({
  claimStatus,
  statusMessage,
  onClick,
}: OrderStatusBadgeProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const statusConfig = getStatusConfig(claimStatus, statusMessage);

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();

    // If onClick handler is provided, call it
    if (onClick) {
      onClick(event, statusMessage || "", statusConfig.value);
    }

    // Toggle popover if there's a status message
    if (statusMessage) {
      setPopoverOpen(!popoverOpen);
    }
  };

  // Get popover content - use status message or default message
  const popoverContent = getStatusMessage(statusMessage, statusConfig.value);

  const tag = (
    <span ref={anchorRef} style={{ display: "inline-block" }}>
      <Tag
        variant={statusConfig.color}
        size="small"
        icon={statusConfig.icon}
        className={
          statusMessage || onClick
            ? "cursor-pointer !rounded-xl"
            : "!rounded-xl"
        }
        style={{ borderRadius: "0.75rem" }}
        onClick={statusMessage || onClick ? handleClick : undefined}
        onKeyDown={
          statusMessage || onClick
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleClick(e as any);
                }
              }
            : undefined
        }
        role={statusMessage || onClick ? "button" : undefined}
        tabIndex={statusMessage || onClick ? 0 : undefined}
        aria-expanded={statusMessage ? popoverOpen : undefined}
        aria-label={
          statusMessage || onClick
            ? `${statusConfig.label} - Klikk for detaljer`
            : undefined
        }
      >
        {statusConfig.label}
      </Tag>
    </span>
  );

  // Wrap with Popover if there's additional information to show
  if (statusMessage) {
    return (
      <>
        {tag}
        <Popover
          open={popoverOpen}
          onClose={() => setPopoverOpen(false)}
          anchorEl={anchorRef.current}
          placement="top"
        >
          <Popover.Content>{popoverContent}</Popover.Content>
        </Popover>
      </>
    );
  }

  return tag;
}
