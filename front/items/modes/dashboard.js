onetype.AddonReady('ui.modes', (modes) =>
{
	modes.Item({
		id: 'dashboard',
		condition: { app: ['audit'] },
		isDefault: true,
		order: 1,
		icon: 'dashboard',
		name: 'Dashboard'
	});
});
