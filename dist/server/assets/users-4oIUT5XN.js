async function GET({
  request
}) {
  try {
    const users = [{
      id: "1",
      email: "user1@example.com",
      role: "user",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    }, {
      id: "2",
      email: "admin@example.com",
      role: "admin",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    }];
    return new Response(JSON.stringify({
      users
    }), {
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: "Failed to fetch users"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}
async function DELETE({
  request
}) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    if (!userId) {
      return new Response(JSON.stringify({
        error: "User ID required"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    return new Response(JSON.stringify({
      success: true
    }), {
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: "Failed to delete user"
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
  DELETE,
  GET,
  SplitComponent as component
};
