import { Magic } from '@magic-sdk/admin';
// import useSendError from '../../../components/Functions/useSendError';
// import runMiddleware from '../../../lib/corsMiddleWare'

// Initiating Magic instance for server-side methods

const customNodeOptions = {
  rpcUrl: 'https://rpc-mainnet.maticvigil.com/', // Your own node URL
  chainId: 137, // Your own node's chainId
};
// const customNodeOptions = {
//   rpcUrl: 'https://rpc-mumbai.matic.today/', // Polygon RPC URL
//   chainId: 80001, // Polygon chain id
// };


// Setting network to localhost blockchain
const magic = new Magic('pk_live_62358854AD91AD07', {
  network: customNodeOptions,
});



export default async function login(req, res) {
  // await runMiddleware(req, res, req.headers.referer ?? req.headers.origin)
  
  try {
    const didToken = req.headers.authorization.substr(7);
    await magic.token.validate(didToken);

    res.status(200).json({ authenticated: true, });
  } catch (error) {
    // useSendError('N/A', req.url, JSON.stringify(error), JSON.stringify(req.body))
    res.status(500).json({ error: error.message });
  }
}
