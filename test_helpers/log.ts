import { Log } from '../deps.ts';

await Log.setup({
  handlers: {
    console: new Log.handlers.ConsoleHandler("DEBUG"),
  },

  loggers: {
    secret_keyring: {
      level: "DEBUG",
      handlers: ['console'],
    },
  },
});

export { Log } from '../deps.ts';
