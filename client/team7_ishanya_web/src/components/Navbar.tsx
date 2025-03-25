import { useState, useEffect } from "react";
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
  FiChevronDown,
  FiPlus,
  FiBell,
  FiTool,
  FiClipboard,
  FiCalendar,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { getUserType, getUserId, logout } from "../store/slices/authSlice";
import { USER_ROLES } from "../types";
import { toast } from "react-toastify";

// Define the type for navigation items
type NavItem = {
  label: string;
  path: string;
  icon: React.JSX.Element;
  isManageItem?: boolean;
  isCreateItem?: boolean;
};

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userType = useSelector(getUserType);
  const userId = useSelector(getUserId);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isManageDropdownOpen, setIsManageDropdownOpen] = useState(false);
  const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    toast.success("You have been successfully logged out");
  };

  const getNavItems = (): NavItem[] => {
    const items: NavItem[] = [
      { label: "Dashboard", path: "/", icon: <FiUser /> },
    ];

    if (userType === USER_ROLES.SUPERUSER || userType === USER_ROLES.ADMIN) {
      items.push(
        {
          label: "Manage Assessments",
          path: "/manage/assessments",
          icon: <FiClipboard />,
          isManageItem: true,
        },
        {
          label: "Manage Queries",
          path: "/manage/queries",
          icon: <FiUsers />,
          isManageItem: true,
        },
        {
          label: "Manage Students",
          path: "/manage/students",
          icon: <FiUsers />,
          isManageItem: true,
        },
        {
          label: "Manage Employees",
          path: "/manage/employees",
          icon: <FiUsers />,
          isManageItem: true,
        },
        {
          label: "Manage Programs",
          path: "/manage/programs",
          icon: <FiSettings />,
          isManageItem: true,
        },
        {
          label: "Create Student",
          path: "/create/student",
          icon: <FiPlus />,
          isCreateItem: true,
        },
        {
          label: "Create Employee",
          path: "/create/employee",
          icon: <FiPlus />,
          isCreateItem: true,
        },
        {
          label: "Assign Educator",
          path: "/create/educator",
          icon: <FiPlus />,
          isCreateItem: true,
        },
        {
          label: "Notify",
          path: "/notify",
          icon: <FiBell />,
        }
      );
    }
    if (userType === USER_ROLES.SUPERUSER) {
      items.push({
        label: "Manage Permissions",
        path: "/manage/permissions",
        icon: <FiSettings />,
        isManageItem: true,
      });
    }
    if (
      userType &&
      (userType === USER_ROLES.EDUCATOR || userType >= USER_ROLES.ADMIN)
    ) {
      items.push(
        { label: "My Students", path: "/my_students", icon: <FiUsers /> },
        { label: "Reports", path: "/reports", icon: <FiFileText /> },
        {
          label: "Manage Appointments",
          path: "/manage/appointments",
          icon: <FiCalendar />,
          isManageItem: true,
        }
      );
    }

    if (userType === USER_ROLES.STUDENT) {
      items.push(
        { label: "My Profile", path: `/profile/${userId}`, icon: <FiUser /> },
        { label: "My Reports", path: "/reports", icon: <FiFileText /> }
      );
    }
    items.push({
      label: "Change Password",
      path: "/update-password",
      icon: <FiTool />,
    });
    return items;
  };

  const navItems = getNavItems();
  const manageItems = navItems.filter((item) => item.isManageItem);
  const createItems = navItems.filter((item) => item.isCreateItem);
  const regularItems = navItems.filter(
    (item) => !item.isManageItem && !item.isCreateItem
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isDrawerOpen]);

  // Animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: "easeIn",
      },
    },
  };

  const drawerVariants = {
    hidden: { x: "100%" },
    visible: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.2 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  const staggerChildren = {
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
  };

  return (
    <>
      <div className="bg-base-100 shadow-sm sticky top-0 z-10 ">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img
                src="/ishanya_logo.png"
                alt="Ishanya India"
                className="h-10"
              />
              <span className="ml-3 font-bold text-lg hidden md:block">
                Ishanya Portal
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {/* Dashboard button */}
              <button
                className="px-3 py-2 rounded hover:bg-gray-100 flex items-center cursor-pointer"
                onClick={() => navigate("/")}
              >
                <span className="mr-2">
                  <FiUser />
                </span>
                Dashboard
              </button>

              {/* Manage dropdown */}
              {manageItems.length > 0 && (
                <div className="relative ">
                  <button
                    className="px-3 py-2 rounded hover:bg-gray-100 flex items-center cursor-pointer"
                    onClick={() =>
                      setIsManageDropdownOpen(!isManageDropdownOpen)
                    }
                    onBlur={() =>
                      setTimeout(() => setIsManageDropdownOpen(false), 100)
                    }
                  >
                    <span className="mr-2">
                      <FiSettings />
                    </span>
                    Manage
                    <motion.span
                      animate={{ rotate: isManageDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="ml-1"
                    >
                      <FiChevronDown />
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {isManageDropdownOpen && (
                      <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200"
                      >
                        {manageItems.map((item, index) => (
                          <motion.button
                            key={index}
                            variants={menuItemVariants}
                            className="cursor-pointer w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-items-start"
                            onClick={() => {
                              navigate(item.path);
                              setIsManageDropdownOpen(false);
                            }}
                          >
                            <span className="mr-2 text-gray-500">
                              {item.icon}
                            </span>
                            {item.label.replace("Manage ", "")}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Create dropdown - only for superuser and admin */}
              {createItems.length > 0 && (
                <div className="relative ">
                  <button
                    className="px-3 py-2 rounded hover:bg-gray-100 flex items-center cursor-pointer"
                    onClick={() =>
                      setIsCreateDropdownOpen(!isCreateDropdownOpen)
                    }
                    onBlur={() =>
                      setTimeout(() => setIsCreateDropdownOpen(false), 100)
                    }
                  >
                    <span className="mr-2">
                      <FiPlus />
                    </span>
                    Create
                    <motion.span
                      animate={{ rotate: isCreateDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="ml-1"
                    >
                      <FiChevronDown />
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {isCreateDropdownOpen && (
                      <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200"
                      >
                        {createItems.map((item, index) => (
                          <motion.button
                            key={index}
                            variants={menuItemVariants}
                            className="cursor-pointer w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-items-start"
                            onClick={() => {
                              navigate(item.path);
                              setIsCreateDropdownOpen(false);
                            }}
                          >
                            <span className="mr-2 text-gray-500">
                              {item.icon}
                            </span>
                            {item.label.replace("Create ", "")}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Other regular items */}
              {regularItems
                .filter((item) => item.label !== "Dashboard")
                .map((item, index) => (
                  <button
                    key={index}
                    className="cursor-pointer px-3 py-2 rounded hover:bg-gray-100 flex items-center"
                    onClick={() => navigate(item.path)}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
            </div>

            <div className="hidden md:block ">
              <div className="dropdown dropdown-end ">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="avatar placeholder pr-10">
                    <div className="bg-neutral text-neutral-content rounded-full w-10">
                      <div className="flex items-center justify-center w-full h-full">
                        <span>{userId ? userId[0].toUpperCase() : "U"}</span>
                      </div>
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

            <div className="md:hidden">
              <button
                className="btn btn-ghost btn-circle"
                onClick={() => setIsDrawerOpen(true)}
              >
                <FiMenu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
          >
            <motion.div
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-y-0 right-0 w-80 bg-base-100 shadow-xl h-full"
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-4 border-b">
                  <img
                    src="/ishanya_logo.png"
                    alt="Ishanya India"
                    className="h-10"
                  />
                  <button
                    className="btn btn-ghost btn-sm btn-circle"
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
                <motion.div
                  className="flex-1 overflow-y-auto p-4"
                  variants={staggerChildren}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="flex flex-col space-y-2">
                    {/* Regular nav items */}
                    {regularItems.map((item, index) => (
                      <motion.button
                        key={index}
                        variants={menuItemVariants}
                        className="flex items-center p-3 rounded hover:bg-gray-100"
                        onClick={() => {
                          navigate(item.path);
                          setIsDrawerOpen(false);
                        }}
                      >
                        <span className="mr-3 text-gray-500">{item.icon}</span>
                        {item.label}
                      </motion.button>
                    ))}

                    {/* Manage items section */}
                    {manageItems.length > 0 && (
                      <>
                        <div className="divider text-sm text-gray-500">
                          Manage
                        </div>
                        {manageItems.map((item, index) => (
                          <motion.button
                            key={`manage-${index}`}
                            variants={menuItemVariants}
                            className="flex items-center p-3 rounded hover:bg-gray-100"
                            onClick={() => {
                              navigate(item.path);
                              setIsDrawerOpen(false);
                            }}
                          >
                            <span className="mr-3 text-gray-500">
                              {item.icon}
                            </span>
                            {item.label.replace("Manage ", "")}
                          </motion.button>
                        ))}
                      </>
                    )}

                    {/* Create items section */}
                    {createItems.length > 0 && (
                      <>
                        <div className="divider text-sm text-gray-500">
                          Create
                        </div>
                        {createItems.map((item, index) => (
                          <motion.button
                            key={`create-${index}`}
                            variants={menuItemVariants}
                            className="flex items-center p-3 rounded hover:bg-gray-100"
                            onClick={() => {
                              navigate(item.path);
                              setIsDrawerOpen(false);
                            }}
                          >
                            <span className="mr-3 text-gray-500">
                              {item.icon}
                            </span>
                            {item.label.replace("Create ", "")}
                          </motion.button>
                        ))}
                      </>
                    )}

                    <div className="divider text-sm text-gray-500">Account</div>
                    <motion.button
                      variants={menuItemVariants}
                      className="flex items-center p-3 rounded hover:bg-gray-100"
                      onClick={() => {
                        navigate(`/profile/${userId}`);
                        setIsDrawerOpen(false);
                      }}
                    >
                      <FiUser className="mr-3 text-gray-500" />
                      My Profile
                    </motion.button>
                    <motion.button
                      variants={menuItemVariants}
                      className="flex items-center p-3 rounded hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      <FiLogOut className="mr-3 text-gray-500" />
                      Logout
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
