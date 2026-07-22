import audit from '#audit/addon.js';

audit.commands.Fn('record', async function(run)
{
    const http = run.context && run.context.http ? run.context.http : null;
    const user = http && http.state ? http.state.user : null;

    const item = this.Item({
        command: run.id,
        input: this.Fn('redact', run.input),
        code: run.code,
        message: run.message,
        time: Number(run.time),
        user_id: user ? String(user.id) : null,
        ip: http && http.request ? (http.request.socket.remoteAddress || '') : '',
        direct: !!run.direct
    });

    await item.Create();

    this.ItemRemove(item.Get('id'), false);

    return item;
});
