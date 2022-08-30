export default async function activation(client) {

    client.command('activation', async (ctx) => {

        await ctx.scene.enter('activation');

    });
}