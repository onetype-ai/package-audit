onetype.AddonReady('admin.dashboard.widgets', (widgets) =>
{
    const range = () => [new Date(Date.now() - 86400000).toISOString(), new Date().toISOString()];

    const created = () => ({
        field: 'created_at',
        value: range(),
        operator: 'BETWEEN'
    });

    const count = async (filters) =>
    {
        const result = await $ot.command('database:find', {
            addon: 'audit.commands',
            filters,
            count: true
        }, true);

        return result.code === 200 ? result.data.value : 0;
    };

    widgets.Item({
        id: 'audit-numbers',
        title: 'Runs',
        icon: 'functions',
        type: 'numbers',
        section: 'audit',
        span: 4,
        order: 1,
        condition: { app: ['audit'] },
        data: async () =>
        {
            const total = await count([created()]);

            const failed = await count([created(), {
                field: 'code',
                value: [400, 599],
                operator: 'BETWEEN'
            }]);

            const internal = await count([created(), {
                field: 'direct',
                value: true
            }]);

            return {
                metrics: [{
                    label: 'Runs',
                    value: total
                }, {
                    label: 'Failed',
                    value: failed,
                    direction: failed ? 'down' : 'neutral'
                }, {
                    label: 'Internal',
                    value: internal
                }]
            };
        }
    });
});
