export interface Templates {
  id: number;
  name: string;
  templateList: {
    content: string;
    id: number;
    name: string;
    typeId: number;
  }[];
}

export const getTemplates = () => {
  return fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/topic_config_template_list`);
};
