import { JoinData } from "@lavacord/discord.js";
import { Command } from "../structure/Command";
import Mellow from "../structure/Mellow";
import logger from "../util/logger";
import i18n from "../util/i18n";

const timeout = 6000;

export default {
  name: "play",
  description: "play audio in voice channel & adding audio to the queue list",
  execute: (message, args) => {
    // send a message
    message
      .reply(i18n.__("processing"))
      .then((msg) => {
        // if argument is missing
        if (args.length === 0) {
          // return a message & delete it after timeout
          return msg
            .edit("💡 example. **play rina sawayama snakeskin**")
            .then(
              (msg) => msg.delete({ timeout }) && message.delete({ timeout })
            )
            .catch(logger.error);
        }

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
            .then(
              (msg) => msg.delete({ timeout }) && message.delete({ timeout })
            )
            .catch(logger.error);
        }

        // check member's voice state
        if (voice.deaf) {
          // return a message & delete it after timeout
          return msg
            .edit(i18n.__("please_undeaf"))
            .then(
              (msg) => msg.delete({ timeout }) && message.delete({ timeout })
            )
            .catch(logger.error);
        }

        // shourtcut for client
        let client = message.client as Mellow;

        // shortcut for guild
        let guild = message.guild;

        // user's argument for searching
        let query = args.join(" ");

        // check if query is url
        if (query.startsWith("http")) {
          // return a message & delete it after timeout
          return msg
            .edit(i18n.__("security_purpose"))
            .then(
              (msg) => msg.delete({ timeout }) && message.delete({ timeout })
            )
            .catch(logger.error);
        }

        // search prefix
        let prefix = "ytsearch";

        // searching
        client
          .findTrack(`${prefix}: ${query}`)
          .then(async (tracks) => {
            // does client found tracks ?
            if (tracks?.length == 0) {
              // return a message & delete it after timeout
              return msg
                .edit(`${i18n.__("can't_find")} ${query}`)
                .then(
                  (msg) =>
                    msg.delete({ timeout }) && message.delete({ timeout })
                );
            }

            // get first track
            let track = tracks!.shift();

            // alert user
            msg.edit(`${i18n.__("found")} ${track!.info.title}`);

            // get player
            let player = client.manager.players.get(guild!.id);

            // get queue list
            let queue = client.ensureQueue(guild!.id);

            if (player?.playing) {
              // add track to guild's queue
              queue?.push(track!);
              // return alert
              return msg.edit(
                `${i18n.__("added_queue")} **${track!.info.title}**`
              );
            }

            // join data
            let data: JoinData = {
              channel: channel!.id,
              guild: guild!.id,
              node: client.manager.idealNodes[0].id,
            };

            // create player
            player = await client.manager.join(data);

            // alert user
            msg
              .edit(`${i18n.__("playing")} ${track!.info.title}`)
              .then((msg) => {
                // play track
                player?.play(track!.track).then((playing) => {
                  // return an alert if failed playing
                  if (!playing) msg.edit(`${i18n.__("error")} 500`);

                  // this will manage queue when end
                  player?.on("end", (data) => {
                    // take first element
                    let track = queue?.shift();

                    // if element is exists play it
                    if (track) player?.play(track?.track);
                    // else destroy player
                    else player?.removeAllListeners("end") && player.stop();
                  });

                  // if error destroy player
                  player?.once("error", player.destroy);
                });
              });
          })
          .catch(logger.error);
      })
      .catch(logger.error);
  },
} as Command;
