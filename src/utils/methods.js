import bs58 from "bs58";

export const numberWithCommas = (x, digits = 3) => {
    return parseFloat(x).toLocaleString(undefined, { maximumFractionDigits: digits });
};

export const ellipsisAddress = (address) => {
    return address?.toString()?.slice(0, 9) + "..." + address?.toString()?.slice(-9);
}

export const isValidAddress = (addr) => {
    try {
        const decodedAddr = bs58.decode(addr);
        if (decodedAddr.length !== 32)
            return false;
        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
};

export const formatNumber = (number) => {
    let suffix = '';
    let formattedNumber = number;

    if (number >= 1e6) {
        suffix = 'M';
        formattedNumber = number / 1e6;
    }
    else if (number >= 1e3) {
        suffix = 'k';
        formattedNumber = number / 1e3;
    }
    return (formattedNumber && formattedNumber > 0) ? `${parseFloat(formattedNumber)?.toFixed(2)}${suffix}` : 0;
}
