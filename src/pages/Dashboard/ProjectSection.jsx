import { FaCheck, FaEye, FaRegCopy, FaTrash } from "react-icons/fa";
import NormalButton from "../../components/Buttons/NormalButton";
import ItemButton from "../../components/Buttons/ItemButton";
import { ellipsisAddress } from "../../utils/methods";
import { IoIosAdd, IoIosRefresh } from "react-icons/io";
import { useState } from "react";
import { toast } from "react-toastify";

const ProjectSection = ({ role, projects, isFullAdmin, onHandleNewProject, onHandleLoadAllProjects, onHandleActivateProject, onHandleViewProject, onHandleDeleteProject }) => {
    const [copied, setCopied] = useState({});

    const copyToClipboard = async (key, text) => {
        if ('clipboard' in navigator) {
            await navigator.clipboard.writeText(text);
            toast.success("Copied");
            setCopied({
                ...copied,
                [key]: true,
            });
            setTimeout(() => setCopied({
                ...copied,
                [key]: false,
            }), 2000);
        }
        else
            console.error('Clipboard not supported');
    };

    return (
        <div className="mt-6">
            <div className="flex items-center justify-between w-full h-auto mb-2 text-xs font-medium text-white uppercase">
                <div className="text-base">
                    {role === "admin" ? "All Projects" : "My Projects"}
                </div>
                <div className="flex items-center gap-2">
                    {role !== "admin" && <NormalButton label="New" action={() => onHandleNewProject()} icon={<IoIosAdd className="text-lg text-green-normal" />} />}
                    <NormalButton label="Refresh" action={() => onHandleLoadAllProjects()} icon={<IoIosRefresh className="text-lg text-green-normal" />} />
                </div>
            </div>
            <div className="relative flex flex-col w-full h-full overflow-x-hidden text-white bg-transparent border border-gray-highlight rounded-lg">
                <table className="w-full font-sans text-xs">
                    <thead className=" text-gray-normal">
                        <tr className="uppercase bg-[#1A1A37] sticky top-0 z-10 h-8">
                            <th className="w-8">
                                #
                            </th>
                            {
                                role === "admin" &&
                                (
                                    <th className="">
                                        User Name
                                    </th>
                                )
                            }
                            <th className="">
                                {role === "admin" ? "Project Name" : "Name"}
                            </th>
                            <th className="">
                                {role === "admin" ? "Project Type" : "Type"}
                            </th>
                            <th className="">
                                Platform
                            </th>
                            {
                                role === "admin" &&
                                (
                                    <th className="">
                                        Fee Wallet
                                    </th>
                                )
                            }
                            <th className="">
                                Status
                            </th>
                            <th className="w-[20%]">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-xs text-gray-normal">
                        {
                            projects.map((item, index) => {
                                return (
                                    <tr key={index} className={`${index % 2 === 1 && "bg-[#ffffff02]"} hover:bg-[#ffffff05] h-8`}>
                                        <td className="text-center">
                                            {index + 1}
                                        </td>
                                        {
                                            role === "admin" &&
                                            (
                                                <td className="text-center">
                                                    {item.userName}
                                                </td>
                                            )
                                        }
                                        <td className="text-center text-white">
                                            {item.name}
                                        </td>
                                        <td className="text-center text-white">
                                            {item.type}
                                        </td>
                                        <td className="text-center text-white">
                                            {item.platform}
                                        </td>
                                        {
                                            role === "admin" &&
                                            (
                                                <td className="text-center">
                                                    <div className="flex items-center justify-center gap-1 font-sans antialiased font-normal leading-normal text-gray-normal">
                                                        <p className="bg-transparent border-none outline-none">
                                                            {(item.depositWallet && item.depositWallet.address) ? ellipsisAddress(item.depositWallet.address, 12) : ""}
                                                        </p>
                                                        {
                                                            (item.depositWallet && item.depositWallet.address) &&
                                                            (
                                                                copied["fee_wallet_" + index] ?
                                                                    (<svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                    </svg>) :
                                                                    (<FaRegCopy className="w-3 h-3 transition ease-in-out transform cursor-pointer active:scale-95 duration-90" onClick={() => copyToClipboard("fee_wallet_" + index, item.depositWallet.address)} />)
                                                            )
                                                        }
                                                    </div>
                                                </td>
                                            )
                                        }
                                        <td className="text-center">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${(() => {
                                                    switch (item.status) {
                                                        case "INIT":
                                                            return "bg-white";
                                                        case "EXPIRED":
                                                            return "bg-gray-normal";
                                                        case "PURCHASE":
                                                        case "TRADE":
                                                            return "bg-green-normal";
                                                        default:
                                                            return "bg-green-normal";
                                                    }
                                                })()}`}></div>
                                                {item.status}
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <div className="flex justify-center gap-1">
                                                {
                                                    (item.status === "INIT" || item.status === "EXPIRED") ?
                                                        (
                                                            <ItemButton label="Activate" action={() => onHandleActivateProject(item)} icon={<FaCheck className="mr-2 text-green-normal" />} />
                                                        ) :
                                                        (
                                                            ((role === "admin" && isFullAdmin) || role !== "admin") &&
                                                            <ItemButton label="Go to project" action={() => onHandleViewProject(item)} icon={<FaEye className="mr-2 text-green-normal" />} />
                                                        )
                                                }
                                                {
                                                    ((role === "admin" && isFullAdmin) || role !== "admin") &&
                                                    <ItemButton label="Delete" action={() => onHandleDeleteProject(item)} icon={<FaTrash className="mr-2 text-green-normal" />} />
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
                {
                    (projects.length === 0) &&
                    (
                        <div className="my-3 text-sm font-bold text-center text-gray-700 uppercase">
                            No Project
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default ProjectSection