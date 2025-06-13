const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
  COMPANY: '/company',
  PAYROLL: '/payroll',
  TAXES: '/taxes',
  REPORTS: '/reports',
  SETTINGS: '/settings',
};

// ----------------------------------------------------------------------

export const paths = {
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  // AUTH
  auth: {
    signIn: `${ROOTS.AUTH}/sign-in`,
    verify: `${ROOTS.AUTH}/verify`,
    signUp: `${ROOTS.AUTH}/sign-up`,
    updatePassword: `${ROOTS.AUTH}/update-password`,
    resetPassword: `${ROOTS.AUTH}/reset-password`,
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    dashboard: `${ROOTS.DASHBOARD}/dashboard`,
    company: `${ROOTS.DASHBOARD}/company`,
    payroll: `${ROOTS.DASHBOARD}/payroll`,
    taxes: `${ROOTS.DASHBOARD}/taxes`,
    reports: `${ROOTS.DASHBOARD}/reports`,
    settings: `${ROOTS.DASHBOARD}/settings`,
    payees: `${ROOTS.DASHBOARD}/payees`,
  },
};