import _ from 'lodash';
import { Amplify } from 'aws-amplify';
import { useSetState } from 'minimal-shared/hooks';
import { useMemo, useEffect, useCallback } from 'react';
import { fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';

import { CONFIG } from 'src/global-config';
import { dispatch } from 'src/redux/store';
import { setUser, setToken } from 'src/redux/slice/auth';

import { useProfileQuery } from '../api';
import { AuthContext } from './auth-context';


// ----------------------------------------------------------------------

/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */

/**
 * Docs:
 * https://docs.amplify.aws/react/build-a-backend/auth/manage-user-session/
 */

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: CONFIG.amplify.userPoolId,
      userPoolClientId: CONFIG.amplify.userPoolWebClientId,
    },
  },
});

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const { state, setState } = useSetState<any>({ user: null, loading: true });

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;
  const { data: userDetails } = useProfileQuery(undefined, { skip: status !== 'authenticated' || !state.user });


  const checkUserSession = useCallback(async () => {
    try {
      const authSession = (await fetchAuthSession({ forceRefresh: true })).tokens;

      if (authSession) {
        const userAttributes = await fetchUserAttributes();

        const accessToken = authSession.accessToken.toString();

        dispatch(setToken(accessToken));

        setState({ user: { ...authSession, ...userAttributes }, loading: false });
      } else {
        setState({ user: null, loading: false });
      }
    } catch (error) {
      console.error(error);
      setState({ user: null, loading: false });
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state.user && !_.isEmpty(userDetails)) {
      setState((prevState: any) => ({
        user: {
          ...prevState.user,
          ...userDetails,
        },
      }));

      dispatch(setUser(userDetails));

    }
  }, []);

  // ----------------------------------------------------------------------



  const memoizedValue = useMemo(
    () => ({
      user: state.user
        ? {
          ...state.user,
          id: state.user?.sub,
          accessToken: state.user?.accessToken?.toString(),
          displayName: `${state.user?.given_name} ${state.user?.family_name}`,
          role: state.user?.role ?? 'admin',
        }
        : null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
