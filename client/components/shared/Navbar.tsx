"use client";

import Login from "@/components/shared/Login";
import ModeToggle from "@/components/shared/ModeToggle";
import ProfileMenu from "@/components/shared/ProfileMenu";
import Signup from "@/components/shared/Signup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const Navbar: React.FC = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [searchBtnState, setSearchBtnState] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const ref = useRef<HTMLInputElement>(null);

    function handleClick() {
        setSearchBtnState((searchBtnState) => !searchBtnState);
        ref.current?.focus();
    }

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setSearchValue(newValue);
    };

    const handleSearchSubmit = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (event.key === "Enter" && searchValue.trim() !== "") {
            router.push(`/search?q=${searchValue.trim()}`);
            ref.current?.blur();
        }
    };

    return (
        <nav className="fixed top-0 w-screen backdrop-blur-md bg-background/70 shadow-md z-50">
            <div className="px-2 md:px-4 lg:px-6 2xl:container h-12 grid grid-cols-2 sm:grid-cols-3 relative">
                <Link href="/" className="flex mr-auto">
                    <Image
                        src="/logo.svg"
                        width={36}
                        height={36}
                        draggable="false"
                        alt="GamersDB Logo"
                    />
                    <div className="self-center px-2 text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                        GamersDB
                    </div>
                </Link>

                <Input
                    ref={ref}
                    type="text"
                    placeholder="Search games"
                    className={`transition ease-in-out duration-150 mx-2 w-[calc(100%-18px)] sm:mx-auto sm:max-w-md sm:my-auto rounded-full border-2 focus-visible:border-indigo-500 focus-visible:ring-0 ${
                        searchBtnState ? "translate-y-14" : "-translate-y-14"
                    } sm:translate-y-0 dark:bg-slate-900 shadow-md sm:shadow-none absolute sm:static`}
                    value={searchValue}
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchSubmit}
                />

                <div className="flex justify-end">
                    <Button
                        onClick={handleClick}
                        variant="outline"
                        size="icon"
                        className="my-auto mr-2 sm:hidden rounded-full"
                    >
                        <MagnifyingGlassIcon className="h-5 w-5" />
                    </Button>
                    <ModeToggle />

                    {session && <ProfileMenu />}
                    <div className="hidden sm:flex align-middle">
                        {!session && <Signup />}
                        {!session && <Login />}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
