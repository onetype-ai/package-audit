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
        id: 'audit-success',
        title: 'Success rate',
        icon: 'speed',
        color: 'green',
        type: 'gauge',
        section: 'audit',
        span: 4,
        order: 4,
        height: 220,
        condition: { app: ['audit'] },
        data: async () =>
        {
            const total = await count([created()]);

            const failed = await count([created(), {
                field: 'code',
                value: [400, 599],
                operator: 'BETWEEN'
            }]);

            const success = Math.max(total - failed, 0);
            const rate = total ? Math.min(Math.round((success / total) * 100), 100) : 100;

            let color = 'green';

            if(rate < 70)
            {
                color = 'red';
            }
            else if(rate < 90)
            {
                color = 'orange';
            }

            return {
                value: rate,
                display: rate + '%',
                caption: success + ' of ' + total + ' runs',
                color
            };
        }
    });
});
