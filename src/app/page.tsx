import { Header } from "@/components/layout/Header";
import { NavigationCard } from "@/components/ui/NavigationCard";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16 mt-8">
          <h2 className="text-3xl font-extrabold text-[#009a4d] sm:text-4xl drop-shadow-sm">
            Portal da Interoperabilidade do Governo do Ceará
          </h2>
          <p className="mt-4 text-xl text-slate-500 max-w-2xl mx-auto">
            Selecione o card com o que você deseja fazer: solicitar dados,
            categorizar dados, estudar sobre a plataforma, conhecer a cartilha,
            etc.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <NavigationCard
            href="/servicos"
            title="Quero preencher uma Ficha de Interoperabilidade"
            description="Categorize os dados do seu órgão para compartilhamento ou solicite acesso a APIs de outro órgão pela plataforma X-Valid."
            icon="assignment"
            accentColor="emerald"
            ctaLabel="Ver Fichas"
          />
          <NavigationCard
            href="https://sistemas.irislab.ce.gov.br/docs-interoperabilidade/"
            title="Quero estudar sobre a plataforma de interoperabilidade"
            description="Acesse o material do 1º Workshop de Interoperabilidade e entenda como a plataforma X-Valid funciona na prática."
            icon="school"
            accentColor="blue"
            ctaLabel="Acessar Workshop"
            isExternal
          />
          <NavigationCard
            href="/pdfs/guia-entrada.pdf"
            title="Quero cadastrar meu órgão na plataforma"
            description="Acesse o guia com o passo a passo para cadastrar seu órgão na plataforma de interoperabilidade X-Valid."
            icon="add_business"
            accentColor="violet"
            ctaLabel="Acessar Guia"
            isExternal
          />
          <NavigationCard
            href="/pdfs/cartilha.pdf"
            title="Quero acessar a cartilha de interoperabilidade"
            description="Acesse a Cartilha de Interoperabilidade e tire suas dúvidas sobre o compartilhamento de dados entre órgãos."
            icon="menu_book"
            accentColor="amber"
            ctaLabel="Acessar Cartilha"
            isExternal
          />
          <NavigationCard
            href="/pdfs/decreto-37059-2026.pdf"
            title="Quero acessar o decreto de interoperabilidade"
            description="Acesse o Decreto 37.059/2026 e conheça as regras de governança no compartilhamento de dados via interoperabilidade."
            icon="contract"
            accentColor="slate"
            ctaLabel="Acessar Decreto"
            isExternal
          />
          <NavigationCard
            href="/pdfs/resolucao-01-2026.pdf"
            title="Quero acessar a resolução com as regras de compartilhamento de dados"
            description="Acesse a Resolução 01/2026 e conheça as regras oficiais de compartilhamento de dados entre órgãos do Governo do Ceará."
            icon="balance"
            accentColor="rose"
            ctaLabel="Acessar Resolução"
            isExternal
          />
        </div>
      </main>
    </>
  );
}
