import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ficha de Categorização de Dados",
};

export default function CategorizacaoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
