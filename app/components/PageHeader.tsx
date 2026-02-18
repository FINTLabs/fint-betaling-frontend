import {Box, Detail, Heading, VStack} from "@navikt/ds-react";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string | ReactNode;
  // level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <Box
      paddingBlock="space-6"
      paddingInline="space-0"
      style={{
        borderBottom: "1px solid #e0e0e0",
        marginBottom: "1.5rem",
      }}
    >
      <VStack gap="space-2" align="start">
        <Heading
          size="medium"
          level="2"
          spacing
        >
          {title}
        </Heading>
        {description && (
          <Detail>
            {description}
          </Detail>
        )}
      </VStack>
    </Box>
  );
}
