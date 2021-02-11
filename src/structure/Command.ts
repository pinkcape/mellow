import { Message } from "discord.js";

export interface Execute {
  (message: Message, args: string[]): unknown;
}

export interface Command {
  name: string;
  execute: Execute;
}
