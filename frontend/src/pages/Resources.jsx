import React, { useState } from 'react';
import { Search, Download, FileText, Video, FileCode, FolderOpen, Filter } from 'lucide-react';

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const resources = [
    { id: 1, title: 'Python Cheatsheet', type: 'pdf', size: '2.4 MB', category: 'Programming', icon: FileText },
    { id: 2, title: 'React Tutorial Video', type: 'video', size: '125 MB', category: 'Frontend', icon: Video },
    { id: 3, title: 'Database Schema', type: 'code', size: '45 KB', category: 'Database', icon: FileCode },
    { id: 4, title: 'Machine Learning Notes', type: 'pdf', size: '5.1 MB', category: 'AI/ML', icon: FileText },
    { id: 5, title: 'CSS Animation Library', type: 'code', size: '1.2 MB', category: 'Frontend', icon: FileCode },
    { id: 6, title: 'API Documentation', type: 'pdf', size: '8.7 MB', category: 'Backend', icon: FileText },
    { id: 7, title: 'Docker Tutorial', type: 'video', size: '89 MB', category: 'DevOps', icon: Video },
    { id: 8, title: 'Project Templates', type: 'folder', size: '15 MB', category: 'General', icon: FolderOpen },
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || resource.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const categories = ['All', 'Programming', 'Frontend', 'Backend', 'AI/ML', 'Database', 'DevOps', 'General'];

  const getTypeColor = (type) => {
    switch (type) {
      case 'pdf': return 'bg-red-100 text-red-700';
      case 'video': return 'bg-purple-100 text-purple-700';
      case 'code': return 'bg-green-100 text-green-700';
      case 'folder': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Resources</h1>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="pdf">PDF</option>
                <option value="video">Video</option>
                <option value="code">Code</option>
                <option value="folder">Folder</option>
              </select>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getTypeColor(resource.type)}`}>
                  <resource.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{resource.title}</h3>
                  <p className="text-sm text-gray-500">{resource.category}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span className={`px-2 py-1 rounded ${getTypeColor(resource.type)}`}>
                  {resource.type.toUpperCase()}
                </span>
                <span>{resource.size}</span>
              </div>

              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No resources found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
