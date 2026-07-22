onetype.AddonReady('ui.dashboard.sections', (sections) =>
{
    sections.Item({
        id: 'audit',
        title: 'Last 24 hours',
        description: 'Command traffic on the instance.',
        icon: 'history',
        order: 1,
        condition: { app: ['audit'] }
    });
});

onetype.AddonReady('ui.dashboard.widgets', (widgets) =>
{
    const range = () => [new Date(Date.now() - 86400000).toISOString(), new Date().toISOString()];

    const created = () => ({ field: 'created_at', value: range(), operator: 'BETWEEN' });

    const count = async (filters) =>
    {
        const result = await $ot.command('database:find', { addon: 'audit.commands', filters, count: true }, true);

        return result.code === 200 ? result.data.value : 0;
    };

    const latest = async (limit) =>
    {
        const result = await $ot.command('database:find', {
            addon: 'audit.commands',
            filters: [created()],
            sort_field: 'id',
            sort_direction: 'desc',
            limit,
            joins: [{ addon: 'workspace.users', field: 'user_id', output: 'user', select: ['id', 'name', 'email'] }]
        }, true);

        return result.code === 200 ? result.data.items : [];
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
            const failed = await count([created(), { field: 'code', value: [400, 599], operator: 'BETWEEN' }]);
            const internal = await count([created(), { field: 'direct', value: true }]);

            return {
                metrics: [
                    { label: 'Runs', value: total },
                    { label: 'Failed', value: failed, direction: failed ? 'down' : 'neutral' },
                    { label: 'Internal', value: internal }
                ]
            };
        }
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
                metrics: { field: 'created_at', interval: 'hour' }
            }, true);

            if(result.code !== 200)
            {
                return { labels: [], series: [] };
            }

            return {
                labels: result.data.data.map((bucket) => new Date(bucket.date).getHours() + 'h'),
                series: [{ name: 'Runs', points: result.data.data.map((bucket) => bucket.value) }]
            };
        }
    });

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
            const ok = await count([window, { field: 'code', value: [200, 299], operator: 'BETWEEN' }]);
            const rejected = await count([window, { field: 'code', value: [400, 499], operator: 'BETWEEN' }]);
            const errored = await count([window, { field: 'code', value: [500, 599], operator: 'BETWEEN' }]);

            return {
                label: 'runs',
                segments: [
                    { name: 'Success', value: ok, color: 'green' },
                    { name: 'Rejected', value: rejected, color: 'orange' },
                    { name: 'Errors', value: errored, color: 'red' }
                ]
            };
        }
    });

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
            const failed = await count([created(), { field: 'code', value: [400, 599], operator: 'BETWEEN' }]);
            const ok = Math.max(total - failed, 0);
            const rate = total ? Math.min(Math.round((ok / total) * 100), 100) : 100;

            return {
                value: rate,
                display: rate + '%',
                caption: ok + ' of ' + total + ' runs',
                color: rate < 90 ? (rate < 70 ? 'red' : 'orange') : 'green'
            };
        }
    });

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

            const top = Object.entries(totals).sort((a, b) => b[1] - a[1]).slice(0, 5);
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
                    color: entry.code >= 500 ? 'red' : (entry.code >= 400 ? 'orange' : 'green'),
                    title: entry.command,
                    detail: entry.direct ? 'system' : (entry.user ? entry.user.name : 'anonymous'),
                    badge: String(entry.code),
                    time: new Date(entry.created_at).toLocaleTimeString()
                }))
            };
        }
    });
});
