import { Select } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'

const DropDownSelect = ({title, required = true, options, handleChage}) => {
    
    const onHandleChage = (e) => {
        handleChage(e.target.value)
    }

    return (
        <div className="mt-4">
            <div className="font-sans text-xs uppercase text-gray-normal">
                {title}<span className="pl-1 text-green-normal">*</span>
            </div>
            <div className="relative">
                <Select
                    className={clsx(
                    'mt-1 block w-full appearance-none border border-gray-border bg-transparent py-1.5 px-3 text-sm/6 font-sans text-white',
                    'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25 data-[focus]:bg-transparent',
                    )}
                    onChange={onHandleChage}
                >
                    {options.map((option, index) => {
                        return (
                            <option value={option.toLowerCase()} className="bg-gray-highlight text-white" key={option}>{option}</option>
                        )
                    })}
                </Select>
                <ChevronDownIcon
                    className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
                    aria-hidden="true"
                />
            </div>
        </div>
    )
}

export default DropDownSelect