'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  UserPlus,
  Settings as SettingsIcon,
  Key,
  Mail,
  Shield,
  Crown,
  Trash2,
  Edit,
  X,
  Check,
  Loader2,
} from 'lucide-react';

interface Team {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  members: TeamMember[];
  _count: {
    tokens: number;
    members: number;
  };
}

interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  joinedAt: string;
  user: {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
  };
}

interface TeamsSettingsProps {
  user: {
    id: string;
    email: string;
    username?: string;
    full_name?: string;
    avatar_url?: string;
  } | null;
}

export function TeamsSettings({ user }: TeamsSettingsProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingTeam, setCreatingTeam] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await fetch('/api/teams');
      if (res.ok) {
        const data = await res.json();
        setTeams(data.teams);
        if (data.teams.length > 0) {
          setSelectedTeam(data.teams[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    setCreatingTeam(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTeamName.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        setTeams([data.team, ...teams]);
        setSelectedTeam(data.team);
        setNewTeamName('');
        setShowCreateForm(false);
        setMessage({ type: 'success', text: 'Team created successfully' });
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to create team' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setCreatingTeam(false);
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !selectedTeam) return;

    setInviting(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch(`/api/teams/${selectedTeam.id}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail.toLowerCase() }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update selected team with new member
        setSelectedTeam({
          ...selectedTeam,
          members: [...selectedTeam.members, data.member],
          _count: {
            ...selectedTeam._count,
            members: selectedTeam._count.members + 1
          }
        });
        setInviteEmail('');
        setMessage({ type: 'success', text: 'Member invited successfully' });
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to invite member' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!selectedTeam || !confirm('Are you sure you want to remove this member?')) return;

    try {
      const res = await fetch(`/api/teams/${selectedTeam.id}/members/${memberId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setSelectedTeam({
          ...selectedTeam,
          members: selectedTeam.members.filter(m => m.id !== memberId),
          _count: {
            ...selectedTeam._count,
            members: selectedTeam._count.members - 1
          }
        });
        setMessage({ type: 'success', text: 'Member removed successfully' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to remove member' });
    }
  };

  const canManageMembers = (member: TeamMember) => {
    return selectedTeam?.ownerId === user?.id || 
           (member.role !== 'OWNER' && 
            selectedTeam?.members.some(m => m.userId === user?.id && m.role === 'ADMIN'));
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'OWNER': return 'bg-[#FF9F1C] text-black';
      case 'ADMIN': return 'bg-blue-500 text-white';
      default: return 'bg-[#404040] text-white';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-[#FF9F1C]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Message */}
      {message.text && (
        <div className={`p-3 text-sm ${
          message.type === 'success' 
            ? 'border border-green-500 bg-green-500/10 text-green-500' 
            : 'border border-red-500 bg-red-500/10 text-red-500'
        }`}>
          {message.text}
        </div>
      )}

      {/* Team Creation */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg">Your Teams</h3>
          <p className="text-sm text-[#737373]">
            Create teams to collaborate and share tokens with colleagues
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-[#FF9F1C] text-black font-bold hover:bg-[#FF9F1C]/90 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Team
        </button>
      </div>

      {/* Create Team Form */}
      {showCreateForm && (
        <div className="border-2 border-[#404040] bg-[#171717] p-6">
          <form onSubmit={handleCreateTeam} className="space-y-4">
            <div>
              <label className="block text-sm text-[#737373] mb-2">Team Name</label>
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="w-full p-3 bg-black border-2 border-[#404040] focus:border-[#FF9F1C] outline-none"
                placeholder="My Team"
                disabled={creatingTeam}
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={creatingTeam || !newTeamName.trim()}
                className="px-4 py-2 bg-[#FF9F1C] text-black font-bold hover:bg-[#FF9F1C]/90 disabled:opacity-50 flex items-center gap-2"
              >
                {creatingTeam ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Create Team
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewTeamName('');
                }}
                className="px-4 py-2 border-2 border-[#404040] text-[#737373] hover:text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Team List */}
      {teams.length === 0 ? (
        <div className="border-2 border-[#404040] bg-[#171717] p-8 text-center">
          <Users className="w-12 h-12 text-[#737373] mx-auto mb-4" />
          <h4 className="font-bold mb-2">No teams yet</h4>
          <p className="text-sm text-[#737373] mb-4">
            Create your first team to start collaborating with your team
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => setSelectedTeam(team)}
              className={`p-4 border-2 text-left transition-all ${
                selectedTeam?.id === team.id
                  ? 'border-[#FF9F1C] bg-[#FF9F1C]/10'
                  : 'border-[#404040] hover:border-[#FF9F1C]'
              }`}
            >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold">{team.name}</h4>
                  {team.ownerId === user?.id && (
                    <Crown className="w-4 h-4 text-[#FF9F1C]" />
                  )}
                </div>
              <div className="text-xs text-[#737373] space-y-1">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {team._count.members} members
                </div>
                <div className="flex items-center gap-1">
                  <Key className="w-3 h-3" />
                  {team._count.tokens} tokens
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Team Details */}
      {selectedTeam && (
        <div className="border-2 border-[#404040] bg-[#171717] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-xl flex items-center gap-2">
                {selectedTeam.name}
                {selectedTeam.ownerId === user?.id && (
                  <Crown className="w-5 h-5 text-[#FF9F1C]" />
                )}
              </h3>
              <p className="text-sm text-[#737373]">
                Created {new Date(selectedTeam.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Team Members */}
          <div className="mb-6">
            <h4 className="font-bold mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Team Members ({selectedTeam.members.length})
            </h4>
            
            <div className="space-y-3">
              {selectedTeam.members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-black border border-[#404040]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#262626] border border-[#404040] flex items-center justify-center rounded-full">
                      {member.user.avatar_url ? (
                        <img 
                          src={member.user.avatar_url} 
                          alt={member.user.full_name || member.user.email}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <Mail className="w-4 h-4 text-[#737373]" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">
                        {member.user.full_name || member.user.email}
                      </div>
                      <div className="text-xs text-[#737373]">
                        {member.user.full_name && member.user.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 text-xs font-bold ${getRoleBadgeColor(member.role)}`}>
                      {member.role}
                    </span>
                    {canManageMembers(member) && member.role !== 'OWNER' && (
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-1 text-[#737373] hover:text-red-500"
                        title="Remove member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invite Member */}
          {(selectedTeam.ownerId === user?.id || 
            selectedTeam.members.some(m => m.userId === user?.id && m.role === 'ADMIN')) && (
            <div className="border-2 border-[#404040] p-4">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Invite Member
              </h4>
              <form onSubmit={handleInviteMember} className="flex gap-3">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="flex-1 p-3 bg-black border-2 border-[#404040] focus:border-[#FF9F1C] outline-none"
                  placeholder="colleague@company.com"
                  disabled={inviting}
                />
                <button
                  type="submit"
                  disabled={inviting || !inviteEmail}
                  className="px-4 py-2 bg-[#FF9F1C] text-black font-bold hover:bg-[#FF9F1C]/90 disabled:opacity-50 flex items-center gap-2"
                >
                  {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  Invite
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}