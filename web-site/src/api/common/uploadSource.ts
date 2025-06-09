export const uploadSource = (file: File) => {
  return fetch(import.meta.env.VITE_UPLOAD_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      file: file
    })
  });
};
