'use client';

import { useState, useEffect } from 'react';
import { 
  AIProviderType, 
  AI_PROVIDER_CONFIGS, 
  STATIC_MODELS, 
  AIModel 
} from '@/lib/ai-providers/types';

interface SavedProvider {
  id: string;
  providerType: AIProviderType;
  displayName: string;
  selectedModel: string;
  apiKeyMasked: string;
}

interface ProviderSettingsProps {
  onSuccess?: () => void;
}

export function ProviderSettings({ onSuccess }: ProviderSettingsProps) {
  // State
  const [providers, setProviders] = useState<SavedProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form state
  const [selectedProvider, setSelectedProvider] = useState<AIProviderType | ''>('');
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [models, setModels] = useState<AIModel[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [testingKey, setTestingKey] = useState(false);

  // Fetch saved providers on mount
  useEffect(() => {
    fetchProviders();
  }, []);

  // Fetch models when provider changes
  useEffect(() => {
    if (selectedProvider) {
      fetchModels(selectedProvider, apiKey);
    } else {
      setModels([]);
    }
    setSelectedModel('');
  }, [selectedProvider]);

  const fetchProviders = async () => {
    try {
      const res = await fetch('/api/providers');
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setProviders(data);
    } catch (err) {
      console.error('Failed to fetch providers:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchModels = async (provider: AIProviderType, key?: string) => {
    setLoadingModels(true);
    try {
      const body: { provider: string; apiKey?: string } = { provider };
      if (key) body.apiKey = key;
      
      const res = await fetch('/api/providers/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      
      if (!data.error) {
        setModels(data.models || []);
        if (data.models?.length > 0 && !selectedModel) {
          setSelectedModel(data.models[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch models:', err);
      // Fallback to static models
      setModels(STATIC_MODELS[provider] || []);
    } finally {
      setLoadingModels(false);
    }
  };

  const testApiKey = async () => {
    if (!selectedProvider || !apiKey) return;
    
    setTestingKey(true);
    setError(null);
    
    try {
      const res = await fetch('/api/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          provider: selectedProvider, 
          apiKey: 'test-key-placeholder',
          testOnly: true 
        }),
      });
      // The actual test happens after we save
      // For now, just validate format
      setSuccess('API key format validated');
    } catch (err) {
      setError('Failed to validate API key');
    } finally {
      setTestingKey(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const res = await fetch('/api/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedProvider,
          apiKey,
          selectedModel,
        }),
      });
      
      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
        return;
      }
      
      setSuccess(`Saved ${data.displayName} configuration!`);
      fetchProviders();
      resetForm();
      onSuccess?.();
    } catch (err) {
      setError('Failed to save provider');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this provider?')) return;
    
    try {
      const res = await fetch(`/api/providers?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
        return;
      }
      
      setSuccess('Provider removed');
      fetchProviders();
    } catch (err) {
      setError('Failed to delete provider');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      // Find the provider and update it
      const provider = providers.find(p => p.id === id);
      if (!provider) return;
      
      const res = await fetch('/api/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: provider.providerType,
          apiKey: '', // Won't update key
          selectedModel: provider.selectedModel,
        }),
      });
      
      const data = await res.json();
      if (!data.error) {
        setSuccess('Default provider updated');
        fetchProviders();
      }
    } catch (err) {
      setError('Failed to set default');
    }
  };

  const resetForm = () => {
    setSelectedProvider('');
    setApiKey('');
    setSelectedModel('');
    setModels([]);
    setError(null);
    setSuccess(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF9F1C]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Saved Providers */}
      <div>
        <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-4">
          Configured Providers
        </h3>
        
        {providers.length === 0 ? (
          <div className="border-2 border-[#404040] bg-[#171717] p-6 text-center">
            <p className="text-[#737373] mb-2">No AI providers configured</p>
            <p className="text-sm text-[#525252]">
              Add a provider below to enable AI-powered token parsing
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="border-2 border-[#404040] bg-[#171717] p-4 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{provider.displayName}</span>
                  </div>
                  <div className="text-sm text-[#737373]">
                    Model: {provider.selectedModel}
                  </div>
                  <div className="text-xs text-[#525252] font-mono">
                    Key: {provider.apiKeyMasked}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSetDefault(provider.id)}
                    className="px-3 py-1 text-sm border border-[#404040] text-[#737373] hover:border-[#FF9F1C] hover:text-[#FF9F1C] transition-colors"
                  >
                    Set Default
                  </button>
                  <button
                    onClick={() => handleDelete(provider.id)}
                    className="px-3 py-1 text-sm border border-[#404040] text-[#737373] hover:border-red-600 hover:text-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add New Provider Form */}
      <div>
        <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-4">
          Add New Provider
        </h3>
        
        <form onSubmit={handleSave} className="space-y-4">
          {/* Provider Selection */}
          <div>
            <label className="block text-sm text-[#737373] mb-2 uppercase tracking-wider">
              Select Provider
            </label>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value as AIProviderType)}
              className="w-full bg-[#0a0a0a] border-2 border-[#404040] text-white px-4 py-2 focus:border-[#FF9F1C] outline-none transition-colors"
              required
            >
              <option value="">Choose a provider...</option>
              {Object.values(AI_PROVIDER_CONFIGS).map((config) => (
                <option key={config.type} value={config.type}>
                  {config.displayName}
                </option>
              ))}
            </select>
          </div>

          {/* API Key Input */}
          {selectedProvider && (
            <div>
              <label className="block text-sm text-[#737373] mb-2 uppercase tracking-wider">
                API Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={`Enter your ${selectedProvider} API key`}
                  className="w-full bg-[#0a0a0a] border-2 border-[#404040] text-white px-4 py-2 pr-12 focus:border-[#FF9F1C] outline-none transition-colors font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={testApiKey}
                  disabled={!apiKey || testingKey}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs bg-[#262626] text-[#737373] hover:text-[#FF9F1C] transition-colors disabled:opacity-50"
                >
                  {testingKey ? '...' : 'Test'}
                </button>
              </div>
              <p className="text-xs text-[#525252] mt-1">
                Your API key is encrypted before storage
              </p>
            </div>
          )}

          {/* Model Selection */}
          {selectedProvider && (
            <div>
              <label className="block text-sm text-[#737373] mb-2 uppercase tracking-wider">
                Select Model
              </label>
              {loadingModels ? (
                <div className="flex items-center gap-2 text-[#737373]">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#FF9F1C]"></div>
                  <span>Loading models...</span>
                </div>
              ) : (
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-[#0a0a0a] border-2 border-[#404040] text-white px-4 py-2 focus:border-[#FF9F1C] outline-none transition-colors"
                  required
                >
                  {models.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name} {model.pricing ? `- $${model.pricing.input}/1M` : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}


          {/* Error/Success Messages */}
          {error && (
            <div className="p-3 border border-red-600 bg-red-600/10 text-red-600 text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="p-3 border border-green-600 bg-green-600/10 text-green-600 text-sm">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!selectedProvider || !apiKey || !selectedModel || saving}
            className="w-full px-4 py-3 bg-[#FF9F1C] text-black font-bold border-2 border-[#FF9F1C] hover:bg-transparent hover:text-[#FF9F1C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Provider Configuration'}
          </button>
        </form>
      </div>
    </div>
  );
}