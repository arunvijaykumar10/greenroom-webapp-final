import type { NavSectionProps } from 'src/components/nav-section';

import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export const navData: NavSectionProps['data'] = [
  {
    subheader: 'Overview',
    items: [
      {
        title: 'Company',
        path: paths.dashboard.root,
        icon: <Iconify icon="noto:office-building" />,
      },
      {
        title: 'Dashboard',
        path: paths.dashboard.dashboard,
        icon: <Iconify icon="material-symbols:dashboard-rounded" />,
      },
      { title: 'Payees', path: paths.dashboard.payees, icon: <Iconify icon="raphael:employee" /> },
      {
        title: 'Payroll',
        path: paths.dashboard.payroll,
        icon: <Iconify icon="fa-solid:dollar-sign" />,
      },
      { title: 'Taxes', path: paths.dashboard.taxes, icon: <Iconify icon="tabler:tax" /> },
      {
        title: 'Reports',
        path: paths.dashboard.reports,
        icon: <Iconify icon="mdi:report-finance" />,
      },
      { title: 'Settings', path: paths.dashboard.settings, icon: <Iconify icon="ooui:settings" /> },
    ],
  },
];
