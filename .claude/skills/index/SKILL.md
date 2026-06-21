---
name: index
description: UI 実装か、api 実装かを判断し注入するコンテキストを振り分けるスキル
trigger: implement|add feature|fix bug|create|build|修正|実装|追加|作成|構築
---

## ルール

1. api を実装する場合は `cat .claude/skills/tdd-workflow/SKILL.md 2>/dev/null` を実行し、コンテキストを注入する
2. UI の実装をする場合は, `cat .claude/skills/ui-workflow/SKILL.md 2>/dev/null`を実行し、コンテキストを注入する
3. 型定義、設定ファイル、などの編集の場合は何もしない
