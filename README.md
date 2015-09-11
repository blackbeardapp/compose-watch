# compose-watch

```
npm install compose-watch -g
```

A docker-compose cli tool that will watch and restart the service
whenever the files changes.

```
compose-watch backend
```

This will look for a docker-compose.yml in your current folder. If it can't find
it there, it will begin to work up the directories until `~`.
