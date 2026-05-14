import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fichas de Interoperabilidade",
};

export default function ServicosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
