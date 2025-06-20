import { useState, useCallback } from "react";
import { CrowdinConfig } from "../config";
import { defaultConfig } from "../config";
import { CrowdinService } from "../service";

export const useCrowdinLanguages = (config: CrowdinConfig = defaultConfig) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [languages, setLanguages] = useState<any[]>([]);

  const crowdinService = new CrowdinService(config);

  /**
   * 加载语言列表
   */
  const loadLanguages = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await crowdinService.getProjectLanguages();
      setLanguages(result);
      return result;
    } catch (error) {
      setError(error as Error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [crowdinService]);

  return {
    loadLanguages,
    isLoading,
    error,
    languages
  };
};
