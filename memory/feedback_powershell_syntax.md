---
name: feedback-powershell-syntax
description: PowerShell 5.1 syntax rules — no &&, no bash heredocs
metadata:
  type: feedback
---

Two things that do NOT work in Windows PowerShell 5.1:

1. `&&` to chain commands — use `;` or separate tool calls instead. If a command must only run on success, use `if ($?) { ... }`.
2. Bash heredoc syntax `<<'EOF'` — does not exist in PowerShell. Use a short single-line string, or PowerShell here-strings `@'...'@` (closing `'@` must be at column 0).

**Why:** User flagged both directly during a commit workflow.

**How to apply:** For git commit messages, prefer a concise single-line `-m "..."` string. If multi-line is needed, use the PowerShell `@'...'@` here-string form.
