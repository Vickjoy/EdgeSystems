// Helper to refresh token and retry request
async function fetchWithAuthRetry(url, options = {}, retry = true) {
  let accessToken = localStorage.getItem('admin_access_token');
  options.headers = options.headers || {};
  // Only add Authorization header if accessToken exists and method is not GET, or if explicitly provided
  if (!options.headers['Authorization'] && accessToken && options.method && options.method !== 'GET') {
    options.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  // If Authorization header is explicitly provided (e.g., for admin actions), keep it
  let response = await fetch(url, options);

  // Check for 401 or 400 with token_not_valid
  if ((response.status === 401 || response.status === 400) && retry) {
    let errorData = {};
    try {
      errorData = await response.clone().json();
    } catch {
      errorData = {};
    }
    if (
      errorData.code === 'token_not_valid' ||
      errorData.detail === 'Given token not valid for any token type'
    ) {
      // Try to refresh token
      const refreshToken = localStorage.getItem('admin_refresh_token');
      if (refreshToken) {
        const refreshResp = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken })
        });
        const refreshData = await refreshResp.json();
        if (refreshResp.ok && refreshData.access) {
          accessToken = refreshData.access;
          localStorage.setItem('admin_access_token', accessToken);
          // Retry original request with new token
          options.headers['Authorization'] = `Bearer ${accessToken}`;
          return fetch(url, options);
        } else {
          // Refresh failed, log out user
          localStorage.removeItem('admin_access_token');
          localStorage.removeItem('admin_refresh_token');
          localStorage.removeItem('admin_user');
          throw new Error('Session expired. Please log in again.');
        }
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
    // Only send Authorization header if token is provided (admin actions)
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    const response = await fetch('http://127.0.0.1:8000/api/categories/', { headers });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const fetchSubcategories = async (categorySlug, token) => {
  try {
    // Only send Authorization header if token is provided (admin actions)
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    const response = await fetch(`http://127.0.0.1:8000/api/categories/${categorySlug}/subcategories/`, { headers });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    throw error;
  }
};

export const createCategory = async (name, token, type = 'fire_safety') => {
  try {
    const response = await fetchWithAuthRetry('http://127.0.0.1:8000/api/categories/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ name, type })
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

export const createSubcategory = async (categorySlug, name, token) => {
  try {
    const response = await fetchWithAuthRetry(`http://127.0.0.1:8000/api/categories/${categorySlug}/subcategories/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ name }) // Only send name
    });
    if (!response.ok) throw new Error('Failed to create subcategory');
    return await response.json();
  } catch (error) {
    console.error('Error creating subcategory:', error);
    throw error;
  }
};

export const updateSubcategory = async (categorySlug, subcategoryId, name, token) => {
  try {
    const response = await fetchWithAuthRetry(`http://127.0.0.1:8000/api/categories/${categorySlug}/subcategories/${subcategoryId}/`, {
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

export const deleteSubcategory = async (categorySlug, subcategoryId, token) => {
  try {
    const response = await fetchWithAuthRetry(`http://127.0.0.1:8000/api/categories/${categorySlug}/subcategories/${subcategoryId}/`, {
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

/**
 * Fetch products for a specific subcategory using the slug-based endpoint.
 * This endpoint is publicly accessible and matches Django's ProductsBySubcategoryView.
 * Endpoint: /api/subcategories/<slug>/products/
 * 
 * @param {string} subcategorySlug - The slug of the subcategory
 * @returns {Promise<Array>} Array of products
 */
export const fetchProductsForSubcategory = async (subcategorySlug) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/subcategories/${subcategorySlug}/products/`);
    if (!response.ok) throw new Error('Failed to fetch products for subcategory');
    return await response.json();
  } catch (error) {
    console.error('Error fetching products for subcategory:', error);
    throw error;
  }
};

export const createProduct = async (form, token) => {
  try {
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('price', form.price);
    formData.append('description', form.description);
    if (form.specifications) formData.append('specifications', form.specifications);
    if (form.features) formData.append('features', form.features);
    if (form.documentation) formData.append('documentation', form.documentation);
    if (form.status) formData.append('status', form.status);
    // Only send image if it's a file (not a string)
    if (form.image && typeof form.image !== 'string') formData.append('image', form.image);
    // Use subcategory slug in the endpoint
    const endpoint = `http://127.0.0.1:8000/api/subcategories/${form.subcategory}/products/create/`;
    const response = await fetchWithAuthRetry(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    if (!response.ok) {
      // Log backend error response
      let errorMsg = 'Failed to add product';
      try {
        const errorData = await response.json();
        console.error('Backend error:', errorData);
        errorMsg += ': ' + (errorData.detail || JSON.stringify(errorData));
      } catch (e) {
        // Could not parse error response
      }
      throw new Error(errorMsg);
    }
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