"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/themes/splide-default.min.css";
import Image from "next/image";

export const splideOptions: any = {
    perPage: 2,
    width: "100%",
    autoHeight: true,
    pagination: false,
    keyboard: "focused",
    gap: "1rem",
    drag: "free",
    snap: true,
    // mediaQuery: "min",
    // breakpoints: {
    //     1024: { perMove: 2 },
    // },
};

const Screenshots = ({ urls }: { urls: string[] }) => {
    const screenshots = urls.map((url: string) => (
        <SplideSlide key={url}>
            <Card className="my-2">
                <CardContent className="p-0 overflow-hidden rounded-xl">
                    <Image
                        src={url}
                        width={600}
                        height={350}
                        quality={100}
                        className="object-cover hover:scale-105 hover:origin-center duration-300 ease-in-out"
                        draggable="false"
                        alt="Screenshot"
                    />
                </CardContent>
            </Card>
        </SplideSlide>
    ));

    return (
        <div className="my-6">
            <Splide options={splideOptions} aria-label="Screenshots">
                {screenshots}
            </Splide>
        </div>
    );
};

export default Screenshots;
