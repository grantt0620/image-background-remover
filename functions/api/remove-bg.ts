export async function onRequestPost(context: any) {
  const { request, env } = context;
  
  const apiKey = env.REMOVE_BG_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const formData = await request.formData();
  const image = formData.get('image');
  
  if (!image) {
    return new Response(JSON.stringify({ error: 'No image provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const bgForm = new FormData();
  bgForm.append('image_file', image);
  bgForm.append('size', 'auto');

  const bgRes = await fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: { 'X-Api-Key': apiKey },
    body: bgForm,
  });

  if (!bgRes.ok) {
    return new Response(JSON.stringify({ error: 'Remove.bg error' }), {
      status: bgRes.status,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const resultBuffer = await bgRes.arrayBuffer();
  return new Response(resultBuffer, {
    status: 200,
    headers: { 'Content-Type': 'image/png' }
  });
}
