# windmill-safety

Safety hooks for the Windmill `wmill` CLI. Blocks destructive operations like sync push without pull, auto-yes flags, plain-text secret exposure, and remote code execution.

## Install

```bash
npx @cmds-cc/hooks add cmds-cc/cmds.cc/hooks/windmill-safety
```

## Hooks

| Hook                              | Default | Description                                                                      |
| --------------------------------- | ------- | -------------------------------------------------------------------------------- |
| Require pull before push          | On      | Blocks `wmill sync push` unless `wmill sync pull` ran first this session         |
| Track sync pull                   | On      | Marker file that enables the pull-before-push guard                              |
| Block --yes on sync               | On      | Prevents bypassing the confirmation prompt on `sync push`                        |
| Block --plain-secrets             | On      | Prevents exposing secrets as unencrypted text                                    |
| Block script/flow execution       | On      | Prevents `wmill script run` and `wmill flow run` without approval                |
| Block script push without review  | Off     | Requires explicit approval before `wmill script push`                            |
| Block reading variables/resources | Off     | Prevents `wmill variable get` and `wmill resource get` from exposing credentials |

## Companion skill

For full safety guidance (risk tiers, pre-flight checklists, safe-usage patterns), install the [wmill-safety skill](https://github.com/cmds-cc/skills/tree/master/skills/wmill-safety):

```bash
npx @cmds-cc/skills add cmds-cc/skills
```

## License

MIT
