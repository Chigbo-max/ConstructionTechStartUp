import { createBrowserRouter } from 'react-router-dom';

import Dashboard from '../pages/Dashboard/Dashboard';
import Projects from '../pages/Projects/Projects';
import CreateProject from '../pages/Projects/CreateProject';
import Jobs from '../pages/Jobs/Jobs';
import Profile from '../pages/Profile/Profile';
import About from '../pages/About/About';
import Landing from '../components/Landing/Landing';
import Contractors from '../pages/Contractors/Contractors';
import Bids from '../pages/Bids/Bids';

import NotFound from '../pages/ErrorPages/NotFound';
import ServerDown from '../pages/ErrorPages/ServerDown';
import NoInternet from '../pages/ErrorPages/NoInternet';

import Onboarding from '../pages/Onboarding/Onboarding';
import Layout from '../components/Layout/Layout';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import ContactUs from '../pages/Contact/Contact';
import RequireAuth from '../pages/Auth/RequireAuth';
import Unauthorized from '../pages/Auth/Unauthorized';

const BrowserRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
    { path: "/",element: <Landing />},
    { path: "/login", element: <Login />},
    { path: "/register", element: <Register />},
    { path: "/onboarding/:role",element: <RequireAuth><Onboarding /></RequireAuth>},
    { path: "/about",element: <About />},
    { path: "/contactUs", element: <ContactUs />},
    { path: "/dashboard", element: <RequireAuth><Dashboard /></RequireAuth>},
    { path: "/projects", element: <RequireAuth><Projects /></RequireAuth>},
    { path: "/projects/new", element: <RequireAuth><CreateProject /></RequireAuth>},
    { path: "/jobs", element: <RequireAuth><Jobs /></RequireAuth>},
    { path: "/contractors", element: <RequireAuth><Contractors /></RequireAuth>},
    { path: "/bids", element: <RequireAuth><Bids /></RequireAuth>},
    { path: "/profile", element: <RequireAuth><Profile /></RequireAuth>},
    { path: "/server-down", element: <ServerDown />},
    { path: "/no-internet", element: <NoInternet /> },
    { path: "/unauthorized", element: <Unauthorized />},
    { path: "*", element: <NotFound />},
    ]
  }
]
)


export default BrowserRouter;