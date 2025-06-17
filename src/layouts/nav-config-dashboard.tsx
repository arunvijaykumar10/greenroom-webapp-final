import type { NavSectionProps } from 'src/components/nav-section';

import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export const navData: NavSectionProps['data'] = [
  {
    items: [
      { title: 'Company', path: paths.app.company, icon: <Iconify icon="noto:office-building" /> },
      {
        title: 'Dashboard',
        path: paths.app.dashboard,
        icon: <Iconify icon="material-symbols:dashboard-rounded" />,
      },
      { title: 'Payees', path: paths.app.payees, icon: <Iconify icon="raphael:employee" /> },
      { title: 'Payroll', path: paths.app.payroll, icon: <Iconify icon="fa-solid:dollar-sign" /> },
      { title: 'Taxes', path: paths.app.taxes, icon: <Iconify icon="tabler:tax" /> },
      { title: 'Reports', path: paths.app.reports, icon: <Iconify icon="mdi:report-finance" /> },
      { title: 'Settings', path: paths.app.settings, icon: <Iconify icon="ooui:settings" /> },
    ],
  },
];
