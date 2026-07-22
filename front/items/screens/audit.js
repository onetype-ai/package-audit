onetype.AddonReady('ui.screens', (screens) =>
{
    screens.Item({
        id: 'audit',
        route: '/audit',
        app: 'audit',
        metadata: { addon: 'audit' }
    });
});
