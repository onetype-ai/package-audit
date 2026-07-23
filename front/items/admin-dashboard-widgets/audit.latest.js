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

    const color = (entry) =>
    {
        if(entry.code >= 500)
        {
            return 'red';
        }

        if(entry.code >= 400)
        {
            return 'orange';
        }

        return 'green';
    };

    const detail = (entry) =>
    {
        if(entry.direct)
        {
            return 'system';
        }

        if(entry.user)
        {
            return entry.user.name;
        }

        return 'anonymous';
    };

    widgets.Item({
        id: 'audit-latest',
        title: 'Latest runs',
        icon: 'history',
        type: 'timeline',
        section: 'audit',
        span: 4,
        order: 6,
        height: 220,
        condition: { app: ['audit'] },
        data: async () =>
        {
            const items = await latest(6);

            return {
                events: items.map((entry) => ({
                    icon: entry.code >= 400 ? 'error' : 'check',
                    color: color(entry),
                    title: entry.command,
                    detail: detail(entry),
                    badge: String(entry.code),
                    time: new Date(entry.created_at).toLocaleTimeString()
                }))
            };
        }
    });
});
