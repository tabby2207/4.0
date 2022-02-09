const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");
const lyricsFinder = require("lyrics-finder");
const _ = require("lodash");

module.exports = {
  name: "lyrics",
  description: "To get and search lyrics of a song",
  usage: "[Song Name]",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["ly"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let player = await client.Manager.get(message.guild.id);
    let SongTitle = args.join(" ");
    if (!args[0] && !player)
      return message.channel.send("❌ | **Nothing is playing right now...**");
    if (!args[0]) SongTitle = player.queue.current.title;
    if (!args[0]) SongURL = player.queue.current.uri;

    let lyrics = await lyricsFinder(SongTitle);
    if (!lyrics)
      return message.channel.send(`**No lyrics found for -** \`${SongTitle}\``);
    lyrics = lyrics.split("\n"); //spliting into lines
    let SplitedLyrics = _.chunk(lyrics, 45); //45 lines each page

    let Pages = SplitedLyrics.map((ly) => {
      let em = new MessageEmbed()
        .setAuthor(SongTitle + "  — Lyrics", client.config.IconURL)
        .setColor("RANDOM")
        .setDescription(ly.join("\n"));

      if (args.join(" ") !== SongTitle)
        em.setThumbnail(player.queue.current.displayThumbnail());

      return em;
    });

    if (!Pages.length || Pages.length === 1)
      return message.channel.send(Pages[0]);
    else return client.Pagination(message, Pages);
  },
  SlashCommand: {
    options: [
        {
          name: "song",
          description: "Get the lyrics of a song",
          required: false,
          options: [
          ],
          
        /**
         *
         * @param {import("../structures/DiscordMusicBot")} client
         * @param {import("discord.js").Message} message
         * @param {string[]} args
         * @param {*} param3
         */
          
          run: async (client, interaction, args, { GuildDB }) => {
            let player = await client.Manager.get(message.guild.id);
            let SongTitle = args.join(" ");
            if (!args[0] && !player)
              return interaction.send("Nothing is playing right now...");
            if (!args[0]) SongTitle = player.queue.current.title;
        
            let lyrics = await lyricsFinder(SongTitle);
            if (!lyrics)
              return interaction.send("No lyrics found for " + SongTitle);
            lyrics = lyrics.split("\n"); //spliting into lines
            let SplitedLyrics = _.chunk(lyrics, 45); //45 lines each page
        
            let Pages = SplitedLyrics.map((ly) => {
              let em = new MessageEmbed()
                .setAuthor(SongTitle + "  — Lyrics", client.config.IconURL)
                .setColor("RANDOM")
                .setDescription(ly.join("\n"));
        
              if (args.join(" ") !== SongTitle)
                em.setThumbnail(player.queue.current.displayThumbnail());
        
              return em;
            });
        
            if (!Pages.length || Pages.length === 1)
              return interaction.send(Pages[0]);
            else return client.Pagination(message, Pages);
        }}],
}
};
