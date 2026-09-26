# Relatório de Refatoração – EventosIF

**Objetivo:** Melhorar a arquitetura em React/React Native, eliminar bugs de estado, garantir imutabilidade e adotar fontes únicas de dados.

**Principais Decisões:**

R1: Eliminação de Estados Derivados (eventosFiltrados e totalInscricoes)

    Problema anterior: O uso de useState sincronizado com useEffect criava renderizações redundantes e duplicação desnecessária de dados em memória.

    Decisão: Cálculo direto na renderização (const eventosFiltrados = ... e const totalInscricoes = inscricoes.length).

    Justificativa: Reduz o consumo de memória, elimina a possibilidade de dessincronização e simplifica o fluxo de dados do componente.

R2: Prevenção de Mutação Direta no Vetor de Inscrições

    Problema anterior: O uso de inscricoes.push(evento) alterava o array mutavelmente na memória, impedindo o React de detetar a alteração de referência e falhando na re-renderização correta.

    Decisão: Uso do operador de espalhamento ([...inscricoesAtuais, evento]) combinado com validação de duplicatas (some).

    Justificativa: Garante a imutabilidade do estado, assegurando o comportamento previsível do React e prevenindo inscrições repetidas no mesmo evento.

R3: Substituição do Objeto Inteiro pelo ID (eventoSelecionadoId)

    Problema anterior: Guardar o objeto completo gerava múltiplas fontes de verdade, correndo o risco de dados desatualizados (como vagas restantes) se a lista original mudasse.

    Decisão: Armazenar apenas o id e buscar o objeto dinamicamente na lista principal.

    Justificativa: Elimina inconsistências de dados e garante que qualquer ecrã reflita sempre o estado mais recente da API.

R4: Unificação de Estados com useReducer

    Problema anterior: Múltiplos useState espalhados (carregando, erro, enviado, eventos) abriam margem para "estados impossíveis" (ex: estar carregando e com erro simultaneamente).

    Decisão: Concentração da máquina de estados num useReducer centralizado.

    Justificativa: Torna as transições de estado explícitas, previsíveis e matematicamente seguras contra bugs lógicos.

R5: Cancelamento de Requisições com AbortController

    Problema anterior: Requisições fetch assíncronas em andamento continuavam a executar mesmo se o componente fosse desmontado, causando vazamentos de memória e avisos no console.

    Decisão: Implementação de AbortController com limpeza no retorno do useEffect.

    Justificativa: Melhora a performance da aplicação e previne erros de atualização de estado em componentes desmontados.

R6 & R7: Elevação e Divisão de Contextos (AppContexto e InscricoesContexto)

    Problema anterior: As inscrições estavam presas na tela de eventos, perdendo-se na navegação, e o contexto global acumulava todas as responsabilidades.

    Decisão: Elevação do estado de inscrições para a camada global e divisão do contexto único (AppContexto para utilitários/tema e InscricoesContexto exclusivo para inscrições).

    Justificativa: Promove a modularidade e evita re-renderizações desnecessárias em cascata em toda a árvore de componentes.

**Complementos:**

    Árvore de decisão (inscrições): valida duplicatas e mantém imutabilidade.

    Context API: escolhida pela simplicidade; com um custo de re-renderizações é aceitável. Seria inadequada se o app crescer muito.

    IDs nas inscrições (C3): evitam inconsistências e duplicações.

    Quinta morada (persistência): não tratada nesta refatoração; se fosse, resolveria o bug C7.

    Estado de servidor: guardar resultado de fetch é apenas um snapshot temporário, exigindo decisões sobre atualização e consistência.
