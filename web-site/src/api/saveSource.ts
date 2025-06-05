export interface SaveSourceParams {
  id: number;
  content: string;
  zipPath: string;
}

export const saveSource = (data: SaveSourceParams) => {
  return fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/topic_config_template_update`, {
    method: "POST",
    body: JSON.stringify(data)
  });
};
