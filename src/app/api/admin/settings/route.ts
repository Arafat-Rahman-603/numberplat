import { NextRequest, NextResponse } from "next/server";
import { getSettings, updateSettings } from "@/lib/db";

export async function GET() {
  const settings = getSettings();
  return NextResponse.json({ success: true, settings });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = updateSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "সেটিংস আপডেট করতে সমস্যা হয়েছে" },
      { status: 500 }
    );
  }
}

