import { Log } from "../deps.ts";

export interface BaseProviderArgs {
  logger?: Log.Logger | null,
}

export abstract class BaseProvider {
  protected readonly logger: Log.Logger;

  constructor (
    args: BaseProviderArgs,
  ) {
    this.logger = args.logger ?? Log.getLogger("secret_keyring");
    this.logger.debug(`Instantiating ${this.constructor.name}`);
  }

  abstract deleteValue(key: string): void | Promise<void>;
  abstract getValue(key: string): (string | null) | Promise<string | null>;
  abstract setValue(key: string, value: string): string | Promise<string>;
}
