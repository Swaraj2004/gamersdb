"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

const ProgressBarProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            {children}
            <ProgressBar
                height="2px"
                color="#585DEC"
                options={{ showSpinner: false, speed: 500 }}
                shallowRouting
            />
        </>
    );
};

export default ProgressBarProvider;
