onetype.AddonReady('admin.dashboard.widgets', (widgets) =>
{
    const range = () => [new Date(Date.now() - 86400000).toISOString(), new Date().toISOString()];

    const created = () => ({
        field: 'created_at',
        value: range(),
        operator: 'BETWEEN'
    });

    widgets.Item({
        id: 'audit-traffic',
        title: 'Runs per hour',
        icon: 'show_chart',
        color: 'blue',
        type: 'line',
        section: 'audit',
        span: 8,
        order: 2,
        height: 220,
        condition: { app: ['audit'] },
        data: async () =>
        {
            const result = await $ot.command('database:find', {
                addon: 'audit.commands',
                filters: [created()],
                metrics: {
                    field: 'created_at',
                    interval: 'hour'
                }
            }, true);

            if(result.code !== 200)
            {
                return {
                    labels: [],
                    series: []
                };
            }

            return {
                labels: result.data.data.map((bucket) => new Date(bucket.date).getHours() + 'h'),
                series: [{
                    name: 'Runs',
                    points: result.data.data.map((bucket) => bucket.value)
                }]
            };
        }
    });
});
