export default async function CreatePosts(client) {

    client.command('CreatePosts', async (ctx) => {

        await ctx.scene.enter('CreatePosts');

    });
}