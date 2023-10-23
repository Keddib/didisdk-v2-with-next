import axios from "axios";
import { isAxiosError } from "axios";
import { NextResponse } from "next/server";

const handler = async (req: Request,) => {
  if (req.method === "POST") {
  const formData = await req.formData();
  const code = formData.get('code')?.toString() || '';
  const walletSignature = formData.get('wallet_signature')?.toString() || '';

    const auth = Buffer.from(
      `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
    ).toString("base64");

    const headers = {
      Authorization: `Basic ${auth}`,
    };

    const data = {
      code: code,
      grant_type: "https://gamium.world/oauth/grant_types/connectwallet",
      wallet_signature: walletSignature,
    };

    try {
      const token_response = await axios.post(
        process.env.API_URL + "token/",
        data,
        { headers }
      );
      NextResponse.json(token_response.data, { status: token_response.status })
    } catch (error) {
      if (isAxiosError(error)) {
        const errorData = error.response?.data || { message: error.message };
        NextResponse.json(
          errorData,
          { status: error.response?.status || 500 }
        );
      } else {
        NextResponse.json(error, { status: 500 })
      }
    }
  } else {
    NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });
  }
};

export default handler;
