import { Link } from 'react-router-dom';
import '../assets/css/cashierSidebar.css';

const sidebarCashier = () => {
    return (
      <div className="card bg-white p-3 shadow-md shadow-purple-200/50 rounded-md">
        <ul className="w-full flex flex-col gap-2 m-0 p-0">
          <li className="flex-center cursor-pointer p-16-semibold w-full whitespace-nowrap">
            <Link to="/cashier" className='no-underline'>
            <button className="p-16-semibold flex size-full gap-4 p-4 group font-semibold rounded-full bg-cover hover:bg-purple-100 hover:shadow-inner focus:bg-gradient-to-r from-purple-400 to-purple-600 focus:text-white text-gray-700 transition-all ease-linear">
                <i className="bi bi-bookmark-dash-fill"></i>
                <span className="no-underline">Dashboard</span>
            </button>
            </Link>
          </li>
          <li className="flex-center cursor-pointer p-16-semibold w-full whitespace-nowrap">
            <button className="p-16-semibold flex size-full gap-4 p-4 group font-semibold rounded-full bg-cover hover:bg-purple-100 hover:shadow-inner focus:bg-gradient-to-r from-purple-400 to-purple-600 focus:text-white text-gray-700 transition-all ease-linear">
            <i className="bi bi-gear-fill"></i>
              <span>Settings</span>
            </button>
          </li>
          <li className="flex-center cursor-pointer p-16-semibold w-full whitespace-nowrap">
            <button className="p-16-semibold flex size-full gap-4 p-4 group font-semibold rounded-full bg-cover hover:bg-purple-100 hover:shadow-inner focus:bg-gradient-to-r from-purple-400 to-purple-600 focus:text-white text-gray-700 transition-all ease-linear">
            <i className="bi bi-door-closed-fill"></i>
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    );
}

export default sidebarCashier;
