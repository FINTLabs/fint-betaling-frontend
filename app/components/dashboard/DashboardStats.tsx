import { Box, HStack, LinkCard } from "@navikt/ds-react";
import {
  ClockIcon,
  ExclamationmarkTriangleIcon,
  FileIcon,
} from "@navikt/aksel-icons";
import type { ReactNode } from "react";

interface StatConfig {
  icon: ReactNode;
  title: string;
  href: string;
  value: number;
  description: string;
}

interface DashboardStatsProps {
  totalOrders: number;
  pendingOrders: number;
  errorOrders: number;
}

export function DashboardStats({
  totalOrders,
  pendingOrders,
  errorOrders,
}: DashboardStatsProps) {
  const stats: StatConfig[] = [
    {
      icon: <FileIcon title="Dokument" fontSize="1.5rem" />,
      title: "Totalt antall ordrer",
      href: "/historikk",
      value: totalOrders,
      description: "Total antall ordrer siste 14 dager",
    },
    {
      icon: <ClockIcon title="Klokke" fontSize="1.5rem" />,
      title: "Ventende ordrer",
      href: "/send",
      value: pendingOrders,
      description: "Ikke sendt til fakturering siste 14 dager",
    },
    {
      icon: <ExclamationmarkTriangleIcon title="Advarsel" fontSize="1.5rem" />,
      title: "Antall feil",
      href: "/historikk?status=ACCEPT_ERROR,SEND_ERROR,ERROR",
      value: errorOrders,
      description: "Kansellerte eller feilede ordrer siste 14 dager",
    },
  ];

  return (
    <HStack gap="space-6" wrap justify="space-between">
      {stats.map((stat) => (
        <LinkCard key={stat.title}>
          <Box
            asChild
            borderRadius="12"
            padding="space-8"
            // background="surface-default"
          >
            <LinkCard.Icon>{stat.icon}</LinkCard.Icon>
          </Box>
          <LinkCard.Title as="span">
            <LinkCard.Anchor href={stat.href}>{stat.title}</LinkCard.Anchor>
          </LinkCard.Title>
          <LinkCard.Description>
            <span
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                color: "#222",
                display: "block",
                marginTop: "0.5rem",
              }}
            >
              {stat.value}
            </span>
            <span
              style={{
                fontSize: "0.875rem",
                color: "#666",
                display: "block",
                marginTop: "0.25rem",
              }}
            >
              {stat.description}
            </span>
          </LinkCard.Description>
        </LinkCard>
      ))}
    </HStack>
  );
}
