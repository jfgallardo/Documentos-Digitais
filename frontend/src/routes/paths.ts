// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: "/auth",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
};

// ----------------------------------------------------------------------

export const paths = {
  // AUTH
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    jwt: {
      signIn: `${ROOTS.AUTH}/login`,
      signUp: `${ROOTS.AUTH}/registration`,
      forgot: `${ROOTS.AUTH}/forgot-password`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
  },
  // PROFILE
  profile: {
    root: `${ROOTS.PROFILE}`,
    overview: `${ROOTS.PROFILE}/overview`,
    team: {
      root: `${ROOTS.PROFILE}/team`,
      edit: (id: number) => `${ROOTS.PROFILE}/team/${id}/edit`,
    },
    security: `${ROOTS.PROFILE}/security`,
    limits: `${ROOTS.PROFILE}/limits`,
  },
};
