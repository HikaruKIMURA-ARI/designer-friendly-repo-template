# TDD (テスト駆動開発) ルール

## 基本原則

- **テスト哲学に必ず従うこと**: `.claude/rules/testing/test-philosophy.md` を必ず参照すること
- **テストサンプルに必ず従うこと**: `.claude/rules/testing/test-case-example.md` を必ず参照し、ドキュメンテーションを意識すること
- **実装は skills と agnets を活用すること** `.claude/skills/tdd-workflow/SKILL.md`を参照するこ

# アーキテクチャのルール

design as code を実現するためのアーキテクチャを実現すること

1. デザイナーが純粋な UI コンポーネントだけを扱えるように、UI 層とドメイン層は厳密に分離すること
2. ビジネスロジックは api 配下の hono で書くこと
3. next.js では サーバーの処理を書かずに `features/hook` に関数化し hono の api を利用すること
4. page.tsx に直接 UI を実装せずに `feature/ui` 配下に viewmodel 的にコンポーネントを作ること
5. UI は atmos 単位で作成し、`shared` 配下に作成すること
6. atmos 以上の Molecules, Organism, Templetes, Page でデザインする場合は shared を組み合わせて `features/ui` にコンポーネントを作ること
7. `share/ui` と `features/ui` また Page 単位で storybook でカタログ化すること

## アーキテクチャのイメージ

```
app/                          # Next.js: ルーティング / ページ合成のみ
├── users/
│   └── page.tsx              # hooks を呼び、UI に props を渡す
└── api/                      # Hono API
    └── routes/
        └── users.route.ts
features/
└── users/
    ├── ui/                   # 純粋な UI。Storybook 対象
    │   └── UserList/
    │       ├── UserList.tsx
    │       ├── UserList.stories.tsx
    │       └── index.ts
    └── hooks/                # Hono API 呼び出し
        └── useUsers.ts
lib/
└── hono-client.ts            # Hono client
shared/
├── ui/                       # 共通 UI
└── styles/                   # tokens / globals
```

# Agentic SDLC and Spec-Driven Development

Kiro-style Spec-Driven Development on an agentic SDLC

## Project Context

### Paths

- Steering: `.kiro/steering/`
- Specs: `.kiro/specs/`

### Steering vs Specification

**Steering** (`.kiro/steering/`) - Guide AI with project-wide rules and context
**Specs** (`.kiro/specs/`) - Formalize development process for individual features

### Active Specifications

- Check `.kiro/specs/` for active specifications
- Use `/kiro:spec-status [feature-name]` to check progress

## Development Guidelines

- Think in English, generate responses in Japanese. All Markdown content written to project files (e.g., requirements.md, design.md, tasks.md, research.md, validation reports) MUST be written in the target language configured for this specification (see spec.json.language).

## Minimal Workflow

- Phase 0 (optional): `/kiro:steering`, `/kiro:steering-custom`
- Phase 1 (Specification):
  - `/kiro:spec-init "description"`
  - `/kiro:spec-requirements {feature}`
  - `/kiro:validate-gap {feature}` (optional: for existing codebase)
  - `/kiro:spec-design {feature} [-y]`
  - `/kiro:validate-design {feature}` (optional: design review)
  - `/kiro:spec-tasks {feature} [-y]`
- Phase 2 (Implementation): `/kiro:spec-impl {feature} [tasks]`
  - `/kiro:validate-impl {feature}` (optional: after implementation)
- Progress check: `/kiro:spec-status {feature}` (use anytime)

## Development Rules

- 3-phase approval workflow: Requirements → Design → Tasks → Implementation
- Human review required each phase; use `-y` only for intentional fast-track
- Keep steering current and verify alignment with `/kiro:spec-status`
- Follow the user's instructions precisely, and within that scope act autonomously: gather the necessary context and complete the requested work end-to-end in this run, asking questions only when essential information is missing or the instructions are critically ambiguous.

## Steering Configuration

- Load entire `.kiro/steering/` as project memory
- Default files: `product.md`, `tech.md`, `structure.md`
- Custom files are supported (managed via `/kiro:steering-custom`)
