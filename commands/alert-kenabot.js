const wait = require('node:timers/promises').setTimeout;
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('alert-kenabot')
        .setDescription('Genera automaticamente tutti gli avvisi musicali.')
        .addStringOption(option =>
            option.setName('type')
            .setDescription('Seleziona quale tipo di avviso generare')
            .setRequired(true)
            .addChoices(
                { name: 'maintenance', value: 'maintenance'},
                { name: 'online', value: 'online'})
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.CreatePublicThreads),

    async execute(interaction, breachForce, auditLog, oggi) {
        try {
            const type = interaction.options.getString('type');
            const Staff = await breachForce.channels.cache.get(`1277745013240893521`);
            const General = await breachForce.channels.cache.get(`1277742240504086549`);
            const Private = await breachForce.channels.cache.get(`1294429329412849705`);

            if ( type === 'maintenance') {
                await Staff.send(`**UPDATE:** <@910965659851178054> <a:a_maintenance:1286444726773481556> Avviso manutenzione inoltrato a tutte le chat \`#music\``);
                await General.send(`**UPDATE:** <@910978145610526761> <a:a_maintenance:1286444726773481556> Avviso manutenzione inoltrato a tutte le chat \`#music\``);
                await Private.send(`**UPDATE:** <@910978145610526761> <a:a_maintenance:1286444726773481556> Avviso manutenzione inoltrato a tutte le chat \`#music\``);
                await interaction.reply(`<a:a_maintenance:1286444726773481556> Avviso manutenzione inoltrato a tutte le chat \`#music\``);
            }

            if ( type === 'online') {
                await Staff.send(`**UPDATE:** <@910965659851178054> è di nuovo operativo <a:a_musical_notes:1286444739318513706>`);
                await General.send(`**UPDATE:** <@910978145610526761> è di nuovo operativo <a:a_musical_notes:1286444739318513706>`);
                await Private.send(`**UPDATE:** <@910978145610526761> è di nuovo operativo <a:a_musical_notes:1286444739318513706>`);
                await interaction.reply(`<a:a_musical_notes:1286444739318513706> Avviso risolutorio inoltrato a tutte le chat \`#music\``);
            }
        } catch (error) {
            console.error(`Errore durante la generazione di un emebed:\n`, error);
            await interaction.reply({ content: `Errore durante la generazione degli avvisi musicali.`, ephemeral: true });
        }
    }
};