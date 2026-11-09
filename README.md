# Manchester Flow

[Português](#português) · [English](#english)

## Português

Aplicação web de apoio à organização da triagem e da fila de atendimento em unidades de saúde. O projeto é um protótipo acadêmico da Abacaxi Tech, com dados fictícios.

O sistema ajuda a registrar informações iniciais, visualizar a fila por prioridade e acompanhar os atendimentos. Ele não realiza diagnósticos nem define a prioridade clínica: essa decisão cabe ao profissional habilitado.

## Funcionalidades

- Painel com total de pacientes na fila, tempo de espera, atendimentos concluídos e avisos de espera prolongada.
- Cadastro de triagem em etapas, com motivo da procura, sintomas, sinais vitais e prioridade informada manualmente.
- Fila ordenada por prioridade e horário de chegada, com busca e filtros por prioridade e status.
- Atualização do atendimento: aguardando, em atendimento e concluído.
- Histórico de triagens concluídas, com busca, filtros por data e prioridade, paginação e consulta dos detalhes.
- Interface responsiva, tema claro/escuro e menu lateral recolhível.

## Tecnologias

- React
- JavaScript (ES modules)
- Vite
- Tailwind CSS e CSS

## Requisitos

Instale uma versão atual do [Node.js](https://nodejs.org/) com npm.

## Como executar

Na raiz do projeto:

```bash
npm install
npm run dev
```

O Vite exibirá no terminal o endereço local para abrir no navegador.

Para gerar e visualizar a versão de produção:

```bash
npm run build
npm run preview
```

## Estrutura do projeto

```text
src/
  components/  Elementos compartilhados da interface
  data/        Registros fictícios usados na demonstração
  pages/       Painel, fila, nova triagem e histórico
  utils/       Formatação e cálculos auxiliares
  App.jsx      Estado e navegação principal
  index.css    Estilos globais e responsivos
public/        Ícones e arquivos públicos
```

## Dados e limitações

Os registros de pacientes são fictícios e servem somente para demonstração. As triagens e mudanças de status ficam em memória durante a sessão; ao atualizar a página, os dados voltam ao conjunto inicial. As preferências de tema e menu lateral são salvas localmente no navegador.

Não use dados reais de pacientes. Este protótipo ainda não possui autenticação, perfis de acesso, servidor ou banco de dados, nem validação clínica. A classificação deve ser feita por profissional habilitado conforme as diretrizes da unidade.

## Próximas etapas

O planejamento do produto prevê autenticação por perfil, relatórios gerenciais e futuras integrações com sistemas da unidade. Esses itens dependem de etapas posteriores de desenvolvimento e validação.

## English

Manchester Flow is a web application that supports triage organization and patient queue management in healthcare facilities. It is an academic prototype by Abacaxi Tech and uses fictional data.

The system helps staff record initial information, view the queue by priority, and follow patient progress. It does not diagnose patients or assign clinical priority; that decision belongs to a qualified healthcare professional.

### Features

- Dashboard with queue totals, waiting times, completed visits, and long-wait alerts.
- Step-by-step triage registration for reason for visit, symptoms, vital signs, and priority entered manually.
- Queue sorted by priority and arrival time, with search and filters by priority and status.
- Visit status updates: waiting, in progress, and completed.
- Completed triage history with search, date and priority filters, pagination, and record details.
- Responsive interface, light and dark themes, and a collapsible sidebar.

### Technology stack

- React
- JavaScript (ES modules)
- Vite
- Tailwind CSS and CSS

### Requirements

Install a current version of [Node.js](https://nodejs.org/) with npm.

### Getting started

From the project root, install dependencies and start the development server:

```bash
npm install
npm run dev
```

Vite will print the local URL in the terminal.

To create and preview a production build:

```bash
npm run build
npm run preview
```

### Project structure

```text
src/
  components/  Shared interface components
  data/        Fictional records used in the demo
  pages/       Dashboard, queue, new triage, and history
  utils/       Formatting and helper calculations
  App.jsx      Main application state and navigation
  index.css    Global and responsive styles
public/        Icons and public assets
```

### Data and limitations

Patient records are fictional and are included for demonstration only. Triage records and status changes are kept in memory for the current session; refreshing the page restores the initial demo data. Theme and sidebar preferences are saved locally in the browser.

Do not enter real patient information. This prototype does not include authentication, access profiles, a server, or a database, and it has not undergone clinical validation. Triage classification must be performed by a qualified professional according to the facility's guidelines.

### Planned next steps

The product plan includes role-based authentication, management reports, and future integrations with facility systems. These items require further development and validation.
