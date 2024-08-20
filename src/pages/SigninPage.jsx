import { useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { IoIosExit } from "react-icons/io";
import { AppContext } from "../providers/AppContext";


export default function SigninPage() {
    const { SERVER_URL, setLoadingPrompt, setOpenLoading, setUser } = useContext(AppContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const name = e.target[0].value;
        const password = e.target[1].value;
        if (name === "") {
            toast.warn("Please input user name");
            return;
        }

        if (password === "") {
            toast.warn("Please input password");
            return;
        }

        setLoadingPrompt("Logging in...");
        setOpenLoading(true);
        try {
            const { data } = await axios.post(`${SERVER_URL}/api/v1/user/login`,
                {
                    name,
                    password,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (data.success) {
                localStorage.setItem("access-token", data.accessToken);
                setUser(data.user);
            }
            else
                toast.warn("Failed to register");
        }
        catch (err) {
            console.log(err);
            setOpenLoading(false);
            toast.warn("Failed to login");
        }
    };

    return (
        <div className={`flex items-center justify-center min-h-screen bg-black-light font-sans pb-7`}>
            <div className="relative max-sm:w-[450px] m-6 max-w-[500px] w-full">
                <IoIosExit className="text-[50px] text-green-normal mb-1 mx-auto" />
                <h2 className="text-lg font-bold text-white uppercase text-center">Login</h2>
                <p className="mb-5 text-sm text-gray-normal text-center">Enter your name and password to login</p>
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="">
                        <div className=" font-sans text-xs uppercase text-gray-normal">
                            Name<span className="pl-1 text-green-normal">*</span>
                        </div>
                        <input
                            id="name"
                            className="outline-none border border-gray-border font-sans text-white placeholder:text-gray-border text-sm px-2.5 bg-transparent w-full h-button mt-1 rounded-lg focus:border-green-normal"
                            placeholder="Enter your name"
                        />
                    </div>
                    <div className="">
                        <div className=" font-sans text-xs uppercase text-gray-normal">
                            Password<span className="pl-1 text-green-normal">*</span>
                        </div>
                        <input
                            id="password"
                            type="password"
                            className="outline-none border border-gray-border font-sans text-white placeholder:text-gray-border text-sm px-2.5 bg-transparent w-full h-button mt-1 rounded-lg focus:border-green-normal"
                            placeholder="Enter your password"
                        />
                    </div>
                    <div className="flex justify-center w-full gap-2">
                        <button
                            type="submit"
                            className=" font-sans text-xs font-medium text-center text-white uppercase px-6 h-10 rounded-[4px] justify-center items-center gap-2.5 inline-flex bg-green-normal active:scale-95 transition duration-90 ease-in-out transform focus:outline-none w-full"
                        >
                            Login
                        </button>
                    </div>
                </form>
                <div className="flex items-center justify-between mt-3 text-sm text-gray-normal">
                    <p>
                        Don't have an account?&nbsp;
                        <Link to="/register" className="text-green-normal hover:underline">
                            Register
                        </Link>
                    </p>
                    <p>
                        Go to &nbsp;
                        <Link to="/" className="text-green-normal hover:underline">
                            Home
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
