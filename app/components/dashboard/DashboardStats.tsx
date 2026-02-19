import {Detail, Heading, HGrid, HStack, InfoCard,} from "@navikt/ds-react";
import {ClockIcon, ExclamationmarkTriangleIcon, FileIcon,} from "@navikt/aksel-icons";
import type {ReactNode} from "react";

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
    <HGrid gap="space-128" columns={3}>
      {stats.map((stat) => (
        // <LinkCard key={stat.title}>
        //   <LinkCard.Icon>{stat.icon}</LinkCard.Icon>
        //   <LinkCard.Title as="span">
        //     <LinkCard.Anchor href={stat.href}>{stat.title}</LinkCard.Anchor>
        //   </LinkCard.Title>
        //   <LinkCard.Description>
        //     <Heading size="large" level="3" spacing align="center">
        //       {stat.value}
        //     </Heading>
        //     <Detail>{stat.description}</Detail>
        //   </LinkCard.Description>
        // </LinkCard>
        <InfoCard data-color="brand-magenta">
          <InfoCard.Header icon={stat.icon}>
            <InfoCard.Title>{stat.title}</InfoCard.Title>
          </InfoCard.Header>

          <InfoCard.Content>
            <Heading size="large" level="3" spacing align="center">
              {stat.value}
            </Heading>
            <Detail>{stat.description}</Detail>
            <HStack justify="end" align="center"></HStack>
          </InfoCard.Content>
        </InfoCard>
      ))}
    </HGrid>
  );
}
