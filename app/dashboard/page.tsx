'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface Issue {
  id: string;
  title: string;
  description: string;
  type: 'CLOUD_SECURITY' | 'RETEAM_ASSESSMENT' | 'VAPT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filter, setFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  
  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    type: 'VAPT' as const,
    priority: 'MEDIUM' as const,
  });

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchIssues(token);
    } catch (error) {
      router.push('/login');
    }
  }, [router]);

  const fetchIssues = async (token: string) => {
    try {
      const response = await fetch('/api/issues', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIssues(data.issues || []);
      }
    } catch (error) {
      console.error('Failed to fetch issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const createIssue = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newIssue),
      });

      if (response.ok) {
        const issue = await response.json();
        setIssues([issue, ...issues]);
        setShowCreateForm(false);
        setNewIssue({
          title: '',
          description: '',
          type: 'VAPT',
          priority: 'MEDIUM',
        });
      }
    } catch (error) {
      console.error('Failed to create issue:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    router.push('/');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'CLOUD_SECURITY': return 'bg-blue-100 text-blue-800';
      case 'RETEAM_ASSESSMENT': return 'bg-red-100 text-red-800';
      case 'VAPT': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColorModern = (type: string) => {
    switch (type) {
      case 'CLOUD_SECURITY': return 'bg-blue-500/20 text-blue-300';
      case 'RETEAM_ASSESSMENT': return 'bg-red-500/20 text-red-300';
      case 'VAPT': return 'bg-amber-500/20 text-amber-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getStatusColorModern = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-500/20 text-blue-300';
      case 'IN_PROGRESS': return 'bg-yellow-500/20 text-yellow-300';
      case 'RESOLVED': return 'bg-green-500/20 text-green-300';
      case 'CLOSED': return 'bg-gray-500/20 text-gray-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getPriorityColorModern = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-500/20 text-red-300';
      case 'HIGH': return 'bg-orange-500/20 text-orange-300';
      case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-300';
      case 'LOW': return 'bg-green-500/20 text-green-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(filter.toLowerCase()) ||
                         issue.description.toLowerCase().includes(filter.toLowerCase());
    const matchesType = !typeFilter || issue.type === typeFilter;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-purple-400/5 to-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900/50 to-purple-900/50"></div>
      </div>

      {/* Navigation */}
      <nav className="relative bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link href="/" className="inline-flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  ApniSec
                </span>
              </Link>
              <div className="ml-6 flex items-center">
                <div className="w-px h-6 bg-white/20"></div>
                <span className="ml-6 text-white/70 font-medium">Security Dashboard</span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <Link
                href="/profile"
                className="flex items-center text-white/70 hover:text-white transition-all duration-200 font-medium group"
              >
                <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </Link>
              <button
                onClick={logout}
                className="flex items-center text-white/70 hover:text-red-300 transition-all duration-200 font-medium group"
              >
                <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
            <div className="text-center sm:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Welcome back, <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">{user?.name}!</span>
              </h1>
              <p className="text-white/70 text-lg">
                Manage your security issues and assessments from your command center
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="group relative flex items-center justify-center px-8 py-4 border border-transparent rounded-2xl text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/25 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative z-10 flex items-center">
                <svg className="w-6 h-6 mr-3 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Issue
              </span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-white/40 group-focus-within:text-purple-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search security issues..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-200 backdrop-blur-sm"
                />
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-white/40 group-focus-within:text-purple-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </div>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="pl-12 pr-8 py-4 bg-white/5 border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-200 backdrop-blur-sm appearance-none cursor-pointer"
                >
                  <option value="" className="text-gray-900">All Types</option>
                  <option value="CLOUD_SECURITY" className="text-gray-900">Cloud Security</option>
                  <option value="RETEAM_ASSESSMENT" className="text-gray-900">Red Team Assessment</option>
                  <option value="VAPT" className="text-gray-900">VAPT</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Issues List */}
        <div>
          {filteredIssues.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No Security Issues Found</h3>
              <p className="text-white/70 text-lg mb-6">Create your first security issue to start tracking vulnerabilities and assessments.</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Your First Issue
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredIssues.map((issue) => (
                <div key={issue.id} className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/[0.12] hover:shadow-purple-500/10 hover:shadow-2xl transition-all duration-300 group">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-200">{issue.title}</h3>
                          <p className="text-white/70 leading-relaxed">{issue.description}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <span className={`px-3 py-2 rounded-xl text-sm font-semibold backdrop-blur-sm border border-white/20 ${getTypeColorModern(issue.type)}`}>
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
                            {issue.type.replace('_', ' ')}
                          </div>
                        </span>
                        <span className={`px-3 py-2 rounded-xl text-sm font-semibold backdrop-blur-sm border border-white/20 ${getStatusColorModern(issue.status)}`}>
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
                            {issue.status.replace('_', ' ')}
                          </div>
                        </span>
                        <span className={`px-3 py-2 rounded-xl text-sm font-semibold backdrop-blur-sm border border-white/20 ${getPriorityColorModern(issue.priority)}`}>
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
                            {issue.priority}
                          </div>
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <div className="text-white/50 text-sm font-medium">
                        {new Date(issue.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <button className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 text-sm font-medium group/button">
                        <span>View Details</span>
                        <svg className="w-4 h-4 ml-2 group-hover/button:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Issue Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-white">Create New Issue</h3>
                <p className="text-white/60 mt-1">Report a security vulnerability or assessment</p>
              </div>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-white/60 hover:text-white transition-colors duration-200 p-2 hover:bg-white/10 rounded-xl"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="group">
                <label className="block text-sm font-semibold text-white/90 mb-3">Issue Title</label>
                <input
                  type="text"
                  value={newIssue.title}
                  onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                  className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-200 backdrop-blur-sm"
                  placeholder="Enter a descriptive title"
                />
              </div>
              
              <div className="group">
                <label className="block text-sm font-semibold text-white/90 mb-3">Description</label>
                <textarea
                  value={newIssue.description}
                  onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-200 backdrop-blur-sm resize-none"
                  placeholder="Describe the security issue in detail"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-sm font-semibold text-white/90 mb-3">Assessment Type</label>
                  <select
                    value={newIssue.type}
                    onChange={(e) => setNewIssue({ ...newIssue, type: e.target.value as any })}
                    className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-200 backdrop-blur-sm appearance-none cursor-pointer"
                  >
                    <option value="VAPT" className="text-gray-900">VAPT</option>
                    <option value="CLOUD_SECURITY" className="text-gray-900">Cloud Security</option>
                    <option value="RETEAM_ASSESSMENT" className="text-gray-900">Red Team</option>
                  </select>
                </div>
                
                <div className="group">
                  <label className="block text-sm font-semibold text-white/90 mb-3">Priority Level</label>
                  <select
                    value={newIssue.priority}
                    onChange={(e) => setNewIssue({ ...newIssue, priority: e.target.value as any })}
                    className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-200 backdrop-blur-sm appearance-none cursor-pointer"
                  >
                    <option value="LOW" className="text-gray-900">Low</option>
                    <option value="MEDIUM" className="text-gray-900">Medium</option>
                    <option value="HIGH" className="text-gray-900">High</option>
                    <option value="CRITICAL" className="text-gray-900">Critical</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowCreateForm(false)}
                className="flex-1 px-6 py-4 border border-white/20 text-white/70 rounded-2xl hover:bg-white/5 hover:text-white transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={createIssue}
                className="flex-1 group relative px-6 py-4 border border-transparent rounded-2xl text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl font-bold overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Issue
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}