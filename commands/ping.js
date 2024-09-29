const { SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`ping`)
        .setDescription(`Monitora il ping di lavoro del bot.`),

    async execute(interaction) {
        try {
            await interaction.reply({ content:`Pong <a:a_robot:1284627590941773834>\nLavoro con ${interaction.client.ws.ping}ms di ritardo.`, ephemeral: true });

        } catch (error) {
            console.error(`Errore durante l'esecuzione del comando /ping:\n`, error);
            await interaction.reply({ content: `Errore durante l'esecuzione del comando /ping.`, ephemeral: true });
        }
    }
};