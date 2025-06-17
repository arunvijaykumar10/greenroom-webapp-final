import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import Dashboard from '../../sections/dashboard/Dashboard';

// ----------------------------------------------------------------------

const metadata = { title: `Dashboard - ${CONFIG.appName}` };

export default function DashboardPage() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>
      <Dashboard />
    </>
  );
}
