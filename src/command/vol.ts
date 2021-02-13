import { Command } from "../structure/Command";
import Mellow from "../structure/Mellow";
import logger from "../util/logger";
import i18n from "../util/i18n";

let timeout = 6000;

export default {
  name: "vol",
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

      // get user's limit argument
      let limit = Number(args.shift());

      // if no limit given
      if (!limit) {
        // return alert with current volume
        return msg.edit(`${i18n.__("current_volume")} %${player.state.volume}`);
      }

      // check maximum limit
      if (limit > 150) {
        // return alert with maximum volume
        return msg
          .edit(i18n.__("max_volume"))
          .then((msg) => msg.delete({ timeout }) && message.delete({ timeout }))
          .catch(logger.error);
      }

      // check minimum limit
      if (limit < 0) {
        // return alert with minimum volume
        return msg
          .edit(i18n.__("min_volume"))
          .then((msg) => msg.delete({ timeout }) && message.delete({ timeout }))
          .catch(logger.error);
      }

      // when player update volume
      player.once("volume", (volume) => {
        // alert user
        msg.edit(`${member} ${i18n.__("set_volume")} ${volume}`);
      });

      // update volume
      player.volume(limit);
    });
  },
} as Command;
