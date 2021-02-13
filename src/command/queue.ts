import { Command } from "../structure/Command";
import Mellow from "../structure/Mellow";
import logger from "../util/logger";
import i18n from "../util/i18n";

let timeout = 6000;

export default {
  name: "queue",
  description: "return queue list",
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

      // get guild's queue list
      let list = client.ensureQueue(guild!.id);

      // check if list is empty
      if (list?.length == 0) {
        // alert user
        return msg
          .edit(i18n.__("queue_empty"))
          .then((msg) => msg.delete({ timeout }) && message.delete({ timeout }))
          .catch(logger.error);
      }

      // map & join list queue into string
      let listMessage = list
        ?.map(
          (t, i) =>
            `${i == 0 ? i18n.__("next_song") : `• ${i}`} : ${t.info.title}`
        )
        .join("\n");

      // return queue list
      msg.edit(listMessage!);
    });
  },
} as Command;
