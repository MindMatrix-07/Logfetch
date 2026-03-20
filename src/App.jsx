import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Filter, RefreshCw, Trash2, AlertCircle, Settings, ExternalLink, Copy, Check } from 'lucide-react';
import axios from 'axios';

// Configuration - can be overridden via environment variables
const DEFAULT_BACKEND_URL = import.meta.env.VITE_LOG_BACKEND_URL || 'https://live-tv-proxy-a9mg.onrender.com';

const LogFetch = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [backendUrl, setBackendUrl] = useState(DEFAULT_BACKEND_URL);
  const [showSettings, setShowSettings] = useState(false);
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState({
    level: null,
    category: '',
    action: 'recent',
  });
  const [summary, setSummary] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  // Fetch logs
  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${backendUrl}/api/logs?action=${filter.action}`;
      
      if (filter.level) url += `&level=${filter.level}`;
      if (filter.category) url += `&category=${encodeURIComponent(filter.category)}`;

      const response = await axios.get(url);

      if (response.data.success || Array.isArray(response.data.logs)) {
        setLogs(response.data.logs || []);
      } else {
        setError('Invalid response format');
      }
    } catch (error) {
      setError(`Failed to fetch logs: ${error.message}`);
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch summary
  const fetchSummary = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/logs?action=summary`);
      if (response.data.summary) {
        setSummary(response.data.summary);
      }
    } catch (error) {
      console.error('Summary fetch error:', error);
    }
  };

  // Auto-refresh effect
  useEffect(() => {
    fetchLogs();
    fetchSummary();

    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchLogs();
      fetchSummary();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, filter, backendUrl]);

  // Auto-scroll effect
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleClearLogs = async () => {
    if (window.confirm('Clear all logs older than 7 days?')) {
      try {
        await axios.delete(`${backendUrl}/api/logs?action=clear`);
        fetchLogs();
        fetchSummary();
      } catch (error) {
        setError('Failed to clear logs');
      }
    }
  };

  const handleFilterChange = (key, value) => {
    setFilter(prev => ({ ...prev, [key]: value }));
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(backendUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLevelColor = level => {
    const colors = {
      ERROR: 'bg-red-100 text-red-900 border-red-300',
      WARN: 'bg-yellow-100 text-yellow-900 border-yellow-300',
      INFO: 'bg-blue-100 text-blue-900 border-blue-300',
      DEBUG: 'bg-gray-100 text-gray-900 border-gray-300',
      SUCCESS: 'bg-green-100 text-green-900 border-green-300',
    };
    return colors[level] || colors.INFO;
  };

  const getLevelEmoji = level => {
    const emojis = {
      ERROR: '❌',
      WARN: '⚠️',
      INFO: 'ℹ️',
      DEBUG: '🔍',
      SUCCESS: '✅',
    };
    return emojis[level] || '📝';
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-4 font-mono overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-950 border border-slate-700 rounded-lg p-4 mb-4 flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            🔍 LogFetch
          </h1>
          <p className="text-slate-400 text-sm">Real-time log viewer for Live TV infrastructure</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded transition"
            title="Configure backend URL"
          >
            <Settings size={20} />
          </button>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-4 py-2 rounded border flex items-center gap-2 transition ${
              autoRefresh
                ? 'bg-green-900 border-green-700 text-green-100'
                : 'bg-slate-700 border-slate-600 text-slate-300'
            }`}
          >
            <RefreshCw size={16} className={autoRefresh ? 'animate-spin' : ''} />
            {autoRefresh ? 'Live' : 'Paused'}
          </button>
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded transition disabled:opacity-50"
          >
            Refresh
          </button>
          <button
            onClick={handleClearLogs}
            className="px-4 py-2 bg-red-900 hover:bg-red-800 border border-red-700 rounded transition flex items-center gap-2"
          >
            <Trash2 size={16} />
            Clear
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-slate-950 border border-slate-700 rounded-lg p-4 mb-4 flex-shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-bold">Backend URL:</label>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
              placeholder="https://your-live-tv-backend.com"
              className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
            />
            <button
              onClick={handleCopyUrl}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded transition flex items-center gap-2"
              title="Copy URL to clipboard"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
          <p className="text-slate-400 text-xs mt-2">
            💡 Points to your Live-TV backend. Change to monitor different environments.
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-950 border border-red-700 rounded-lg p-4 mb-4 flex-shrink-0 flex items-start gap-2">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Connection Error</p>
            <p className="text-sm text-red-200">{error}</p>
            <p className="text-xs text-red-300 mt-2">
              Check that backend URL is correct: <code className="bg-red-900 px-2 py-1 rounded">{backendUrl}</code>
            </p>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-4 flex-shrink-0">
          <div className="bg-blue-950 border border-blue-700 rounded p-3">
            <div className="text-xs text-blue-300">Total</div>
            <div className="text-xl font-bold">{summary.total}</div>
          </div>
          <div className="bg-red-950 border border-red-700 rounded p-3">
            <div className="text-xs text-red-300">Errors</div>
            <div className="text-xl font-bold">{summary.levels.ERROR || 0}</div>
          </div>
          <div className="bg-yellow-950 border border-yellow-700 rounded p-3">
            <div className="text-xs text-yellow-300">Warnings</div>
            <div className="text-xl font-bold">{summary.levels.WARN || 0}</div>
          </div>
          <div className="bg-green-950 border border-green-700 rounded p-3">
            <div className="text-xs text-green-300">Success</div>
            <div className="text-xl font-bold">{summary.levels.SUCCESS || 0}</div>
          </div>
          <div className="bg-cyan-950 border border-cyan-700 rounded p-3">
            <div className="text-xs text-cyan-300">Info</div>
            <div className="text-xl font-bold">{summary.levels.INFO || 0}</div>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded p-3">
            <div className="text-xs text-gray-300">Debug</div>
            <div className="text-xl font-bold">{summary.levels.DEBUG || 0}</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 bg-slate-950 border border-slate-700 rounded p-4 mb-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Filter size={16} />
          <span className="text-sm text-slate-400">Filters:</span>
        </div>

        <select
          value={filter.action}
          onChange={e => handleFilterChange('action', e.target.value)}
          className="px-3 py-1 bg-slate-700 border border-slate-600 rounded text-sm hover:bg-slate-600 transition cursor-pointer"
        >
          <option value="recent">Recent (100)</option>
          <option value="errors">Errors & Warnings</option>
          <option value="stream-issues">Stream Issues</option>
          <option value="android">📱 Android Logs</option>
          <option value="summary">Summary</option>
        </select>

        <select
          value={filter.level || ''}
          onChange={e => handleFilterChange('level', e.target.value || null)}
          className="px-3 py-1 bg-slate-700 border border-slate-600 rounded text-sm hover:bg-slate-600 transition cursor-pointer"
        >
          <option value="">All Levels</option>
          <option value="ERROR">❌ Errors</option>
          <option value="WARN">⚠️ Warnings</option>
          <option value="INFO">ℹ️ Info</option>
          <option value="DEBUG">🔍 Debug</option>
          <option value="SUCCESS">✅ Success</option>
        </select>

        <input
          type="text"
          placeholder="Filter by category..."
          value={filter.category}
          onChange={e => handleFilterChange('category', e.target.value)}
          className="px-3 py-1 bg-slate-700 border border-slate-600 rounded text-sm hover:bg-slate-600 transition flex-1 min-w-[200px]"
        />
      </div>

      {/* Logs Container */}
      <div
        ref={scrollRef}
        className="flex-1 bg-slate-950 border border-slate-700 rounded overflow-y-auto space-y-1 p-2"
      >
        {logs.length === 0 ? (
          <div className="text-center text-slate-500 py-8">
            <p className="text-lg">No logs found</p>
            <p className="text-sm mt-2">
              {error ? 'Check your connection' : 'Waiting for logs...'}
            </p>
          </div>
        ) : (
          logs.map((log, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedLog(selectedLog?.timestamp === log.timestamp ? null : log)}
              className={`p-2 rounded border cursor-pointer transition ${getLevelColor(log.level)}`}
            >
              <div className="flex items-start justify-between text-sm">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg">{getLevelEmoji(log.level)}</span>
                    <span className="font-bold uppercase text-xs">{log.level}</span>
                    <span className="text-xs opacity-75">[{log.category}]</span>
                    <span className="text-xs opacity-50">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-1 text-sm break-words">{log.message}</div>
                  {selectedLog?.timestamp === log.timestamp && log.data && (
                    <pre className="mt-2 p-2 bg-black bg-opacity-30 rounded text-xs overflow-x-auto">
                      {typeof log.data === 'string' ? log.data : JSON.stringify(log.data, null, 2)}
                    </pre>
                  )}
                </div>
                {selectedLog?.timestamp === log.timestamp && (
                  <ChevronDown className="flex-shrink-0 ml-2" size={16} />
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-slate-950 border border-slate-700 rounded px-4 py-2 text-xs text-slate-400 flex justify-between mt-4 flex-shrink-0">
        <span>Displaying {logs.length} logs from {backendUrl}</span>
        <span>
          {loading ? 'Loading...' : `Last updated: ${new Date().toLocaleTimeString()}`}
        </span>
      </div>
    </div>
  );
};

export default LogFetch;
