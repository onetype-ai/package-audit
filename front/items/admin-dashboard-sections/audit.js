onetype.AddonReady('admin.dashboard.sections', (sections) =>
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
