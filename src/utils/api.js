// Helper to refresh token and retry request
async function fetchWithAuthRetry(url, options, retry = true) {
  let accessToken = localStorage.getItem('access_token');
  let response = await fetch(url, options);
  if (response.status === 401 && retry) {
    // Try to refresh token
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      const refreshResp = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken })
      });
      const refreshData = await refreshResp.json();
      if (refreshResp.ok && refreshData.access) {
        accessToken = refreshData.access;
        localStorage.setItem('access_token', accessToken);
        // Retry original request with new token
        const newOptions = { ...options, headers: { ...options.headers, Authorization: `Bearer ${accessToken}` } };
        return fetch(url, newOptions);
      } else {
        // Refresh failed, log out user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        throw new Error('Session expired. Please log in again.');
      }
    }
  }
  return response;
}

// Example API utility functions
export const fetchProducts = async (category) => {
  try {
    const response = await fetch(`/api/products?category=${category}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`/api/products/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
};

export const fetchCategories = async (token) => {
  try {
    const response = await fetchWithAuthRetry('http://127.0.0.1:8000/api/categories/', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const fetchSubcategories = async (categoryId, token) => {
  try {
    const response = await fetchWithAuthRetry(`http://127.0.0.1:8000/api/categories/${categoryId}/subcategories/`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    throw error;
  }
};

export const createCategory = async (name, token) => {
  try {
    const response = await fetchWithAuthRetry('http://127.0.0.1:8000/api/categories/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ name, type: 'fire' })
    });
    if (!response.ok) throw new Error('Failed to create category');
    return await response.json();
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const updateCategory = async (id, name, token) => {
  try {
    const response = await fetchWithAuthRetry(`http://127.0.0.1:8000/api/categories/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ name })
    });
    if (!response.ok) throw new Error('Failed to update category');
    return await response.json();
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const deleteCategory = async (id, token) => {
  try {
    const response = await fetchWithAuthRetry(`http://127.0.0.1:8000/api/categories/${id}/`, {
      method: 'DELETE',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    if (!response.ok) throw new Error('Failed to delete category');
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

export const createSubcategory = async (categoryId, name, token) => {
  try {
    const response = await fetchWithAuthRetry(`http://127.0.0.1:8000/api/categories/${categoryId}/subcategories/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ name })
    });
    if (!response.ok) throw new Error('Failed to create subcategory');
    return await response.json();
  } catch (error) {
    console.error('Error creating subcategory:', error);
    throw error;
  }
};

export const updateSubcategory = async (categoryId, subcategoryId, name, token) => {
  try {
    const response = await fetchWithAuthRetry(`http://127.0.0.1:8000/api/categories/${categoryId}/subcategories/${subcategoryId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ name })
    });
    if (!response.ok) throw new Error('Failed to update subcategory');
    return await response.json();
  } catch (error) {
    console.error('Error updating subcategory:', error);
    throw error;
  }
};

export const deleteSubcategory = async (subcategoryId, token) => {
  try {
    const response = await fetchWithAuthRetry(`http://127.0.0.1:8000/api/subcategories/${subcategoryId}/`, {
      method: 'DELETE',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    if (!response.ok) throw new Error('Failed to delete subcategory');
    return true;
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    throw error;
  }
};

export const fetchProductsBySubcategory = async (subcategoryId, page = 1, pageSize = 10, token) => {
  try {
    const response = await fetchWithAuthRetry(`http://127.0.0.1:8000/api/products/?subcategory=${subcategoryId}&page=${page}&page_size=${pageSize}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const createProduct = async (form, token) => {
  try {
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('price', form.price);
    formData.append('description', form.description);
    formData.append('subcategory', form.subcategory);
    if (form.specifications) formData.append('specifications', form.specifications);
    if (form.features) formData.append('features', form.features);
    if (form.link) formData.append('link', form.link);
    if (form.image && typeof form.image !== 'string') formData.append('image', form.image);
    if (form.pdf && typeof form.pdf !== 'string') formData.append('pdf', form.pdf);
    const response = await fetchWithAuthRetry('http://127.0.0.1:8000/api/products/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    if (!response.ok) throw new Error('Failed to add product');
    return await response.json();
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const updateProduct = async (id, form, token) => {
  try {
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('price', form.price);
    formData.append('description', form.description);
    formData.append('subcategory', form.subcategory);
    if (form.specifications) formData.append('specifications', form.specifications);
    if (form.features) formData.append('features', form.features);
    if (form.link) formData.append('link', form.link);
    if (form.image && typeof form.image !== 'string') formData.append('image', form.image);
    if (form.pdf && typeof form.pdf !== 'string') formData.append('pdf', form.pdf);
    const response = await fetchWithAuthRetry(`http://127.0.0.1:8000/api/products/${id}/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    if (!response.ok) throw new Error('Failed to update product');
    return await response.json();
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id, token) => {
  try {
    const response = await fetchWithAuthRetry(`http://127.0.0.1:8000/api/products/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to delete product');
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};