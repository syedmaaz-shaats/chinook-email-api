import { Resend } from "resend";
import Busboy from "busboy";

export const config = {
  api: {
    bodyParser: false, // required for file uploads
  },
};

export default async function handler(req, res) {
  // ---------------------------
  // CORS
  // ---------------------------
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const fields = {};
    const attachments = [];

    // ---------------------------
    // Parse form using Busboy
    // ---------------------------
    await new Promise((resolve, reject) => {
      const busboy = Busboy({ headers: req.headers });

      // text fields
      busboy.on("field", (name, value) => {
        fields[name] = value;
      });

      // file upload
      busboy.on("file", (name, file, info) => {
        const { filename, encoding, mimeType } = info;

        let buffer = Buffer.alloc(0);

        file.on("data", (data) => {
          buffer = Buffer.concat([buffer, data]);
        });

        file.on("end", () => {
          attachments.push({
            filename,
            content: buffer.toString("base64"),
          });
        });
      });

      busboy.on("finish", () => resolve());
      busboy.on("error", (err) => reject(err));

      req.pipe(busboy);
    });

    const { name, email, phone, message } = fields;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ---------------------------
    // SEND EMAIL
    // ---------------------------
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Chinook Upholstery <onboarding@resend.dev>",
      to: "maaz582ss@gmail.com", //info@chinookupholstery.com
      subject: `📩 New Message from ${name} — Chinook Upholstery`,
      html: `
        <div style="font-family: Arial; background-color: #f8fafc; padding: 40px;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden;">

            <div style="background-color: #002f61; color: #fff; text-align: center; padding: 25px;">
              <h1 style="margin: 0;">Chinook Upholstery</h1>
              <p>New Contact Form Submission</p>
            </div>

            <div style="padding: 30px;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
              <p><strong>Message:</strong></p>
              <div style="background:#f3f4f6; padding:15px; border-radius:8px;">
                ${message.replace(/\n/g, "<br>")}
              </div>
            </div>

            <div style="background:#002f61; color:#fff; text-align:center; padding: 15px;">
              <p>© ${new Date().getFullYear()} Chinook Upholstery</p>
            </div>

          </div>
        </div>
      `,
      attachments,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Email API Error:", err);
    return res.status(500).json({ error: "Email sending failed" });
  }
}
