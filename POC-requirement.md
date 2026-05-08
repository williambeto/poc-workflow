# POC — Provar que o fluxo de trabalho do codex-repo-starter funciona end-to-end

## Problem

`codex-repo-starter` é um kit de partida para workflows baseados em Codex. O repositório contém skills, prompts, templates, runbooks e pipelines de validação — mas nunca foi testado em um projeto real de ponta a ponta.

Sem uma POC, não há evidência de que o workflow consegue:

- Transformar uma ideia em código funcional
- Manter o escopo pequeno e revisável
- Produzir validação com evidência antes de cada etapa
- Evitar regressões
- Resultar em um projeto publicável

## Goal

Criar um projeto real do zero, usando `codex-repo-starter` como submodule, e executar o workflow completo do bootstrap até a primeira PR merged — provando que o kit funciona na prática.

## Scope

### Included

- Criar projeto POC (`poc-workflow`) com stack simples e verificável
- Adicionar `codex-repo-starter` como git submodule
- Executar o workflow completo: Requirement → Spec → Tech Plan → PR Breakdown → Implementation → Validation
- Entregar 1 a 3 PRs implementando uma feature pequena mas funcional
- Validar cada etapa com evidência antes de avançar
- Documentar o que funcionou, o que falhou, e o que precisa melhorar
- Produzir um report final de lições aprendidas

### Not included

- Projeto de produção ou com requisitos complexos
- Deploy para produção
- Autenticação, banco de dados, ou infraestrutura real
- Múltiplas features ou temas

## Why a POC

| Risco | O que a POC responde |
| ----- | -------------------- |
| Prompts não são acionáveis | Os prompts 01-09 produzem documentos úteis? |
| Skills não guiam bem | As skills (product-manager, tech-lead, tester) são claras na prática? |
| Validação é incômoda | O pipeline de 6 níveis adiciona valor real? |
| Handoffs perdem contexto | Agents conseguem seguir o fluxo sem perder informação? |
| PRs ficam muito grandes | O PR breakdown produz PRs pequenos e revisáveis? |
| O workflow não escala | Funciona para algo maior que documentação? |

## Project suggestion — Task Tracker CLI

Um CLI simples em Node.js para gerenciar tarefas locais com arquivo JSON.

**Stack:** Node.js + TypeScript +指挥官 (commander) + Jest + JSON file storage

**Feature:** CRUD de tarefas via CLI com list, add, done, remove.

**Exemplo de uso:**

```bash
npm run build
./dist/cli.js add "Implementar autenticação" --priority high
./dist/cli.js list
./dist/cli.js done 1
./dist/cli.js remove 2
```

**Por que esta stack:**

- Node.js + TypeScript: já instalado na máquina do desenvolvedor
- commander: CLI maduro e simples
- Jest: testing framework já no skill de tester
- JSON file: persistence simples, sem setup de banco
- CLI verificável: testes de integração via `spawnSync`

## Workflow steps

### Fase 1 — Bootstrap (Day 1)

1. Inicializar `poc-workflow` como novo repositório git
2. Adicionar `codex-repo-starter` como submodule em `lib/codex-repo-starter`
3. Configurar package.json, TypeScript, Jest, commander
4. Commit inicial: "feat: project bootstrap"
5. Criar primeiro requirement seguindo `prompts/01-create-requirement.md`
6. Validar requirement com skill `tester`
7. Criar spec seguindo `prompts/02-create-spec.md`
8. Criar tech plan seguindo `prompts/03-create-tech-plan.md`
9. PR breakdown seguindo `prompts/04-breakdown-prs.md`
10. Validar cada documento antes de avançar

### Fase 2 — Implementação (Day 2)

11. Implementar PR #1 seguindo `prompts/05-implement-pr.md`
12. Revisar PR #1 seguindo `prompts/06-review-and-fix.md`
13. Validar PR #1 seguindo `prompts/08-validate.md`
14. Repetir para PR #2 e #3 se necessário
15. Cada PR: validation com `npm run validate` + teste manual do CLI

### Fase 3 — Report (Day 3)

16. Escrever `poc-report.md` documentando:
    - O que funcionou
    - O que falhou ou foi confuso
    - Tempo gasto em cada etapa
    - Tamanho real dos PRs vs. planejado
    - Quality gates que funcionaram
    - Quality gates que não funcionaram
    - Recomendações de melhoria

## Handoff entre fases

Cada fase produz um handoff document (seguindo `harness/handoffs/HANDOFF.template.md`) que inclui:

- Resumo do que foi feito
- Estado atual do projeto
- PRs mergeados vs. pendentes
- Validações passadas
- Decisões em aberto
- Próximo passo recomendado

## Acceptance criteria

### POC-1

Dado que `codex-repo-starter` está como submodule,
quando um agente começa a trabalhar no projeto,
então consegue acessar prompts, skills, templates e runbooks pelo submodule.

### POC-2

Dado que um requirement foi criado,
quando a skill `tester` revisa o documento,
então produces um review com findings categorizados por severidade e tipo.

### POC-3

Dado que o tech plan foi criado,
quando a PR breakdown é gerada,
então cada PR tem escopo ≤ 200 linhas de código ou ≤ 5 arquivos.

### POC-4

Dado que uma PR foi implementada,
quando `npm run validate` é executado,
então todos os 6 níveis de validação passam.

### POC-5

Dado que uma PR foi mergeada,
quando a skill `tester` valida o trabalho,
então há evidência concretas (comandos executados, outputs) no report.

### POC-6

Dado que todas as PRs foram mergeadas,
quando o POC report é escrito,
então contém lições aprendidas acionáveis com recomendações de melhoria.

## Dependencies

- Node.js 20+ com npm
- Git
- Acesso à internet (para buscar schema de OpenCode)
- GitHub CLI (`gh`)
- Tempo estimado: 3 sessões de ~2 horas

## Assumptions

- O submodule `codex-repo-starter` será referenciado por path relativo `lib/codex-repo-starter/`
- O projeto POC não precisa ser publicado em npm
- Os prompts 01-09 são suficientes para guiar o fluxo sem modificação
- A stack Node.js + TypeScript é simples o suficiente para focar no workflow, não na tecnologia

## Open questions

| # | Pergunta | Decisão |
| -- | -------- | ------- |
| 1 | Qual feature implementar? | CLI Task Tracker (ver proposta acima) |
| 2 | Quantas PRs? | 1-3 dependendo do breakdown |
| 3 | Onde criar o repo? | `github.com/williambeto/poc-workflow` |
| 4 | Submodule ou monorepo? | Submodule (prova que funciona como kit reutilizável) |
| 5 | Testes são obrigatórios? | Sim — unit tests com Jest para lógica de negócio |
| 6 | CI/CD no POC? | Sim — reuse o workflow do `codex-repo-starter` |
| 7 | Documentation completa? | README + um example do workflow rodando |

## Success metrics

| Métrica | Target | Como medir |
| ------- | ------ | ---------- |
| PRs mergeadas | 1-3 | `gh pr list` |
| Validação por PR | 6/6 | Output de `npm run validate` |
| Tempo por fase | ≤ 2h por fase | Timestamps nos commits |
| Tamanho dos PRs | ≤ 200 linhas | `git diff --stat` |
| Report de lições | 1 documento | `poc-report.md` criado |
| Reusabilidade do kit | Submodule funciona | Commits não duplicam código do kit |

## Recommendation

**Ready for execution**

Este requirement é pequeno, verificável, e produz evidência concreta de que o workflow funciona. O projeto POC `poc-workflow` será criado como próximo passo.
