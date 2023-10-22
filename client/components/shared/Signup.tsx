"use client";

import SignupForm from "@/components/shared/SignupForm";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

const Signup = () => {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild className="my-auto mr-2">
                <Button variant="outline" className="rounded-full">
                    Sign up
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[320px] rounded-lg sm:max-w-[400px]">
                <DialogHeader className="mb-3">
                    <DialogTitle className="text-center font-semibold text-xl">
                        Sign up
                    </DialogTitle>
                    <DialogDescription className="pt-2">
                        Username should contain only letters, numbers, and
                        underscores.
                    </DialogDescription>
                </DialogHeader>
                <SignupForm setOpen={setOpen} />
            </DialogContent>
        </Dialog>
    );
};

export default Signup;
