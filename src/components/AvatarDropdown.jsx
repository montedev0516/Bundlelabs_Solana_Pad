import { Fragment } from "react";
// import { Link } from "react-router-dom";
import { Popover, Transition } from "@headlessui/react";

export default function AvatarDropdown({ imageUrl, name, address, onLogout, onViewProfile }) {
    return (
        <div className="AvatarDropdown ">
            <Popover className="relative">
                {({ open }) => (
                    <>
                        <Popover.Button className={`inline-flex items-center focus:outline-none focus-visible:ring-opacity-75`}>
                            <img src={imageUrl} alt="avatar" className="inline-block relative object-cover object-center !rounded-full w-8 h-8 cursor-pointer mt-1" />
                        </Popover.Button>
                        <Transition as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1">
                            <Popover.Panel className="absolute z-30 min-w-[170px] px-2 mt-1 right-0 sm:right-0 sm:px-0 text-gray-normal">
                                <div className="overflow-hidden rounded-[4px] shadow-lg">
                                    <div className="relative grid grid-cols-1 px-3 pt-3 pb-1 shadow bg-gray-highlight">
                                        <div className="flex items-center pl-1 space-x-3">
                                            <img src={imageUrl} alt="avatar" className="inline-flex items-center w-8 h-8 rounded-full focus:outline-none focus-visible:ring-white focus-visible:ring-opacity-75" />
                                            <div className="flex-grow">
                                                <h4 className="text-sm font-semibold text-white">{name}</h4>
                                                <p className="text-xs">
                                                    {address ? address.slice(0, 5) + "..." + address.slice(39) : ""}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="w-full mt-3 border-b border-neutral-200 dark:border-neutral-700 opacity-10" />
                                        <button className="mt-2 ml-0 flex items-center h-8 p-2 transition duration-150 ease-in-out hover:bg-[rgba(0,0,0,0.1)] focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                                            onClick={onViewProfile}>
                                            <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                                                <svg
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M12.1601 10.87C12.0601 10.86 11.9401 10.86 11.8301 10.87C9.45006 10.79 7.56006 8.84 7.56006 6.44C7.56006 3.99 9.54006 2 12.0001 2C14.4501 2 16.4401 3.99 16.4401 6.44C16.4301 8.84 14.5401 10.79 12.1601 10.87Z"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round" />
                                                    <path
                                                        d="M7.15997 14.56C4.73997 16.18 4.73997 18.82 7.15997 20.43C9.90997 22.27 14.42 22.27 17.17 20.43C19.59 18.81 19.59 16.17 17.17 14.56C14.43 12.73 9.91997 12.73 7.15997 14.56Z"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <div className="ml-2">
                                                <p className="text-xs font-medium">{"MY PROFILE"}</p>
                                            </div>
                                        </button>
                                        <button className="ml-0 flex items-center h-8 p-2 transition duration-150 ease-in-out hover:bg-[rgba(0,0,0,0.1)] focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                                            onClick={onLogout}>
                                            <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                                                <svg
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M8.90002 7.55999C9.21002 3.95999 11.06 2.48999 15.11 2.48999H15.24C19.71 2.48999 21.5 4.27999 21.5 8.74999V15.27C21.5 19.74 19.71 21.53 15.24 21.53H15.11C11.09 21.53 9.24002 20.08 8.91002 16.54"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round" />
                                                    <path
                                                        d="M15 12H3.62"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round" />
                                                    <path
                                                        d="M5.85 8.6499L2.5 11.9999L5.85 15.3499"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <div className="ml-2">
                                                <p className="text-xs font-medium">{"LOG OUT"}</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </Popover.Panel>
                        </Transition>
                    </>
                )}
            </Popover>
        </div>
    );
}
