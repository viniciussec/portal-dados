"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import {
  InteractiveAttributes,
  Attribute,
} from "@/components/forms/InteractiveAttributes";
import {
  FileDown,
  ArrowLeft,
  Scale,
  Info,
  CornerDownRight,
  SearchCode,
  Eye,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";

// ── Utilitários ──────────────────────────────────────────────────────────────

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 || digits.length === 11;
}

function formatDate(d: string): string {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

const LABEL_CAT: Record<string, string> = {
  amplo: "Amplo",
  restrito: "Restrito",
  especifico: "Específico",
};
const LABEL_TIPO_CAT: Record<string, string> = {
  "consulta-registro-unico": "Consulta de Registro Único",
  "conjunto-informacoes": "Conjunto de Informações",
};
const LABEL_TIPO_NOVO: Record<string, string> = {
  consulta: "Consulta de Registro Único",
  conjunto: "Conjunto de Informações",
};
const LABEL_BASE_LEGAL: Record<string, string> = {
  "art-7-iii": "Art. 7º, III - Execução de políticas públicas (dados comuns)",
  "art-11-ii-b":
    'Art. 11, II, "b" - Política pública prevista em lei (dados sensíveis)',
  outro: "Outro (especificar na adequação)",
};

// ── Componentes auxiliares do Preview ───────────────────────────────────────

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 py-2 border-b border-slate-100 last:border-0">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide w-44 shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-sm text-slate-800 flex-1">
        {value || <span className="text-slate-400 italic">Não preenchido</span>}
      </span>
    </div>
  );
}

function PreviewSection({
  title,
  colorClass,
  children,
}: {
  title: string;
  colorClass: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
      <div
        className={cn(
          "px-4 py-2.5 font-bold text-sm uppercase tracking-wider",
          colorClass,
        )}
      >
        {title}
      </div>
      <div className="px-4 py-3 bg-white space-y-0">{children}</div>
    </div>
  );
}

// ── Página Principal ─────────────────────────────────────────────────────────

export default function SolicitacaoPage() {
  const INITIAL_STATE = {
    orgaoSolicitante: "",
    siglaSolicitante: "",
    responsavel: "",
    nomeContatoTecnico: "",
    telefoneContato: "",
    contatoTecnico: "",
    dataSolicitacao: "",
    orgaoGestor: "",
    siglaGestor: "",
    caminho: "",

    idCatalogo: "",
    tituloDadoA: "",
    categoriaCompartilhamento: "",
    tipoInformacaoCat: "",

    tipoInformacaoNovo: "",
    tituloSolicitado: "",
    envolveDadosPessoais: false,
    finalidadeLGPD: "",
    baseLegalLGPD: "",
    baseLegalEspecificaLGPD: "",
    adequacaoLGPD: "",
    necessidadeLGPD: "",
  };

  const [formData, setFormData] = useState(INITIAL_STATE);
  const [atributosEntrada, setAtributosEntrada] = useState<Attribute[]>([]);
  const [atributosSaida, setAtributosSaida] = useState<Attribute[]>([]);
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    type: "warning" | "info" | "success";
    content: React.ReactNode;
    primaryAction?: { label: string; onClick: () => void };
    secondaryAction?: { label: string; onClick: () => void };
  }>({ isOpen: false, title: "", type: "info", content: null });

  const closeModal = () =>
    setModalConfig((prev) => ({ ...prev, isOpen: false }));

  // ── Validações de campo ────────────────────────────────────────────────────

  const validateFields = (): { key: string; label: string }[] => {
    const required = [
      { key: "orgaoSolicitante", label: "Órgão/Entidade Solicitante" },
      { key: "siglaSolicitante", label: "Sigla do Solicitante" },
      { key: "responsavel", label: "Responsável Técnico" },
      { key: "nomeContatoTecnico", label: "Nome do Contato Técnico" },
      { key: "telefoneContato", label: "Telefone de Contato" },
      { key: "contatoTecnico", label: "E-mail de Contato" },
      { key: "dataSolicitacao", label: "Data da Solicitação" },
      { key: "orgaoGestor", label: "Órgão/Entidade Gestora dos Dados" },
      { key: "siglaGestor", label: "Sigla do Órgão Gestor" },
    ];

    const missing = required.filter(
      (f) => !formData[f.key as keyof typeof formData],
    );

    if (!formData.caminho) {
      missing.push({
        key: "caminho",
        label: "Origem do Dado (Dado Já Categorizado ou Novo Compartilhamento)",
      });
    } else if (formData.caminho === "categorizado") {
      if (!formData.idCatalogo)
        missing.push({ key: "idCatalogo", label: "ID do Dado no Catálogo" });
      if (!formData.tituloDadoA)
        missing.push({
          key: "tituloDadoA",
          label: "Título do Dado (Catálogo)",
        });
      if (!formData.categoriaCompartilhamento)
        missing.push({
          key: "categoriaCompartilhamento",
          label: "Categoria de Compartilhamento",
        });
      if (!formData.tipoInformacaoCat)
        missing.push({
          key: "tipoInformacaoCat",
          label: "Tipo de Informação (Catálogo)",
        });
    } else if (formData.caminho === "nao-categorizado") {
      if (!formData.tipoInformacaoNovo)
        missing.push({
          key: "tipoInformacaoNovo",
          label: "Tipo de Informação (Novo)",
        });
      if (!formData.tituloSolicitado)
        missing.push({
          key: "tituloSolicitado",
          label: "Título do Dado Solicitado",
        });
    }

    if (formData.envolveDadosPessoais) {
      if (!formData.finalidadeLGPD)
        missing.push({ key: "finalidadeLGPD", label: "LGPD: Finalidade" });
      if (!formData.baseLegalLGPD)
        missing.push({ key: "baseLegalLGPD", label: "LGPD: Base Legal" });
      else if (formData.baseLegalLGPD === "Outro" && !formData.baseLegalEspecificaLGPD)
        missing.push({ key: "baseLegalEspecificaLGPD", label: "LGPD: Base Legal Específica" });

      if (!formData.adequacaoLGPD)
        missing.push({ key: "adequacaoLGPD", label: "LGPD: Adequação" });
      if (!formData.necessidadeLGPD)
        missing.push({ key: "necessidadeLGPD", label: "LGPD: Necessidade" });
    }

    // Formato
    if (formData.telefoneContato && !isValidPhone(formData.telefoneContato)) {
      missing.push({
        key: "telefoneContato",
        label: "Telefone de Contato (formato inválido)",
      });
    }
    if (formData.contatoTecnico && !isValidEmail(formData.contatoTecnico)) {
      missing.push({
        key: "contatoTecnico",
        label: "E-mail de Contato (formato inválido)",
      });
    }

    return missing;
  };

  const showValidationError = (missing: { key: string; label: string }[]) => {
    setModalConfig({
      isOpen: true,
      type: "warning",
      title: "Campos Obrigatórios Pendentes",
      content: (
        <div className="space-y-3">
          <p className="text-sm">
            Para gerar a ficha oficial, preencha os seguintes campos:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm font-medium text-slate-700">
            {missing.map((f) => (
              <li key={f.key}>{f.label}</li>
            ))}
          </ul>
        </div>
      ),
      primaryAction: { label: "Entendi, vou preencher", onClick: closeModal },
    });
  };

  // ── Preview ────────────────────────────────────────────────────────────────

  const buildPreviewContent = () => {
    const isCatA = formData.caminho === "categorizado";
    return (
      <div className="space-y-4">
        {/* Cabeçalho oficial */}
        <div className="text-center pb-4 border-b border-slate-200">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">
            Estado do Ceará • Casa Civil
          </p>
          <p className="font-extrabold text-slate-800 text-base">
            Ficha de Solicitação de Compartilhamento de Dados
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Resolução nº 01/2026 • Gerado em{" "}
            {new Date().toLocaleDateString("pt-BR")}
          </p>
        </div>

        <PreviewSection
          title="Tipo de Solicitação"
          colorClass="bg-slate-100 text-slate-700"
        >
          <PreviewRow
            label="Status"
            value={
              isCatA
                ? "Dado Já Categorizado (Consta no Catálogo)"
                : "Dado Não Categorizado (Requer Categorização Prévia)"
            }
          />
        </PreviewSection>

        <PreviewSection
          title="Órgão Solicitante"
          colorClass="bg-orange-50 text-orange-800"
        >
          <PreviewRow
            label="Órgão/Entidade"
            value={`${formData.orgaoSolicitante}${formData.siglaSolicitante ? ` (${formData.siglaSolicitante})` : ""}`}
          />
          <PreviewRow label="Responsável" value={formData.responsavel} />
          <PreviewRow
            label="Contato Técnico"
            value={formData.nomeContatoTecnico}
          />
          <PreviewRow label="Telefone" value={formData.telefoneContato} />
          <PreviewRow label="E-mail" value={formData.contatoTecnico} />
          <PreviewRow
            label="Data da Solicitação"
            value={formatDate(formData.dataSolicitacao)}
          />
        </PreviewSection>

        <PreviewSection
          title="Órgão Gestor dos Dados"
          colorClass="bg-blue-50 text-blue-800"
        >
          <PreviewRow
            label="Órgão/Entidade"
            value={`${formData.orgaoGestor}${formData.siglaGestor ? ` (${formData.siglaGestor})` : ""}`}
          />
        </PreviewSection>

        <PreviewSection
          title="Dados Solicitados"
          colorClass={
            isCatA ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
          }
        >
          {isCatA ? (
            <>
              <PreviewRow label="ID no Catálogo" value={formData.idCatalogo} />
              <PreviewRow label="Título do Dado" value={formData.tituloDadoA} />
              <PreviewRow
                label="Categoria"
                value={
                  LABEL_CAT[formData.categoriaCompartilhamento] ||
                  formData.categoriaCompartilhamento
                }
              />
              <PreviewRow
                label="Tipo de Informação"
                value={
                  LABEL_TIPO_CAT[formData.tipoInformacaoCat] ||
                  formData.tipoInformacaoCat
                }
              />
            </>
          ) : (
            <>
              <PreviewRow
                label="Tipo de Informação"
                value={
                  LABEL_TIPO_NOVO[formData.tipoInformacaoNovo] ||
                  formData.tipoInformacaoNovo
                }
              />
              <PreviewRow
                label="Título Sugerido"
                value={formData.tituloSolicitado}
              />
              <PreviewRow
                label={`Atributos Entrada (${atributosEntrada.length})`}
                value={
                  atributosEntrada.length > 0
                    ? atributosEntrada.map((a) => a.name).join(", ")
                    : "Nenhum"
                }
              />
              <PreviewRow
                label={`Atributos Saída (${atributosSaida.length})`}
                value={
                  atributosSaida.length > 0
                    ? atributosSaida.map((a) => a.name).join(", ")
                    : "Nenhum"
                }
              />
            </>
          )}
        </PreviewSection>

        {formData.envolveDadosPessoais && (
          <PreviewSection
            title="Proteção de Dados Pessoais (LGPD)"
            colorClass="bg-amber-50 text-amber-800"
          >
            <PreviewRow label="Finalidade" value={formData.finalidadeLGPD} />
            <PreviewRow
              label="Base Legal"
              value={
                formData.baseLegalLGPD === "Outro" && formData.baseLegalEspecificaLGPD
                  ? `Outro - ${formData.baseLegalEspecificaLGPD}`
                  : LABEL_BASE_LEGAL[formData.baseLegalLGPD] ||
                    formData.baseLegalLGPD
              }
            />
            <PreviewRow label="Adequação" value={formData.adequacaoLGPD} />
            <PreviewRow label="Necessidade" value={formData.necessidadeLGPD} />
          </PreviewSection>
        )}

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-2">
          <p className="font-bold text-slate-700 uppercase tracking-wide text-xs mb-2">
            Próximos Passos
          </p>
          <p>
            🔹 <strong>Protocolação:</strong> O PDF deve ser encaminhado via
            Ofício ao Órgão Gestor pelo sistema <strong>SUITE</strong>.
          </p>
          <p>
            🔹 <strong>Confidencialidade:</strong> Se envolve dados pessoais ou
            sensíveis restritos, anexe o Termo de Sigilo.
          </p>
          <p>
            🔹 <strong>Acompanhamento:</strong> O Órgão Gestor tem prazo para
            analisar e interagir via NUP gerado.
          </p>
        </div>
      </div>
    );
  };

  // ── Ações ──────────────────────────────────────────────────────────────────

  const handleLimpar = () => {
    setModalConfig({
      isOpen: true,
      type: "warning",
      title: "Limpar Formulário",
      content: (
        <p className="text-sm">
          Tem certeza que deseja limpar todos os campos da ficha? Esta ação não
          pode ser desfeita.
        </p>
      ),
      secondaryAction: { label: "Cancelar", onClick: closeModal },
      primaryAction: {
        label: "Sim, limpar tudo",
        onClick: () => {
          closeModal();
          setFormData(INITIAL_STATE);
          setAtributosEntrada([]);
          setAtributosSaida([]);
          setEmailError("");
          setPhoneError("");
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
      },
    });
  };

  const handleVisualizarFicha = () => {
    const missing = validateFields();
    if (missing.length > 0) {
      showValidationError(missing);
      return;
    }
    setPreviewOpen(true);
  };

  const handleGerarPDF = async () => {
    const missing = validateFields();
    if (missing.length > 0) {
      showValidationError(missing);
      return;
    }

    const isCaminhoA = formData.caminho === "categorizado";
    const pdfData = [
      {
        title: "Órgão Solicitante",
        content: [
          `Entidade: ${formData.orgaoSolicitante} (${formData.siglaSolicitante})`,
          `Responsável: ${formData.responsavel}`,
          `Nome do Contato Técnico: ${formData.nomeContatoTecnico}`,
          `Telefone de Contato: ${formData.telefoneContato}`,
          `E-mail de Contato: ${formData.contatoTecnico}`,
          `Data da Solicitação: ${formatDate(formData.dataSolicitacao)}`,
        ],
      },
      {
        title: "Órgão Gestor Alvo",
        content: [
          `Entidade Gestora: ${formData.orgaoGestor} (${formData.siglaGestor})`,
        ],
      },
      {
        title: "Dados Solicitados",
        content: isCaminhoA
          ? [
              `Status: Já Categorizado (Consta no Catálogo)`,
              `ID do Dado no Catálogo: ${formData.idCatalogo}`,
              `Título do Dado: ${formData.tituloDadoA}`,
              `Categoria de Compartilhamento: ${LABEL_CAT[formData.categoriaCompartilhamento] || formData.categoriaCompartilhamento}`,
              `Tipo de Informação: ${LABEL_TIPO_CAT[formData.tipoInformacaoCat] || formData.tipoInformacaoCat}`,
            ]
          : [
              `Status: Não Categorizado`,
              `Tipo de Informação: ${LABEL_TIPO_NOVO[formData.tipoInformacaoNovo] || "Não informado"}`,
              `Título Sugerido: ${formData.tituloSolicitado}`,
              `Atributos Entrada: ${atributosEntrada.length > 0 ? atributosEntrada.map((a) => a.name).join(", ") : "Nenhum"}`,
              `Atributos Saída: ${atributosSaida.length > 0 ? atributosSaida.map((a) => a.name).join(", ") : "Nenhum"}`,
            ],
      },
    ];

    if (formData.envolveDadosPessoais) {
      pdfData.push({
        title: "Proteção de Dados Pessoais (LGPD)",
        content: [
          `Envolve Dados Pessoais: Sim`,
          `Finalidade: ${formData.finalidadeLGPD}`,
          `Base Legal: ${formData.baseLegalLGPD === "Outro" && formData.baseLegalEspecificaLGPD ? `Outro - ${formData.baseLegalEspecificaLGPD}` : LABEL_BASE_LEGAL[formData.baseLegalLGPD] || formData.baseLegalLGPD}`,
          `Adequação: ${formData.adequacaoLGPD}`,
          `Necessidade: ${formData.necessidadeLGPD}`,
        ],
      });
    }

    setModalConfig({
      isOpen: true,
      type: "info",
      title: "Próximos Passos (Orientação)",
      content: (
        <div className="space-y-4 text-sm mt-2">
          <p className="font-medium text-slate-700">
            Para tramitar a Solicitação de Compartilhamento, siga as diretrizes
            governamentais:
          </p>
          <ul className="space-y-4">
            <li className="flex gap-3 items-start">
              <span className="text-orange-500 mt-0.5">🔹</span>
              <span className="text-slate-600">
                <strong>Envio Via Ofício:</strong> O PDF gerado deve ser
                encaminhado via Ofício ao Órgão Gestor da Informação através do
                sistema <strong>SUITE</strong>.
              </span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-orange-500 mt-0.5">🔹</span>
              <span className="text-slate-600">
                <strong>Acordo de Confidencialidade:</strong> Caso envolva
                acesso a dados pessoais ou sensíveis restritos, certifique-se de
                anexar o termo de sigilo correspondente.
              </span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-orange-500 mt-0.5">🔹</span>
              <span className="text-slate-600">
                <strong>Acompanhamento:</strong> O Órgão Gestor tem prazo
                estipulado para analisar seu pedido e poderá interagir via NUP
                gerado.
              </span>
            </li>
          </ul>
        </div>
      ),
      secondaryAction: { label: "Cancelar", onClick: closeModal },
      primaryAction: {
        label: "Prosseguir e Baixar PDF",
        onClick: async () => {
          closeModal();
          const { generatePDF } = await import("@/lib/pdfGenerator");
          await generatePDF(
            "Ficha de Solicitação de Compartilhamento",
            pdfData,
            "save",
          );
        },
      },
    });
  };

  // ── Input helpers ──────────────────────────────────────────────────────────

  const inputClass = (error?: string) =>
    cn(
      "w-full p-2.5 border-2 bg-slate-50 rounded-lg focus:bg-white focus:ring-4 outline-none transition-all",
      error
        ? "border-red-400 focus:border-red-500 focus:ring-red-50"
        : "border-slate-200 focus:border-orange-500 focus:ring-orange-50",
    );

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <Header />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="text-orange-600 hover:text-orange-700 flex items-center gap-2 font-medium transition-colors"
          >
            <ArrowLeft size={20} /> Voltar para o Início
          </Link>
          <button
            onClick={handleGerarPDF}
            disabled={!formData.caminho}
            className="disabled:opacity-50 disabled:cursor-not-allowed bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
          >
            <FileDown size={20} /> Exportar Ficha PDF
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden relative">
          <div className="absolute top-0 inset-x-0 h-2 bg-orange-500"></div>
          <div className="bg-slate-50 border-b border-slate-200 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex bg-white w-28 h-20 items-center justify-center border-b-4 border-orange-500 shadow-sm shrink-0">
                <SearchCode
                  strokeWidth={1.25}
                  className="w-10 h-10 text-slate-700"
                />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-slate-800 mb-2 tracking-tight flex items-center gap-3">
                  <span className="sm:hidden text-3xl">📄</span> Ficha de
                  Solicitação
                </h1>
                <p className="text-slate-500 font-medium">
                  Decreto Estadual nº 37.059/2026 e Resolução nº 01/2026 -
                  Subcomitê de Governança de Dados do Governo do Estado do Ceará
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-12">
            {/* Base Legal */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-amber-900 shadow-sm">
              <h3 className="font-bold flex items-center gap-2 mb-3 text-amber-700">
                <Scale size={20} /> Para que serve essa ficha?
              </h3>
              <ul className="space-y-2 text-sm leading-relaxed">
                <li>
                  Essa ficha deve ser preenchida por um solicitante de dados.
                  Após o preenchimento completo dela, você deve{" "}
                  <strong> exportar para PDF</strong> e anexá-la no seu ofício
                  de solicitação.
                </li>
                <li>
                  O dado que você está solicitando pode{" "}
                  <strong>já estar categorizado </strong>
                  (presente no Catálogo de Dados) ou{" "}
                  <strong>ainda necessita</strong> de categorização. A depender
                  do caso, selecione a opção correta de solicitação.
                </li>
                <li>
                  <strong> Quem pode solicitar?</strong> Órgãos e entidades da
                  Administração Pública estadual e demais Poderes do Estado
                  (Art. 5.1)
                </li>
                <li>
                  <strong>Base legal:</strong> Resolução nº 01/2026, Art. 5.3 e
                  5.4: Procedimentos para solicitação de categorização e
                  compartilhamento de dados.
                </li>
              </ul>
            </div>

            {/* Tipo de Solicitação */}
            <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b-2 border-slate-100 pb-3">
                <CornerDownRight className="text-orange-500" /> Escolha o tipo
                de solicitação
              </h2>
              <div className="bg-slate-50 border border-slate-200 text-slate-700 p-4 rounded-lg flex items-start gap-3 mb-6 font-medium">
                <Info className="shrink-0 mt-0.5 text-slate-500" />
                <p>
                  Primeiro consulte o <strong>Catálogo de Dados</strong>{" "}
                  disponibilizado pelo{" "}
                  <strong>Subcomitê de Governança de Dados.</strong> Depois,
                  escolha o cenário correto para sua solicitação.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div
                  className={cn(
                    "border-2 rounded-xl p-6 cursor-pointer transition-all hover:-translate-y-1",
                    formData.caminho === "categorizado"
                      ? "border-[#009a4d] bg-green-50 shadow-md"
                      : "bg-slate-50 border-slate-200",
                  )}
                  onClick={() =>
                    setFormData({ ...formData, caminho: "categorizado" })
                  }
                >
                  <h3 className="text-[#009a4d] font-bold text-lg mb-2 flex items-center gap-2">
                    🟢 Dado Categorizado
                  </h3>
                  <p className="text-sm text-slate-600 text-center">
                    O dado <strong>JÁ ESTÁ</strong> no Catálogo de Dados. <br />{" "}
                    Solicitar compartilhamento do dado que já possui um
                    identificador (ID) cadastrado. Você só precisará fazer isso
                    uma única vez.
                  </p>
                </div>
                <div
                  className={cn(
                    "border-2 rounded-xl p-6 cursor-pointer transition-all hover:-translate-y-1",
                    formData.caminho === "nao-categorizado"
                      ? "border-red-500 bg-red-50 shadow-md"
                      : "bg-slate-50 border-slate-200",
                  )}
                  onClick={() =>
                    setFormData({ ...formData, caminho: "nao-categorizado" })
                  }
                >
                  <h3 className="text-red-500 font-bold text-lg mb-2 flex items-center gap-2">
                    🔴 Dado Não Categorizado
                  </h3>
                  <p className="text-sm text-slate-600 text-center">
                    O dado <strong>NÃO ESTÁ</strong> no Catálogo.
                    <br />
                    Solicitar primeiro a categorização do dado. Depois da
                    categorização, você poderá solicitar o dado já existente no
                    Catálogo de Dados. Você só precisará fazer isso uma única
                    vez.
                  </p>
                </div>
              </div>
            </section>

            {/* Identificação e Contato */}
            {formData.caminho && (
              <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b-2 border-slate-100 pb-3">
                  <span className="text-orange-500 text-xl">🏛️</span>{" "}
                  Identificação do Órgão Solicitante (quem está pedindo o dado)
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block font-bold text-slate-700 mb-2">
                      Órgão/Entidade Solicitante{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputClass()}
                      value={formData.orgaoSolicitante}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          orgaoSolicitante: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-2">
                      Sigla <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputClass()}
                      value={formData.siglaSolicitante}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          siglaSolicitante: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-2">
                      Nome do Responsável{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputClass()}
                      value={formData.responsavel}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          responsavel: e.target.value,
                        })
                      }
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Gestor máximo que assinará o Termo de Responsabilidade
                    </p>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-2">
                      Nome do Contato Técnico{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputClass()}
                      value={formData.nomeContatoTecnico}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nomeContatoTecnico: e.target.value,
                        })
                      }
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Técnico responsável pelo acompanhamento da solicitação
                    </p>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-2">
                      Telefone de Contato{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      className={inputClass(phoneError)}
                      value={formData.telefoneContato}
                      onChange={(e) => {
                        const masked = formatPhone(e.target.value);
                        setFormData({ ...formData, telefoneContato: masked });
                        setPhoneError("");
                      }}
                      onBlur={() => {
                        if (
                          formData.telefoneContato &&
                          !isValidPhone(formData.telefoneContato)
                        )
                          setPhoneError(
                            "Telefone inválido. Ex: (85) 99999-9999",
                          );
                        else setPhoneError("");
                      }}
                      placeholder="(XX) XXXXX-XXXX"
                    />
                    {phoneError && (
                      <p className="text-xs text-red-500 mt-1">{phoneError}</p>
                    )}
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-2">
                      E-mail de Contato <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      className={inputClass(emailError)}
                      value={formData.contatoTecnico}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          contatoTecnico: e.target.value,
                        });
                        setEmailError("");
                      }}
                      onBlur={() => {
                        if (
                          formData.contatoTecnico &&
                          !isValidEmail(formData.contatoTecnico)
                        )
                          setEmailError(
                            "E-mail inválido. Ex: nome@orgao.gov.br",
                          );
                        else setEmailError("");
                      }}
                      placeholder="nome@orgao.ce.gov.br"
                    />
                    {emailError && (
                      <p className="text-xs text-red-500 mt-1">{emailError}</p>
                    )}
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-2">
                      Data da Solicitação{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className={inputClass()}
                      value={formData.dataSolicitacao}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dataSolicitacao: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-2">
                      Órgão/Entidade Gestora dos Dados{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputClass()}
                      value={formData.orgaoGestor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          orgaoGestor: e.target.value,
                        })
                      }
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Órgão responsável pela governança dos dados solicitados
                    </p>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-2">
                      Sigla do Órgão Gestor{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputClass()}
                      value={formData.siglaGestor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          siglaGestor: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Caminho A: Dado Categorizado */}
                {formData.caminho === "categorizado" && (
                  <div className="bg-slate-50 border border-green-200 rounded-xl p-6 mt-6 shadow-inner">
                    <h3 className="text-[#008141] font-bold text-lg mb-4 flex items-center gap-2">
                      🟢 Referência do Catálogo (Dado Categorizado)
                    </h3>
                    <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg flex items-start gap-3 mb-6 text-sm">
                      <Scale className="shrink-0 mt-0.5" size={18} />
                      <ul>
                        <li>
                          Você está solicitando um dado já categorizado, ou
                          seja, que está no <strong>Catálogo de Dados</strong>.
                          A seguir, você deve informar o ID do dado desejado e
                          algumas outras informações básicas.{" "}
                        </li>
                        <br />
                        <li>
                          Ao finalizar o preenchimento dessa ficha, você deve
                          gerar um PDF clicando no botão{" "}
                          <strong>“Gerar Ficha”</strong> e anexá-la no{" "}
                          <strong>
                            Ofício de Solicitação de Compartilhamento
                          </strong>{" "}
                          (Anexo 3 da Resolução). Além do ofício, você também
                          deve preencher o{" "}
                          <strong>Termo de Responsabilidade</strong> (Anexo 4 da
                          Resolução).
                        </li>
                      </ul>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-bold text-slate-700 mb-2">
                          ID do Dado no Catálogo{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full p-2.5 border-2 border-green-200 bg-white rounded-lg focus:border-[#009a4d] outline-none transition-all"
                          value={formData.idCatalogo}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              idCatalogo: e.target.value,
                            })
                          }
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          Código de identificação da Ficha de Categorização no
                          Catálogo de Dados
                        </p>
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-2">
                          Título do Dado (Catálogo){" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full p-2.5 border-2 border-green-200 bg-white rounded-lg focus:border-[#009a4d] outline-none transition-all"
                          value={formData.tituloDadoA}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              tituloDadoA: e.target.value,
                            })
                          }
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          Título exato conforme consta no Catálogo de Dados
                        </p>
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-2">
                          Categoria de Compartilhamento{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <select
                          className="w-full p-2.5 border-2 border-green-200 bg-white rounded-lg focus:border-[#009a4d] outline-none transition-all"
                          value={formData.categoriaCompartilhamento}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              categoriaCompartilhamento: e.target.value,
                            })
                          }
                        >
                          <option value="">-- Conforme Catálogo --</option>
                          <option value="amplo">Amplo</option>
                          <option value="restrito">Restrito</option>
                          <option value="especifico">Específico</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-2">
                          Tipo de Informação{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <select
                          className="w-full p-2.5 border-2 border-green-200 bg-white rounded-lg focus:border-[#009a4d] outline-none transition-all"
                          value={formData.tipoInformacaoCat}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              tipoInformacaoCat: e.target.value,
                            })
                          }
                        >
                          <option value="">
                            -- Conforme Ficha de Categorização --
                          </option>
                          <option value="consulta-registro-unico">
                            Consulta de Registro Único
                          </option>
                          <option value="conjunto-informacoes">
                            Conjunto de Informações
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Caminho B: Não Categorizado */}
                {formData.caminho === "nao-categorizado" && (
                  <div className="bg-slate-50 border border-red-200 rounded-xl p-6 mt-6 shadow-inner">
                    <h3 className="text-red-700 font-bold text-lg mb-4 flex items-center gap-2">
                      🔴 Detalhamento para Categorização Prévia
                    </h3>
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg flex items-start gap-3 mb-6">
                      <Scale className="shrink-0 mt-0.5" size={18} />
                      <ul>
                        <li>
                          Você está solicitando um dado que ainda não foi
                          categorizado, ou seja, NÃO está no{" "}
                          <strong>Catálogo de Dados.</strong> A seguir, você
                          deve informar o tipo de informação que você deseja
                          (Consulta de Registro Único ou Conjunto de
                          Informações) e quais os atributos de entrada e saída
                          necessários para o recebimento dos dados.
                        </li>
                        <br />
                        <li>
                          <strong>Consulta de Registro Único:</strong> Use
                          quando a busca for sobre uma pessoa ou um objeto
                          específico. Exemplos: consultar os dados biográficos
                          de um CPF ou detalhes de um veículo a partir da placa
                          dele.
                        </li>
                        <br />
                        <li>
                          <strong>Conjunto de Informações:</strong> Use quando a
                          busca utilizar critérios (parâmetros) e gerar uma
                          lista de resultados. Exemplos: lista dos beneficiários
                          do Vale Gás ou de veículos com licenciamento atrasado
                          em um município
                        </li>
                        <br />
                        <li>
                          Ao finalizar o preenchimento dessa ficha, você deve
                          gerar um PDF clicando no botão{" "}
                          <strong>“Gerar Ficha”</strong> e anexá-la no{" "}
                          <strong>
                            Ofício de Solicitação de Categorização
                          </strong>{" "}
                          (Anexo 2 da Resolução). Como o dado ainda não está
                          categorizado, você NÃO deve preencher o Termo de
                          Responsabilidade ainda.
                        </li>
                      </ul>
                    </div>
                    <div className="grid grid-cols-1 gap-6 mb-6">
                      <div>
                        <label className="block font-bold text-slate-700 mb-2">
                          Tipo de Informação Solicitada
                        </label>
                        <select
                          className="w-full p-2.5 border-2 border-red-200 bg-white rounded-lg focus:border-red-500 outline-none transition-all"
                          value={formData.tipoInformacaoNovo}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              tipoInformacaoNovo: e.target.value,
                            })
                          }
                        >
                          <option value="">-- Selecione --</option>
                          <option value="consulta">
                            Consulta de Registro Único
                          </option>
                          <option value="conjunto">
                            Conjunto de Informações
                          </option>
                        </select>
                        <p className="text-xs text-slate-500 mt-1">
                          Consulta Única: busca dados sobre 1 pessoa/objeto
                          específico | Conjunto: lista várias pessoas/objetos
                          com base em filtros
                        </p>
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-2">
                          Título Sugerido para o Dado
                        </label>
                        <input
                          type="text"
                          className="w-full p-2.5 border-2 border-red-200 bg-white rounded-lg focus:border-red-500 outline-none transition-all"
                          value={formData.tituloSolicitado}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              tituloSolicitado: e.target.value,
                            })
                          }
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          Sugestão de título que caracterize os dados
                          solicitados
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      <InteractiveAttributes
                        type="entrada"
                        title="ENTRADA (O que você TEM)"
                        description="Atributos que você precisa consultar."
                        placeholder="Ex: CPF, CNPJ..."
                        items={atributosEntrada}
                        onAdd={(name) =>
                          setAtributosEntrada([
                            ...atributosEntrada,
                            { id: Date.now().toString(), name },
                          ])
                        }
                        onRemove={(id) =>
                          setAtributosEntrada(
                            atributosEntrada.filter((a) => a.id !== id),
                          )
                        }
                      />
                      <InteractiveAttributes
                        type="saida"
                        title="SAÍDA (O que você QUER)"
                        description="Dados exatos que deseja receber como resposta."
                        placeholder="Ex: Nome, status..."
                        items={atributosSaida}
                        onAdd={(name) =>
                          setAtributosSaida([
                            ...atributosSaida,
                            { id: Date.now().toString(), name },
                          ])
                        }
                        onRemove={(id) =>
                          setAtributosSaida(
                            atributosSaida.filter((a) => a.id !== id),
                          )
                        }
                      />
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* LGPD */}
            {formData.caminho && (
              <section className="bg-[#fefce8] border-[3px] border-amber-400 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                <h3 className="text-amber-800 font-bold text-xl mb-6 flex items-center gap-2">
                  <span className="text-amber-700">⚖️</span> Os dados
                  solicitados envolvem dados pessoais? (LGPD)
                </h3>
                <div className="bg-[#fdf8d4] rounded-lg p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-5 border border-amber-200/50">
                  <span className="text-slate-800 font-medium text-base">
                    A solicitação envolve dados pessoais?
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer sm:ml-auto">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={formData.envolveDadosPessoais}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          envolveDadosPessoais: e.target.checked,
                        })
                      }
                    />
                    <div className="w-12 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#009a4d] shadow-inner"></div>
                    <span className="ml-3 font-bold text-slate-700 w-8">
                      {formData.envolveDadosPessoais ? "SIM" : "NÃO"}
                    </span>
                  </label>
                </div>
                <div className="bg-[#eef4ff] border border-[#bfd7fc] rounded-lg p-5 text-blue-900 text-sm leading-relaxed mb-2">
                  <ul>
                    <li>
                      <strong>O que são dados pessoais?</strong> Informações que
                      identifiquem ou tornem identificável uma pessoa (CPF
                      completo, nome + endereço, etc.).
                    </li>
                    <br />
                    <li>
                      Se sua solicitação envolve dados pessoais, é necessário
                      informar a{" "}
                      <strong>
                        finalidade, adequação, necessidade e base legal
                      </strong>{" "}
                      para ter acesso aos dados.
                    </li>
                  </ul>
                </div>
                {formData.envolveDadosPessoais && (
                  <div className="mt-8 space-y-6 pt-6 border-t border-amber-200 animate-in fade-in duration-300">
                    <div className="space-y-6">
                      <div>
                        <label className="block font-bold text-slate-700 mb-2">
                          Finalidade <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          className="w-full p-2.5 border-2 border-amber-200 bg-white rounded-lg focus:border-amber-500 outline-none min-h-20"
                          placeholder="Objetivo legítimo, específico e explícito..."
                          value={formData.finalidadeLGPD}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              finalidadeLGPD: e.target.value,
                            })
                          }
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          {`Informe para que o dado pessoal será usado. Ex: "Validação de identidade para concessão do benefício X"`}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block font-bold text-slate-700 mb-2">
                            Adequação <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            className="w-full p-2.5 border-2 border-amber-200 bg-white rounded-lg focus:border-amber-500 outline-none min-h-20"
                            value={formData.adequacaoLGPD}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                adequacaoLGPD: e.target.value,
                              })
                            }
                          />
                          <p className="text-xs text-slate-500 mt-1">
                            Compatibilidade do tratamento com a finalidade
                            informada
                          </p>
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-2">
                            Necessidade <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            className="w-full p-2.5 border-2 border-amber-200 bg-white rounded-lg focus:border-amber-500 outline-none min-h-20"
                            value={formData.necessidadeLGPD}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                necessidadeLGPD: e.target.value,
                              })
                            }
                          />
                          <p className="text-xs text-slate-500 mt-1">
                            Justifique porque não é possível fazer sem esse dado
                          </p>
                        </div>
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-2">
                          Base Legal <span className="text-red-500">*</span>
                        </label>
                        <select
                          className="w-full p-2.5 border-2 border-amber-200 bg-white rounded-lg focus:border-amber-500 outline-none"
                          value={formData.baseLegalLGPD}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              baseLegalLGPD: e.target.value,
                            })
                          }
                        >
                          <option
                            value="Art. 7º, III - Execução de políticas
                          públicas (dados comuns)"
                          >
                            Art. 7º, III - Execução de políticas públicas (dados
                            comuns)
                          </option>
                          <option
                            value={`Art. 11, II, "b" - Política pública prevista em lei (dados sensíveis)`}
                          >{`Art. 11, II, "b" - Política pública prevista em lei (dados sensíveis)`}</option>
                          <option value="Outro">Outro</option>
                        </select>
                        <p className="text-xs text-slate-500 mt-1">
                          Informar qual a justificativa na lei, de acordo com a
                          LGPD. Ex: Art. 7º, III - Execução de políticas
                          públicas (dados comuns)
                        </p>
                      </div>
                      {formData.baseLegalLGPD === "Outro" && (
                        <div>
                          <label className="block font-bold text-slate-700 mb-2">
                            Especifique a base legal{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            className="w-full p-2.5 border-2 border-amber-200 bg-white rounded-lg focus:border-amber-500 outline-none"
                            value={formData.baseLegalEspecificaLGPD}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                baseLegalEspecificaLGPD: e.target.value,
                              })
                            }
                          ></textarea>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* Footer */}
          <div className="bg-slate-50 border-t border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={handleLimpar}
              className="bg-white border-2 border-slate-200 hover:bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 transition-colors shadow-sm active:scale-95 w-full sm:w-auto"
            >
              <Trash2 size={20} /> Limpar Formulário
            </button>
            <button
              onClick={handleVisualizarFicha}
              disabled={!formData.caminho}
              className="disabled:opacity-50 disabled:cursor-not-allowed bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 transition-colors shadow-sm active:scale-95 w-full sm:w-auto"
            >
              <Eye size={20} /> Visualizar Ficha
            </button>
            <button
              onClick={handleGerarPDF}
              disabled={!formData.caminho}
              className="disabled:opacity-50 disabled:cursor-not-allowed bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 transition-colors shadow-sm active:scale-95 w-full sm:w-auto"
            >
              <FileDown size={20} /> Gerar Ficha PDF
            </button>
          </div>
        </div>
      </main>

      {/* Modal de avisos e próximos passos */}
      <Modal {...modalConfig} onClose={closeModal}>
        {modalConfig.content}
      </Modal>

      {/* Modal de Preview */}
      <Modal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Pré-visualização da Ficha"
        type="info"
        size="lg"
        secondaryAction={{
          label: "Fechar",
          onClick: () => setPreviewOpen(false),
        }}
        primaryAction={{
          label: "Gerar PDF",
          onClick: () => {
            setPreviewOpen(false);
            handleGerarPDF();
          },
        }}
      >
        {buildPreviewContent()}
      </Modal>
    </>
  );
}
