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
  return fetch("https://demo-admin.mitrade.com/mt-activity-service/admin/topic_config_template_list");
};
