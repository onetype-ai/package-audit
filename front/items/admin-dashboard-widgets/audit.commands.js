onetype.AddonReady('admin.dashboard.widgets', (widgets) =>
{
    const range = () => [new Date(Date.now() - 86400000).toISOString(), new Date().toISOString()];

    const created = () => ({
        field: 'created_at',
        value: range(),
        operator: 'BETWEEN'
    });

    const latest = async (limit) =>
    {
        const result = await $ot.command('database:find', {
            addon: 'audit.commands',
            filters: [created()],
            sort_field: 'id',
            sort_direction: 'desc',
            limit,
            joins: [{
                addon: 'platform.users',
                field: 'user_id',
                output: 'user',
                select: ['id', 'name', 'email']
            }]
        }, true);

        return result.code === 200 ? result.data.items : [];
    };

    widgets.Item({
        id: 'audit-commands',
        title: 'Top commands',
        icon: 'terminal',
        type: 'list',
        section: 'audit',
        span: 4,
        order: 5,
        height: 220,
        condition: { app: ['audit'] },
        data: async () =>
        {
            const items = await latest(200);
            const totals = {};

            items.forEach((entry) => totals[entry.command] = (totals[entry.command] || 0) + 1);

            const top = Object.entries(totals).sort((left, right) => right[1] - left[1]).slice(0, 5);
            const max = top.length ? top[0][1] : 1;

            return {
                rows: top.map(([command, total]) => ({
                    icon: 'terminal',
                    label: command,
                    value: total,
                    percent: Math.round((total / max) * 100)
                }))
            };
        }
    });
});
