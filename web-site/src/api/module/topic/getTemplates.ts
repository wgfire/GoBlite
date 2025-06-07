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

export interface TopicConfig {
  TopicConfigInfo: {
    content: string;
    h5Title: number;
    langCode: string;
    langName: number;
    id: string;
    topicCode: string;
  };
}

export const getTemplates = () => {
  return fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/topic_config_template_list`);
};

export const getTopicConfig = (id: number) => {
  return fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/topic_config?id=${id}`, {
    method: "GET"
  });
};
