const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`hello`)
        .setDescription(`Ti saluta, ma fai attenzione, è un po' suscettibile...`),

    async execute(interaction, breachForce, auditLog, oggi) {
        try {
            const risposte = [
                `Ehii :smiling_face_with_3_hearts:`,
                `Ciao, come va? :blush:`,
                `Eccoti, buona permanenza :grinning:`,

                `Ah, sei tu? Pensavo fosse qualcuno di interessante.`,
                `Preferirei non rispondere, ma eccomi qui.`,
                `Risparmiami i convenevoli, vai al punto.`,
                `Ok ciao, ma non devi scassarmi l'anima.`,


                `Ciao un cazzo, che vuoi?`,
                `Ah, sei ancora qui? Che palle.`,
                `Ma non hai un cazzo di meglio da fare?`,
                `Se devi dire qualcosa di inutile, taci strunz.`,
            ];
            const rispostaRandom = risposte[Math.floor(Math.random() * risposte.length)];
            await interaction.reply({ content: `${rispostaRandom}`, ephemeral: true });
            
            const ora = oggi.getHours().toString().padStart(2, '0'); const minuto = oggi.getMinutes().toString().padStart(2, '0');
            await auditLog.send(`${ora}:${minuto} - L'utente ${interaction.user} ha usato il comando /hello.`);
        } catch (error) {
            console.error(`Errore durante l'esecuzione del comando /hello:\n`, error);
            await interaction.reply({ content: `Errore durante l'esecuzione del comando /hello.`, ephemeral: true });
        }
    }
};