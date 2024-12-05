const ipfsGateway = "https://ipfs.io/ipfs/";

export const convertIpfsUriToHttp = (ipfsUri: string): string => {
    return ipfsUri.replace("ipfs://", ipfsGateway);
};
