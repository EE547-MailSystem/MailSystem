// Interaction with backend
const API_URL = "http://18.224.100.253:8080"
//const API_URL = "http://localhost:3000"
const Authorization_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMSIsInVzZXJuYW1lIjoidXNlciIsImlhdCI6MTc0NjU1ODM4MX0.X3XfAqK_gYTUIAh_9NSgnUfxDSb86lgUt7vwCjuMkw0"

// GET the list of catogory
export const fetchCategories = async () => {
  const response = await fetch(`${API_URL}/categories`, {
    headers: { 'Content-Type': 'application/json', "Authorization": Authorization_key },
  });
  if (!response.ok) throw new Error('Failed to fetch categories');
  return await response.json();
};

// GET all emails of one Category
// export const fetchEmailsByCategory = async (category) => {
//   const endpoint = category === 'all' 
//     ? `${API_URL}/emails/all/preview` 
//     : `${API_URL}/emails/${category}/preview`; 
//   const response = await fetch(endpoint);
//   if (!response.ok) throw new Error(`Failed to fetch ${category} emails`);
//   return await response.json();
// };


// GET all emails of one Category
export const fetchEmailsByCategory = async (category) => {
  const endpoint = category === 'all' 
    ? `${API_URL}/emails/all/preview` 
    : `${API_URL}/emails/${category}/preview`; 
  const response = await fetch(endpoint, {
    headers: { 'Content-Type': 'application/json', "Authorization": Authorization_key },
  });
  const data = await response.json();
  return data.map(email => ({
    ...email,
    tags: normalizeTags(email.tags)
  }));
};

const normalizeTags = (tags) => {
  if (Array.isArray(tags)) {
    return tags;
  }
  if (!tags) {
    return [];
  }
  const tagsString = String(tags).trim();
  if (tagsString.includes(',')) {
    return tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
  }
  if (tagsString.includes('#')) {
    return tagsString.split('#')
      .map(tag => tag.trim())
      .filter(tag => tag && tag !== '#');
  }
  return [tagsString];
};

// GET specific email object by ID
export const fetchEmailById = async (id) => {
  const response = await fetch(`${API_URL}/emails/${id}`, {
    headers: { 'Content-Type': 'application/json', "Authorization": Authorization_key },
  });
  if (!response.ok) throw new Error('Email not found');
  const email = await response.json();
  return {
    ...email,
    tags: normalizeTags(email.tags)
  };
};

// POST updated importance prompt
export const updateImportancePrompt = async (prompt) => {
  const response = await fetch(`${API_URL}/prompt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', "Authorization": Authorization_key },
    body: JSON.stringify({ user_prompt: prompt })
  });
  if (!response.ok) throw new Error('Failed to update prompt');
  return await response.json();
};

// POST user defined category
export const addNewCategories = async (categories) => {
  const response = await fetch(`${API_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', "Authorization": Authorization_key },
    body: JSON.stringify({ newAdd_categories: categories })
  });
  if (!response.ok) throw new Error('Failed to add categories');
  return await response.json();
};

// POST urgent status
export const updateUrgentStatus = async (emailId, urgentStatus) => {
  const response = await fetch(`${API_URL}/urgentStatus`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', "Authorization": Authorization_key },
    body: JSON.stringify({ 
      email_id: emailId,
      urgent_status: urgentStatus 
    })
  });
  if (!response.ok) throw new Error('Failed to update status');
  return await response.json();
};

// POST read status
export const updateReadStatus = async (emailId, readStatus) => {
  const response = await fetch(`${API_URL}/readStatus`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', "Authorization": Authorization_key },
    body: JSON.stringify({ 
      email_id: emailId,
      read_status: readStatus 
    })
  });
  if (!response.ok) throw new Error('Failed to update status');
  return await response.json();
};