export default async function sendMessagePrivate(client) {

    client.command('sendMessagePrivate', async (ctx) => {

        await ctx.scene.enter('sendMessagePrivate');

    });
}