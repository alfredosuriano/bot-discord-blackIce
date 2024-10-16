const { SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`ping`)
        .setDescription(`Monitora il ping di lavoro del bot.`),

    async execute(interaction, auditLog, oggi) {
        try {
            await interaction.reply({ content:`Pong <a:a_robot:1284627590941773834>\nLavoro con ${interaction.client.ws.ping}ms di ritardo.`, ephemeral: true });
            
            const ora = oggi.getHours().toString().padStart(2, '0'); const minuto = oggi.getMinutes().toString().padStart(2, '0');
            await auditLog.send(`${ora}:${minuto} - L'utente ${interaction.user} ha usato il comando /ping.`);
        } catch (error) {
            console.error(`Errore durante l'esecuzione del comando /ping:\n`, error);
            await interaction.reply({ content: `Errore durante l'esecuzione del comando /ping.`, ephemeral: true });
        }
    }
};