import axios from "axios";
import { isAxiosError } from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest,res: NextApiResponse) => {
  if (req.method === "POST") {
    const {wallet_address} = await req.body;
    const scope = process.env.NEXT_PUBLIC_DIDIT_SCOPE;
    const claims = process.env.NEXT_PUBLIC_DIDIT_CLAIMS;

    const auth = Buffer.from(
      `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
    ).toString("base64");

    const headers = {
      Authorization: `Basic ${auth}`,
    };

    const data = {
      scope,
      wallet_address,
      claims,
    };

    try {
      const url = process.env.API_URL + "wallet-authorization/";
      console.log('url->', url);
      const wallet_authorization_response = await axios.post(
        url,
        data,
        { headers }
      );
      res.status(wallet_authorization_response.status).json(wallet_authorization_response.data);
    } catch (error) {
      if (isAxiosError(error)) {
        console.log('auth error->', error.response?.data);
        const errorData = error.response?.data || { message: error.message };
        res.status(error.response?.status || 500).json({ message: errorData });
      } else {
        console.log('auth error->2', error);
        res.status(500).json({ message: error });
      }
    }
  } else {
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
};

export default handler;
