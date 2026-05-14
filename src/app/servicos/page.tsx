import { Header } from "@/components/layout/Header";
import { NavigationCard } from "@/components/ui/NavigationCard";
import Link from "next/link";
import { FileText, SearchCode, ArrowLeft } from "lucide-react";

export default function ServicosPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 max-w-4xl mx-auto">
          <Link
            href="/"
            className="text-[#009a4d] hover:text-[#008141] flex items-center gap-2 font-medium transition-colors"
          >
            <ArrowLeft size={20} /> Voltar para o Início
          </Link>
        </div>
        <div className="text-center mb-16 mt-8">
          <h2 className="text-3xl font-extrabold text-[#009a4d] sm:text-4xl drop-shadow-sm">
            Fichas de Interoperabilidade
          </h2>
          <p className="mt-4 text-xl text-slate-500 max-w-2xl mx-auto">
            Selecione a ficha correspondente ao que você precisa fazer.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <NavigationCard
            href="/categorizacao"
            title="Quero categorizar meus dados para compartilhar"
            description="Preencha a Ficha de Categorização para classificar os dados que seu órgão irá compartilhar pela plataforma de interoperabilidade."
            icon={FileText}
            accentColor="emerald"
            ctaLabel="Iniciar Categorização"
          />
          <NavigationCard
            href="/solicitacao"
            title="Quero solicitar dados de outro órgão"
            description="Preencha a Ficha de Solicitação para pedir API's que outro órgão irá disponibilizar pela plataforma de interoperabilidade."
            icon={SearchCode}
            accentColor="orange"
            ctaLabel="Nova Solicitação"
          />
        </div>
      </main>
    </>
  );
}
