const CategorizedContent = () => (
  <div className="space-y-4 text-sm mt-2">
    <p className="font-medium text-slate-700">
      Para tramitar a sua <strong>Solicitação de Compartilhamento</strong>, siga
      as diretrizes governamentais:
    </p>
    <ul className="space-y-4">
      <li className="flex gap-3 items-start">
        <span className="text-orange-500 mt-0.5">🔹</span>
        <span className="text-slate-600">
          <strong>Envio via Ofício no SUITE:</strong> O PDF gerado (Ficha de
          Solicitação) deve ser encaminhado em anexo a um Ofício (conforme
          modelo do Anexo 3 da Resolução nº 01/2026). O protocolo deve ser
          direcionado à Casa Civil (Gestora da Plataforma - CC/ASINDE ou
          CC/PROTOCOLO) através do sistema SUITE.
        </span>
      </li>
      <li className="flex gap-3 items-start">
        <span className="text-orange-500 mt-0.5">🔹</span>
        <span className="text-slate-600">
          <strong>Termo de Responsabilidade:</strong> Caso o dado solicitado
          seja classificado como <strong>Restrito</strong> ou{" "}
          <strong>Específico</strong>, é obrigatório anexar o Termo de
          Responsabilidade (Anexo 4 da Resolução) devidamente assinado pelo
          dirigente máximo do seu órgão.
        </span>
      </li>
      <li className="flex gap-3 items-start">
        <span className="text-orange-500 mt-0.5">🔹</span>
        <span className="text-slate-600">
          <strong>Acompanhamento e Prazos:</strong> A Casa Civil receberá o NUP
          e notificará o Órgão Gestor do Dado. O Gestor terá o prazo de 15 dias
          para analisar seu pedido e até 30 dias para liberar o
          compartilhamento, podendo interagir e solicitar correções diretamente
          pelo processo no SUITE.
        </span>
      </li>
    </ul>
  </div>
);

const UncategorizedContent = () => (
  <div className="space-y-4 text-sm mt-2">
    <p className="font-medium text-slate-700">
      Para tramitar a sua <strong>Solicitação de Categorização</strong>, siga as
      diretrizes governamentais:
    </p>
    <ul className="space-y-4">
      <li className="flex gap-3 items-start">
        <span className="text-orange-500 mt-0.5">🔹</span>
        <span className="text-slate-600">
          <strong>Envio via Ofício no SUITE:</strong> Como este dado ainda não
          compõe o Catálogo do Estado, o PDF gerado deve ser encaminhado em
          anexo a um Ofício de Solicitação de Categorização (conforme modelo do
          Anexo 2 da Resolução nº 01/2026). O protocolo deve ser direcionado à
          Casa Civil (CC/ASINDE ou CC/PROTOCOLO) via sistema SUITE.
        </span>
      </li>
      <li className="flex gap-3 items-start">
        <span className="text-orange-500 mt-0.5">🔹</span>
        <span className="text-slate-600">
          <strong>Análise e Inclusão no Catálogo:</strong> A Casa Civil enviará
          o seu pedido ao Órgão Gestor da informação. O Gestor analisará a
          viabilidade técnica e fará a classificação do dado (Amplo, Restrito ou
          Específico), incluindo-o oficialmente no Catálogo de Dados da
          plataforma.
        </span>
      </li>
      <li className="flex gap-3 items-start">
        <span className="text-orange-500 mt-0.5">🔹</span>
        <span className="text-slate-600">
          <strong>Próximo Passo (Acesso ao Dado):</strong> Assim que a
          categorização for concluída, o processo retornará para você no SUITE.
          Somente após essa etapa você deverá realizar um novo ofício, desta vez
          solicitando formalmente o <em>compartilhamento</em> (acesso) desse
          dado recém-criado.
        </span>
      </li>
    </ul>
  </div>
);

type ExportModalContentProps = {
  journeyType: string;
};

export function ExportModalContent({ journeyType }: ExportModalContentProps) {
  if (journeyType === "categorizado") {
    return <CategorizedContent />;
  }

  if (journeyType === "nao-categorizado") {
    return <UncategorizedContent />;
  }

  return null;
}
