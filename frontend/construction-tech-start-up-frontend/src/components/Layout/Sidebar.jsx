import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setSidebarOpen, selectSidebarOpen } from '../../features/ui/uiSlice';
import { logout, selectCurrentUser, selectCurrentRole } from '../../features/auth/authSlice';
import { 
  faHome, 
  faProjectDiagram, 
  faBriefcase, 
  faUser, 
  faClipboardList, 
  faFileAlt, 
  faSignOutAlt 
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectSidebarOpen);
  const currentUser = useSelector(selectCurrentUser);
  const currentRole = useSelector(selectCurrentRole);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(setSidebarOpen(false));
  };

  const getNavigationItems = () => {
     const baseItems = [
    { name: 'Dashboard', href: '/dashboard', icon: faHome },
    { name: 'Projects', href: '/projects', icon: faProjectDiagram },
    { name: 'Jobs', href: '/jobs', icon: faBriefcase },
    { name: 'Profile', href: '/profile', icon: faUser },
  ];

     if (currentRole === 'HOMEOWNER') {
    baseItems.splice(2, 0, { name: 'Bids', href: '/bids', icon: faClipboardList });
  } else if (currentRole === 'CONTRACTOR') {
    baseItems.splice(2, 0, { name: 'Applications', href: '/applications', icon: faFileAlt });
  }

    return baseItems;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={() => dispatch(setSidebarOpen(false))}
      />

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-primary-500">Construction Tech</h1>
            <button
              onClick={() => dispatch(setSidebarOpen(false))}
              className="lg:hidden text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* User Info */}
          {currentUser && (
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {currentUser.name?.charAt(0) || 'U'}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                  <p className="text-xs text-gray-500">{currentUser.email}</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mt-1">
                    {currentRole}
                  </span>
                </div>
              </div>
            </div>
          )}

                     {/* Navigation */}
           <nav className="flex-1 px-4 py-6 space-y-2">
             {getNavigationItems().map((item) => (
               <Link
                 key={item.name}
                 to={item.href}
                 onClick={() => dispatch(setSidebarOpen(false))}
                 className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-primary-50 hover:text-primary-700 transition-all duration-200 cursor-pointer"
               >
                <FontAwesomeIcon icon={item.icon} className="mr-3 text-lg" />
                 {item.name}
               </Link>
             ))}
           </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 hover:text-red-700 transition-all duration-200 cursor-pointer"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
