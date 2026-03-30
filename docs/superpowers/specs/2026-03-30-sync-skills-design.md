# Sync Skills — Design Spec

**Date:** 2026-03-30
**Status:** Approved
**Type:** Claude Code Skill (local to robinvanbaalen.nl project)

## Purpose

A Claude Code skill that synchronizes the website's skills pages with the `rvanbaalen/skills` marketplace repository. It detects new and updated skills by comparing version numbers, generates website content from source SKILL.md files, and presents everything for user review before writing files.

## Skill Identity

| Field | Value |
|-------|-------|
| Name | `sync-skills` |
| Invoke | `/sync-skills` |
| Scope | Local to `robinvanbaalen.nl` project |
| Trigger | Manual |

## Source of Truth

- **Marketplace manifest:** `/Users/robin/Sites/rvanbaalen-skills/.claude-plugin/marketplace.json`
- **Per-plugin metadata:** `plugins/{name}/.claude-plugin/plugin.json`
- **Per-plugin content:** `plugins/{name}/skills/{name}/SKILL.md` (and sub-skills for multi-skill plugins)
- **Website content collection:** `src/content/skills/{name}.yaml`
- **Website detail pages:** `src/pages/skills/{name}.mdx`

## Change Detection

### Updated skills
A skill is **updated** when the `version` field in `marketplace.json` differs from the `version` field in the website's `src/content/skills/{name}.yaml`.

### New skills
A skill is **new** when it exists in `marketplace.json` but has no corresponding `.yaml` file in `src/content/skills/`.

### No changes
If all versions match and no new plugins exist, inform the user and exit cleanly.

## Flow

### Phase 1: Fetch & Compare

1. **Git pull** the `rvanbaalen-skills` repo (`/Users/robin/Sites/rvanbaalen-skills`).
2. **Read** `marketplace.json` to get all plugins with their versions.
3. **Read** all `.yaml` files in `src/content/skills/` to get current website versions.
4. **Compare** to produce three lists:
   - New skills (in marketplace, not on website)
   - Updated skills (version mismatch)
   - Unchanged (skip)

### Phase 2: Pass 1 — Summary & Scope Confirmation

Present a markdown summary to the user:

```
## Skills Sync Summary

### New skills
- `new-skill` v1.0.0

### Updated skills
- `commit` 1.2.1 → 1.3.0
- `cofounder` 1.0.0 → 1.1.0

### Unchanged (skipping)
- `make-issue` v1.0.0
- ...
```

User can:
- **Confirm** to proceed with all detected changes
- **Adjust scope** — exclude specific skills from this sync

### Phase 3: Parallel Content Generation

Dispatch **one background subagent per skill** (new or updated) to generate content. All agents run in parallel.

Each subagent receives:
- The plugin's `SKILL.md` content (and sub-skill SKILL.md files for multi-skill plugins like `pm` and `cofounder`)
- The `plugin.json` metadata
- The `marketplace.json` entry for this plugin
- For updates: the existing `.mdx` file content (to preserve structure and any manual additions)
- Output format templates (see Content Generation Rules below)

Each subagent returns:
- Generated `.yaml` content (as text)
- Generated `.mdx` content (as text)

### Phase 4: Pass 2 — Per-Skill Review

As subagents complete, present each skill's generated content to the user via `AskUserQuestion`:

```markdown
## commit (1.2.1 → 1.3.0)

### src/content/skills/commit.yaml
\`\`\`yaml
name: Commit
description: Micro-commit with conventional commit messages
version: "1.3.0"
...
\`\`\`

### src/pages/skills/commit.mdx
\`\`\`mdx
---
layout: ../../layouts/SkillLayout.astro
name: Commit
...
---

## When to use
...
\`\`\`

**Approve** or **Modify**?
```

If the user says **Modify**, they provide corrections. The skill applies the corrections and re-presents. No infinite loop — the user can always approve and hand-edit later.

### Phase 5: Write Files

For each approved skill, write:
- `src/content/skills/{name}.yaml`
- `src/pages/skills/{name}.mdx`

New files are created; existing files are overwritten with the approved content.

## Content Generation Rules

### `.yaml` file (content collection)

| Field | Source |
|-------|--------|
| `name` | marketplace.json `name`, title-cased |
| `description` | marketplace.json `description` |
| `version` | marketplace.json `version` (quoted string) |
| `author` | plugin.json `author.name` |
| `invoke` | `/rvanbaalen:{name}` |
| `trigger` | Derived from SKILL.md description — `manual` if user-invoked, `auto` if auto-triggered |
| `category` | `"agent"` if plugin has `agents/` directory, otherwise `"skill"` |
| `order` | Preserve existing value for updates; next available number for new skills |

### `.mdx` file (detail page)

**Frontmatter:**

| Field | Source |
|-------|--------|
| `layout` | `../../layouts/SkillLayout.astro` |
| `name` | Same as yaml `name` |
| `description` | Same as yaml `description` |
| `version` | Same as yaml `version` |
| `author` | Same as yaml `author` |
| `invoke` | Same as yaml `invoke` |
| `install` | `{plugin-name}@rvanbaalen` |
| `repo` | `rvanbaalen/skills` |
| `category` | Same as yaml `category` |

**Body sections** (generated from SKILL.md content):

1. `## When to use` — extracted/summarized from SKILL.md description and trigger conditions
2. `## How it works` — numbered list of the skill's workflow steps
3. `## Modes` (if applicable) — different invocation modes
4. `## Invoke` — code block with invocation examples

For **updates**: preserve any manually-added sections that don't exist in the template above.

For **multi-skill plugins** (pm, cofounder): summarize the sub-skills and their purposes.

## Subagent Prompt Template

```
You are generating website content for a Claude Code skill page.

**Plugin:** {name}
**Version:** {version}
**Description:** {marketplace_description}

**Source content (SKILL.md):**
{skill_md_content}

**Plugin metadata (plugin.json):**
{plugin_json_content}

{IF UPDATE}
**Existing MDX page (preserve structure and manual additions):**
{existing_mdx_content}
{END IF}

Generate two files:

1. A YAML file for the content collection with these fields:
   name, description, version, author, invoke, trigger, category, order

2. An MDX file for the detail page with:
   - Frontmatter: layout, name, description, version, author, invoke, install, repo, category
   - Body sections: "When to use", "How it works", optional "Modes", "Invoke"
   - Write in concise, direct prose. No filler. Match the tone of a developer portfolio.
   - For updates: preserve any manually-added content from the existing MDX.

Return the full content of both files.
```

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| Git pull fails | Report error, abort gracefully |
| No changes detected | Inform user ("All skills are up to date"), exit |
| User excludes a skill in Pass 1 | Skip it — don't dispatch a subagent for it |
| User says "Modify" in Pass 2 | Apply corrections, re-present. User can always approve and hand-edit later |
| Plugin has no SKILL.md | Use marketplace.json description + plugin.json as sole source; warn user |
| Multi-skill plugin (pm, cofounder) | Read all sub-skill SKILL.md files; generate a summary page |
| Skills repo path doesn't exist | Error: "Skills repo not found at expected path" |

## File Paths

| What | Path |
|------|------|
| Skills repo | `/Users/robin/Sites/rvanbaalen-skills` |
| Marketplace manifest | `/Users/robin/Sites/rvanbaalen-skills/.claude-plugin/marketplace.json` |
| Plugin content | `/Users/robin/Sites/rvanbaalen-skills/plugins/{name}/` |
| Website YAML | `/Users/robin/Sites/robinvanbaalen.nl/src/content/skills/{name}.yaml` |
| Website MDX | `/Users/robin/Sites/robinvanbaalen.nl/src/pages/skills/{name}.mdx` |
| Skill file (this skill) | `/Users/robin/Sites/robinvanbaalen.nl/.claude/skills/sync-skills/SKILL.md` |
