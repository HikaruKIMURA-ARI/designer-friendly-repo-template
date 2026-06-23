---
name: ui-workflow
description: UI 実装スキル。 主にデザイナーがコンポーネントとstories ファイルを実装するときに使う。
trigger: UI|frontend|component|storybook|implement|add feature|fix bug|create|build|修正|実装|追加|作成|構築
---

## ルール

### 新規追加の場合

1. atmos 単位の UI を `shared/ui` に実装すること(例：ボタン、テキストエリア、トグルなど)
2. `Molecules` `Organism`, `Templates` (例：ヘッダー、サイドバー、モーダルなど)単位の UI を `features/<feature-name>/ui` に実装すること
3. `Page` (画面単位) 単位の UI は `features/<feature-name>/ui/<feature-name>Page.tsx` に実装すること
4. 1〜3 の `stories.tsx` を作成すること
5. `app/<feature-name>/page.tsx` を作成する場合は、`features/<feature-name>/ui/<feature-name>Page.tsx` を読み込むだけにすること
6. `app/api`, `features/<feature-name>/hooks` は触らないこと。どうしても必要な場合はユーザー(エンジニア)に、許可を求めること。実装者がデザイナーの場合はその旨を伝えること

### 修正の場合

1. 「新規追加の場合」のルールと変わらない。上記ルールに外れることあれば、「新規追加の場合」のアウトプットと同じになるように軌道修正すること
