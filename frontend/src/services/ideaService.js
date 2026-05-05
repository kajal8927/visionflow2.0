import api from "./api.js";

export const submitIdeaApi = async (formData) => {
  try {
    const response = await api.post("/ideas", formData);
    return {
      success: true,
      idea: response.data?.idea || response.data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to submit idea. Please try again.",
    };
  }
};

export const getMyIdeasApi = async () => {
  try {
    const response = await api.get("/ideas/my");
    return {
      success: true,
      ideas: response.data?.ideas || response.data || [],
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to load ideas.",
      ideas: [],
    };
  }
};

export const getIdeaByIdApi = async (id) => {
  const response = await api.get(`/ideas/${id}`);
  return response.data;
};

export const aiCompareIdeasApi = async () => {
  try {
    const response = await api.post("/ideas/ai-compare");
    return {
      success: true,
      ideas: response.data?.ideas || [],
      message: response.data?.message || "AI comparison completed.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "AI comparison failed. Please try again.",
    };
  }
};

export const downloadIdeaReportApi = async (id) => {
  try {
    const response = await api.get(`/ideas/${id}/report`, {
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;

    const contentDisposition = response.headers["content-disposition"];
    let filename = `IdeaReport-${id}.pdf`;

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
      if (filenameMatch && filenameMatch.length === 2) {
        filename = filenameMatch[1];
      }
    }

    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error("Download report error:", error);
    return {
      success: false,
      message: "Failed to download report.",
    };
  }
};

 