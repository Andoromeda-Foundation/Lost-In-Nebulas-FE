import axios from "axios";
export default class NasID {
    constructor() {
        this.contract = 'n1g3dNR43HN62cT8i72wGt747Z55dBYv1im'
        this.api = 'https://mainnet.nebulas.io'
    }

    async call({
        from, //
        functionName,
        value = '0',
        args = [],
    }) {
        const { contractAddress, api } = this;
        const to = contractAddress;
        const txParams = {
            value,
            nonce: 0,
            gasPrice: '1000000',
            gasLimit: '2000000',
            contract: { function: functionName, args: JSON.stringify(args) },
        };
        const { data } = await axios
            .post(`${api}/v1/user/call`, (Object.assign({ from, to }, txParams)));

        return data.result.result;
    }

    async fetchAccountDetail(address) {
        if (address === null) {
            return null;
        }
        const result = await this.call({ from: address, functionName: 'get' });
        return JSON.parse(result);
    }
}
