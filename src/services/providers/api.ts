export interface ModelInfo {
  id: string;
  name: string;
}

export async function fetchModels(endpoint: string, apiKey: string): Promise<ModelInfo[]> {
  try {
    // Try OpenAI-compatible /v1/models endpoint
    const modelsUrl = endpoint.replace(/\/chat\/completions$/, '/models');
    const response = await fetch(modelsUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.status}`);
    }

    const data = await response.json();
    
    // Handle different response formats
    if (Array.isArray(data)) {
      return data.map((m: any) => ({
        id: m.id || m.name,
        name: m.name || m.id,
      }));
    }
    if (data.data && Array.isArray(data.data)) {
      return data.data.map((m: any) => ({
        id: m.id || m.name,
        name: m.name || m.id,
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Failed to fetch models:', error);
    return [];
  }
}

export async function testConnection(endpoint: string, apiKey: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'test',
        messages: [{ role: 'user', content: 'Hi' }],
        max_tokens: 1,
      }),
    });

    // If we get a response (even 4xx), the endpoint is reachable
    if (response.status === 401 || response.status === 403) {
      return { success: false, message: 'Invalid API key' };
    }
    if (response.status === 404) {
      return { success: false, message: 'Endpoint not found' };
    }
    if (response.status === 429) {
      return { success: true, message: 'Endpoint reachable (rate limited)' };
    }
    if (response.ok) {
      return { success: true, message: 'Connection successful' };
    }
    
    // Other errors - endpoint is reachable but something is wrong
    const errorData = await response.json().catch(() => ({}));
    return { 
      success: false, 
      message: errorData.error?.message || `Error: ${response.status}` 
    };
  } catch (error: any) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return { success: false, message: 'Cannot reach endpoint (CORS or network error)' };
    }
    return { success: false, message: error.message || 'Connection failed' };
  }
}
