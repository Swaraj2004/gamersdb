import Image from "next/image";

const HeroSection = () => {
    return (
        <main className="py-10 grid grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto">
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
            </div>
            <div className="hidden md:grid grid-cols-2">
                <div className="grid">
                    <Image
                        src={"/playstation.png"}
                        width={200}
                        height={200}
                        quality={100}
                        className="my-auto ml-auto object-cover hover:scale-105 hover:origin-center duration-300 ease-in-out translate-y-3"
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
                        className="m-auto object-cover hover:scale-105 hover:origin-center duration-300 ease-in-out -translate-y-3"
                        draggable="false"
                        alt="Xbox"
                    />
                </div>
            </div>
        </main>
    );
};

export default HeroSection;
