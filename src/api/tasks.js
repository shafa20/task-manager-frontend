import axios from 'axios';

const API_URL = 'http://localhost:8000/api/tasks';

export const getTasks = async (page = 1, paginated = true, status = '', search = '') => {
  let url = API_URL;
  const params = [];
  if (paginated) {
    params.push(`page=${page}`);
  }
  if (status) {
    params.push(`status=${encodeURIComponent(status)}`);
  }
  if (search) {
    params.push(`search=${encodeURIComponent(search)}`);
  }
  if (params.length > 0) {
    url += '?' + params.join('&');
  }
  const res = await axios.get(url);
  // Handle Laravel's default pagination (pagination info at root)
  if (paginated && res.data && res.data.data && res.data.current_page) {
    return {
      tasks: res.data.data,
      meta: {
        current_page: res.data.current_page,
        last_page: res.data.last_page,
        per_page: res.data.per_page,
        total: res.data.total,
      },
      links: res.data.links
    };
  }
  // If paginated, return {tasks, meta, links} (meta object style)
  if (paginated && res.data && res.data.data && res.data.meta) {
    return {
      tasks: res.data.data,
      meta: res.data.meta,
      links: res.data.links
    };
  }
  // Fallback for non-paginated
  if (Array.isArray(res.data)) return { tasks: res.data, meta: null, links: null };
  if (Array.isArray(res.data.data)) return { tasks: res.data.data, meta: null, links: null };
  if (Array.isArray(res.data.tasks)) return { tasks: res.data.tasks, meta: null, links: null };
  return { tasks: [], meta: null, links: null };
};

export const getTask = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  // Try to extract the task if wrapped
  if (res.data && res.data.task) return res.data.task;
  return res.data;
};

export const createTask = async (task) => {
  await axios.post(API_URL, task);
};

export const updateTask = async (id, task) => {
  await axios.put(`${API_URL}/${id}`, task);
};

export const deleteTask = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};
