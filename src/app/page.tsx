import { Header } from "@/components/layout/Header";
import Link from "next/link";
import { FileText, SearchCode } from "lucide-react";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16 mt-8">
          <h2 className="text-3xl font-extrabold text-[#009a4d] sm:text-4xl drop-shadow-sm">
            Portal de Governança de Dados
          </h2>
          <p className="mt-4 text-xl text-slate-500 max-w-2xl mx-auto">
            Selecione o seu perfil para realizar a categorização ou solicitar acesso a conjuntos de dados do Governo do Estado do Ceará.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Gestor Card */}
          <Link href="/categorizacao" className="group block h-full">
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-8 hover:border-emerald-500 hover:shadow-xl transition-all duration-300 h-full flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-2 bg-emerald-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300">
                <FileText className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">
                Sou Gestor de Dados
              </h3>
              <p className="text-slate-500 leading-relaxed">
                Acesse a Ficha de Categorização para declarar e classificar formalmente a disponibilidade técnica dos dados sob sua governança.
              </p>
              <div className="mt-8 px-6 py-2 bg-slate-50 text-emerald-600 font-semibold rounded-full group-hover:bg-emerald-50 transition-colors">
                Iniciar Categorização &rarr;
              </div>
            </div>
          </Link>

          {/* Solicitante Card */}
          <Link href="/solicitacao" className="group block h-full">
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-8 hover:border-orange-500 hover:shadow-xl transition-all duration-300 h-full flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-2 bg-orange-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300">
                <SearchCode className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">
                Sou Órgão Solicitante
              </h3>
              <p className="text-slate-500 leading-relaxed">
                Acesse a Ficha de Solicitação para requerer integração, consumir APIs ou obter bases de dados em conformidade com as resoluções.
              </p>
              <div className="mt-8 px-6 py-2 bg-slate-50 text-orange-600 font-semibold rounded-full group-hover:bg-orange-50 transition-colors">
                Nova Solicitação &rarr;
              </div>
            </div>
          </Link>
        </div>
      </main>
    </>
  );
}
