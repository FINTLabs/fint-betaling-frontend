import { Button, HStack } from "@navikt/ds-react";
import {
  ArrowsCirclepathIcon,
  TasklistSendIcon,
  DownloadIcon,
} from "@navikt/aksel-icons";

interface OrderHistoryActionsProps {
  selectedCount: number;
  onUpdate: () => void;
  onResend: () => void;
  onExport: () => void;
}

export function OrderHistoryActions({
  selectedCount,
  onUpdate,
  onResend,
  onExport,
}: OrderHistoryActionsProps) {
  const hasSelection = selectedCount > 0;

  return (
    <HStack gap="2">
      <Button
        variant="secondary"
        size="small"
        onClick={onUpdate}
        icon={<ArrowsCirclepathIcon />}
      >
        OPPDATER
      </Button>
      <Button
        variant="secondary"
        size="small"
        onClick={onResend}
        disabled={!hasSelection}
        icon={<TasklistSendIcon />}
      >
        RESEND
      </Button>
      <Button
        variant="secondary"
        size="small"
        onClick={onExport}
        disabled={!hasSelection}
        icon={<DownloadIcon />}
      >
        EKSPORTER
      </Button>
    </HStack>
  );
}
