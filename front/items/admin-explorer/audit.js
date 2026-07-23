onetype.AddonReady('admin.explorer', (explorer) =>
{
    explorer.Item({
        id: 'audit',
        order: 50,
        group: 'Audit',
        prefix: 'audit',
        icon: 'history',
        label: 'Audit log',
        hint: 'Open the audit trail',
        keywords: ['audit', 'log', 'history', 'commands'],
        callback: () => $ot.ui.apps.open('audit')
    });
});
