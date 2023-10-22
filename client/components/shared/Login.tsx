import LoginForm from "@/components/shared/LoginForm";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const Login = () => {
    return (
        <Dialog>
            <DialogTrigger asChild className="my-auto">
                <Button variant="secondary" className="rounded-full">
                    Login
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[320px] rounded-lg sm:max-w-[400px]">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-center font-semibold text-xl">
                        Log in
                    </DialogTitle>
                </DialogHeader>
                <LoginForm />
            </DialogContent>
        </Dialog>
    );
};

export default Login;
