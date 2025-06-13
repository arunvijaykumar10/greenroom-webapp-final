import { Helmet } from 'react-helmet-async';

import { Container, Typography } from '@mui/material';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const metadata = { title: `Dashboard - ${CONFIG.appName}` };

export default function OverviewAppPage() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom align="center">
          Welcome to Greenroom
        </Typography>
      </Container>
    </>
  );
}
