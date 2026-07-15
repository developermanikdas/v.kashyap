    import api from "../api/axios";

export const finishDraft = async (draftId) => {
  const response = await api.post(`/drafts/${draftId}/finish`);

  return response.data;
};