import React, { useState } from 'react';
import { Poem, AnalysisResult } from '../types';
import { generatePoemAnalysis, generateInkPainting } from '../services/geminiService';

interface PoemDetailProps {
  poem: Poem;
  onClose: () => void;
}

const PoemDetail: React.FC<PoemDetailProps> = ({ poem, onClose }) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [tab, setTab] = useState<'read' | 'analyze'>('read');

  const handleAnalyze = async () => {
    if (analysis) return; // Already loaded
    setLoadingAnalysis(true);
    const result = await generatePoemAnalysis(poem.title, poem.author, poem.content);
    setAnalysis(result);
    setLoadingAnalysis(false);
  };

  const handleGenerateImage = async () => {
    if (generatedImage) return;
    setLoadingImage(true);
    const imgData = await generateInkPainting(poem.title, poem.content);
    setGeneratedImage(imgData);
    setLoadingImage(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-paper/95 backdrop-blur-sm p-4 md:p-8 animate-fade-in">
      <div className="relative w-full max-w-6xl h-[90vh] bg-paper shadow-2xl border border-stone-200 flex flex-col md:flex-row overflow-hidden rounded-sm">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-2 text-stone-500 hover:text-vermilion transition-colors font-serif"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Left: Visualization (Image or Placeholder) */}
        <div className="w-full md:w-1/2 h-1/3 md:h-full bg-[#f0ede5] relative flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-stone-200">
          {generatedImage ? (
            <div className="relative w-full h-full group">
               <img 
                src={generatedImage} 
                alt="AI Generated Ink Wash" 
                className="w-full h-full object-cover opacity-90 sepia-[.15]"
              />
              <a 
                href={generatedImage} 
                download={`moyun_${poem.title}.png`}
                className="absolute bottom-4 right-4 bg-white/80 hover:bg-white text-ink px-4 py-2 rounded-full text-xs shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                下载画作
              </a>
            </div>
           
          ) : (
            <div className="text-center p-8">
              <div className="mb-4 opacity-20">
                <svg className="w-24 h-24 mx-auto text-ink" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.41L17.5 6.5 9.99 9.91 6.5 17.5zm5.5-6.66c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1 1.1-.49 1.1-1.1-.49-1.1-1.1-1.1z"/>
                </svg>
              </div>
              <p className="text-stone-500 font-serif italic mb-6">"诗中有画"</p>
              <button 
                onClick={handleGenerateImage}
                disabled={loadingImage}
                className="border border-stone-400 text-stone-600 hover:border-vermilion hover:text-vermilion px-6 py-2 transition-all font-serif flex items-center mx-auto gap-2"
              >
                {loadingImage ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-stone-400 border-t-transparent rounded-full"></span>
                    <span>墨染中...</span>
                  </>
                ) : (
                   <>
                    <span>生成意境图</span>
                   </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right: Content & Controls */}
        <div className="w-full md:w-1/2 h-2/3 md:h-full flex flex-col relative bg-paper">
          
          {/* Controls */}
          <div className="absolute top-0 left-0 p-6 flex gap-4 z-20">
             <button 
               onClick={() => setTab('read')}
               className={`text-lg font-serif transition-colors ${tab === 'read' ? 'text-vermilion' : 'text-stone-400 hover:text-ink'}`}
             >
               阅
             </button>
             <button 
               onClick={() => {
                 setTab('analyze');
                 handleAnalyze();
               }}
               className={`text-lg font-serif transition-colors ${tab === 'analyze' ? 'text-vermilion' : 'text-stone-400 hover:text-ink'}`}
             >
               赏
             </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden relative">
            
            {tab === 'read' && (
              <div className="w-full h-full overflow-auto md:overflow-hidden flex flex-col md:flex-row items-center md:justify-center p-8 md:p-12">
                 {/* 
                    Vertical Layout Container 
                    Desktop: vertical-rl (Right to Left flow)
                    Mobile: normal flow (Top to Bottom)
                 */}
                 <div 
                   className="
                     flex flex-col md:block 
                     md:[writing-mode:vertical-rl] 
                     md:h-[80vh] md:overflow-x-auto md:overflow-y-hidden
                     text-left 
                     gap-8 md:gap-0
                     mx-auto
                     scrollbar-hide
                   "
                 >
                    {/* Title (Rightmost in Vertical-RL) */}
                    <h2 className="text-3xl md:text-5xl font-bold font-serif text-ink tracking-[0.2em] md:ml-16 leading-relaxed whitespace-nowrap md:py-4">
                      {poem.title}
                    </h2>
                    
                    {/* Author Info (Left of Title) */}
                    <div className="flex flex-row md:flex-col gap-3 md:gap-4 text-sm md:text-lg text-vermilion font-serif tracking-[0.2em] items-center md:items-start md:ml-10 md:py-4">
                       <span className="border border-vermilion px-1.5 py-0.5 rounded-[2px] opacity-80 whitespace-nowrap">{poem.dynasty}</span>
                       <span className="whitespace-nowrap font-medium">{poem.author}</span>
                    </div>

                    {/* Spacer for aesthetics in vertical mode */}
                    <div className="hidden md:block md:ml-4"></div>

                    {/* Poem Lines (Left of Author) */}
                    {poem.content.map((line, idx) => (
                      <p 
                        key={idx} 
                        className="
                          text-xl md:text-3xl text-ink/90 font-serif 
                          tracking-[0.15em] leading-loose md:leading-[3em] 
                          md:ml-8 whitespace-nowrap md:py-2
                        "
                      >
                        {line}
                      </p>
                    ))}
                 </div>
              </div>
            )}

            {tab === 'analyze' && (
              <div className="h-full w-full overflow-auto p-8 md:p-12 animate-fade-in">
                <div className="max-w-md mx-auto pt-12">
                  {loadingAnalysis ? (
                    <div className="flex flex-col items-center justify-center h-full text-stone-400 space-y-4">
                      <div className="w-1 h-12 bg-stone-200 animate-pulse"></div>
                      <p>AI 正在品读...</p>
                    </div>
                  ) : analysis ? (
                    <div className="space-y-8 font-serif text-ink/80">
                      <div>
                        <h3 className="text-sm font-bold text-indigo mb-2 uppercase tracking-widest">翻译 / Translation</h3>
                        <p className="text-base leading-relaxed italic border-l-2 border-indigo/20 pl-4">{analysis.translation}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-vermilion mb-2 uppercase tracking-widest">赏析 / Appreciation</h3>
                        <p className="text-base leading-relaxed text-justify">{analysis.appreciation}</p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          {/* Footer Logo Seal */}
          <div className="absolute bottom-6 left-6 opacity-30 pointer-events-none z-0">
             <div className="w-8 h-8 border-2 border-vermilion text-vermilion flex items-center justify-center text-xs font-serif rounded-sm">
               墨
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PoemDetail;