import { Command } from "../structure/Command";

export default {
  name: "ping",
  execute: (message, args) => {
    message.reply("pong?").then((msg) => {
      // calc how much time taken to response
      let time = msg.createdTimestamp - message.createdTimestamp;

      // edit message with response details
      msg.edit(`time taken: ${time}ms`);
    });
  },
} as Command;
