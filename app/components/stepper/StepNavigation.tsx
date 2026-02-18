import { Box, HStack, Button } from "@navikt/ds-react";

interface StepNavigationProps {
  onNext: () => void;
  nextButtonText?: string;
  onPrevious?: () => void;
  previousButtonText?: string;
  disabled?: boolean;
}

export function StepNavigation({
  onNext,
  nextButtonText = "Videre",
  onPrevious,
  previousButtonText = "Tilbake",
  disabled,
}: StepNavigationProps) {
  return (
    <Box paddingBlock="space-4">
      <HStack gap="space-4" justify="space-between" align="center">
        <Box>
          {onPrevious && (
            <Button variant="secondary" size={"small"} onClick={onPrevious}>
              {previousButtonText}
            </Button>
          )}
        </Box>
        <Box style={onPrevious ? { marginLeft: "auto" } : {}}>
          <Button
            variant="primary"
            size={"small"}
            disabled={disabled}
            onClick={onNext}
          >
            {nextButtonText}
          </Button>
        </Box>
      </HStack>
    </Box>
  );
}
