# Hook Collections

Installable Claude Code hook packages. Each folder contains a `claude-hooks.json` that can be installed with [cc-hooks-install](https://github.com/sieteunoseis/cc-hooks-install).

## General Safety

| Package                                 | Description                                                              | Install                                                                                 |
| --------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| [safety-essentials](safety-essentials/) | Block rm -rf, force push, git reset --hard, secrets in commits           | `npx cc-hooks-install add sieteunoseis/hooks.automate.builders/hooks/safety-essentials` |
| [secrets-safety](secrets-safety/)       | Block reading .env/.pem files, env dumps, Vault writes, 1Password writes | `npx cc-hooks-install add sieteunoseis/hooks.automate.builders/hooks/secrets-safety`    |
| [database-safety](database-safety/)     | Block DROP TABLE, TRUNCATE, migrate:fresh/reset                          | `npx cc-hooks-install add sieteunoseis/hooks.automate.builders/hooks/database-safety`   |
| [docker-safety](docker-safety/)         | Block docker system prune, force remove, volume deletion                 | `npx cc-hooks-install add sieteunoseis/hooks.automate.builders/hooks/docker-safety`     |

## Cloud & Infrastructure

| Package                                 | Description                                                      | Install                                                                                 |
| --------------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [cloud-safety](cloud-safety/)           | Block destructive AWS, GCP, and Azure CLI operations             | `npx cc-hooks-install add sieteunoseis/hooks.automate.builders/hooks/cloud-safety`      |
| [kubernetes-safety](kubernetes-safety/) | Block kubectl delete, drain, exec, and helm uninstall            | `npx cc-hooks-install add sieteunoseis/hooks.automate.builders/hooks/kubernetes-safety` |
| [cloudflare-safety](cloudflare-safety/) | Block wrangler delete, KV purge, D1 drops, R2 deletion           | `npx cc-hooks-install add sieteunoseis/hooks.automate.builders/hooks/cloudflare-safety` |
| [network-safety](network-safety/)       | Block SSH, Terraform destroy, Ansible playbook runs, SNMP writes | `npx cc-hooks-install add sieteunoseis/hooks.automate.builders/hooks/network-safety`    |

## Network Engineering & Cisco UC

| Package                               | Description                                                              | Install                                                                                |
| ------------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| [cisco-cli-safety](cisco-cli-safety/) | Block writes across all Cisco UC CLIs (AXL, ISE, YANG, AudioCodes, Spok) | `npx cc-hooks-install add sieteunoseis/hooks.automate.builders/hooks/cisco-cli-safety` |
| [windmill-safety](windmill-safety/)   | Require pull before push, block runs, block secret reads on Windmill     | `npx cc-hooks-install add sieteunoseis/hooks.automate.builders/hooks/windmill-safety`  |

## Productivity

| Package                                   | Description                                               | Install                                                                                  |
| ----------------------------------------- | --------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| [auto-format](auto-format/)               | Run prettier after Claude writes or edits files           | `npx cc-hooks-install add sieteunoseis/hooks.automate.builders/hooks/auto-format`        |
| [bash-audit-log](bash-audit-log/)         | Log all bash commands to ~/.claude/bash-log.txt           | `npx cc-hooks-install add sieteunoseis/hooks.automate.builders/hooks/bash-audit-log`     |
| [notify-on-stop](notify-on-stop/)         | Desktop notification when Claude finishes                 | `npx cc-hooks-install add sieteunoseis/hooks.automate.builders/hooks/notify-on-stop`     |
| [npm-publish-safety](npm-publish-safety/) | Block npm unpublish, deprecate, owner, and access changes | `npx cc-hooks-install add sieteunoseis/hooks.automate.builders/hooks/npm-publish-safety` |

## CLI-Specific Hooks

These live in each CLI tool's own repo:

| Package   | Install                                           |
| --------- | ------------------------------------------------- |
| spok-api  | `npx cc-hooks-install add sieteunoseis/spok-api`  |
| cisco-axl | `npx cc-hooks-install add sieteunoseis/cisco-axl` |
