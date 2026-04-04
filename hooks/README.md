# Hook Collections

Installable Claude Code hook packages. Each folder contains a `claude-hooks.json` that can be installed with [cc-hooks-install](https://github.com/sieteunoseis/cc-hooks-install).

## Available Hooks

| Package                                 | Description                                                    | Install                                                                                 |
| --------------------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [safety-essentials](safety-essentials/) | Block rm -rf, force push, git reset --hard, secrets in commits | `npx cc-hooks-install add sieteunoseis/hooks.automate.builders/hooks/safety-essentials` |
| [database-safety](database-safety/)     | Block DROP TABLE, TRUNCATE, migrate:fresh/reset                | `npx cc-hooks-install add sieteunoseis/hooks.automate.builders/hooks/database-safety`   |
| [docker-safety](docker-safety/)         | Block docker system prune, force remove, volume deletion       | `npx cc-hooks-install add sieteunoseis/hooks.automate.builders/hooks/docker-safety`     |
| [auto-format](auto-format/)             | Run prettier after Claude writes or edits files                | `npx cc-hooks-install add sieteunoseis/hooks.automate.builders/hooks/auto-format`       |
| [bash-audit-log](bash-audit-log/)       | Log all bash commands to ~/.claude/bash-log.txt                | `npx cc-hooks-install add sieteunoseis/hooks.automate.builders/hooks/bash-audit-log`    |
| [notify-on-stop](notify-on-stop/)       | Desktop notification when Claude finishes                      | `npx cc-hooks-install add sieteunoseis/hooks.automate.builders/hooks/notify-on-stop`    |

### Network Engineering & Infrastructure

| Package                               | Description                                                              | Install                                                                                |
| ------------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| [network-safety](network-safety/)     | Block SSH, Terraform destroy, Ansible playbook runs, SNMP writes         | `npx cc-hooks-install add sieteunoseis/hooks.automate.builders/hooks/network-safety`   |
| [cisco-cli-safety](cisco-cli-safety/) | Block writes across all Cisco UC CLIs (AXL, ISE, YANG, AudioCodes, Spok) | `npx cc-hooks-install add sieteunoseis/hooks.automate.builders/hooks/cisco-cli-safety` |

## For CLI-specific hooks

These live in each CLI tool's own repo:

| Package   | Install                                           |
| --------- | ------------------------------------------------- |
| spok-api  | `npx cc-hooks-install add sieteunoseis/spok-api`  |
| cisco-axl | `npx cc-hooks-install add sieteunoseis/cisco-axl` |
