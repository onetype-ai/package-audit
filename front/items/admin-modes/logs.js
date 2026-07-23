onetype.AddonReady('admin.modes', (modes) =>
{
    modes.Item({
        id: 'logs',
        condition: { app: ['audit'] },
        order: 2,
        icon: 'list_alt',
        name: 'Logs'
    });
});
