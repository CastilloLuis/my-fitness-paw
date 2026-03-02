import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { subject, message } = await request.json();

    if (!subject || !message) {
      return NextResponse.json(
        { error: "Subject and message are required" },
        { status: 400 },
      );
    }

    if (subject.length > 200 || message.length > 5000) {
      return NextResponse.json(
        { error: "Subject or message too long" },
        { status: 400 },
      );
    }

    await resend.emails.send({
      from: "MyFitnessPaw <noreply@myfitnesspaw.app>",
      to: "kasti.eth@gmail.com",
      subject: `[Contact] ${subject}`,
      text: message,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
