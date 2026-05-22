import {
  BankNoteIcon,
  CheckmarkCircleIcon,
  ExclamationmarkTriangleIcon,
  InformationIcon,
  RoadblockIcon,
  XMarkIcon,
} from "@navikt/aksel-icons";
import type { ReactNode } from "react";

export interface ClaimStatusConfig {
  value: string;
  icon: ReactNode;
  label: string;
  color: "info" | "success" | "warning" | "error" | "neutral";
}

export const ORDER_STATUS_LIST: ClaimStatusConfig[] = [
  {
    value: "STORED",
    icon: <InformationIcon title="Ikke sendt" fontSize="1rem" />,
    label: "Ikke sendt",
    color: "info",
  },
  {
    value: "SENT",
    icon: <BankNoteIcon title="Sendt" fontSize="1rem" />,
    label: "Sendt",
    color: "info",
  },
  {
    value: "ACCEPTED",
    icon: <BankNoteIcon title="Klar" fontSize="1rem" />,
    label: "Klar",
    color: "success",
  },
  {
    value: "ISSUED",
    icon: <BankNoteIcon title="Fakturert" fontSize="1rem" />,
    label: "Fakturert",
    color: "success",
  },
  {
    value: "PAID",
    icon: <CheckmarkCircleIcon title="Betalt" fontSize="1rem" />,
    label: "Betalt",
    color: "success",
  },
  {
    value: "CREDITED",
    icon: <XMarkIcon title="Kreditert" fontSize="1rem" />,
    label: "Kreditert",
    color: "success",
  },
  {
    value: "UPDATE_ERROR",
    icon: (
      <ExclamationmarkTriangleIcon title="Oppdateringsfeil" fontSize="1rem" />
    ),
    label: "Oppdateringsfeil",
    color: "error",
  },
  {
    value: "ACCEPT_ERROR",
    icon: (
      <ExclamationmarkTriangleIcon
        title="Feil fra økonomisystemet"
        fontSize="1rem"
      />
    ),
    label: "Feil fra økonomisystemet",
    color: "error",
  },
  {
    value: "SEND_ERROR",
    icon: (
      <ExclamationmarkTriangleIcon title="Feil ved sending" fontSize="1rem" />
    ),
    label: "Feil ved sending",
    color: "error",
  },
  {
    value: "ERROR",
    icon: <ExclamationmarkTriangleIcon title="Generell feil" fontSize="1rem" />,
    label: "Generell feil",
    color: "error",
  },
  {
    value: "CANCELLED",
    icon: <RoadblockIcon title="Kansellerte" fontSize="1rem" />,
    label: "Kansellerte",
    color: "warning",
  },
];

export const DEFAULT_STATUS_CONFIG: ClaimStatusConfig = {
  value: "",
  icon: <ExclamationmarkTriangleIcon title="Ukjent status" fontSize="1rem" />,
  label: "Klarte ikke finne ordrestatus",
  color: "error",
};

/**
 * Get the appropriate message to display for a status.
 * Similar to the old getMessage function, handles JSON parsing and default messages.
 */
export function getStatusMessage(
  statusMessage?: string,
  statusValue?: string,
  errorMessage?: string,
): string {
  // Special handling for STORED status
  if (statusValue === "STORED") {
    return (
      "Ordre er lagret, men ikke sendt til økonomisystem. Gå til 'Send ordre' i " +
      "hovedmenyen til venstre for å sende ordre til økonomisystem"
    );
  }

  // Try to parse JSON message if present
  if (statusMessage) {
    try {
      const parsed = JSON.parse(statusMessage);
      if (parsed.message) {
        return parsed.message;
      }
      return statusMessage;
    } catch {
      // If not JSON, return as-is
      return statusMessage;
    }
  }

  // Fallback to error message if provided
  if (errorMessage) {
    return errorMessage;
  }

  // Default fallback
  return "Sorry, men vi har ikke fått noen detaljer fra økonomisystemet!";
}

export function getStatusConfig(
  claimStatus: string,
  statusMessage?: string,
): ClaimStatusConfig {
  // First try to find exact match
  const exactMatch = ORDER_STATUS_LIST.find(
    (status) => status.value === claimStatus.toUpperCase(),
  );
  if (exactMatch) {
    return exactMatch;
  }

  // Fallback to message-based matching for common variations
  const statusLower = claimStatus.toLowerCase();
  const messageLower = (statusMessage || "").toLowerCase();

  if (statusLower === "cancelled" || messageLower.includes("kansellert")) {
    return ORDER_STATUS_LIST.find((s) => s.value === "CANCELLED")!;
  }

  if (
    statusLower === "stored" ||
    messageLower.includes("ikke oversendt") ||
    messageLower.includes("ikke sendt") ||
    messageLower.includes("lagret")
  ) {
    return ORDER_STATUS_LIST.find((s) => s.value === "STORED")!;
  }

  if (statusLower === "sent" || messageLower.includes("sendt")) {
    return ORDER_STATUS_LIST.find((s) => s.value === "SENT")!;
  }

  if (statusLower.includes("error") || statusLower.includes("feil")) {
    // Try to match specific error types
    if (
      messageLower.includes("oppdatering") ||
      statusLower.includes("update")
    ) {
      return ORDER_STATUS_LIST.find((s) => s.value === "UPDATE_ERROR")!;
    }
    if (messageLower.includes("innsendelse") || statusLower.includes("send")) {
      return ORDER_STATUS_LIST.find((s) => s.value === "SEND_ERROR")!;
    }
    if (
      messageLower.includes("oversending") ||
      statusLower.includes("accept")
    ) {
      return ORDER_STATUS_LIST.find((s) => s.value === "ACCEPT_ERROR")!;
    }
    return ORDER_STATUS_LIST.find((s) => s.value === "ERROR")!;
  }

  if (statusLower === "paid" || statusLower === "betalt") {
    return ORDER_STATUS_LIST.find((s) => s.value === "PAID")!;
  }

  if (statusLower === "credited" || statusLower === "kreditert") {
    return ORDER_STATUS_LIST.find((s) => s.value === "CREDITED")!;
  }

  if (statusLower === "accepted" || statusLower.includes("klar")) {
    return ORDER_STATUS_LIST.find((s) => s.value === "ACCEPTED")!;
  }

  if (statusLower === "issued" || statusLower === "fakturert") {
    return ORDER_STATUS_LIST.find((s) => s.value === "ISSUED")!;
  }

  return DEFAULT_STATUS_CONFIG;
}
