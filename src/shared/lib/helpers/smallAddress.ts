export function smallAddress(address: string | undefined, sliceLength: number = 5) {
    if (!address) {
        return "";
    }

    if (address.endsWith(".ton") || address.endsWith(".me") || address.endsWith(".t.me")) {
        return address;
    }

    const start = address.slice(0, sliceLength);
    const end = address.slice(-sliceLength);

    return `${start}...${end}`;
}
