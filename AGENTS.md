# Repository instructions

## Git workflow

- Use Conventional Commit subjects with one of these prefixes: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, or `test:`.
- At the end of a task, stage the intended changes, create a Conventional Commit, and push the current branch with `git push origin HEAD`.
- If the user explicitly asks to hold a commit or push, follow that request and report the pending Git steps.
- If a push fails, report the exact error and do not retry silently.
- Review `git status` before staging. Do not include unrelated, generated, temporary, or secret files in a commit.
