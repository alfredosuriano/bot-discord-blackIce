const wait = require('node:timers/promises').setTimeout;
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ceo-deleteall')
        .setDescription('Elimina tutti i messaggi nella chat eccetto quelli attaccati.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction, breachForce, auditLog, oggi) {
        try {
            const canale = interaction.channel;
            const tuttiMessaggi = await canale.messages.fetch({ limit: 100 });
            const soloEliminabili = tuttiMessaggi.toJSON().slice(5).filter(msg => !msg.pinned);
            await canale.bulkDelete(soloEliminabili, true);
            await wait(1_000);

            await interaction.reply({ content: 'Messaggi eliminati con successo!', ephemeral: true });
            await wait(5_000);
            await interaction.deleteReply();
        } catch (error) {
            console.error(`Errore durante l'eliminazione dei messaggi:\n`, error);
            await interaction.reply({ content: `Errore durante l'eliminazione dei messaggi.`, ephemeral: true });
        }
    }
};