"use client";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Rating = ({ rating }: { rating: string | number }) => {
    return (
        <div className="mt-20 ml-auto h-60">
            <CircularProgressbar
                className="w-32 h-32 font-bold"
                value={typeof rating === "string" ? 0 : rating}
                text={`${rating}`}
                strokeWidth={10}
                background
                styles={buildStyles({
                    backgroundColor: "#fff",
                    textSize: "1.7rem",
                    textColor: "#000",
                    pathColor: "#6D28D9",
                    trailColor: "#374151",
                    // trailColor: "#fff",
                })}
            />
            <div className="text-xl font-semibold text-center text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                Rating
            </div>
        </div>
    );
};

export default Rating;
