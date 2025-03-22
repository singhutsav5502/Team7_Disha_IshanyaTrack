import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  FiMenu,
  FiX,
  FiLogOut,
  FiUser,
  FiUsers,
  FiFileText,
  FiSettings,
} from "react-icons/fi";
import { getUserType, getUserId, logout } from "../store/slices/authSlice";
import { USER_ROLES } from "../types";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userType = useSelector(getUserType);
  const userId = useSelector(getUserId);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    toast.success("You have been successfully logged out");
  };

  const getNavItems = () => {
    const items = [{ label: "Dashboard", path: "/", icon: <FiUser /> }];

    if (userType === USER_ROLES.SUPERUSER || userType === USER_ROLES.ADMIN) {
      items.push(
        {
          label: "Manage Students",
          path: "/manage/students",
          icon: <FiUsers />,
        },
        {
          label: "Manage Employees",
          path: "/manage/employees",
          icon: <FiUsers />,
        },
        {
          label: "Manage Programs",
          path: "/manage/programs",
          icon: <FiSettings />,
        }
      );
    }

    if (
      userType &&
      (userType === USER_ROLES.EDUCATOR || userType >= USER_ROLES.ADMIN)
    ) {
      items.push(
        { label: "My Students", path: "/my-students", icon: <FiUsers /> },
        { label: "Reports", path: "/reports", icon: <FiFileText /> }
      );
    }

    if (userType === USER_ROLES.STUDENT) {
      items.push(
        { label: "My Profile", path: `/profile/${userId}`, icon: <FiUser /> },
        { label: "My Reports", path: "/my-reports", icon: <FiFileText /> }
      );
    }

    return items;
  };

  const navItems = getNavItems();

  const NavContent = () => (
    <>
      {navItems.map((item, index) => (
        <button
          key={index}
          className="btn btn-ghost"
          onClick={() => {
            navigate(item.path);
            if (window.innerWidth < 768) setIsDrawerOpen(false);
          }}
        >
          <div className="flex items-center">
            {item.icon}
            <span className="ml-2">{item.label}</span>
          </div>
        </button>
      ))}
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto">
        <div className="flex-1">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src="/ishanya-logo.png" alt="Ishanya India" className="h-10" />
            <span className="ml-3 font-bold text-lg hidden md:block">
              Ishanya Portal
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="flex-none hidden md:flex gap-4">
          <NavContent />

          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-full w-10">
                  <span>{userId ? userId[0] : "U"}</span>
                </div>
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a onClick={() => navigate(`/profile/${userId}`)}>
                  <FiUser />
                  My Profile
                </a>
              </li>
              <li>
                <a onClick={handleLogout}>
                  <FiLogOut />
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex-none md:hidden">
          <button
            className="btn btn-square btn-ghost"
            onClick={() => setIsDrawerOpen(true)}
          >
            <FiMenu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`drawer drawer-end ${isDrawerOpen ? "drawer-open" : ""}`}>
        <input
          id="my-drawer"
          type="checkbox"
          className="drawer-toggle"
          checked={isDrawerOpen}
          onChange={() => setIsDrawerOpen(!isDrawerOpen)}
        />
        <div className="drawer-side">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
            onClick={() => setIsDrawerOpen(false)}
          ></label>
          <div className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold">Menu</span>
              <button
                className="btn btn-ghost btn-sm btn-square"
                onClick={() => setIsDrawerOpen(false)}
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <NavContent />

              <button
                className="btn btn-ghost justify-start"
                onClick={() => {
                  navigate(`/profile/${userId}`);
                  setIsDrawerOpen(false);
                }}
              >
                <div className="flex items-center">
                  <FiUser />
                  <span className="ml-2">My Profile</span>
                </div>
              </button>

              <button
                className="btn btn-ghost justify-start"
                onClick={handleLogout}
              >
                <div className="flex items-center">
                  <FiLogOut />
                  <span className="ml-2">Logout</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
