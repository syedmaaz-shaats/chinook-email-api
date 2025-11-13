import express from "express";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();
const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(express.json());

// POST route
app.post("/send-message", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const data = await resend.emails.send({
      from: "Chinook Upholstery <onboarding@resend.dev>",
      to: "info@chinookupholstery.com",
      subject: `📩 New Message from ${name} — Chinook Upholstery`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; padding: 40px;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <div style="background-color: #002f61; color: #ffffff; text-align: center; padding: 25px 20px;">
              <h1 style="margin: 0; font-size: 22px; font-weight: 600;">Chinook Upholstery</h1>
              <p style="margin: 5px 0 0; font-size: 14px; letter-spacing: 0.5px;">New Contact Form Submission</p>
            </div>
            <div style="padding: 30px 40px;">
              <p style="font-size: 16px; color: #333333; margin-bottom: 15px;">You have received a new message:</p>
              <div style="background-color: #f3f4f6; border-radius: 10px; padding: 20px; margin-bottom: 25px;">
                <p style="margin: 0; font-size: 15px;"><strong style="color: #002f61;">Name:</strong> ${name}</p>
                <p style="margin: 8px 0 0; font-size: 15px;"><strong style="color: #002f61;">Email:</strong> <a href="mailto:${email}" style="color: #2563eb;">${email}</a></p>
              </div>
              <div style="padding: 20px; border-left: 4px solid #002f61; background-color: #f9fafb; border-radius: 6px;">
                <p style="font-size: 15px; color: #111827; margin: 0; line-height: 1.6;">${message.replace(/\n/g, "<br>")}</p>
              </div>
              <p style="margin-top: 25px; font-size: 13px; color: #6b7280;">This message was sent from the Chinook Upholstery website contact form.</p>
            </div>
            <div style="background-color: #002f61; color: #ffffff; text-align: center; padding: 15px 10px;">
              <p style="margin: 0; font-size: 13px;">© ${new Date().getFullYear()} Chinook Upholstery, Drapery & Flooring Ltd.</p>
            </div>
          </div>
        </div>
      `,
    });

    console.log("✅ Email sent:", data);
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Email send error:", error);
    res.status(500).json({ error: "Failed to send message." });
  }
});

// Start server
app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
