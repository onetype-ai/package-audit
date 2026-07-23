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
        id: 'audit-statuses',
        title: 'Outcomes',
        icon: 'donut_small',
        type: 'donut',
        section: 'audit',
        span: 4,
        order: 3,
        height: 220,
        condition: { app: ['audit'] },
        data: async () =>
        {
            const window = created();

            const success = await count([window, {
                field: 'code',
                value: [200, 299],
                operator: 'BETWEEN'
            }]);

            const rejected = await count([window, {
                field: 'code',
                value: [400, 499],
                operator: 'BETWEEN'
            }]);

            const errored = await count([window, {
                field: 'code',
                value: [500, 599],
                operator: 'BETWEEN'
            }]);

            return {
                label: 'runs',
                segments: [{
                    name: 'Success',
                    value: success,
                    color: 'green'
                }, {
                    name: 'Rejected',
                    value: rejected,
                    color: 'orange'
                }, {
                    name: 'Errors',
                    value: errored,
                    color: 'red'
                }]
            };
        }
    });
});
