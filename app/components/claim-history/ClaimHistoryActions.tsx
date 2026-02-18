import { Button, HStack } from "@navikt/ds-react";
import { DownloadIcon, TasklistSendIcon } from "@navikt/aksel-icons";
import {exportClaimsToCsv} from "~/utils/exportClaimsToCsv";
import type {IClaim} from "~/types/claim";

interface OrderHistoryActionsProps {
  selectedCount: number;
  onResend: () => void;
  claims: IClaim[];
}

export function ClaimHistoryActions({
  selectedCount,
  onResend,
    claims,
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
        onClick={() => exportClaimsToCsv(claims)}
        icon={<DownloadIcon />}
      >
        EKSPORTER
      </Button>
    </HStack>
  );
}
