const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`audition-start`)
        .setDescription(`Inizializza il provino creando i messaggi standard.`)
        .addUserOption(option =>
            option.setName('utente')
            .setDescription('Seleziona quale nuovo utente.')
            .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.CreatePublicThreads),

    async execute(interaction) {
        try {
            const canale = interaction.guild.channels.cache.get(`1271900271424966728`);
            const utente = interaction.options.getUser('utente');
            const messaggio = await canale.send(`${utente} il tuo profilo è stato accettato, entra nel tuo Thread ↓`);
            const ilThread = await messaggio.startThread({
                name: `@${utente.displayName} \'s Thread`,
                autoArchiveDuration: 10080, //7 giorni di inattività
            });
            await ilThread.send(`Comunicaci quando saresti disponibile per il provino con data e orario, puoi inserire più date.\n<@&1271782624028786770>`);
            await interaction.reply({ content: `Thread di ${utente} creato e ruolo aggiornato.`});
        } catch (error) {
            console.error(`Errore nell'esecuzione del comando audition-start:\n`, error);
            await interaction.reply({ content: `Errore nell'esecuzione del comando audition-start.`, ephemeral: true });
        }
    }
};