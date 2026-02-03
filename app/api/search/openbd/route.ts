import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isbn = searchParams.get("isbn");
  if (!isbn) {
    return NextResponse.json([null], { status: 200 });
  }

  const url = "https://api.openbd.jp/v1/get?isbn=" + encodeURIComponent(isbn);
  const resp = await fetch(url, { cache: "no-store" });
  const data = await resp.json();
  return NextResponse.json(data, {
    status: 200,
    headers: { "Cache-Control": "no-store" },
  });
}
