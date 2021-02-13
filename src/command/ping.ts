import { Command } from "../structure/Command";
import i18n from "../util/i18n";

export default {
  name: "ping",
  description: "return bot response time in ms",
  execute: (message, args) => {
    message.reply("pong?").then((msg) => {
      // calc how much time taken to response
      let time = msg.createdTimestamp - message.createdTimestamp;

      // edit message with response details
      msg.edit(`${i18n.__("time_taken")}: ${time}ms`);
    });
  },
} as Command;
