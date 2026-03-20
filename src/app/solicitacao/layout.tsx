import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ficha de Solicitação de Compartilhamento",
};

export default function SolicitacaoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
