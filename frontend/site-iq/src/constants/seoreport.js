export const SEO_REPORT_API = {
  GENERATE: '/seoreports/generate',
  DELETE: (jid) => `/seoreports/delete/${jid}`,
  RETURN: (jid) => `/seoreports/return/${jid}`,
  GET_WEBSITE: (websiteId) => `/seoreports/websites/${websiteId}`,
  DELETE_PHRASE: (websiteId, phrase) => `/seoreports/delete/${websiteId}/${phrase}`
};

export const LIGHTHOUSE_API = {
  ANALYZE: '/lighthouse/analyze',
  GET_ALL: '/lighthouse',
  GET_ONE: (id) => `/lighthouse/${id}`,
  UPDATE: (id) => `/lighthouse/${id}`,
  DELETE: (id) => `/lighthouse/${id}`,
};
