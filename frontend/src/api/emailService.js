// Interation with backend
const API_URL = "http://localhost:3000";
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
    const response = await fetch(endpoint,{
    headers: { 'Content-Type': 'application/json', "Authorization": Authorization_key },
  });
    //if (!response.ok) throw new Error(`Failed to fetch ${category} emails`);
    //return await response.json();
    const data = await response.json();
    return data.map(email => ({
      ...email,
      tags: Array.isArray(email.tags) ? email.tags : 
            email.tags ? [email.tags] : []
    }));
  };


// GET specific email object by ID
export const fetchEmailById = async (id) => {
  const response = await fetch(`${API_URL}/emails/${id}`, {
    headers: { 'Content-Type': 'application/json', "Authorization": Authorization_key },
  });
  if (!response.ok) throw new Error('Email not found');
  return await response.json();
};

// POST updated importance prompt
export const updateImportancePrompt = async (prompt) => {
  const response = await fetch(`${API_URL}/prompt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_prompt: prompt }),
    headers: { 'Content-Type': 'application/json', "Authorization": Authorization_key },
  });
  if (!response.ok) throw new Error('Failed to update prompt');
  return await response.json();
};

// POST user defined category
export const addNewCategories = async (categories) => {
  const response = await fetch(`${API_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ newAdd_categories: categories }),
    headers: { 'Content-Type': 'application/json', "Authorization": Authorization_key },
  });
  if (!response.ok) throw new Error('Failed to add categories');
  return await response.json();
};

// POST urgent status
export const updateUrgentStatus = async (emailId, urgentStatus) => {
  const response = await fetch(`${API_URL}/urgentStatus`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      email_id: emailId,
      urgent_status: urgentStatus 
    }),
    headers: { 'Content-Type': 'application/json', "Authorization": Authorization_key },
  });
  if (!response.ok) throw new Error('Failed to update status');
  return await response.json();
};
