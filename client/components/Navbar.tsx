"use client";

import Image from "next/image";
import ProfileMenu from "./ProfileMenu";
import ModeToggle from "./ModeToggle";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

const Navbar: React.FC = () => {
    const [searchBtnState, setSearchBtnState] = useState(false);
    const ref = useRef<HTMLInputElement>(null);

    function handleClick() {
        setSearchBtnState((searchBtnState) => !searchBtnState);
        ref.current?.focus();
    }

    const shown =
        "transition ease-in-out duration-150 mx-2 w-[calc(100%-18px)] sm:mx-auto sm:max-w-md sm:my-auto rounded-full border-2 focus-visible:border-indigo-500 focus-visible:ring-0 translate-y-14 sm:translate-y-0 bg-slate-200 dark:bg-slate-900 shadow-md sm:shadow-none absolute sm:static";
    const hidden =
        "transition ease-in-out duration-150 mx-2 w-[calc(100%-18px)] sm:mx-auto sm:max-w-md sm:my-auto rounded-full border-2 focus-visible:border-indigo-500 focus-visible:ring-0 -translate-y-14 sm:translate-y-0 bg-slate-200 dark:bg-slate-900 shadow-md sm:shadow-none absolute sm:static";

    return (
        <nav className="fixed top-0 w-screen backdrop-blur-md bg-background/70 shadow-md z-50">
            <div className="px-2 md:px-4 lg:px-6 2xl:container grid grid-cols-2 sm:grid-cols-3 h-12 relative">
                <div className="flex mr-auto">
                    <Image
                        src="/logo.svg"
                        width={38}
                        height={38}
                        draggable="false"
                        alt="GamersDB Logo"
                    />
                    <div className="self-center px-2 text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                        GamersDB
                    </div>
                </div>

                <Input
                    ref={ref}
                    type="text"
                    placeholder="Search games"
                    className={searchBtnState ? shown : hidden}
                />

                <div className="flex justify-end">
                    <Button
                        onClick={handleClick}
                        variant="outline"
                        size="icon"
                        className="my-auto sm:hidden rounded-full"
                    >
                        <MagnifyingGlassIcon className="h-5 w-5" />
                    </Button>
                    <ModeToggle />
                    <ProfileMenu />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
