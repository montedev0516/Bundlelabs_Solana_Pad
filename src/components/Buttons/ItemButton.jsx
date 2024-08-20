const ItemButton = ({label, action, icon}) => {
    return (
        <button
            className="relative flex items-center justify-center px-2 min-h-6 h-auto text-xxs transition ease-in-out transform rounded-[2px] font-medium cursor-pointer active:scale-95 duration-90 bg-gray-highlight text-gray-normal hover:bg-gray-border hover:text-white uppercase"
            onClick={action}>
            {icon}
            {label}
        </button>
    )
}

export default ItemButton