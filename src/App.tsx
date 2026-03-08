import React, { useState, useEffect, useRef } from 'react';
import { VCon, Party, Dialog, Analysis } from './types';
import { MOCK_VCONS, PARTIES } from './data/mockCase';
import { generateBaseline, checkConsistency, semanticSearch } from './services/geminiService';
import { cn } from './lib/utils';
import { 
  ShieldCheck, 
  Users, 
  FileText, 
  Mic, 
  Search, 
  Menu, 
  Sparkles,
  AlertTriangle, 
  CheckCircle2,
  Clock,
  ChevronRight,
  Lock,
  Send,
  MessageSquare,
  ArrowLeft,
  Download,
  Image as ImageIcon,
  File as FileIcon,
  Video as VideoIcon,
  Play
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';

export default function App() {
  const [activeVCon, setActiveVCon] = useState<VCon>(MOCK_VCONS[0]);
  const [currentUser, setCurrentUser] = useState<Party>(PARTIES.musa);
  const [activeSessionId, setActiveSessionId] = useState<string>(MOCK_VCONS[0].metadata?.sessions?.[2].id || '');
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [generatedAnalysis, setGeneratedAnalysis] = useState<Analysis[]>([]);
  
  // Demo state to track if baseline has been generated
  const [hasBaseline, setHasBaseline] = useState(false);

  const activeSession = activeVCon.metadata?.sessions?.find(s => s.id === activeSessionId);
  const sessionDialogs = activeVCon.dialog.filter(d => d.metadata?.sessionId === activeSessionId);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{query: string, answer: string}[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Reset state when conversation changes
  useEffect(() => {
    // Set default session to the last active one or first one
    const sessions = activeVCon.metadata?.sessions || [];
    const defaultSession = sessions.find(s => s.status === 'active') || sessions[0];
    if (defaultSession) {
      setActiveSessionId(defaultSession.id);
    }
    setGeneratedAnalysis(activeVCon.analysis || []);
    setHasBaseline(false);
    setSearchResults([]);
    setSearchQuery('');
    
    // Reset current user to the first participant of the new conversation
    if (activeVCon.parties.length > 0) {
      setCurrentUser(activeVCon.parties[0]);
    }
  }, [activeVCon]);

  const handleGenerateBaseline = async () => {
    setAiLoading(true);
    
    const response = await generateBaseline(activeVCon);
    
    if (response && response.result) {
      const analysis: Analysis = {
        type: 'baseline',
        name: 'Baseline Analysis',
        body: JSON.stringify(response.result),
        vendor: 'Gemini',
        created_at: new Date().toISOString(),
        dialog: response.dialogIndices
      };
      setGeneratedAnalysis(prev => [...prev, analysis]);
      setHasBaseline(true);
    }
    setAiLoading(false);
  };

  const handleCheckConsistency = async () => {
    setAiLoading(true);
    
    const baselineArtifact = generatedAnalysis.find(a => a.type === 'baseline');
    if (!baselineArtifact) {
      setAiLoading(false);
      return;
    }

    const baselineData = JSON.parse(baselineArtifact.body as string);
    const response = await checkConsistency(activeVCon, baselineData);
    
    if (response && response.result) {
      const analysis: Analysis = {
        type: 'consistency_check',
        name: 'Progress Report',
        body: JSON.stringify(response.result),
        vendor: 'Gemini',
        created_at: new Date().toISOString(),
        dialog: response.dialogIndices
      };
      setGeneratedAnalysis(prev => [...prev, analysis]);
    }
    setAiLoading(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    
    const answer = await semanticSearch(searchQuery, activeVCon);
    
    if (answer) {
      setSearchResults(prev => [{query: searchQuery, answer}, ...prev]);
      setSearchQuery('');
    }
    setIsSearching(false);
  };

  const handleDownloadVCon = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeVCon, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${activeVCon.uuid}.vcon.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // Role-based access control logic
  const canViewDialog = (dialog: Dialog) => {
    if (currentUser.role === 'Mediator') return true;
    
    // Generic role check - if you are the originator, you can see it
    if (dialog.originator !== undefined && activeVCon.parties[dialog.originator]?.id === currentUser.id) return true;

    // If it's a public session or shared, everyone can see (simplified logic)
    return true;
  };

  const visibleDialogs = sessionDialogs.filter(canViewDialog);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-900">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setIsSidebarOpen(false)}>
          <div className="w-80 h-full bg-white shadow-xl flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#EBBC80] rounded-lg flex items-center justify-center text-white font-bold">v</div>
                <span className="font-bold text-xl tracking-tight">vChat</span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-gray-500">
                <ChevronRight size={20} className="rotate-180" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">vCons</div>
              <div className="space-y-2">
                {MOCK_VCONS.map(vcon => (
                  <button
                    key={vcon.uuid}
                    onClick={() => {
                      setActiveVCon(vcon);
                      setIsSidebarOpen(false);
                    }}
                    className={cn(
                      "w-full text-left p-3 rounded-xl border text-sm transition-all duration-200",
                      activeVCon.uuid === vcon.uuid
                        ? "bg-[#EBBC80]/10 border-[#EBBC80]/50 shadow-sm ring-1 ring-[#EBBC80]/20"
                        : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-200"
                    )}
                  >
                    <div className="font-semibold text-gray-900">{vcon.subject}</div>
                    <div className="text-xs text-gray-500 mt-1 line-clamp-1 flex items-center gap-1.5">
                      <span className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        vcon.metadata?.type === 'Healthcare' ? "bg-blue-400" :
                        vcon.metadata?.type === 'Education' ? "bg-purple-400" : "bg-orange-400"
                      )} />
                      {vcon.metadata?.type} • {vcon.parties.length} Parties
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-3 mt-4">Sessions</div>
              <div className="space-y-1">
                {activeVCon.metadata?.sessions?.map(session => (
                  <button
                    key={session.id}
                    onClick={() => {
                      setActiveSessionId(session.id);
                      setIsSidebarOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center justify-between group transition-all duration-200",
                      activeSessionId === session.id 
                        ? "bg-gray-100 text-gray-900 font-medium shadow-sm" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-2 h-2 rounded-full ring-2 ring-white",
                        session.status === 'active' ? "bg-green-500" : "bg-gray-300"
                      )} />
                      <span>{session.title}</span>
                    </div>
                    {session.importSource && (
                      <span className="text-[10px] bg-white border border-gray-100 text-gray-500 px-1.5 py-0.5 rounded shadow-sm">
                        {session.importSource}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Role Switcher (Mobile) */}
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <label className="block relative group">
                <span className="sr-only">Viewing As</span>
                <div className="flex items-center gap-3 p-2 pr-3 rounded-xl bg-white border border-gray-200 shadow-sm group-hover:border-[#EBBC80]/50 transition-all cursor-pointer">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-100">
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">
                        {currentUser.name.substring(0, 2)}
                      </div>
                    )}
                  </div>
                  
                  {/* Text Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider leading-none mb-0.5">Viewing As</div>
                    <div className="text-sm font-semibold text-gray-900 truncate leading-tight">{currentUser.name}</div>
                  </div>

                  {/* Selector Icon */}
                  <div className="text-gray-400">
                    <div className="flex flex-col -space-y-1">
                      <ChevronRight size={12} className="-rotate-90" />
                      <ChevronRight size={12} className="rotate-90" />
                    </div>
                  </div>
                </div>

                {/* Hidden Native Select */}
                <select 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  value={currentUser.id}
                  onChange={(e) => setCurrentUser(PARTIES[e.target.value] || activeVCon.parties.find(p => p.id === e.target.value))}
                >
                  {activeVCon.parties.map(u => (
                    <option key={u.id} value={u.id}>
                       {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar / Navigation (Desktop) */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-gray-200 flex items-center gap-2">
          <div className="w-8 h-8 bg-[#EBBC80] rounded-lg flex items-center justify-center text-white font-bold">
            v
          </div>
          <span className="font-bold text-xl tracking-tight">vChat</span>
        </div>
        
        <div className="p-4">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">vCons</div>
          <div className="space-y-2">
            {MOCK_VCONS.map(vcon => (
              <button
                key={vcon.uuid}
                onClick={() => setActiveVCon(vcon)}
                className={cn(
                  "w-full text-left p-3 rounded-xl border text-sm transition-all duration-200",
                  activeVCon.uuid === vcon.uuid
                    ? "bg-[#EBBC80]/10 border-[#EBBC80]/50 shadow-sm ring-1 ring-[#EBBC80]/20"
                    : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-200"
                )}
              >
                <div className="font-semibold text-gray-900">{vcon.subject}</div>
                <div className="text-xs text-gray-500 mt-1 line-clamp-1 flex items-center gap-1.5">
                  <span className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    vcon.metadata?.type === 'Healthcare' ? "bg-blue-400" :
                    vcon.metadata?.type === 'Education' ? "bg-purple-400" : "bg-orange-400"
                  )} />
                  {vcon.metadata?.type} • {vcon.parties.length} Parties
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-3 mt-4">Sessions</div>
          <div className="space-y-1">
            {activeVCon.metadata?.sessions?.map(session => (
              <button
                key={session.id}
                onClick={() => setActiveSessionId(session.id)}
                className={cn(
                  "w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center justify-between group transition-all duration-200",
                  activeSessionId === session.id 
                    ? "bg-gray-100 text-gray-900 font-medium shadow-sm" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full ring-2 ring-white",
                    session.status === 'active' ? "bg-green-500" : "bg-gray-300"
                  )} />
                  <span>{session.title}</span>
                </div>
                {session.importSource && (
                  <span className="text-[10px] bg-white border border-gray-100 text-gray-500 px-1.5 py-0.5 rounded shadow-sm">
                    {session.importSource}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Role Switcher (Demo Only) */}
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <label className="block relative group">
            <span className="sr-only">Viewing As</span>
            <div className="flex items-center gap-3 p-2 pr-3 rounded-xl bg-white border border-gray-200 shadow-sm group-hover:border-[#EBBC80]/50 transition-all cursor-pointer">
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-100">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">
                    {currentUser.name.substring(0, 2)}
                  </div>
                )}
              </div>
              
              {/* Text Info */}
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider leading-none mb-0.5">Viewing As</div>
                <div className="text-sm font-semibold text-gray-900 truncate leading-tight">{currentUser.name}</div>
              </div>

              {/* Selector Icon */}
              <div className="text-gray-400">
                <div className="flex flex-col -space-y-1">
                  <ChevronRight size={12} className="-rotate-90" />
                  <ChevronRight size={12} className="rotate-90" />
                </div>
              </div>
            </div>

            {/* Hidden Native Select */}
            <select 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              value={currentUser.id}
              onChange={(e) => setCurrentUser(PARTIES[e.target.value] || activeVCon.parties.find(p => p.id === e.target.value))}
            >
              {activeVCon.parties.map(u => (
                <option key={u.id} value={u.id}>
                   {u.name} ({u.role})
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative bg-slate-50/50">
          <>
            {/* Header */}
            <div className="h-14 md:h-16 border-b border-gray-200 bg-white flex items-center justify-between px-3 md:px-6 gap-2">
              <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
                <button 
                  onClick={() => {
                    setIsSidebarOpen(true);
                    setIsAiPanelOpen(false);
                  }}
                  className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg flex-shrink-0"
                >
                  <Menu size={20} />
                </button>
                <div className="flex flex-col min-w-0 flex-1">
                  <h2 className="font-semibold text-sm md:text-lg truncate">{activeSession?.title}</h2>
                  {activeSession?.status === 'active' && (
                     <span className="flex items-center gap-1 text-[10px] text-green-600 md:hidden">
                       <span className="relative flex h-1.5 w-1.5">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                       </span>
                       Live
                     </span>
                  )}
                </div>
                
                {activeSession?.status === 'active' && (
                  <span className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-100 flex-shrink-0">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span>Live Session</span>
                  </span>
                )}
                {activeSession?.importSource && (
                  <span className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-200">
                    <Clock size={12} />
                    Imported from {activeSession.importSource}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2 md:gap-3">
                <button 
                  onClick={handleDownloadVCon}
                  className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors flex-shrink-0"
                  title="Download vCon JSON"
                >
                  <Download size={18} className="md:w-5 md:h-5" />
                </button>
                <button 
                  onClick={() => {
                    setIsAiPanelOpen(!isAiPanelOpen);
                    if (!isAiPanelOpen) setIsSidebarOpen(false);
                  }}
                  className={cn(
                    "p-2 rounded-full transition-colors relative flex-shrink-0",
                    isAiPanelOpen ? "bg-[#EBBC80] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  <Sparkles size={18} className="md:w-5 md:h-5" />
                  {generatedAnalysis.length > 0 && (
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-red-500 rounded-full border-2 border-white" />
                  )}
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
              {visibleDialogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Lock size={48} className="mb-4 opacity-20" />
                  <p>Content redacted for your role ({currentUser.role})</p>
                </div>
              ) : (
                visibleDialogs.map((dialog, idx) => {
                  const sender = activeVCon.parties[dialog.originator || 0];
                  const isMe = sender.id === currentUser.id;
                  
                  return (
                    <div key={idx} className={cn("flex gap-2 md:gap-4 max-w-3xl", isMe ? "ml-auto flex-row-reverse" : "")}>
                      <div className="flex-shrink-0">
                        {sender.avatar ? (
                          <img src={sender.avatar} alt={sender.name} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200" />
                        ) : (
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xs">
                            {sender.name?.substring(0, 2)}
                          </div>
                        )}
                      </div>
                      
                      <div className={cn("flex flex-col", isMe ? "items-end" : "items-start")}>
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-sm font-semibold text-gray-900">{sender.name}</span>
                          <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                            {sender.role}
                          </span>
                          <span className="text-xs text-gray-400 hidden sm:inline">
                            {format(new Date(dialog.start), 'h:mm a')}
                          </span>
                        </div>
                        
                        <div className={cn(
                          "px-3 py-2.5 md:px-5 md:py-3.5 text-sm shadow-sm border max-w-[95%] md:max-w-[90%]",
                          isMe 
                            ? "bg-[#EBBC80] text-white border-[#EBBC80] rounded-2xl rounded-tr-sm" 
                            : "bg-white text-gray-800 border-gray-100 rounded-2xl rounded-tl-sm"
                        )}>
                          {dialog.type === 'audio' ? (
                            <div className="flex items-center gap-3 min-w-[200px]">
                              <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center",
                                isMe ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                              )}>
                                <Mic size={16} />
                              </div>
                              <div className="flex-1">
                                <div className={cn(
                                  "h-1 rounded-full w-full mb-1.5",
                                  isMe ? "bg-white/40" : "bg-gray-200"
                                )} />
                                <div className={cn(
                                  "text-[10px] font-medium uppercase tracking-wide",
                                  isMe ? "text-white/80" : "text-gray-400"
                                )}>Voice Note • {dialog.metadata?.duration}s</div>
                              </div>
                            </div>
                          ) : dialog.type === 'image' ? (
                            <div className="space-y-2">
                              <div className="relative rounded-lg overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => window.open(dialog.content, '_blank')}>
                                <img 
                                  src={dialog.content} 
                                  alt={dialog.metadata?.caption || "Image attachment"} 
                                  className="max-w-full h-auto max-h-[300px] object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              {dialog.metadata?.caption && (
                                <div className={cn("text-xs flex items-center gap-1.5", isMe ? "text-white/90" : "text-gray-500")}>
                                  <ImageIcon size={12} />
                                  <span>{dialog.metadata.caption}</span>
                                </div>
                              )}
                            </div>
                          ) : dialog.type === 'video' ? (
                            <div className="space-y-2">
                              <div className="relative rounded-lg overflow-hidden bg-black aspect-video flex items-center justify-center group">
                                <video 
                                  src={dialog.content} 
                                  controls
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              {dialog.metadata?.caption && (
                                <div className={cn("text-xs flex items-center gap-1.5", isMe ? "text-white/90" : "text-gray-500")}>
                                  <VideoIcon size={12} />
                                  <span>{dialog.metadata.caption}</span>
                                </div>
                              )}
                            </div>
                          ) : dialog.type === 'file' ? (
                            <div className="flex items-center gap-3 min-w-[200px]">
                              <div className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                                isMe ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                              )}>
                                <FileIcon size={20} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate mb-0.5">{dialog.content}</div>
                                <div className={cn(
                                  "text-[10px] uppercase tracking-wide",
                                  isMe ? "text-white/80" : "text-gray-400"
                                )}>
                                  {dialog.metadata?.size || 'Unknown Size'} • {dialog.mimetype.split('/')[1]?.toUpperCase() || 'FILE'}
                                </div>
                              </div>
                              <button 
                                onClick={() => {
                                  // Mock download
                                  const blob = new Blob(['Mock file content'], { type: dialog.mimetype });
                                  const url = URL.createObjectURL(blob);
                                  const a = document.createElement('a');
                                  a.href = url;
                                  a.download = dialog.content;
                                  a.click();
                                  URL.revokeObjectURL(url);
                                }}
                                className={cn(
                                  "p-2 rounded-full transition-colors",
                                  isMe ? "hover:bg-white/10 text-white" : "hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                                )}
                              >
                                <Download size={16} />
                              </button>
                            </div>
                          ) : (
                            <p className="leading-relaxed whitespace-pre-wrap">{dialog.content}</p>
                          )}
                        </div>
                        
                        {/* Attribution / Signature Footer */}
                        <div className={cn(
                          "flex items-center gap-1.5 mt-1.5 transition-opacity px-1",
                          isMe ? "justify-end" : "justify-start"
                        )}>
                          <ShieldCheck size={12} className="text-gray-300" />
                          <span className="text-[10px] text-gray-400 font-medium">Signed & Verified</span>
                          {dialog.metadata?.importedFrom && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span className="text-[10px] text-gray-400">via {dialog.metadata.importedFrom}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input Area (Visual Only) */}
            <div className="p-2 md:p-4 bg-white border-t border-gray-200">
              <div className="flex items-center gap-2 md:gap-3 max-w-4xl mx-auto">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
                  <Mic size={20} />
                </button>
                <div className="flex-1 bg-gray-100 rounded-full px-3 py-2 md:px-4 md:py-2.5 text-sm text-gray-500">
                  Type a message...
                </div>
              </div>
            </div>
          </>
      </div>

      {/* AI Panel (Right Drawer) */}
      <div className={cn(
        "bg-white border-l border-gray-200 shadow-xl flex flex-col transition-all duration-300 ease-in-out z-50 md:z-40",
        isAiPanelOpen ? "translate-x-0" : "translate-x-full md:translate-x-0 md:w-0 md:border-l-0 md:overflow-hidden",
        "fixed inset-y-0 right-0 w-full md:static md:h-full",
        isAiPanelOpen && "md:w-96"
      )}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsAiPanelOpen(false)} 
              className="md:hidden mr-2 text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft size={20} />
            </button>
            <Sparkles size={18} className="text-[#EBBC80]" />
            <h3 className="font-semibold text-sm">AI Tools</h3>
          </div>
          <button onClick={() => setIsAiPanelOpen(false)} className="hidden md:block text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200/50 transition-colors">
            <ChevronRight size={18} className={cn("transition-transform", isAiPanelOpen && "md:rotate-0", !isAiPanelOpen && "rotate-180")} />
          </button>
          <button onClick={() => setIsAiPanelOpen(false)} className="md:hidden text-gray-400 hover:text-gray-600 p-1">
             <span className="text-xs font-medium">Close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 md:space-y-6">
          
          {/* Context Card */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-3 md:p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-blue-600 bg-blue-100 p-1.5 rounded-lg"><Users size={16} /></div>
              <div>
                <h4 className="text-sm font-semibold text-blue-900">{activeVCon.metadata?.type} Context Active</h4>
                <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                  Tools are optimized for {activeVCon.metadata?.type?.toLowerCase()} conversations.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">Available Actions</h4>
            
            {!hasBaseline ? (
              <button 
                onClick={handleGenerateBaseline}
                disabled={aiLoading}
                className="w-full text-left p-3 md:p-4 rounded-2xl border border-gray-200 hover:border-[#EBBC80] hover:bg-[#EBBC80]/5 transition-all group relative overflow-hidden shadow-sm hover:shadow-md bg-white"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-gray-900">
                    {activeVCon.metadata?.type === 'Healthcare' ? 'Initial Assessment' : 
                     activeVCon.metadata?.type === 'Education' ? 'Academic Baseline' : 
                     'Generate Baseline'}
                  </span>
                  <FileText size={18} className="text-gray-400 group-hover:text-[#EBBC80]" />
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {activeVCon.metadata?.type === 'Healthcare' ? 'Summarize patient history and initial diagnosis.' : 
                   activeVCon.metadata?.type === 'Education' ? 'Establish initial performance and goals.' : 
                   'Analyze testimonies to establish facts.'}
                </p>
              </button>
            ) : (
              <button 
                onClick={handleCheckConsistency}
                disabled={aiLoading}
                className="w-full text-left p-3 md:p-4 rounded-2xl border border-gray-200 hover:border-[#EBBC80] hover:bg-[#EBBC80]/5 bg-white transition-all group shadow-sm hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-gray-900">
                    {activeVCon.metadata?.type === 'Healthcare' ? 'Track Progress' : 
                     activeVCon.metadata?.type === 'Education' ? 'Monitor Progress' : 
                     'Check Consistency'}
                  </span>
                  <AlertTriangle size={18} className="text-gray-400 group-hover:text-[#EBBC80]" />
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {activeVCon.metadata?.type === 'Healthcare' ? 'Compare current status against treatment plan.' : 
                   activeVCon.metadata?.type === 'Education' ? 'Track performance against initial goals.' : 
                   'Compare current statements against baseline.'}
                </p>
              </button>
            )}
          </div>

          {/* Semantic Search */}
          <div className="space-y-4 pt-6 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">Semantic Search</h4>
            <form onSubmit={handleSearch} className="relative group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask about the conversation..."
                className="w-full pl-4 pr-12 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#EBBC80] focus:ring-2 focus:ring-[#EBBC80]/20 transition-all shadow-sm"
              />
              <button 
                type="submit" 
                disabled={isSearching || !searchQuery.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-[#EBBC80] disabled:opacity-50 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {isSearching ? <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-[#EBBC80] rounded-full"/> : <Send size={18} />}
              </button>
            </form>

            {/* Search Results */}
            <div className="space-y-3">
              {searchResults.map((result, idx) => (
                <div key={idx} className="bg-gray-50 rounded-xl p-4 text-xs border border-gray-100 shadow-sm">
                  <div className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Search size={12} className="text-[#EBBC80]" />
                    "{result.query}"
                  </div>
                  <div className="text-gray-600 leading-relaxed prose prose-xs max-w-none">
                    <ReactMarkdown>{result.answer}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Artifacts Stream */}
          {generatedAnalysis.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">Generated Reports</h4>
              
              {generatedAnalysis.map((artifact, idx) => {
                const content = JSON.parse(artifact.body as string);
                
                return (
                  <div key={idx} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="bg-gray-50/80 px-4 py-3 border-b border-gray-100 flex items-center justify-between backdrop-blur-sm">
                      <span className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                        {artifact.type === 'baseline' ? <FileText size={12} className="text-blue-500" /> : <AlertTriangle size={12} className="text-orange-500" />}
                        {artifact.name}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">{format(new Date(artifact.created_at), 'h:mm a')}</span>
                    </div>
                    
                    <div className="p-4 text-xs">
                      {artifact.type === 'baseline' && (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                            <span className="text-gray-500 font-medium">Agreement Rate</span>
                            <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md border border-green-100">{content.agreement_rate}</span>
                          </div>
                          <div className="space-y-1">
                            <span className="font-medium text-gray-900 text-[10px] uppercase tracking-wide">Consensus</span>
                            <p className="text-gray-600 leading-relaxed bg-gray-50 p-2.5 rounded-lg border border-gray-100">{content.consensus}</p>
                          </div>
                          {content.dissent && (
                            <div className="space-y-1">
                              <span className="font-medium text-orange-700 text-[10px] uppercase tracking-wide">Dissent</span>
                              <div className="text-gray-600 italic bg-orange-50/50 p-2.5 rounded-lg border border-orange-100">
                                "{content.dissent}"
                              </div>
                            </div>
                          )}
                          {content.key_facts && content.key_facts.length > 0 && (
                            <div className="pt-2 border-t border-gray-100">
                              <span className="font-medium text-gray-900 block mb-2 text-[10px] uppercase tracking-wide">Key Facts</span>
                              <ul className="space-y-1.5">
                                {content.key_facts.map((fact: string, i: number) => (
                                  <li key={i} className="flex items-start gap-2 text-gray-600">
                                    <span className="w-1 h-1 rounded-full bg-gray-400 mt-1.5 shrink-0" />
                                    <span>{fact}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {artifact.type === 'consistency_check' && (
                        <div className="space-y-4">
                          {content.contradiction_found ? (
                            <div className="flex items-center gap-2 text-red-700 bg-red-50 p-3 rounded-xl border border-red-100">
                              <AlertTriangle size={16} />
                              <span className="font-semibold">Contradiction Detected</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-xl border border-green-100">
                              <CheckCircle2 size={16} />
                              <span className="font-semibold">Consistent</span>
                            </div>
                          )}
                          
                          <div className="space-y-3">
                            <div>
                              <div className="text-[10px] uppercase text-gray-400 font-bold mb-1.5">Previous Claim</div>
                              <div className="p-3 bg-gray-50 rounded-xl text-gray-500 line-through decoration-red-300 decoration-2">
                                {content.previous_claim}
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] uppercase text-gray-400 font-bold mb-1.5">Current Claim</div>
                              <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-xl text-gray-800 font-medium">
                                {content.current_claim}
                              </div>
                            </div>
                            <div className="pt-3 border-t border-gray-100">
                              <span className="font-medium text-gray-900 block mb-1.5 text-[10px] uppercase tracking-wide">Analysis</span>
                              <p className="text-gray-600 leading-relaxed">
                                {content.analysis}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-gray-50 px-4 py-2 border-t border-gray-100 flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
                      <ShieldCheck size={12} />
                      Signed & Verified
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {aiLoading && (
             <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-3">
               <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-[#EBBC80]"></div>
               <span className="text-xs font-medium animate-pulse">Processing...</span>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
