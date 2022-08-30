export default async function sendComment(client) {

    client.command('sendComment', async (ctx) => {

        await ctx.scene.enter('sendComment');

    });
}