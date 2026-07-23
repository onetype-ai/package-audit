onetype.AddonReady('admin.layouts', (layouts) =>
{
    layouts.Item({
        id: 'dashboard',
        isActive: true,
        condition: {
            app: ['audit'],
            mode: ['dashboard']
        },
        zone: 'root',
        slot: 'center',
        render: function()
        {
            return '<e-dashboard pattern="dots"></e-dashboard>';
        }
    });
});
