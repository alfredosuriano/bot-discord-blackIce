const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`audition-finish`)
        .setDescription(`Scrive i risultati del provino.`)
        .addUserOption(option =>
            option.setName('utente')
            .setDescription('Seleziona quale utente tra i candidati.')
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('esito')
            .setDescription('Seleziona l\'esito del provino')
            .setRequired(true)
            .addChoices(
                { name: 'Accettato', value: 'accettato' },
                { name: 'Rifiutato', value: 'rifiutato' },
                { name: 'Sospeso', value: 'sospeso' })
        )
        .addStringOption(option =>
            option.setName('team')
            .setDescription('Seleziona l\'esito del provino')
            .setRequired(true)
            .addChoices(
                { name: 'T1', value: 'T1' },
                { name: 'T2', value: 'T2' },
                { name: 'T3', value: 'T3' })
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.CreatePublicThreads),

    async execute(interaction) {
        try {
            const canale = interaction.guild.channels.cache.get(`1271900217330896957`);
            const utente = interaction.options.getUser('utente');
            const esito = interaction.options.getString('esito');
            const team = interaction.options.getString('team');
            if ( esito === 'rifiutato') {
                await canale.send(`${utente} è stato rifiutato.`);
            }
            else if ( esito === 'sospeso') { 
                await canale.send(`Il provino di ${utente} è stato sospeso. Per info contattare uno <@&1271782624028786770>`);
            } 
            else if ( esito === 'accettato') { 
                await canale.send(`Complimenti ${utente} hai superato il provino! Ora fai parte del **Team Ranked** come ${team}`);
                if      ( team === 'T1') { await interaction.guild.members.cache.get(utente.id).roles.add(`1282150210658631733`); }
                else if ( team === 'T2') { await interaction.guild.members.cache.get(utente.id).roles.add(`1282150274953379871`); }
                else if ( team === 'T3') { await interaction.guild.members.cache.get(utente.id).roles.add(`1282150320146747533`); } 
            }

            await interaction.reply({ content: `Risultato di ${utente} comunicato.`});
        } catch (error) {
            console.error(`Errore nell'esecuzione del comando audition-finish:\n`, error);
            await interaction.reply({ content: 'Errore nell\'esecuzione del comando audition-finish.', ephemeral: true });
        }
    }
};