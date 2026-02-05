import { Box, Heading, VStack } from "@navikt/ds-react";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string | ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function PageHeader({ title, description, level = 1 }: PageHeaderProps) {
  return (
    <Box
      paddingBlock="6"
      paddingInline="0"
      style={{
        borderBottom: "1px solid #e0e0e0",
        marginBottom: "1.5rem",
      }}
    >
      <VStack gap="2" align="start">
        <Heading
          size="large"
          level={level}
          spacing
          style={{
            color: "#222",
            fontWeight: 700,
            margin: 0,
          }}
        >
          {title}
        </Heading>
        {description && (
          <div
            style={{
              fontSize: "1rem",
              color: "#666",
              fontWeight: 400,
              lineHeight: "1.5",
            }}
          >
            {typeof description === "string" ? (
              <p style={{ margin: 0 }}>{description}</p>
            ) : (
              description
            )}
          </div>
        )}
      </VStack>
    </Box>
  );
}
