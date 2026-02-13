'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Key,
  Plus,
  Search,
  Settings,
  Activity,
  Shield,
  Menu,
  Moon,
  Sun,
  Download,
  Clock,
  AlertTriangle,
  CheckCircle,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  FileCode,
} from 'lucide-react';
import { useToknStore, getDecryptedToken } from '@/lib/store';
import { maskToken, copyToClipboard, formatRelativeTime } from '@/lib/encryption';
import { useAppTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';
import { AddTokenModal } from '@/components/tokens/AddTokenModal';
import { TokenDetailModal } from '@/components/tokens/TokenDetailModal';

// Stats Card Component
function StatCard({
  title,
  value,
  icon: Icon,
  accent = false,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <div className={cn(
      'p-4 border-2 border-[#404040] bg-[#171717]',
      accent && 'border-[#FF9F1C]'
    )}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-[#737373] uppercase tracking-wider mb-1">
            {title}
          </div>
          <div className={cn(
            'text-2xl font-bold',
            accent ? 'text-[#FF9F1C]' : 'text-white'
          )}>
            {value}
          </div>
        </div>
        <div className={cn(
          'w-10 h-10 flex items-center justify-center border',
          accent ? 'border-[#FF9F1C] text-[#FF9F1C]' : 'border-[#404040] text-[#737373]'
        )}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

// Token Card Component
function TokenCard({
  token,
  onDelete,
  onClick,
}: {
  token: {
    id: string;
    service: string;
    token: string;
    status: 'ACTIVE' | 'EXPIRED' | 'EXPIRING';
    category: string;
    updatedAt: string;
  };
  onDelete: () => void;
  onClick: () => void;
}) {
  const [showToken, setShowToken] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const decrypted = getDecryptedToken(token.token);
    const success = await copyToClipboard(decrypted);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const statusColors = {
    ACTIVE: 'bg-green-600 text-white',
    EXPIRED: 'bg-red-600 text-white',
    EXPIRING: 'bg-[#FF9F1C] text-black',
  };

  return (
    <div className="border-2 border-[#404040] bg-[#171717] hover:border-[#FF9F1C] transition-colors group">
      {/* Header */}
      <div
        className="p-4 cursor-pointer border-b border-[#262626]"
        onClick={onClick}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#737373] uppercase tracking-wider">
            {token.category}
          </span>
          <span className={cn(
            'px-2 py-0.5 text-xs font-bold uppercase',
            statusColors[token.status]
          )}>
            {token.status}
          </span>
        </div>
        <h3 className="text-lg font-bold text-white uppercase tracking-wider">
          {token.service}
        </h3>
      </div>

      {/* Token Preview */}
      <div className="px-4 py-3 bg-[#0a0a0a] border-b border-[#262626]">
        <div className="flex items-center justify-between">
          <code className="text-sm text-[#737373] font-mono truncate max-w-[180px]">
            {showToken ? getDecryptedToken(token.token) : maskToken(getDecryptedToken(token.token))}
          </code>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowToken(!showToken);
            }}
            className="p-1 text-[#737373] hover:text-[#FF9F1C] transition-colors shrink-0"
          >
            {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 flex items-center justify-between">
        <span className="text-xs text-[#525252]">
          Updated {formatRelativeTime(token.updatedAt)}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className={cn(
              'p-2 border transition-colors',
              copied
                ? 'border-green-600 text-green-600'
                : 'border-[#404040] text-[#737373] hover:border-[#FF9F1C] hover:text-[#FF9F1C]'
            )}
          >
            {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 border border-[#404040] text-[#737373] hover:border-red-600 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Activity Item Component
function ActivityItem({
  action,
  service,
  timestamp,
  details,
}: {
  action: string;
  service: string;
  timestamp: string;
  details?: string;
}) {
  const actionIcons: Record<string, React.ElementType> = {
    CREATE: Plus,
    UPDATE: Shield,
    DELETE: Trash2,
    COPY: Copy,
    REVEAL: Eye,
    PARSE: FileCode,
  };

  const Icon = actionIcons[action] || Activity;

  return (
    <div className="flex items-start gap-3 py-2 border-b border-[#262626] last:border-0">
      <div className="w-6 h-6 flex items-center justify-center border border-[#404040] text-[#737373] shrink-0">
        <Icon className="w-3 h-3" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#FF9F1C] uppercase">{action}</span>
          <span className="text-xs text-[#737373]">{service}</span>
        </div>
        {details && (
          <p className="text-xs text-[#525252] truncate">{details}</p>
        )}
      </div>
      <span className="text-xs text-[#525252] shrink-0">
        {formatRelativeTime(timestamp)}
      </span>
    </div>
  );
}

// Main Dashboard Page
export default function DashboardPage() {
  const {
    tokens,
    activities,
    deleteToken,
    addActivity,
    exportToEnv,
    exportToJson,
    user,
  } = useToknStore();

  const { theme, toggleTheme } = useAppTheme();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

  // Stats
  const totalTokens = tokens.length;
  const activeTokens = tokens.filter(t => t.status === 'ACTIVE').length;
  const expiringTokens = tokens.filter(t => t.status === 'EXPIRING').length;

  // Filter tokens
  const filteredTokens = tokens.filter(token =>
    token.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Export handlers
  const handleExportEnv = () => {
    const content = exportToEnv();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '.env';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJson = () => {
    const content = exportToJson();
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tokens.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setShowAddModal(true);
      }
      if (e.key === 'Escape') {
        setShowAddModal(false);
        setSelectedToken(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className={cn(
        'border-r-2 border-[#404040] bg-[#171717] flex flex-col transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-16'
      )}>
        {/* Logo */}
        <div className="p-4 border-b border-[#404040] flex items-center gap-3">
          <Key className="w-6 h-6 text-[#FF9F1C] shrink-0" />
          {sidebarOpen && (
            <span className="text-xl font-bold text-white tracking-wider">TOKN</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2">
          <a
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 border-2 border-[#FF9F1C] bg-[#FF9F1C]/10 text-[#FF9F1C] mb-1"
          >
            <Shield className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span className="uppercase text-sm font-bold">Dashboard</span>}
          </a>
          <a
            href="/parser"
            className="flex items-center gap-3 px-3 py-2 border border-[#404040] text-[#737373] hover:border-[#FF9F1C] hover:text-[#FF9F1C] transition-colors mb-1"
          >
            <FileCode className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span className="uppercase text-sm font-bold">Parser</span>}
          </a>
          <a
            href="#activity"
            className="flex items-center gap-3 px-3 py-2 border border-[#404040] text-[#737373] hover:border-[#FF9F1C] hover:text-[#FF9F1C] transition-colors mb-1"
          >
            <Activity className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span className="uppercase text-sm font-bold">Activity</span>}
          </a>
          <a
            href="/"
            className="flex items-center gap-3 px-3 py-2 border border-[#404040] text-[#737373] hover:border-[#FF9F1C] hover:text-[#FF9F1C] transition-colors"
          >
            <Settings className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span className="uppercase text-sm font-bold">Settings</span>}
          </a>
        </nav>

        {/* Theme Toggle */}
        <div className="p-2 border-t border-[#404040]">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2 border border-[#404040] text-[#737373] hover:border-[#FF9F1C] hover:text-[#FF9F1C] transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 shrink-0" /> : <Moon className="w-5 h-5 shrink-0" />}
            {sidebarOpen && <span className="uppercase text-sm font-bold">Toggle Theme</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="border-b-2 border-[#404040] bg-[#171717] px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 border border-[#404040] text-[#737373] hover:border-[#FF9F1C] hover:text-[#FF9F1C] transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
            <input
              id="search-input"
              type="text"
              placeholder="Search tokens... (Ctrl+K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a0a0a] border-2 border-[#404040] text-white pl-10 pr-4 py-2 focus:border-[#FF9F1C] outline-none transition-colors font-mono"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#FF9F1C] text-black font-bold border-2 border-[#FF9F1C] hover:bg-transparent hover:text-[#FF9F1C] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="uppercase text-sm">Add Token</span>
            </button>
            <button
              onClick={handleExportEnv}
              className="p-2 border border-[#404040] text-[#737373] hover:border-[#FF9F1C] hover:text-[#FF9F1C] transition-colors"
              title="Export .env"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>

          {/* User */}
          <div className="flex items-center gap-3 pl-4 border-l border-[#404040]">
            <div className="w-8 h-8 bg-[#262626] border border-[#404040] flex items-center justify-center text-[#737373] font-bold text-sm">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 flex">
          {/* Main Area */}
          <div className="flex-1 p-6 overflow-auto">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                title="Total Tokens"
                value={totalTokens}
                icon={Key}
              />
              <StatCard
                title="Active"
                value={activeTokens}
                icon={CheckCircle}
                accent={activeTokens > 0}
              />
              <StatCard
                title="Expiring"
                value={expiringTokens}
                icon={AlertTriangle}
                accent={expiringTokens > 0}
              />
              <StatCard
                title="Last Activity"
                value={activities[0] ? formatRelativeTime(activities[0].timestamp) : 'Never'}
                icon={Clock}
              />
            </div>

            {/* Tokens Grid */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold uppercase tracking-wider">Your Tokens</h2>
              <span className="text-sm text-[#737373]">{filteredTokens.length} tokens</span>
            </div>

            {filteredTokens.length === 0 ? (
              <div className="border-2 border-[#404040] bg-[#171717] p-12 text-center">
                <Key className="w-12 h-12 text-[#404040] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2 uppercase">No Tokens Yet</h3>
                <p className="text-[#737373] mb-6">
                  {searchQuery
                    ? 'No tokens match your search.'
                    : 'Add your first token to get started.'}
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF9F1C] text-black font-bold border-2 border-[#FF9F1C] hover:bg-transparent hover:text-[#FF9F1C] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="uppercase">Add Your First Token</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTokens.map((token) => (
                  <TokenCard
                    key={token.id}
                    token={token}
                    onDelete={() => deleteToken(token.id)}
                    onClick={() => setSelectedToken(token.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Activity Sidebar */}
          <aside className="w-72 border-l-2 border-[#404040] bg-[#171717] p-4 hidden lg:block" id="activity">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#FF9F1C]" />
              Recent Activity
            </h3>
            <div className="space-y-0">
              {activities.length === 0 ? (
                <p className="text-sm text-[#525252]">No activity yet.</p>
              ) : (
                activities.slice(0, 20).map((activity) => (
                  <ActivityItem
                    key={activity.id}
                    action={activity.action}
                    service={activity.service}
                    timestamp={activity.timestamp}
                    details={activity.details}
                  />
                ))
              )}
            </div>
          </aside>
        </div>
      </main>

      {/* Modals */}
      {showAddModal && (
        <AddTokenModal onClose={() => setShowAddModal(false)} />
      )}

      {selectedToken && (
        <TokenDetailModal
          tokenId={selectedToken}
          onClose={() => setSelectedToken(null)}
        />
      )}
    </div>
  );
}
