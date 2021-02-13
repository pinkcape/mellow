import { Command } from "../structure/Command";
import Mellow from "../structure/Mellow";
import logger from "../util/logger";
import i18n from "../util/i18n";

let timeout = 6000;

export default {
  name: "skip",
  execute: (message, args) => {
    message.reply(i18n.__("processing")).then((msg) => {
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
          .edit(i18n.__("please_be_in_voice_channel"))
          .then((msg) => msg.delete({ timeout }) && message.delete({ timeout }))
          .catch(logger.error);
      }

      // check member's voice state
      if (voice.deaf) {
        // return a message & delete it after timeout
        return msg
          .edit(i18n.__("please_undeaf"))
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
          .edit(i18n.__("not_connected"))
          .then((msg) => msg.delete({ timeout }) && message.delete({ timeout }))
          .catch(logger.error);
      }

      // check if player playing
      if (!player.playing) {
        // alert user
        return msg
          .edit(i18n.__("must_playing"))
          .then((msg) => msg.delete({ timeout }) && message.delete({ timeout }))
          .catch(logger.error);
      }

      // stop current track
      player
        .stop()
        .then((isStopped) =>
          msg.edit(
            isStopped
              ? `${member} ${i18n.__("user_skipping")}`
              : i18n.__("failed")
          )
        )
        .catch(logger.error);
    });
  },
} as Command;
