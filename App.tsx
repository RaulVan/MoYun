import React, { useState, useMemo } from 'react';
import { INITIAL_POEMS } from './constants';
import { Poem } from './types';
import PoemDetail from './components/PoemDetail';

const App: React.FC = () => {
  const [poems] = useState<Poem[]>(INITIAL_POEMS);
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string | null>(null);

  // Filter Logic
  const filteredPoems = useMemo(() => {
    return poems.filter(poem => {
      const matchesSearch = 
        poem.title.includes(searchQuery) || 
        poem.author.includes(searchQuery) ||
        poem.content.some(line => line.includes(searchQuery));
      
      const matchesTag = filterTag ? poem.tags.includes(filterTag) : true;

      return matchesSearch && matchesTag;
    });
  }, [poems, searchQuery, filterTag]);

  // Featured Poem (Random for demo, usually Daily)
  const dailyPoem = poems[0];

  return (
    <div className="min-h-screen bg-paper bg-paper-texture text-ink selection:bg-vermilion/20 selection:text-ink overflow-x-hidden">
      
      {/* Detail Overlay */}
      {selectedPoem && (
        <PoemDetail 
          poem={selectedPoem} 
          onClose={() => setSelectedPoem(null)} 
        />
      )}

      <div className="flex flex-col md:flex-row min-h-screen">
        
        {/* Navigation / Sidebar (Desktop) */}
        <aside className="w-full md:w-20 md:h-screen border-b md:border-b-0 md:border-r border-stone-200 flex flex-row md:flex-col justify-between items-center py-4 md:py-8 bg-paper z-10 sticky top-0 md:static">
          <div className="font-calligraphy text-2xl text-ink md:writing-vertical-rl cursor-pointer hover:text-vermilion transition-colors px-4">
            墨韵山河
          </div>
          
          <nav className="flex md:flex-col gap-6 text-sm font-serif text-stone-500">
             <button 
              onClick={() => {setFilterTag(null); setSearchQuery('');}} 
              className={`hover:text-ink transition-colors ${!filterTag && !searchQuery ? 'text-vermilion font-bold' : ''}`}
             >
               {window.innerWidth >= 768 ? <span className="vertical-text">全</span> : "全"}
             </button>
             <button onClick={() => setFilterTag('唐')} className={`hover:text-ink transition-colors ${filterTag === '唐' ? 'text-vermilion font-bold' : ''}`}>
               {window.innerWidth >= 768 ? <span className="vertical-text">唐</span> : "唐"}
             </button>
             <button onClick={() => setFilterTag('宋')} className={`hover:text-ink transition-colors ${filterTag === '宋' ? 'text-vermilion font-bold' : ''}`}>
               {window.innerWidth >= 768 ? <span className="vertical-text">宋</span> : "宋"}
             </button>
          </nav>

          <div className="hidden md:block w-8 h-8 border border-vermilion text-vermilion rounded-sm flex items-center justify-center text-xs opacity-60">
            印
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col relative">
          
          {/* Daily Selection Hero Section */}
          <header className="p-8 md:p-16 bg-stone-200/10 border-b border-stone-200/30 flex flex-col justify-center min-h-[30vh]">
            <div className="max-w-3xl">
              <h1 className="text-xs font-bold tracking-[0.3em] text-stone-400 uppercase mb-4 flex items-center gap-2">
                <span className="w-4 h-[1px] bg-stone-400"></span>
                Daily Selection
              </h1>
              <div 
                className="text-5xl md:text-7xl font-serif font-bold text-ink cursor-pointer hover:text-stone-600 transition-colors leading-tight mb-4"
                onClick={() => setSelectedPoem(dailyPoem)}
              >
                {dailyPoem.title}
              </div>
              <div className="text-vermilion font-serif text-lg tracking-widest flex items-center gap-2">
                 <span className="border border-vermilion px-1.5 py-0.5 rounded-[2px] text-sm opacity-80">{dailyPoem.dynasty}</span>
                 <span>{dailyPoem.author}</span>
              </div>
            </div>
          </header>

          {/* Library Section: Search & List */}
          <section className="flex-1 flex flex-col bg-paper/30">
            
            {/* Search Toolbar */}
            <div className="px-6 md:px-12 pt-8 pb-4 flex justify-between items-end">
              <div className="text-xs font-bold tracking-[0.2em] text-stone-300 uppercase hidden md:block">
                 The Collection
              </div>
              
              {/* Search Input */}
              <div className="relative group w-full md:w-auto flex justify-end">
                <div className="relative">
                   <input 
                     type="text" 
                     placeholder="寻诗 / 觅人"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="bg-transparent border-b border-stone-300 focus:border-vermilion outline-none w-full md:w-64 py-2 text-right font-serif placeholder:text-stone-300 text-ink transition-all"
                   />
                   <span className="absolute right-0 -bottom-5 text-[10px] text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      输入字、词或人名
                   </span>
                </div>
              </div>
            </div>

            {/* Poem List Grid */}
            <div className="flex-1 p-6 md:px-12 md:pb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredPoems.map((poem) => (
                  <div 
                    key={poem.id}
                    onClick={() => setSelectedPoem(poem)}
                    className="group relative h-80 border border-stone-100 bg-white/40 hover:border-stone-300 hover:bg-white/80 transition-all duration-500 cursor-pointer p-6 rounded-sm flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md"
                  >
                    {/* Decorative faint background char */}
                    <div className="absolute -right-4 -bottom-8 text-[8rem] font-calligraphy text-stone-100 group-hover:text-stone-200 transition-colors pointer-events-none select-none z-0 opacity-50">
                      {poem.title[0]}
                    </div>

                    {/* Poem Content Snippet */}
                    <div className="relative z-10 flex-1 flex items-start">
                      {/* Desktop Vertical Snippet */}
                      <div className="hidden md:flex flex-row-reverse gap-4 h-48 overflow-hidden mask-gradient-b">
                          <p className="vertical-text text-lg font-bold text-ink group-hover:text-vermilion transition-colors">{poem.title}</p>
                          <p className="vertical-text text-sm text-stone-500">{poem.content[0]}</p>
                          <p className="vertical-text text-sm text-stone-500">{poem.content[1]}</p>
                      </div>
                      
                      {/* Mobile Horizontal Snippet */}
                      <div className="md:hidden space-y-2">
                          <h3 className="text-xl font-bold font-serif group-hover:text-vermilion transition-colors">{poem.title}</h3>
                          <p className="text-stone-500 text-sm font-serif">{poem.content[0]}</p>
                      </div>
                    </div>

                    {/* Footer info */}
                    <div className="relative z-10 pt-4 border-t border-stone-100 flex justify-between items-center">
                      <span className="text-xs text-stone-400 font-serif tracking-widest uppercase">
                        {poem.dynasty} · {poem.author}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-vermilion opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    </div>
                  </div>
                ))}

                {filteredPoems.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center text-stone-300 py-20">
                    <p className="font-serif text-xl">空山不见人</p>
                    <p className="text-sm mt-2">未寻得相关诗词</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Minimal Footer */}
            <footer className="p-6 md:px-12 md:pb-8 text-center md:text-right text-[10px] text-stone-300 font-serif tracking-widest uppercase">
              MoYun © 2024 · Powered by Gemini Nano
            </footer>
          </section>

        </main>
      </div>
    </div>
  );
};

export default App;