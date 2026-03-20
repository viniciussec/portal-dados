"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { InteractiveAttributes, Attribute } from "@/components/forms/InteractiveAttributes";
import { FileDown, ArrowLeft, Info, AlertTriangle, Scale, FileText, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";

export default function CategorizacaoPage() {
  const INITIAL_STATE = {
    orgaoGestor: "",
    respTecnico: "",
    contatoTecnico: "",
    dataCat: "",
    tipoInfo: "",
    tituloDado: "",
    descricaoDado: "",
    categoria: "",
    subcategoria: "",
    regrasCompartilhamento: "",
    fundamentacaoEspecifica: "",
    envolveDadosPessoais: false,
    finalidadeLGPD: "",
    baseLegalLGPD: "",
    adequacaoLGPD: "",
    necessidadeLGPD: "",
  };

  const [formData, setFormData] = useState(INITIAL_STATE);
  const [atributosEntrada, setAtributosEntrada] = useState<Attribute[]>([]);
  const [atributosSaida, setAtributosSaida] = useState<Attribute[]>([]);
  const [emailError, setEmailError] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    type: 'warning' | 'info' | 'success';
    content: React.ReactNode;
    primaryAction?: { label: string; onClick: () => void };
    secondaryAction?: { label: string; onClick: () => void };
  }>({ isOpen: false, title: '', type: 'info', content: null });

  const closeModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  function formatDate(d: string) {
    if (!d) return "";
    const [y, m, day] = d.split("-");
    return `${day}/${m}/${y}`;
  }

  const LABEL_BASE_LEGAL: Record<string, string> = {
    "art-7-iii": "Art. 7º, III - Execução de políticas públicas (dados comuns)",
    "art-11-ii-b": 'Art. 11, II, "b" - Política pública prevista em lei (dados sensíveis)',
    outro: "Outro (especificar na adequação)",
  };

  const handleLimpar = () => {
    setModalConfig({
      isOpen: true,
      type: 'warning',
      title: 'Limpar Formulário',
      content: <p className="text-sm">Tem certeza que deseja limpar todos os campos da ficha? Esta ação não pode ser desfeita.</p>,
      secondaryAction: { label: 'Cancelar', onClick: closeModal },
      primaryAction: {
        label: 'Sim, limpar tudo',
        onClick: () => {
          closeModal();
          setFormData(INITIAL_STATE);
          setAtributosEntrada([]);
          setAtributosSaida([]);
          setEmailError("");
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    });
  };

  const SUBCATEGORIAS = {
    amplo: [
      { id: 'A01', label: 'A01 - Informação gerada em evento público' },
      { id: 'A02', label: 'A02 - Informação sobre funcionamento governamental' },
      { id: 'A03', label: 'A03 - Informações declaradas públicas pelos órgãos' },
      { id: 'A04', label: 'A04 - Situação de regularidade de Pessoas Jurídicas' },
      { id: 'A05', label: 'A05 - Informações estatísticas' },
      { id: 'A06', label: 'A06 - Beneficiários com dados anonimizados' }
    ],
    restrito: [
      { id: 'R01', label: 'R01 - Dados cadastrais' },
      { id: 'R02', label: 'R02 - Situação de regularidade de Pessoas Físicas' },
      { id: 'R03', label: 'R03 - Beneficiários de programas sociais' }
    ],
    especifico: [
      { id: 'E01', label: 'E01 - Informações com restrições legais' },
      { id: 'E02', label: 'E02 - Segurança pública' },
      { id: 'E03', label: 'E03 - Informações internas de sistemas' },
      { id: 'E04', label: 'E04 - Informações que coloquem pessoas em risco' },
      { id: 'E05', label: 'E05 - Informações médicas' }
    ]
  };

  const validateFields = () => {
    const required = [
      { key: 'orgaoGestor', label: 'Órgão/Entidade Gestora' },
      { key: 'respTecnico', label: 'Responsável Técnico' },
      { key: 'contatoTecnico', label: 'Contato Técnico (E-mail)' },
      { key: 'dataCat', label: 'Data da Categorização' },
      { key: 'tipoInfo', label: 'Tipo de Informação' },
      { key: 'tituloDado', label: 'Título do Dado' },
      { key: 'descricaoDado', label: 'Descrição' },
      { key: 'categoria', label: 'Categoria de Compartilhamento' },
      { key: 'subcategoria', label: 'Subcategoria' }
    ];
    const missing = required.filter(f => !formData[f.key as keyof typeof formData]);
    if (formData.envolveDadosPessoais) {
      if (!formData.finalidadeLGPD) missing.push({ key: 'finalidadeLGPD', label: 'LGPD: Finalidade' });
      if (!formData.baseLegalLGPD) missing.push({ key: 'baseLegalLGPD', label: 'LGPD: Base Legal' });
      if (!formData.adequacaoLGPD) missing.push({ key: 'adequacaoLGPD', label: 'LGPD: Adequação' });
      if (!formData.necessidadeLGPD) missing.push({ key: 'necessidadeLGPD', label: 'LGPD: Necessidade' });
    }
    if (formData.contatoTecnico && !isValidEmail(formData.contatoTecnico))
      missing.push({ key: 'contatoTecnico', label: 'Contato Técnico (E-mail inválido)' });
    return missing;
  };

  const showValidationError = (missing: { key: string; label: string }[]) => {
    setModalConfig({
      isOpen: true,
      type: 'warning',
      title: 'Campos Obrigatórios Pendentes',
      content: (
        <div className="space-y-3">
          <p className="text-sm">Para gerar a ficha oficial, preencha os seguintes campos:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm font-medium text-slate-700">
            {missing.map(f => <li key={f.key}>{f.label}</li>)}
          </ul>
        </div>
      ),
      primaryAction: { label: 'Entendi, vou preencher', onClick: closeModal }
    });
  };

  const buildPreviewContent = () => {
    const subLabel = formData.subcategoria
      ? SUBCATEGORIAS[formData.categoria as keyof typeof SUBCATEGORIAS]?.find(s => s.id === formData.subcategoria)?.label || formData.subcategoria
      : "";
    const TIPO: Record<string, string> = { consulta: "Consulta de Registro Único", conjunto: "Conjunto de Informações" };

    const Row = ({ label, value }: { label: string; value: string }) => (
      <div className="flex gap-3 py-2 border-b border-slate-100 last:border-0">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide w-44 shrink-0 pt-0.5">{label}</span>
        <span className="text-sm text-slate-800 flex-1">{value || <span className="text-slate-400 italic">Não preenchido</span>}</span>
      </div>
    );
    const Section = ({ title, colorClass, children }: { title: string; colorClass: string; children: React.ReactNode }) => (
      <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
        <div className={cn("px-4 py-2.5 font-bold text-sm uppercase tracking-wider", colorClass)}>{title}</div>
        <div className="px-4 py-3 bg-white">{children}</div>
      </div>
    );

    return (
      <div className="space-y-4">
        <div className="text-center pb-4 border-b border-slate-200">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Estado do Ceará • Casa Civil</p>
          <p className="font-extrabold text-slate-800 text-base">Ficha de Categorização de Dados</p>
          <p className="text-xs text-slate-500 mt-1">Resolução nº 01/2026 • Gerado em {new Date().toLocaleDateString("pt-BR")}</p>
        </div>

        <Section title="Identificação do Gestor de Dados" colorClass="bg-green-50 text-green-800">
          <Row label="Órgão/Entidade" value={formData.orgaoGestor} />
          <Row label="Responsável Técnico" value={formData.respTecnico} />
          <Row label="Contato (E-mail)" value={formData.contatoTecnico} />
          <Row label="Data da Categorização" value={formatDate(formData.dataCat)} />
        </Section>

        <Section title="Tipo e Detalhes da Informação" colorClass="bg-blue-50 text-blue-800">
          <Row label="Tipo de Informação" value={TIPO[formData.tipoInfo] || formData.tipoInfo} />
          <Row label="Título do Dado" value={formData.tituloDado} />
          <Row label="Descrição" value={formData.descricaoDado} />
          <Row label={`Atributos Entrada (${atributosEntrada.length})`} value={atributosEntrada.length > 0 ? atributosEntrada.map(a => a.name).join(", ") : "Nenhum"} />
          <Row label={`Atributos Saída (${atributosSaida.length})`} value={atributosSaida.length > 0 ? atributosSaida.map(a => a.name).join(", ") : "Nenhum"} />
        </Section>

        <Section title="Categoria de Compartilhamento" colorClass={formData.categoria === 'amplo' ? "bg-green-50 text-green-800" : formData.categoria === 'restrito' ? "bg-amber-50 text-amber-800" : "bg-red-50 text-red-800"}>
          <Row label="Categoria" value={formData.categoria ? formData.categoria.toUpperCase() : ""} />
          <Row label="Subcategoria" value={subLabel} />
          {formData.regrasCompartilhamento && <Row label="Regras Complementares" value={formData.regrasCompartilhamento} />}
          {formData.fundamentacaoEspecifica && <Row label="Fundamentação Específica" value={formData.fundamentacaoEspecifica} />}
        </Section>

        {formData.envolveDadosPessoais && (
          <Section title="Proteção de Dados Pessoais (LGPD)" colorClass="bg-amber-50 text-amber-800">
            <Row label="Finalidade" value={formData.finalidadeLGPD} />
            <Row label="Base Legal" value={LABEL_BASE_LEGAL[formData.baseLegalLGPD] || formData.baseLegalLGPD} />
            <Row label="Adequação" value={formData.adequacaoLGPD} />
            <Row label="Necessidade" value={formData.necessidadeLGPD} />
          </Section>
        )}
      </div>
    );
  };

  const handleVisualizarFicha = () => {
    const missing = validateFields();
    if (missing.length > 0) { showValidationError(missing); return; }
    setPreviewOpen(true);
  };

  const handleGerarPDF = async () => {
    const missing = validateFields();
    if (missing.length > 0) { showValidationError(missing); return; }

    const { generatePDF } = await import("@/lib/pdfGenerator");
    const TIPO: Record<string, string> = { consulta: "Consulta de Registro Único", conjunto: "Conjunto de Informações" };
    const pdfData = [
      {
        title: "Identificação do Gestor de Dados",
        content: [
          `Órgão/Entidade Gestora: ${formData.orgaoGestor}`,
          `Responsável Técnico: ${formData.respTecnico}`,
          `Contato (E-mail): ${formData.contatoTecnico}`,
          `Data da Categorização: ${formatDate(formData.dataCat)}`
        ]
      },
      {
        title: "Detalhes da Informação",
        content: [
          `Tipo de Informação: ${TIPO[formData.tipoInfo] || 'Não informado'}`,
          `Título do Dado: ${formData.tituloDado}`,
          `Descrição: ${formData.descricaoDado || 'N/A'}`
        ]
      },
      {
        title: "Atributos",
        content: [
          `Atributos de Entrada: ${atributosEntrada.length > 0 ? atributosEntrada.map(a => a.name).join(", ") : "Nenhum"}`,
          `Atributos de Saída: ${atributosSaida.length > 0 ? atributosSaida.map(a => a.name).join(", ") : "Nenhum"}`
        ]
      },
      {
        title: "Categoria de Compartilhamento",
        content: [
          `Categoria: ${formData.categoria ? formData.categoria.toUpperCase() : 'Não selecionada'}`,
          `Subcategoria: ${formData.subcategoria ? SUBCATEGORIAS[formData.categoria as keyof typeof SUBCATEGORIAS]?.find(s => s.id === formData.subcategoria)?.label || formData.subcategoria : 'Não selecionada'}`,
          ...(formData.regrasCompartilhamento ? [`Regras Complementares: ${formData.regrasCompartilhamento}`] : []),
          ...(formData.fundamentacaoEspecifica ? [`Fundamentação para Categorização Específica: ${formData.fundamentacaoEspecifica}`] : [])
        ]
      }
    ];

    if (formData.envolveDadosPessoais) {
      pdfData.splice(3, 0, {
        title: "Proteção de Dados Pessoais (LGPD)",
        content: [
          `Envolve Dados Pessoais: Sim`,
          `Finalidade: ${formData.finalidadeLGPD}`,
          `Base Legal: ${formData.baseLegalLGPD === 'art-7-iii' ? 'Art. 7º, III (dados comuns)' : formData.baseLegalLGPD === 'art-11-ii-b' ? 'Art. 11, II, "b" (dados sensíveis)' : formData.baseLegalLGPD}`,
          `Adequação: ${formData.adequacaoLGPD}`,
          `Necessidade: ${formData.necessidadeLGPD}`
        ]
      });
    }

    generatePDF("Ficha de Categorização de Dados", pdfData, "save");
  };

  return (
    <>
      <Header />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="text-[#009a4d] hover:text-[#008141] flex items-center gap-2 font-medium transition-colors">
            <ArrowLeft size={20} /> Voltar para o Início
          </Link>
          <button onClick={handleGerarPDF} className="bg-[#009a4d] hover:bg-[#008141] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm">
            <FileDown size={20} /> Exportar Ficha PDF
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden relative">
          <div className="absolute top-0 inset-x-0 h-2 bg-[#009a4d]"></div>
          <div className="bg-slate-50 border-b border-slate-200 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex bg-white w-28 h-20 items-center justify-center border-b-[4px] border-[#009a4d] shadow-sm shrink-0">
                 <FileText strokeWidth={1.25} className="w-10 h-10 text-slate-700" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-slate-800 mb-2 tracking-tight flex items-center gap-3">
                  <span className="sm:hidden text-3xl">📊</span> Ficha de Categorização
                </h1>
                <p className="text-slate-500 font-medium">Resolução nº 01/2026 - Estado do Ceará | Versão Digital</p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-12">
            {/* Legal Info */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-amber-900 shadow-sm">
              <h3 className="font-bold flex items-center gap-2 mb-3 text-amber-700">
                <Scale size={20} /> Base Legal
              </h3>
              <ul className="space-y-2 text-sm leading-relaxed">
                <li><strong>Resolução nº 01/2026, Art. 3.5:</strong> "O gestor de dados deve preencher uma Ficha de Categorização disponibilizada pelo Subcomitê de Governança de Dados"</li>
                <li><strong>Decreto nº 37.059/2026:</strong> Governança no compartilhamento de dados no âmbito da Administração Pública estadual</li>
              </ul>
            </div>

            {/* Identificação */}
            <section className="bg-white border text-sm border-slate-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b-2 border-slate-100 pb-3">
                <span className="text-[#009a4d]">📋</span> Identificação do Gestor de Dados
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-bold text-slate-700 mb-2">Órgão/Entidade Gestora de Dados <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full p-2.5 border-2 border-slate-200 bg-slate-50 rounded-lg focus:border-[#009a4d] focus:bg-white focus:ring-4 focus:ring-green-50 transition-all outline-none" value={formData.orgaoGestor} onChange={(e) => setFormData({...formData, orgaoGestor: e.target.value})} />
                  <p className="text-xs text-slate-500 mt-2">Nome completo do órgão responsável pela governança dos dados</p>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-2">Responsável Técnico <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full p-2.5 border-2 border-slate-200 bg-slate-50 rounded-lg focus:border-[#009a4d] focus:bg-white focus:ring-4 focus:ring-green-50 transition-all outline-none" value={formData.respTecnico} onChange={(e) => setFormData({...formData, respTecnico: e.target.value})} />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-2">Contato Técnico (E-mail) <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    className={cn("w-full p-2.5 border-2 bg-slate-50 rounded-lg focus:bg-white focus:ring-4 transition-all outline-none", emailError ? "border-red-400 focus:border-red-500 focus:ring-red-50" : "border-slate-200 focus:border-[#009a4d] focus:ring-green-50")}
                    value={formData.contatoTecnico}
                    onChange={(e) => { setFormData({...formData, contatoTecnico: e.target.value}); setEmailError(""); }}
                    onBlur={() => {
                      if (formData.contatoTecnico && !isValidEmail(formData.contatoTecnico))
                        setEmailError("E-mail inválido. Ex: nome@orgao.gov.br");
                      else setEmailError("");
                    }}
                    placeholder="nome@orgao.ce.gov.br"
                  />
                  {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
                  {!emailError && <p className="text-xs text-slate-500 mt-1">E-mail para esclarecimentos técnicos sobre a categorização</p>}
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-2">Data da Categorização <span className="text-red-500">*</span></label>
                  <input type="date" className="w-full p-2.5 border-2 border-slate-200 bg-slate-50 rounded-lg focus:border-[#009a4d] focus:bg-white focus:ring-4 focus:ring-green-50 transition-all outline-none" value={formData.dataCat} onChange={(e) => setFormData({...formData, dataCat: e.target.value})} />
                </div>
              </div>
            </section>

            {/* Tipo Informação */}
            <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b-2 border-slate-100 pb-3">
                <span className="text-[#009a4d]">📑</span> Tipo de Informação
              </h2>
              
              <div className="bg-slate-50 border border-slate-200 text-slate-700 p-4 rounded-lg flex items-start gap-3 mb-6">
                <Info className="flex-shrink-0 mt-0.5 text-slate-500" />
                <p><strong>Art. 3.2 da Resolução:</strong> O gestor de dados deve categorizar dois tipos de informações específicos.</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-2">Selecione o Tipo de Informação <span className="text-red-500">*</span></label>
                <select className="w-full p-2.5 border-2 border-slate-200 bg-slate-50 rounded-lg focus:border-[#009a4d] focus:bg-white focus:ring-4 focus:ring-green-50 transition-all outline-none" value={formData.tipoInfo} onChange={(e) => setFormData({...formData, tipoInfo: e.target.value})}>
                  <option value="">-- Selecione --</option>
                  <option value="consulta">1. Consulta de Registro Único</option>
                  <option value="conjunto">2. Conjunto de Informações</option>
                </select>
              </div>

              {formData.tipoInfo === "consulta" && (
                <div className="mt-4 bg-green-50 text-green-800 p-4 rounded-lg border border-green-200">
                  <strong>Consulta de Registro Único:</strong> Pesquisa que retorna informações sobre um indivíduo ou objeto específico. Requer chave única (ID) e retorna dados correspondentes àquele identificador.
                </div>
              )}
              {formData.tipoInfo === "conjunto" && (
                <div className="mt-4 bg-green-50 text-green-800 p-4 rounded-lg border border-green-200">
                  <strong>Conjunto de Informações:</strong> Pesquisa baseada em filtros que retorna lista de dados. Usa parâmetros de pesquisa abrangentes e retorna matriz com múltiplos registros.
                </div>
              )}
            </section>

            {/* Detalhes e Atributos */}
            <section className="bg-white border text-sm border-slate-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b-2 border-slate-100 pb-3">
                <span className="text-[#009a4d]">📝</span> Detalhes da Informação Categorizada
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block font-bold text-slate-700 mb-2">Título do Dado <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full p-2.5 border-2 border-slate-200 bg-slate-50 rounded-lg focus:border-[#009a4d] focus:bg-white focus:ring-4 focus:ring-green-50 transition-all outline-none" value={formData.tituloDado} onChange={(e) => setFormData({...formData, tituloDado: e.target.value})} />
                  <p className="text-xs text-slate-500 mt-2">Título claro e descritivo que caracterize os dados categorizados</p>
                </div>
                
                <div>
                  <label className="block font-bold text-slate-700 mb-2">Descrição <span className="text-red-500">*</span></label>
                  <textarea className="w-full p-2.5 border-2 border-slate-200 bg-slate-50 rounded-lg focus:border-[#009a4d] focus:bg-white focus:ring-4 focus:ring-green-50 transition-all outline-none min-h-[120px]" value={formData.descricaoDado} onChange={(e) => setFormData({...formData, descricaoDado: e.target.value})} />
                  <p className="text-xs text-slate-500 mt-2">Definição detalhada do dado ou informação categorizada</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <InteractiveAttributes 
                    type="entrada"
                    title="ENTRADA"
                    description="Parâmetros definidos pelo gestor de dados que o solicitante fornecerá para localizar o registro ou filtrar a lista."
                    placeholder="Ex: CPF, matrícula, NIS..."
                    items={atributosEntrada}
                    onAdd={(name) => setAtributosEntrada([...atributosEntrada, { id: Date.now().toString(), name }])}
                    onRemove={(id) => setAtributosEntrada(atributosEntrada.filter(a => a.id !== id))}
                  />
                  <InteractiveAttributes 
                    type="saida"
                    title="SAÍDA"
                    description="Dados disponibilizados ao solicitante por meio da API, como resultado da consulta realizada a partir dos atributos de entrada."
                    placeholder="Ex: nome, telefone, endereço..."
                    items={atributosSaida}
                    onAdd={(name) => setAtributosSaida([...atributosSaida, { id: Date.now().toString(), name }])}
                    onRemove={(id) => setAtributosSaida(atributosSaida.filter(a => a.id !== id))}
                  />
                </div>
              </div>
            </section>

            {/* Secao LGPD */}
            <section className="bg-[#fefce8] border-[3px] border-amber-400 rounded-2xl p-6 shadow-sm">
              <h3 className="text-amber-800 font-bold text-xl mb-6 flex items-center gap-2">
                <span className="text-amber-700">⚖️</span> Dados Pessoais (LGPD)
              </h3>
              
              <div className="bg-[#fdf8d4] rounded-lg p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-5 border border-amber-200/50">
                <span className="text-slate-800 font-medium text-base">A categorização envolve dados pessoais?</span>
                
                <label className="relative inline-flex items-center cursor-pointer sm:ml-auto">
                  <input type="checkbox" className="sr-only peer" checked={formData.envolveDadosPessoais} onChange={(e) => setFormData({...formData, envolveDadosPessoais: e.target.checked})} />
                  <div className="w-12 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#009a4d] shadow-inner"></div>
                  <span className="ml-3 font-bold text-slate-700 w-8">{formData.envolveDadosPessoais ? 'SIM' : 'NÃO'}</span>
                </label>
              </div>

              <div className="bg-[#eef4ff] border border-[#bfd7fc] rounded-lg p-5 text-blue-900 text-sm leading-relaxed mb-2 space-y-2">
                <p><strong>Dados pessoais:</strong> Informações que identifiquem ou tornem identificável uma pessoa (CPF completo, nome + endereço, etc.). <strong>Dados sensíveis:</strong> origem racial, convicções religiosas, dados de saúde, orientação sexual, etc.</p>
                <p><strong>Art. 5.5 da Resolução:</strong> O compartilhamento de dados pessoais deve seguir as resoluções do Comitê Estadual de Proteção de Dados Pessoais.</p>
              </div>

              {formData.envolveDadosPessoais && (
                <div className="mt-8 space-y-6 pt-6 border-t border-amber-200 animate-in fade-in duration-300">
                  <div className="space-y-6">
                    <div>
                      <label className="block font-bold text-slate-700 mb-2">Finalidade <span className="text-red-500">*</span></label>
                      <textarea className="w-full p-2.5 border-2 border-amber-200 bg-white rounded-lg focus:border-amber-500 outline-none min-h-[80px]" value={formData.finalidadeLGPD} onChange={(e) => setFormData({...formData, finalidadeLGPD: e.target.value})} />
                      <p className="text-xs text-slate-500 mt-1">Objetivo legítimo, específico e explícito do tratamento dos dados</p>
                    </div>
                    
                    <div>
                      <label className="block font-bold text-slate-700 mb-2">Base Legal <span className="text-red-500">*</span></label>
                      <select className="w-full p-2.5 border-2 border-amber-200 bg-white rounded-lg focus:border-amber-500 outline-none" value={formData.baseLegalLGPD} onChange={(e) => setFormData({...formData, baseLegalLGPD: e.target.value})}>
                        <option value="">-- Selecione --</option>
                        <option value="art-7-iii">Art. 7º, III - Execução de políticas públicas (dados comuns)</option>
                        <option value="art-11-ii-b">Art. 11, II, "b" - Política pública prevista em lei (dados sensíveis)</option>
                        <option value="outro">Outro (especificar na adequação)</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-bold text-slate-700 mb-2">Adequação <span className="text-red-500">*</span></label>
                        <textarea className="w-full p-2.5 border-2 border-amber-200 bg-white rounded-lg focus:border-amber-500 outline-none min-h-[80px]" value={formData.adequacaoLGPD} onChange={(e) => setFormData({...formData, adequacaoLGPD: e.target.value})} />
                        <p className="text-xs text-slate-500 mt-1">Compatibilidade do tratamento com a finalidade informada</p>
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-2">Necessidade <span className="text-red-500">*</span></label>
                        <textarea className="w-full p-2.5 border-2 border-amber-200 bg-white rounded-lg focus:border-amber-500 outline-none min-h-[80px]" value={formData.necessidadeLGPD} onChange={(e) => setFormData({...formData, necessidadeLGPD: e.target.value})} />
                        <p className="text-xs text-slate-500 mt-1">Justificativa de que são dados mínimos necessários</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Categorização e Privacidade */}
            <section className="bg-white border text-sm border-slate-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b-2 border-slate-100 pb-3">
                <span className="text-[#009a4d]">🔐</span> Categoria de Compartilhamento
              </h2>
              
              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg flex items-start gap-3 mb-6 font-medium">
                <AlertTriangle className="flex-shrink-0 mt-0.5 text-amber-600" />
                <p><strong>Importante:</strong> Categorizar sempre que possível no nível mais aberto, respeitando regras de sigilo (Art. 3.1).</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div 
                  className={cn("border-2 rounded-xl p-5 cursor-pointer transition-all hover:-translate-y-1 relative overflow-hidden", formData.categoria === 'amplo' ? "border-[#009a4d] bg-green-50 shadow-md" : "border-slate-200 bg-white")} 
                  onClick={() => setFormData({...formData, categoria: 'amplo', subcategoria: ''})}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#009a4d] flex items-center justify-center text-white text-xl">🟢</div>
                    <div className="font-bold text-[#009a4d] text-lg">AMPLO</div>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">Dados públicos sem restrição de acesso, com divulgação garantida.</p>
                  <div className="text-xs bg-black/5 text-slate-700 p-2 rounded">Ex: Diário Oficial, Dados abertos, Contratos</div>
                </div>

                <div 
                  className={cn("border-2 rounded-xl p-5 cursor-pointer transition-all hover:-translate-y-1 relative overflow-hidden", formData.categoria === 'restrito' ? "border-amber-500 bg-amber-50 shadow-md" : "border-slate-200 bg-white")} 
                  onClick={() => setFormData({...formData, categoria: 'restrito', subcategoria: ''})}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white text-xl">🟡</div>
                    <div className="font-bold text-amber-600 text-lg">RESTRITO</div>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">Compartilhamento condicionado por sigilo legal ou segurança.</p>
                  <div className="text-xs bg-black/5 text-slate-700 p-2 rounded">Ex: Dados tributários, Dados protegidos por lei</div>
                </div>

                <div 
                  className={cn("border-2 rounded-xl p-5 cursor-pointer transition-all hover:-translate-y-1 relative overflow-hidden", formData.categoria === 'especifico' ? "border-red-500 bg-red-50 shadow-md" : "border-slate-200 bg-white")} 
                  onClick={() => setFormData({...formData, categoria: 'especifico', subcategoria: ''})}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white text-xl">🔴</div>
                    <div className="font-bold text-red-600 text-lg">ESPECÍFICO</div>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">Nível máximo de controle. Acesso avaliado caso a caso.</p>
                  <div className="text-xs bg-black/5 text-slate-700 p-2 rounded">Ex: Dados sensíveis, Inquéritos judiciais</div>
                </div>
              </div>

              {formData.categoria && (
                <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-xl animate-in fade-in duration-300 space-y-6">
                  <div>
                    <label className="block font-bold text-slate-700 mb-2">
                      Subcategoria ({formData.categoria.toUpperCase()}) <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full p-3 border-2 border-slate-200 bg-white rounded-lg focus:border-[#009a4d] focus:ring-4 focus:ring-green-50 transition-all outline-none text-slate-700 font-medium cursor-pointer"
                      value={formData.subcategoria}
                      onChange={(e) => setFormData({...formData, subcategoria: e.target.value})}
                    >
                      <option value="">-- Selecione uma subcategoria --</option>
                      {SUBCATEGORIAS[formData.categoria as keyof typeof SUBCATEGORIAS].map(sub => (
                        <option key={sub.id} value={sub.id}>{sub.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-2">Regras Complementares de Compartilhamento</label>
                    <textarea className="w-full p-2.5 border-2 border-slate-200 bg-white rounded-lg focus:border-[#009a4d] focus:ring-4 focus:ring-green-50 transition-all outline-none min-h-[80px]" value={formData.regrasCompartilhamento} onChange={(e) => setFormData({...formData, regrasCompartilhamento: e.target.value})} />
                    <p className="text-xs text-slate-500 mt-1">Regras adicionais para compartilhamento (opcional se categoria não for Específico)</p>
                  </div>
                  {formData.categoria === 'especifico' && (
                    <div>
                      <label className="block font-bold text-slate-700 mb-2">Fundamentação para Categorização Específica</label>
                      <textarea className="w-full p-2.5 border-2 border-slate-200 bg-white rounded-lg focus:border-[#009a4d] focus:ring-4 focus:ring-green-50 transition-all outline-none min-h-[80px]" value={formData.fundamentacaoEspecifica} onChange={(e) => setFormData({...formData, fundamentacaoEspecifica: e.target.value})} />
                      <p className="text-xs text-slate-500 mt-1">Justificativa se o dado foi classificado como Específico quando o Subcomitê definiu como Restrito</p>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
          
          {/* Footer Action */}
          <div className="bg-slate-50 border-t border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button onClick={handleLimpar} className="bg-white border-2 border-slate-200 hover:bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 transition-colors shadow-sm active:scale-95 w-full sm:w-auto">
              <Trash2 size={20} /> Limpar Formulário
            </button>
            <button onClick={handleVisualizarFicha} className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 transition-colors shadow-sm active:scale-95 w-full sm:w-auto">
              <Eye size={20} /> Visualizar Ficha
            </button>
            <button onClick={handleGerarPDF} className="bg-[#009a4d] hover:bg-[#008141] text-white px-8 py-3 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 transition-colors shadow-sm active:scale-95 w-full sm:w-auto">
              <FileDown size={20} /> Gerar Ficha PDF
            </button>
          </div>
        </div>
      </main>
      <Modal {...modalConfig} onClose={closeModal}>
        {modalConfig.content}
      </Modal>

      <Modal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Pré-visualização da Ficha"
        type="info"
        size="lg"
        secondaryAction={{ label: "Fechar", onClick: () => setPreviewOpen(false) }}
        primaryAction={{
          label: "Gerar PDF",
          onClick: () => { setPreviewOpen(false); handleGerarPDF(); },
        }}
      >
        {buildPreviewContent()}
      </Modal>
    </>
  );
}
