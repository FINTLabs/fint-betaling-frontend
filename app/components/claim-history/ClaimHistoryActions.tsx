import { Button, HStack } from "@navikt/ds-react";
import { DownloadIcon, TasklistSendIcon } from "@navikt/aksel-icons";

interface OrderHistoryActionsProps {
  selectedCount: number;
  onResend: () => void;
  onExport: () => void;
}

export function ClaimHistoryActions({
  selectedCount,
  onResend,
  onExport,
}: OrderHistoryActionsProps) {
  const hasSelection = selectedCount > 0;

  return (
    <HStack gap="space-4">
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
        icon={<DownloadIcon />}
      >
        EKSPORTER
      </Button>
    </HStack>
  );
}
