import { FaTrash } from "react-icons/fa";
import { IoIosRefresh } from "react-icons/io";
import NormalButton from "../../components/Buttons/NormalButton";
import ItemButton from "../../components/Buttons/ItemButton";

const UserSection = ({ role, users, isFullAdmin, onHandleRefresh, onHandleDeleteUser }) => {

    if (role !== 'admin') {
        return null
    }

    return (
        <div className="mt-6">
            <div className="flex items-center justify-between w-full h-auto mb-2 text-xs font-medium text-white uppercase">
                <div className="text-base">
                    All Users
                </div>
                <NormalButton label="Refresh" action={() => onHandleRefresh()} icon={<IoIosRefresh className="text-lg text-green-normal" />} />
            </div>
            <div className="relative flex flex-col w-full h-full overflow-x-hidden text-white bg-transparent border border-gray-highlight rounded-lg">
                <table className="w-full font-sans text-xs">
                    <thead className=" text-gray-normal">
                        <tr className="uppercase bg-[#1A1A37] sticky top-0 z-10 h-8">
                            <th className="w-8">
                                <p className="leading-none text-center">
                                    #
                                </p>
                            </th>
                            <th className="">
                                <p className="leading-none text-center">
                                    Name
                                </p>
                            </th>
                            <th className="">
                                <p className="leading-none text-center">
                                    Role
                                </p>
                            </th>
                            <th className="">
                                <p className="leading-none text-center">
                                    Telegram ID
                                </p>
                            </th>
                            <th className="">
                                <p className="leading-none text-center">
                                    Code
                                </p>
                            </th>
                            <th className="">
                                <p className="leading-none text-center">
                                    Referral
                                </p>
                            </th>
                            <th className="">
                                <p className="leading-none text-center">
                                    Action
                                </p>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-xs text-gray-normal">
                        {
                            users.map((item, index) => {
                                return (
                                    <tr key={index}
                                        className={`${index % 2 === 1 && "bg-[#ffffff02]"} hover:bg-[#ffffff05] h-8`}
                                    >
                                        <td className="text-center">
                                            {index + 1}
                                        </td>
                                        <td className="text-center text-white">
                                            {item.name}
                                        </td>
                                        <td className="text-center">
                                            {item.role}
                                        </td>
                                        <td className="text-center">
                                            {item.telegramID}
                                        </td>
                                        <td className="text-center">
                                            {item.code}
                                        </td>
                                        <td className="text-center">
                                            {item.referral}
                                        </td>
                                        <td className="text-center">
                                            {
                                                isFullAdmin &&
                                                <div className="flex justify-center gap-2">
                                                    <ItemButton label="Delete" action={() => onHandleDeleteUser(item)} icon={<FaTrash className="mr-2 text-green-normal" />} />
                                                </div>
                                            }
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
                {
                    (users.length === 0) &&
                    (
                        <div className="my-3 text-sm font-bold text-center text-gray-700 uppercase">
                            No User
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default UserSection