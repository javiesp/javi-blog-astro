import type { APIRoute } from "astro";
import { app } from "@/firebase/server";
import { getFirestore } from "firebase-admin/firestore";

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();

  const title = formData.get("title")?.toString();
  const content = formData.get("content_markdown")?.toString();

  const images = formData.getAll("images").map((i) => i.toString());

  const tags = formData.getAll("tags").map((t) => t.toString());

  if (!title || !content) {
    return new Response("Missing required fields", { status: 400 });
  }

  const db = getFirestore(app);

  try {
    await db.collection("posts").add({
      title,
      content_markdown: content,
      images,
      tags,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    return new Response("Something went wrong", { status: 500 });
  }

  return redirect("/dashboard");
};