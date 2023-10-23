import axios from "axios";
import { isAxiosError } from "axios";
import { NextResponse } from "next/server";

const handler = async (req : Request) => {
  if (req.method === "POST") {
    const formData = await req.formData();
    const wallet_address = formData.get("wallet_address")?.toString() || "";
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
      const wallet_authorization_response = await axios.post(
        process.env.API_URL + "wallet-authorization/",
        data,
        { headers }
      );
      NextResponse.json(wallet_authorization_response.data, { status: wallet_authorization_response.status })
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
