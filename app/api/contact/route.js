import contactSchema from "@/models/contactSchema";
import { connectDB } from "@/config/db";
import { sendEmail } from "@/app/lib/mailer";

/// CREATE CONTACT
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, phone, email, comment } = body;

    /// BASIC VALIDATION
    if (!name || !phone || !email || !comment) {
      return Response.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const newContact = await contactSchema.create({
      name,
      phone,
      email,
      comment,
    });

    /// SEND CONFIRMATION EMAIL
    await sendEmail({
      to: email,
      subject: "We received your message",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
          <h2>Hello ${name},</h2>
          <p>Thank you for contacting us. We have received your message successfully.</p>
          <p>Here is the information you submitted:</p>

          <div style="background: #f4fafa; padding: 16px; border-radius: 10px; margin: 16px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Comment:</strong> ${comment}</p>
          </div>

          <p>Our team will get back to you as soon as possible.</p>
        </div>
      `,
      text: `
Hello ${name},

Thank you for contacting us. We have received your message successfully.

Name: ${name}
Phone: ${phone}
Email: ${email}
Comment: ${comment}
      `,
    });

    return Response.json(
      {
        success: true,
        message: "Contact submitted successfully",
        data: newContact,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message);

      return Response.json(
        { success: false, message: "Validation failed", errors },
        { status: 400 }
      );
    }

    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/// GET ALL CONTACTS WITH PAGINATION
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const total = await contactSchema.countDocuments();
    const data = await contactSchema
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return Response.json(
      {
        success: true,
        data,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/// UPDATE READ STATUS
export async function PATCH(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { id, isRead } = body;

    if (!id) {
      return Response.json(
        { success: false, message: "Contact id is required" },
        { status: 400 }
      );
    }

    const updatedContact = await contactSchema.findByIdAndUpdate(
      id,
      { isRead },
      { new: true }
    );

    if (!updatedContact) {
      return Response.json(
        { success: false, message: "Contact not found" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Read status updated successfully",
        data: updatedContact,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/// DELETE CONTACT BY ID
export async function DELETE(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json(
        { success: false, message: "Contact id is required" },
        { status: 400 }
      );
    }

    const deletedContact = await contactSchema.findByIdAndDelete(id);

    if (!deletedContact) {
      return Response.json(
        { success: false, message: "Contact not found" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Contact deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}