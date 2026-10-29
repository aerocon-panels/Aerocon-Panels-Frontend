import React, { useEffect, useState } from 'react';
import { ArrowLeft, LogOut } from 'lucide-react';
import { supabase } from './lib/supabaseClient';

const SUPER_USER_EMAIL = 'saas.agency2021@gmail.com';

const isSuperUser = (user) =>
  user?.email?.toLowerCase() === SUPER_USER_EMAIL;

export default function SuperUserPortal() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInLoading, setSignInLoading] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (!active) return;
        if (sessionError) setError(sessionError.message);
        setUser(data.session?.user ?? null);
      } catch (sessionError) {
        if (active) {
          console.error('Super User session error:', sessionError);
          setError('Unable to verify your session. Please reload and try again.');
        }
      } finally {
        if (active) setAuthLoading(false);
      }
    };

    void loadSession();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isSuperUser(user)) {
      setCustomers([]);
      return undefined;
    }

    let active = true;
    setDashboardLoading(true);
    setError('');

    const loadCustomers = async () => {
      try {
        const { data, error: queryError } = await supabase
          .from('customer_enquiries')
          .select('name, phone');

        if (!active) return;
        if (queryError) {
          console.error('Customer dashboard loading error:', queryError);
          setError(`Unable to load customer records: ${queryError.message}`);
          setCustomers([]);
        } else {
          setCustomers(data ?? []);
        }
      } catch (queryError) {
        if (active) {
          console.error('Customer dashboard loading error:', queryError);
          setError('Unable to load customer records. Please try again.');
          setCustomers([]);
        }
      } finally {
        if (active) setDashboardLoading(false);
      }
    };

    void loadCustomers();

    return () => {
      active = false;
    };
  }, [user]);

  const handleSignIn = async (event) => {
    event.preventDefault();
    setSignInLoading(true);
    setError('');

    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      if (!isSuperUser(data.user)) {
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) {
          console.error('Unauthorized session sign-out error:', signOutError);
        }
        setError('This account is not authorized to access the Super User dashboard.');
      } else {
        setUser(data.user);
        setPassword('');
      }
    } catch (signInError) {
      console.error('Super User sign-in error:', signInError);
      setError('Unable to sign in. Check your connection and try again.');
    } finally {
      setSignInLoading(false);
    }
  };

  const handleSignOut = async () => {
    setError('');
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        console.error('Super User sign-out error:', signOutError);
        setError(`Unable to sign out: ${signOutError.message}`);
      } else {
        setCustomers([]);
        setUser(null);
      }
    } catch (signOutError) {
      console.error('Super User sign-out error:', signOutError);
      setError('Unable to sign out. Please try again.');
    }
  };

  return (
    <main className="superUserPage">
      <header className="superUserHeader">
        <div className="container superUserHeaderContent">
          <a className="superUserBack" href="#home">
            <ArrowLeft size={17} />
            Back to website
          </a>
          {isSuperUser(user) && (
            <button
              type="button"
              className="superUserSignOut"
              onClick={handleSignOut}
            >
              <LogOut size={17} />
              Sign out
            </button>
          )}
        </div>
      </header>

      <section className="container superUserContent">
        {authLoading ? (
          <p className="superUserMessage">Checking your session...</p>
        ) : isSuperUser(user) ? (
          <>
            <div className="superUserTitle">
              <span className="eyebrow">Private access</span>
              <h1>Customer enquiries</h1>
              <p>Customer contact details are visible only to the authorized Super User.</p>
            </div>

            {error && <p className="superUserError" role="alert">{error}</p>}

            {dashboardLoading ? (
              <p className="superUserMessage">Loading customer records...</p>
            ) : !error ? (
              customers.length ? (
                <div className="customerTableWrap">
                  <table className="customerTable">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Phone Number</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((customer, index) => (
                        <tr key={`${customer.phone || customer.name || 'customer'}-${index}`}>
                          <td>{customer.name || '—'}</td>
                          <td>{customer.phone || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="superUserMessage">No customer records found.</p>
              )
            ) : null}
          </>
        ) : user ? (
          <div className="superUserCard">
            <span className="eyebrow">Private access</span>
            <h1>Not authorized</h1>
            <p>This account does not have Super User access.</p>
            {error && <p className="superUserError" role="alert">{error}</p>}
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>
        ) : (
          <form className="superUserCard" onSubmit={handleSignIn}>
            <span className="eyebrow">Private access</span>
            <h1>Super User login</h1>
            <p>Sign in with the account authorized to view customer records.</p>

            <label className="superUserField">
              Email
              <input
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>

            <label className="superUserField">
              Password
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>

            {error && <p className="superUserError" role="alert">{error}</p>}

            <button
              className="btn btn-primary superUserSubmit"
              type="submit"
              disabled={signInLoading}
            >
              {signInLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
