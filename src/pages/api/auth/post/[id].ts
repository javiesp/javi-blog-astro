import type { APIRoute } from "astro";
import { app } from "@/firebase/server";
import { getFirestore } from "firebase-admin/firestore";

const db = getFirestore(app);
const postsRef = db.collection("posts");

//**
// Methods to fetch, update and delete
//  */
export const POST: APIRoute = async ({ params, request, redirect }) => {
  if (!params.id) {
    return new Response("Cannot find post", { status: 404 });
  }

  const formData = await request.formData();

  const title = formData.get("title")?.toString();
  const content_markdown = formData.get("content_markdown")?.toString();

  const images = formData.getAll("images").map((i) => i.toString());
  const tags = formData.getAll("tags").map((t) => t.toString());

  if (!title || !content_markdown) {
    return new Response("Missing required fields", { status: 400 });
  }

  try {
    await postsRef.doc(params.id).update({
      title,
      content_markdown,
      images,
      tags,
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    return new Response("Something went wrong", { status: 500 });
  }

  return redirect("/dashboard");
};

export const DELETE: APIRoute = async ({ params, redirect }) => {
  if (!params.id) {
    return new Response("Cannot find post", { status: 404 });
  }

  try {
    await postsRef.doc(params.id).delete();
  } catch (error) {
    return new Response("Something went wrong", { status: 500 });
  }

  return redirect("/dashboard");
};