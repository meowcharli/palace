// app/api/draft-mode/disable/route.ts
import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  // Need to await the promise returned by draftMode()
  await (await draftMode()).disable();
  return NextResponse.json({ disabled: true });
}