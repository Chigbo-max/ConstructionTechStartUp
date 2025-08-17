import { Outlet} from "react-router-dom";
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import {useSelector} from 'react-redux'
import { selectIsAuthenticated } from '../../features/auth/authSlice';

function Layout(){
    const isAuthenticated = useSelector(selectIsAuthenticated);

    return(
        <div>
            <Header/>
            <main>
                <Outlet/>
            </main>
            {isAuthenticated && <Footer/>}
            {isAuthenticated && <Sidebar/>}
        </div>
    )
}

export default Layout;