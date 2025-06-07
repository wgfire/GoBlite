export const uploadSource = (file: File) => {
  return fetch("https://demo-resource.mistorebox.com/api/op/resource/v1/file/upload-zip", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      file: file
    })
  });
};
