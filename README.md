# compose-watch

```
npm install compose-watch -g
```

A docker-compose cli tool that will watch a directory and restart the relevant service when files in the directory are modified. You can either provide a directory or it will use the current working directory.

```
compose-watch backend
```

This command will look for a docker-compose.yml in your current folder. If it can't find
it there, it will work up the directories until the root directory.
