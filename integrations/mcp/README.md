# `epwwb-mcp` — the dataset as MCP tools

One file, no dependencies, no install step. If you have Node 18 or newer, you
have everything this needs.

```jsonc
{
  "mcpServers": {
    "epwwb": {
      "command": "node",
      "args": ["/absolute/path/to/integrations/mcp/server.mjs"]
    }
  }
}
```

Drop that into your client's MCP config — `claude_desktop_config.json`, a
`.mcp.json` for Claude Code, Cursor's `mcp.json`, or anything else that speaks
stdio — and restart it.

Claude Code, in one line:

```bash
claude mcp add epwwb -- node /absolute/path/to/integrations/mcp/server.mjs
```

## Tools

| Tool | What it answers |
| --- | --- |
| `get_overview` | What is in here, how fresh it is, how much of it there is. Start here. |
| `list_repos` | Repositories reviewed on air — filter by host, pillar, week or free text. |
| `get_window` | The rolling four-week window: slots, staging, vault, crossovers cut. |
| `list_skills` | Skills taught inside the window, with lessons, hosts and demo repos. |
| `get_inventory` | The agent, method and protocol inventory behind the thesis. |
| `list_niches` | Communities, the pain they complain about, the slice that unbundles it. |
| `get_vault` | Audio sessions and reference documents. |
| `get_deck` | The thirteen-slide briefing deck. |
| `simulate_funnel` | Runs the ACP model and returns MRR, payout, ARR and the 5x exit. |
| `search` | One free-text query across every resource above. |

Every resource is also exposed for direct reading at `epwwb://v1/<id>` —
`epwwb://v1/window`, `epwwb://v1/skills`, and so on.

## Pointing it somewhere else

The server reads the published JSON over HTTPS. `EPWWB_BASE_URL` moves it to
another deployment, or to a local build:

```bash
# your own deploy
EPWWB_BASE_URL=https://your-site.example node server.mjs

# a local static export, no network at all
STATIC_EXPORT=true pnpm build
EPWWB_BASE_URL="file://$PWD/out" node integrations/mcp/server.mjs
```

Responses are cached in memory for five minutes. The data only changes when a
build runs, so that is generous already.

## What it will not do

There is nothing to authenticate and nothing to write. The upstream is a set of
static JSON files on a CDN: every tool is a read, and a failing tool returns its
error as text to the model rather than tearing down the session.
