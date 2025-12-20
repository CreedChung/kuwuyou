import { z } from "zod";
z.object({
  file: z.any()
});
async function POST({
  request
}) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file) {
      return new Response(JSON.stringify({
        error: "No file provided"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    const text = await file.text();
    return new Response(JSON.stringify({
      success: true,
      content: text,
      filename: file.name
    }), {
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: "File parsing failed"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}
const SplitComponent = () => null;
export {
  POST,
  SplitComponent as component
};
