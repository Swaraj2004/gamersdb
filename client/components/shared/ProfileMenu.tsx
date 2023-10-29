import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const ProfileMenu = () => {
    const { data: session, status } = useSession();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="rounded-full my-auto w-10 h-10"
                >
                    <Avatar>
                        <AvatarImage
                            src="/profile-picture.svg"
                            alt="profile-img"
                            height={40}
                            width={40}
                        />
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1 text-center my-2">
                        {status === "authenticated" && session?.user && (
                            <>
                                <p className="font-medium leading-none mb-2">
                                    {session.user.username}
                                </p>
                                <p className="text-sm leading-none text-muted-foreground">
                                    {session.user.email}
                                </p>
                            </>
                        )}
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    {/* <DropdownMenuItem>Profile</DropdownMenuItem> */}
                    <Link href="/friends">
                        <DropdownMenuItem>Friends</DropdownMenuItem>
                    </Link>
                    <Link href="/collections">
                        <DropdownMenuItem>Collections</DropdownMenuItem>
                    </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ProfileMenu;
