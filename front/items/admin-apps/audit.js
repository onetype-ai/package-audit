onetype.AddonReady('admin.apps', (apps) =>
{
    apps.Item({
        id: 'audit',
        name: 'Audit',
        icon: 'history',
        color: 'rgba(96, 165, 250, 1)',
        description: 'Audit trail of the instance. Every command run with who ran it, from where and how it went.',
        order: 9,
        isHidden: true
    });
});
