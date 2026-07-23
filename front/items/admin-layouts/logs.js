onetype.AddonReady('admin.layouts', (layouts) =>
{
    layouts.Item({
        id: 'logs',
        isActive: true,
        condition: {
            app: ['audit'],
            mode: ['logs']
        },
        zone: 'root',
        slot: 'center',
        render: function()
        {
            return '<e-audit-grid :background="0"></e-audit-grid>';
        }
    });
});
