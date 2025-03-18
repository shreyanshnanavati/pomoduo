export async function GET(request: Request) {
  // Parse the request body
  
  // e.g. Insert new user into your DB
  // const newUser = { id: Date.now(), name };
 
  return new Response(JSON.stringify({"hello":"world"}), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  });
}