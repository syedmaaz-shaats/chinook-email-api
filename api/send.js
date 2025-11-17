import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Chinook Upholstery <onboarding@resend.dev>",
      to: "info@chinookupholstery.com",
      subject: `📩 New Message from ${name} — Chinook Upholstery`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; padding: 40px;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background-color: #002f61; color: #ffffff; text-align: center; padding: 25px 20px;">
              <h1 style="margin: 0; font-size: 22px; font-weight: 600;">Chinook Upholstery</h1>
              <p style="margin: 5px 0 0; font-size: 14px;">New Contact Form Submission</p>
            </div>

            <!-- Details Box -->
            <div style="padding: 30px 40px;">
              <p style="font-size: 16px; color: #333;">You have received a new message:</p>

              <div style="background-color: #f3f4f6; border-radius: 10px; padding: 20px; margin-bottom: 25px;">
                <p><strong style="color: #002f61;">Name:</strong> ${name}</p>
                <p><strong style="color: #002f61;">Email:</strong> 
                  <a href="mailto:${email}" style="color: #2563eb;">${email}</a>
                </p>
                <p><strong style="color: #002f61;">Phone:</strong> ${phone ? phone : "Not provided"}</p>
              </div>

              <!-- Message -->
              <div style="padding: 20px; border-left: 4px solid #002f61; background-color: #f9fafb;">
                <p style="color: #111827; line-height: 1.6;">
                  ${message.replace(/\n/g, "<br>")}
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #002f61; color: #ffffff; text-align: center; padding: 15px 10px;">
              <p style="margin: 0; font-size: 13px;">© ${new Date().getFullYear()} Chinook Upholstery, Drapery & Flooring Ltd.</p>
            </div>

          </div>
        </div>
      `,
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("❌ Email API Error:", error);
    return res.status(500).json({ error: "Email sending failed" });
  }
}
