"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/lib/store/auth-slice";
import type { AppDispatch, RootState } from "@/lib/store/store";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  const navigation = [
    { name: "Home", href: "/" },
    ...(isAuthenticated
      ? [
          { name: "Dashboard", href: "/dashboard" },
          { name: "Bills", href: "/bills" },
        ]
      : []),
  ];

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <nav className="bg-gradient-to-r from-violet-600 to-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-white text-xl font-bold">BillsManager</span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      pathname === item.href
                        ? "bg-violet-700 text-white"
                        : "text-white hover:bg-violet-500 hover:bg-opacity-75"
                    } px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <span className="text-white">Welcome, {user?.username}</span>
                  <Button
                    variant="secondary"
                    onClick={handleLogout}
                    className="hover:bg-violet-500 hover:text-white transition-colors"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link href="/auth/login">
                    <Button variant="secondary">Login</Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button variant="secondary">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-violet-500 focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  pathname === item.href
                    ? "bg-violet-700 text-white"
                    : "text-white hover:bg-violet-500 hover:bg-opacity-75"
                } block px-3 py-2 rounded-md text-base font-medium`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {isAuthenticated ? (
              <Button
                variant="secondary"
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full mt-2"
              >
                Logout
              </Button>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block"
                  onClick={() => setIsOpen(false)}
                >
                  <Button variant="secondary" className="w-full mt-2">
                    Login
                  </Button>
                </Link>
                <Link
                  href="/auth/signup"
                  className="block"
                  onClick={() => setIsOpen(false)}
                >
                  <Button variant="secondary" className="w-full mt-2">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
