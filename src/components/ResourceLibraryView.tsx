import React, { useState, useEffect } from 'react';
import {
  LABVIEW_RESOURCES,
  CERTIFICATION_CATEGORIES,
  RESOURCE_TYPE_FILTERS,
  LabVIEWResource,
  CertificationDifficulty,
  filterResources,
  generateWhitepaperDocumentText,
} from '../data/resourceLibraryData';
import {
  Search,
  BookOpen,
  Download,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Award,
  Users,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Share2,
  Check,
  X,
  SlidersHorizontal,
  Info,
  Clock,
  ArrowRight,
  Layers,
  Cpu,
} from 'lucide-react';

const STORAGE_KEY_BOOKMARKS = 'labview_academy_resource_bookmarks';

interface ResourceLibraryViewProps {
  initialDifficulty?: CertificationDifficulty;
  onOpenExamPrep?: () => void;
  onOpenCertTracker?: () => void;
}

export const ResourceLibraryView: React.FC<ResourceLibraryViewProps> = ({
  initialDifficulty = 'ALL',
  onOpenExamPrep,
  onOpenCertTracker,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<CertificationDifficulty>(initialDifficulty);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'rating' | 'title' | 'difficulty'>('rating');
  const [bookmarkedOnly, setBookmarkedOnly] = useState<boolean>(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
      return saved ? JSON.parse(saved) : ['clad-core-1-2-manual', 'cld-style-guide-blume'];
    } catch {
      return ['clad-core-1-2-manual', 'cld-style-guide-blume'];
    }
  });

  const [activeWhitepaper, setActiveWhitepaper] = useState<LabVIEWResource | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  // Sync bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(bookmarkedIds));
    } catch (e) {
      console.error('Failed to save bookmarks to localStorage', e);
    }
  }, [bookmarkedIds]);

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCopyLink = (resource: LabVIEWResource, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard?.writeText(resource.url);
    setCopiedId(resource.id);
    setTimeout(() => {
      setCopiedId((current) => (current === resource.id ? null : current));
    }, 2000);
  };

  const handleDownloadWhitepaper = (resource: LabVIEWResource, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const content = generateWhitepaperDocumentText(resource);
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = resource.downloadFileName || `${resource.id}-briefing.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccessId(resource.id);
    setTimeout(() => {
      setDownloadSuccessId((current) => (current === resource.id ? null : current));
    }, 2500);
  };

  const filteredResources = filterResources(LABVIEW_RESOURCES, {
    difficulty: selectedDifficulty,
    category: selectedCategory,
    searchQuery,
    bookmarkedOnly,
    bookmarkedIds,
    sortBy,
  });

  // Calculate high-level summary counts
  const totalCount = LABVIEW_RESOURCES.length;
  const officialDocsCount = LABVIEW_RESOURCES.filter((r) => r.category === 'official_doc').length;
  const communityCount = LABVIEW_RESOURCES.filter((r) => r.category === 'community_forum').length;
  const whitepaperCount = LABVIEW_RESOURCES.filter((r) => r.category === 'whitepaper').length;
  const bookmarkedCount = bookmarkedIds.length;

  const getDifficultyBadge = (difficulty: CertificationDifficulty) => {
    switch (difficulty) {
      case 'CLAD':
        return {
          bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
          dot: 'bg-cyan-400',
          label: 'CLAD (Associate)',
        };
      case 'CLD':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          dot: 'bg-amber-400',
          label: 'CLD (Developer)',
        };
      case 'CLA':
        return {
          bg: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
          dot: 'bg-purple-400',
          label: 'CLA (Architect)',
        };
      default:
        return {
          bg: 'bg-slate-700/40 text-slate-300 border-slate-600',
          dot: 'bg-slate-400',
          label: 'All Certification Tiers',
        };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'official_doc':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'community_forum':
        return <Users className="w-4 h-4 text-sky-400" />;
      case 'whitepaper':
        return <FileText className="w-4 h-4 text-amber-400" />;
      default:
        return <BookOpen className="w-4 h-4 text-slate-400" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'official_doc':
        return 'NI Official Manual';
      case 'community_forum':
        return 'Community Forum';
      case 'whitepaper':
        return 'Whitepaper & Guide';
      default:
        return 'Resource';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-amber-950/20 border border-slate-800 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <BookOpen className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold tracking-wider text-amber-400 uppercase">
                Curated NI Engineering Repository
              </span>
            </div>

            {/* Quick Links */}
            <div className="flex items-center gap-2">
              {onOpenCertTracker && (
                <button
                  onClick={onOpenCertTracker}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700 cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Check Exam Readiness</span>
                </button>
              )}
              {onOpenExamPrep && (
                <button
                  onClick={onOpenExamPrep}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Take Practice Exam</span>
                </button>
              )}
            </div>
          </div>

          <div className="max-w-3xl space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Resource & Whitepaper Library
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Direct access to National Instruments official documentation, active peer community forums, and downloadable architectural whitepapers—systematically categorized by certification difficulty level (CLAD, CLD, CLA).
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-slate-800/80">
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
              <span className="text-[11px] text-slate-400 block font-medium">Curated Resources</span>
              <span className="text-xl font-bold text-white mt-0.5 block">{totalCount}</span>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
              <span className="text-[11px] text-emerald-400 block font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> NI Official Docs
              </span>
              <span className="text-xl font-bold text-slate-100 mt-0.5 block">{officialDocsCount}</span>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
              <span className="text-[11px] text-sky-400 block font-medium flex items-center gap-1">
                <Users className="w-3 h-3" /> Community Hubs
              </span>
              <span className="text-xl font-bold text-slate-100 mt-0.5 block">{communityCount}</span>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
              <span className="text-[11px] text-amber-400 block font-medium flex items-center gap-1">
                <FileText className="w-3 h-3" /> Whitepapers & Guides
              </span>
              <span className="text-xl font-bold text-slate-100 mt-0.5 block">{whitepaperCount}</span>
            </div>
            <div className="col-span-2 sm:col-span-1 bg-slate-950/60 border border-slate-800 rounded-xl p-3">
              <span className="text-[11px] text-pink-400 block font-medium flex items-center gap-1">
                <Bookmark className="w-3 h-3" /> Bookmarked
              </span>
              <span className="text-xl font-bold text-pink-300 mt-0.5 block">{bookmarkedCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4">
        {/* Tier Tabs (CLAD, CLD, CLA, ALL) */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-400" /> Tier:
            </span>
            {CERTIFICATION_CATEGORIES.map((cat) => {
              const isSelected = selectedDifficulty === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedDifficulty(cat.id as CertificationDifficulty)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-slate-950/20 text-slate-950 font-black' : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bookmarked toggle */}
          <button
            onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
              bookmarkedOnly
                ? 'bg-pink-500/20 border-pink-500/50 text-pink-300 shadow-md shadow-pink-500/10'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${bookmarkedOnly ? 'fill-pink-400 text-pink-400' : ''}`} />
            <span>Saved for Review</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {bookmarkedCount}
            </span>
          </button>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, architecture, author, SCPI, Actor Framework, DAQmx, or manual..."
              className="w-full pl-10 pr-9 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Select Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
            {RESOURCE_TYPE_FILTERS.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-700 text-white border border-slate-600'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:bg-slate-800/50'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              <option value="rating">Highest Rated</option>
              <option value="title">Title (A-Z)</option>
              <option value="difficulty">Certification Level</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Results Summary */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div>
          Showing <span className="font-semibold text-white">{filteredResources.length}</span> of {totalCount} resources
          {selectedDifficulty !== 'ALL' && (
            <span className="ml-1.5 px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {selectedDifficulty}
            </span>
          )}
          {selectedCategory !== 'all' && (
            <span className="ml-1 px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {getCategoryLabel(selectedCategory)}
            </span>
          )}
          {bookmarkedOnly && (
            <span className="ml-1 px-2 py-0.5 rounded bg-pink-500/10 text-pink-400 border border-pink-500/20">
              Bookmarked Only
            </span>
          )}
        </div>

        {(selectedDifficulty !== 'ALL' || selectedCategory !== 'all' || searchQuery || bookmarkedOnly) && (
          <button
            onClick={() => {
              setSelectedDifficulty('ALL');
              setSelectedCategory('all');
              setSearchQuery('');
              setBookmarkedOnly(false);
            }}
            className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer underline"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Resource Cards Grid */}
      {filteredResources.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-white">No matching resources found</h3>
            <p className="text-xs text-slate-400">
              Try adjusting your search query, selecting "All Levels", or clearing your filters to see available technical documentation.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedDifficulty('ALL');
              setSelectedCategory('all');
              setSearchQuery('');
              setBookmarkedOnly(false);
            }}
            className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all cursor-pointer"
          >
            Clear Filters & View All
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredResources.map((resource) => {
            const badge = getDifficultyBadge(resource.difficulty);
            const isBookmarked = bookmarkedIds.includes(resource.id);
            const isCopied = copiedId === resource.id;
            const isDownloaded = downloadSuccessId === resource.id;

            return (
              <div
                key={resource.id}
                className="group relative bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top Bar: Difficulty Tier & Category Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border ${badge.bg}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                        {badge.label}
                      </span>

                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300">
                        {getCategoryIcon(resource.category)}
                        <span>{getCategoryLabel(resource.category)}</span>
                      </span>

                      {resource.isDownloadable && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 font-semibold">
                          <Download className="w-2.5 h-2.5" />
                          <span>{resource.downloadFormat} • {resource.fileSize}</span>
                        </span>
                      )}
                    </div>

                    {/* Bookmark and Share action buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleCopyLink(resource, e)}
                        title="Copy direct reference link"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        {isCopied ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Share2 className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={(e) => toggleBookmark(resource.id, e)}
                        title={isBookmarked ? 'Remove from bookmarks' : 'Save for exam study'}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isBookmarked
                            ? 'text-pink-400 bg-pink-500/10 hover:bg-pink-500/20'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="w-4 h-4 fill-pink-400" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Title & Publisher */}
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                      {resource.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                      <span className="font-medium text-slate-300">{resource.publisher}</span>
                      <span>•</span>
                      <span className="text-[11px] text-slate-400">{resource.authorOrStandard}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {resource.description}
                  </p>

                  {/* Key Topics Covered (Pills) */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Core Technical Domains:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {resource.keyTopics.map((topic, i) => (
                        <span
                          key={i}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-slate-950/80 text-slate-300 border border-slate-800"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Crucial Architectural Takeaways preview */}
                  <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800/80 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Core Engineering Rule
                    </span>
                    <p className="text-xs text-slate-300 leading-normal italic">
                      "{resource.takeaways[0]}"
                    </p>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-5 mt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-400">
                    <span className="text-slate-300 font-semibold">Target:</span> {resource.recommendedFor}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {/* Read & Study Whitepaper Modal button */}
                    <button
                      onClick={() => setActiveWhitepaper(resource)}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                      <span>Study Overview</span>
                    </button>

                    {/* Download button if downloadable */}
                    {resource.isDownloadable && (
                      <button
                        onClick={(e) => handleDownloadWhitepaper(resource, e)}
                        title="Download whitepaper briefing document"
                        className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          isDownloaded
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {isDownloaded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Downloaded</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            <span>Download ({resource.downloadFormat})</span>
                          </>
                        )}
                      </button>
                    )}

                    {/* External Link */}
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-sm shadow-amber-500/20 cursor-pointer"
                    >
                      <span>Visit Source</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive Whitepaper Reader & Briefing Modal */}
      {activeWhitepaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${
                      getDifficultyBadge(activeWhitepaper.difficulty).bg
                    }`}
                  >
                    {activeWhitepaper.difficultyLabel}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                    {getCategoryLabel(activeWhitepaper.category)}
                  </span>
                  {activeWhitepaper.fileSize && (
                    <span className="text-xs text-slate-400">
                      {activeWhitepaper.fileSize}
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {activeWhitepaper.title}
                </h2>
                <p className="text-xs text-slate-400">
                  Published by <span className="text-slate-300 font-semibold">{activeWhitepaper.publisher}</span> • Standard: {activeWhitepaper.authorOrStandard}
                </p>
              </div>

              <button
                onClick={() => setActiveWhitepaper(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Executive Architectural Summary */}
            <div className="bg-gradient-to-r from-amber-950/20 to-slate-950/50 border border-amber-500/20 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wide">
                <Sparkles className="w-4 h-4" /> Executive Engineering Summary
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {activeWhitepaper.executiveSummary}
              </p>
            </div>

            {/* Detailed Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Full Technical Abstract
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeWhitepaper.description}
              </p>
            </div>

            {/* Core Topics Breakdown */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Exam Syllabus & Architecture Domains
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeWhitepaper.keyTopics.map((topic, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950/60 border border-slate-800 rounded-lg p-2.5"
                  >
                    <span className="w-5 h-5 rounded-md bg-amber-500/10 text-amber-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                      {i + 1}
                    </span>
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Crucial Architectural Takeaways */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Crucial Production & Certification Rules
              </h4>
              <div className="space-y-2">
                {activeWhitepaper.takeaways.map((takeaway, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 bg-slate-950/40 border border-slate-800/80 rounded-xl p-3 text-xs text-slate-300"
                  >
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{takeaway}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Target Audience */}
            <div className="bg-slate-950/40 rounded-xl p-4 border border-slate-800 text-xs text-slate-300 space-y-1">
              <span className="font-bold text-amber-400 block uppercase tracking-wider text-[10px]">
                Recommended Target Audience
              </span>
              <p>{activeWhitepaper.recommendedFor}</p>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleBookmark(activeWhitepaper.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    bookmarkedIds.includes(activeWhitepaper.id)
                      ? 'bg-pink-500/20 border-pink-500/50 text-pink-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>
                    {bookmarkedIds.includes(activeWhitepaper.id)
                      ? 'Bookmarked'
                      : 'Save for Study'}
                  </span>
                </button>

                <button
                  onClick={() => handleCopyLink(activeWhitepaper)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                >
                  {copiedId === activeWhitepaper.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2">
                {activeWhitepaper.isDownloadable && (
                  <button
                    onClick={() => handleDownloadWhitepaper(activeWhitepaper)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Briefing (.md)</span>
                  </button>
                )}

                <a
                  href={activeWhitepaper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  <span>Open Official Site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
