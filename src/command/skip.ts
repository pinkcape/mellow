import { Command } from "../structure/Command";
import Mellow from "../structure/Mellow";
import logger from "../util/logger";

let timeout = 6000;

export default {
  name: "skip",
  execute: (message, args) => {
    message.reply("**processing..**").then((msg) => {
      // shortcut for member
      let member = message.member;

      // shortcut for member voice state
      let voice = member!.voice;

      // shortcut for member voice channel
      let channel = voice.channel;

      // check member voice channel
      if (!channel) {
        // return a message & delete it after timeout
        return msg
          .edit(`Sorry ${member} but you've to be in voice`)
          .then((msg) => msg.delete({ timeout }) && message.delete({ timeout }))
          .catch(logger.error);
      }

      // check member's voice state
      if (voice.deaf) {
        // return a message & delete it after timeout
        return msg
          .edit(`Sorry ${member} but you've to undeaf yourself`)
          .then((msg) => msg.delete({ timeout }) && message.delete({ timeout }))
          .catch(logger.error);
      }

      // shortcut for client
      let client = message.client as Mellow;

      // shortcut for guild
      let guild = message.guild;

      // get player
      let player = client.manager.players.get(guild!.id);

      // check if player exists
      if (!player) {
        // alert user
        return msg
          .edit(`Sorry ${member} but i'm not connected in any channel`)
          .then((msg) => msg.delete({ timeout }) && message.delete({ timeout }))
          .catch(logger.error);
      }

      // check if player playing
      if (!player.playing) {
        // alert user
        return msg
          .edit(`Sorry ${member} but you've to play something`)
          .then((msg) => msg.delete({ timeout }) && message.delete({ timeout }))
          .catch(logger.error);
      }

      // stop current track
      player
        .stop()
        .then((isStopped) =>
          msg.edit(isStopped ? `${member} skipping track` : "failed")
        )
        .catch(logger.error);
    });
  },
} as Command;
