import Login from "@/components/shared/Login";
import Signup from "@/components/shared/Signup";
import { getServerSession } from "next-auth/next";
import Image from "next/image";

const HeroSection = async () => {
    const session = await getServerSession();

    return (
        <main className="py-16 grid grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto">
            <div className="grid place-content-center text-center">
                <div className="text-3xl font-bold from-purple-600 via-pink-600 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent pb-4 max-w-2xl">
                    Discover, Collect and Share Your Game Collections
                </div>
                <div className="text-lg font-semibold max-w-2xl">
                    Welcome to our free games database website! Here, you can
                    discover games, create collections, and easily share them
                    with your friends. Plus, you can keep yourself updated with
                    the most current gaming news.
                </div>
                <div className="flex justify-center mt-4 sm:hidden">
                    {!session && <Signup />}
                    {!session && <Login />}
                </div>
            </div>
            <div className="hidden md:grid grid-cols-2">
                <div className="grid">
                    <Image
                        src={"/playstation.png"}
                        width={200}
                        height={200}
                        quality={100}
                        priority={true}
                        className="my-auto ml-auto object-cover hover:scale-105 hover:origin-center duration-300 ease-in-out translate-y-3 translate-x-4 drop-shadow-dark"
                        draggable="false"
                        alt="Playstation"
                    />
                </div>
                <div className="grid">
                    <Image
                        src={"/xbox.png"}
                        width={200}
                        height={200}
                        quality={100}
                        priority={true}
                        className="m-auto object-cover hover:scale-105 hover:origin-center duration-300 ease-in-out -translate-y-3 drop-shadow-dark"
                        draggable="false"
                        alt="Xbox"
                    />
                </div>
            </div>
        </main>
    );
};

export default HeroSection;
