import { Injectable, Scope, ConsoleLogger } from '@nestjs/common';
import { green, magenta, cyan, red, yellow, white } from 'chalk';

/**
 * CustomLogger that extends from ConsoleLogger
 */
@Injectable({ scope: Scope.TRANSIENT })
export class Logger extends ConsoleLogger {
  /**
   * Write a 'info' level log.
   */
  info(message: string, ...optionalParams: [...any, string?]): void {
    console.info(green(`${new Date().toISOString()} [INFO] ${message} - [${white(this.context)}] ${optionalParams}`));
  }

  /**
   * Write an 'error' level log.
   */
  error(message: string, ...optionalParams: [...any, string?]): void {
    console.error(red(`${new Date().toISOString()} [ERROR] ${message} - [${white(this.context)}] ${optionalParams}`));
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: string, ...optionalParams: [...any, string?]): void {
    console.warn(yellow(`${new Date().toISOString()} [WARN] ${message} - [${white(this.context)}] ${optionalParams}`));
  }

  /**
   * Write a 'debug' level log.
   */
  debug(message: string, ...optionalParams: [...any, string?]): void {
    console.debug(
      magenta(`${new Date().toISOString()} [DEBUG] ${message} - [${white(this.context)}] ${optionalParams}`),
    );
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose(message: string, ...optionalParams: [...any, string?]): void {
    console.log(cyan(`${new Date().toISOString()} [VERBOSE] ${message} - [${white(this.context)}] ${optionalParams}`));
  }
}
