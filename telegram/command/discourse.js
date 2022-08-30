export default async function discourse(client) {

    client.command('discourse', async (ctx) => {

        await ctx.scene.enter('discourse');

    });
}