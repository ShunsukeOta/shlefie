import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  if (!q) {
    return NextResponse.json({ items: [] }, { status: 200 });
  }

  const queries = [
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
      q
    )}&printType=books&maxResults=6&langRestrict=ja`,
    `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(
      q
    )}&printType=books&maxResults=6&langRestrict=ja`,
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
      q
    )}&printType=books&maxResults=6`,
    `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(
      q
    )}&printType=books&maxResults=6`,
  ];

  let data: any = { items: [], totalItems: 0 };
  for (const url of queries) {
    const resp = await fetch(url, { cache: "no-store" });
    data = await resp.json();
    if (Array.isArray(data.items) && data.items.length > 0) {
      break;
    }
  }

  return NextResponse.json(data, {
    status: 200,
    headers: { "Cache-Control": "no-store" },
  });
}
