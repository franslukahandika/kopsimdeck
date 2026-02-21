import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  FileText, 
  Presentation, 
  ChevronRight, 
  ChevronLeft, 
  Users, 
  TrendingUp, 
  MapPin, 
  Phone, 
  Mail, 
  Globe,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Rocket,
  Target,
  Flag,
  ShieldCheck,
  Link,
  Cpu,
  Zap,
  Award,
  Sparkles,
  Edit3,
  Send
} from 'lucide-react';
import { APIResponse, DeckData, DeckAssets } from './types';
import { generateSectorImage, editSectorImage } from './services/geminiService';
import pptxgen from 'pptxgenjs';
import html2pdf from 'html2pdf.js';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DeckData | null>(null);
  const [assets, setAssets] = useState<DeckAssets | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [generatingImages, setGeneratingImages] = useState(false);
  const [editingImageKey, setEditingImageKey] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const deckRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/deck-data')
      .then(res => res.json())
      .then((res: APIResponse) => {
        if (res.status === 'success') {
          setData(res.data);
          setAssets(res.assets);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const paginate = (newDirection: number) => {
    const nextSlide = currentSlide + newDirection;
    if (nextSlide >= 0 && nextSlide < slides.length) {
      setDirection(newDirection);
      setCurrentSlide(nextSlide);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    })
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const generatePDF = async () => {
    const printElement = document.getElementById('print-version');
    if (!printElement) return;

    const opt = {
      margin: 0,
      filename: 'KSIM_Strategic_Deck.pdf',
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        logging: false,
        width: 1200,
        windowWidth: 1200,
        scrollY: 0,
        scrollX: 0
      },
      jsPDF: { unit: 'px' as const, format: [1200, 675] as [number, number], orientation: 'landscape' as const },
      pagebreak: { mode: ['css', 'legacy'] }
    };

    try {
      await html2pdf().set(opt).from(printElement).save();
    } catch (error) {
      console.error('PDF Generation Error:', error);
    }
  };

  const generatePPTX = async () => {
    if (!data || !assets) return;

    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';
    
    const colorPri = '0F172A';
    const colorSec = '334155';
    const colorAcc = 'C5A059';
    const colorText = '475569';

    // Slide 1: Cover
    let s1 = pptx.addSlide();
    if (assets.logo) {
      s1.addImage({ data: assets.logo, x: 3.9, y: 1, w: 2.2, h: 2.2, sizing: { type: 'contain', w: 2.2, h: 2.2 } });
    }
    s1.addText(data.meta.title, { x: 0.5, y: 3.5, w: 9, fontSize: 36, color: colorPri, bold: true, align: 'center', fontFace: 'Arial' });
    s1.addText(data.meta.subtitle, { x: 0.5, y: 4.3, w: 9, fontSize: 22, color: colorAcc, align: 'center', bold: true, fontFace: 'Arial' });
    s1.addText(data.meta.date, { x: 0.5, y: 5.0, w: 9, fontSize: 14, color: colorText, align: 'center', fontFace: 'Arial' });

    // Slide 2: Executive Summary
    let s2 = pptx.addSlide();
    s2.addText('EXECUTIVE SUMMARY', { x: 0.5, y: 0.4, w: 9, fontSize: 28, color: colorPri, bold: true, fontFace: 'Arial' });
    s2.addShape(pptx.ShapeType.rect, { fill: { color: colorAcc }, x: 0.5, y: 0.9, w: 2, h: 0.05 });
    
    s2.addText(data.executiveSummary.map(text => ({ text, options: { bullet: true, color: colorText, fontSize: 14 } })), { x: 0.5, y: 1.3, w: 5.5, h: 4 });
    
    s2.addShape(pptx.ShapeType.roundRect, { fill: { color: colorPri }, x: 6.5, y: 1.5, w: 3, h: 2.5, rectRadius: 0.2 });
    s2.addText(data.traction.impact.farmers, { x: 6.5, y: 2.0, w: 3, fontSize: 48, color: colorAcc, bold: true, align: 'center' });
    s2.addText('Petani & Nelayan Binaan', { x: 6.5, y: 2.8, w: 3, fontSize: 14, color: 'FFFFFF', align: 'center', bold: true });

    // Slide 3: Management Team
    let s3 = pptx.addSlide();
    s3.addText('MANAGEMENT & SUPERVISION', { x: 0.5, y: 0.4, w: 9, fontSize: 28, color: colorPri, bold: true, fontFace: 'Arial' });
    s3.addShape(pptx.ShapeType.rect, { fill: { color: colorAcc }, x: 0.5, y: 0.9, w: 2, h: 0.05 });

    data.meta.office.managementTeam.forEach((member, i) => {
      const yPos = 1.5 + (i * 1.8);
      s3.addShape(pptx.ShapeType.roundRect, { fill: { color: 'F1F5F9' }, x: 0.5, y: yPos, w: 9, h: 1.5, rectRadius: 0.1 });
      if (assets.managementPhotos[i]) {
        s3.addImage({ data: assets.managementPhotos[i], x: 0.8, y: yPos + 0.25, w: 1, h: 1, rounding: true });
      }
      s3.addText(member.name, { x: 2.0, y: yPos + 0.4, w: 7, fontSize: 18, color: colorPri, bold: true });
      s3.addText(member.title, { x: 2.0, y: yPos + 0.7, w: 7, fontSize: 12, color: colorText });
    });

    // Slide 4: Problem & Solution
    let s4 = pptx.addSlide();
    s4.addText('PROBLEM & SOLUTION', { x: 0.5, y: 0.4, w: 9, fontSize: 28, color: colorPri, bold: true });
    s4.addShape(pptx.ShapeType.rect, { fill: { color: colorAcc }, x: 0.5, y: 0.9, w: 2, h: 0.05 });

    s4.addShape(pptx.ShapeType.roundRect, { fill: { color: 'F1F5F9' }, x: 0.5, y: 1.3, w: 4.3, h: 3.8, rectRadius: 0.1 });
    s4.addText(data.problemStatement.title, { x: 0.7, y: 1.5, w: 4, fontSize: 18, color: colorPri, bold: true });
    s4.addText(data.problemStatement.points.slice(0, 4).map(p => ({ text: p, options: { bullet: true, fontSize: 11, color: colorText } })), { x: 0.7, y: 2.0, w: 4 });

    s4.addShape(pptx.ShapeType.roundRect, { fill: { color: 'FFFFFF' }, line: { color: colorSec, width: 2 }, x: 5.2, y: 1.3, w: 4.3, h: 3.8, rectRadius: 0.1 });
    s4.addText(data.solution.title, { x: 5.4, y: 1.5, w: 4, fontSize: 18, color: colorPri, bold: true });
    s4.addText(data.solution.pillars.map(p => ({ text: p.name + ': ' + p.description, options: { bullet: true, fontSize: 11, color: colorText } })), { x: 5.4, y: 2.0, w: 4 });
    
    // Slide 5: Competitive Advantages
    let s5 = pptx.addSlide();
    s5.addText('COMPETITIVE ADVANTAGES', { x: 0.5, y: 0.4, w: 9, fontSize: 28, color: colorPri, bold: true });
    s5.addShape(pptx.ShapeType.rect, { fill: { color: colorAcc }, x: 0.5, y: 0.9, w: 2, h: 0.05 });

    data.competitiveAdvantages.forEach((adv, i) => {
      const xPos = 0.5 + (i % 3) * 3.1;
      const yPos = 1.3 + Math.floor(i / 3) * 2.1;
      s5.addShape(pptx.ShapeType.roundRect, { fill: { color: 'FFFFFF' }, line: { color: colorAcc, width: 2 }, x: xPos, y: yPos, w: 2.8, h: 1.8, rectRadius: 0.1 });
      s5.addText(adv, { x: xPos + 0.1, y: yPos + 0.5, w: 2.6, fontSize: 14, color: colorPri, bold: true, align: 'center' });
    });

    // Sector Slides (Sawit, Perikanan, Pertanian)
    const sectors = [
      { key: 'sawit', title: 'SEKTOR 1: KELAPA SAWIT', color: 'E5D5B5', img1: assets.portfolio.sawitPlantation, img2: assets.portfolio.sawitMill },
      { key: 'perikanan', title: 'SEKTOR 2: PERIKANAN', color: 'EFF6FF', img1: assets.portfolio.fisheryOcean, img2: assets.portfolio.fisheryColdStorage },
      { key: 'pertanian', title: 'SEKTOR 3: PERTANIAN', color: 'ECFDF5', img1: assets.portfolio.farmVegetables, img2: assets.portfolio.farmDistribution }
    ];

    sectors.forEach(sector => {
      let s = pptx.addSlide();
      const sData = data.sectors[sector.key as keyof typeof data.sectors];
      s.addText(sector.title, { x: 0.5, y: 0.4, w: 9, fontSize: 28, color: colorPri, bold: true });
      s.addShape(pptx.ShapeType.rect, { fill: { color: colorAcc }, x: 0.5, y: 0.9, w: 2, h: 0.05 });

      s.addShape(pptx.ShapeType.roundRect, { fill: { color: sector.color }, x: 0.5, y: 1.3, w: 4.5, h: 0.6, rectRadius: 0.1 });
      s.addText('Rantai Nilai: ' + sData.valueChain, { x: 0.7, y: 1.3, w: 4.1, h: 0.6, fontSize: 12, color: colorPri, bold: true, align: 'center' });

      s.addText(sData.operations.map(o => ({ text: o, options: { bullet: true, fontSize: 12, color: colorText } })), { x: 0.5, y: 2.1, w: 4.5 });
      
      if (sector.img1) s.addImage({ data: sector.img1, x: 5.2, y: 1.3, w: 4.3, h: 1.8, sizing: { type: 'cover', w: 4.3, h: 1.8 } });
      if (sector.img2) s.addImage({ data: sector.img2, x: 5.2, y: 3.3, w: 4.3, h: 1.8, sizing: { type: 'cover', w: 4.3, h: 1.8 } });
    });

    // Slide 9: Roadmap
    let s8 = pptx.addSlide();
    s8.addText('STRATEGIC ROADMAP', { x: 0.5, y: 0.4, w: 9, fontSize: 28, color: colorPri, bold: true });
    s8.addShape(pptx.ShapeType.rect, { fill: { color: colorAcc }, x: 0.5, y: 0.9, w: 2, h: 0.05 });

    [data.roadmap.phase1, data.roadmap.phase2, data.roadmap.phase3].forEach((phase, i) => {
      const xPos = 0.5 + (i * 3.1);
      s8.addShape(pptx.ShapeType.roundRect, { fill: { color: 'F1F5F9' }, x: xPos, y: 1.3, w: 2.8, h: 4, rectRadius: 0.1, line: { color: colorPri, width: 1 } });
      s8.addText(phase.title, { x: xPos + 0.1, y: 1.5, w: 2.6, fontSize: 16, color: colorPri, bold: true, align: 'center' });
      s8.addText(phase.milestones.map(m => ({ text: m, options: { bullet: true, fontSize: 10, color: colorText } })), { x: xPos + 0.1, y: 2.0, w: 2.6 });
    });

    // Slide 10: Investment Ask & Closing
    let s9 = pptx.addSlide();
    s9.addText('INVESTMENT PROPOSITION', { x: 0.5, y: 0.4, w: 9, fontSize: 28, color: colorPri, bold: true });
    s9.addShape(pptx.ShapeType.rect, { fill: { color: colorAcc }, x: 0.5, y: 0.9, w: 2, h: 0.05 });

    const boxes = [
      { title: 'Penggunaan Dana', data: data.investmentAsk.useOfFunds, color: colorPri },
      { title: 'Rationale', data: data.investmentAsk.rationale, color: colorAcc },
      { title: 'Return & Exit', data: data.investmentAsk.investorReturn, color: colorSec }
    ];

    boxes.forEach((box, i) => {
      const xPos = 0.5 + (i * 3.1);
      s9.addShape(pptx.ShapeType.roundRect, { fill: { color: 'FFFFFF' }, line: { color: box.color, width: 2 }, x: xPos, y: 1.3, w: 2.8, h: 2.5, rectRadius: 0.1 });
      s9.addText(box.title, { x: xPos + 0.1, y: 1.5, w: 2.6, fontSize: 14, color: colorPri, bold: true, align: 'center' });
      s9.addText(box.data.map(d => ({ text: d, options: { bullet: true, fontSize: 9, color: colorText } })), { x: xPos + 0.1, y: 1.9, w: 2.6 });
    });

    s9.addShape(pptx.ShapeType.roundRect, { fill: { color: colorPri }, x: 0.5, y: 4.1, w: 9, h: 1.2, rectRadius: 0.2 });
    s9.addText(`"${data.closing}"`, { x: 0.7, y: 4.3, w: 8.6, fontSize: 14, color: 'FFFFFF', italic: true, align: 'center' });
    s9.addText(`${data.meta.office.website} | ${data.meta.office.phone}`, { x: 0.7, y: 4.8, w: 8.6, fontSize: 10, color: colorAcc, align: 'center' });

    pptx.writeFile({ fileName: 'KSIM_Strategic_Deck.pptx' });
  };

  const handleGenerateAIImages = async () => {
    if (!data || !assets) return;
    setGeneratingImages(true);

    const prompts = {
      sawitPlantation: "A vast, lush green sustainable oil palm plantation in Indonesia, aerial view, morning mist, professional agricultural photography.",
      sawitMill: "A modern, clean industrial mini CPO processing plant, sustainable technology, professional industrial architecture photography.",
      fisheryOcean: "A modern fishing vessel in the deep blue Indonesian ocean, sustainable fishing practices, cinematic sunrise, high-end maritime photography.",
      fisheryColdStorage: "A state-of-the-art industrial cold storage facility for seafood, clean blue lighting, professional logistics photography.",
      farmVegetables: "A high-tech greenhouse with vibrant organic vegetables, hydroponic systems, bright natural lighting, professional horticulture photography.",
      farmDistribution: "A modern agricultural distribution center with refrigerated trucks, organized logistics, professional supply chain photography."
    };

    try {
      const newPortfolio = { ...assets.portfolio };
      
      for (const [key, prompt] of Object.entries(prompts)) {
        const generated = await generateSectorImage(prompt);
        if (generated) {
          (newPortfolio as any)[key] = generated;
        }
      }

      setAssets({
        ...assets,
        portfolio: newPortfolio
      });
    } catch (error) {
      console.error("Failed to generate AI images:", error);
    } finally {
      setGeneratingImages(false);
    }
  };

  const handleEditImage = async (key: string) => {
    if (!assets || !editPrompt) return;
    setIsEditing(true);
    try {
      const currentImage = (assets.portfolio as any)[key];
      const edited = await editSectorImage(currentImage, editPrompt);
      if (edited) {
        setAssets({
          ...assets,
          portfolio: {
            ...assets.portfolio,
            [key]: edited
          }
        });
        setEditingImageKey(null);
        setEditPrompt("");
      }
    } catch (error) {
      console.error("Failed to edit image:", error);
    } finally {
      setIsEditing(false);
    }
  };

  const ImageWithEdit = ({ imageKey, src, className }: { imageKey: string, src: string, className?: string }) => (
    <div className={`relative group/img ${className}`}>
      <img src={src} className="w-full h-full object-cover rounded-xl shadow-md" />
      <div className="absolute inset-0 bg-black-40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
        {editingImageKey === imageKey ? (
          <div className="p-4 bg-white rounded-xl shadow-2xl w-full mx-4 flex flex-col gap-2">
            <input 
              autoFocus
              className="text-xs p-2 border border-slate-200 rounded-lg text-primary outline-none focus:ring-2 focus:ring-accent"
              placeholder="e.g. Add more sunset glow..."
              value={editPrompt}
              onChange={(e) => setEditPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEditImage(imageKey)}
            />
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setEditingImageKey(null)}
                className="text-[10px] uppercase font-bold text-slate-400 hover:text-slate-600"
              >
                Cancel
              </button>
              <button 
                disabled={isEditing}
                onClick={() => handleEditImage(imageKey)}
                className="bg-accent text-white p-1.5 rounded-lg hover:bg-accent-90 disabled:opacity-50"
              >
                {isEditing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setEditingImageKey(imageKey)}
            className="bg-white-20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white-40 transition-all border border-white-20"
          >
            <Edit3 className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-accent animate-spin mb-4" />
        <h2 className="text-xl font-display font-medium text-primary uppercase tracking-[0.2em]">Memproses Data Strategis...</h2>
      </div>
    );
  }

  if (!data || !assets) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold text-slate-900">Gagal Memuat Data</h2>
          <p className="text-slate-600">Silakan coba segarkan halaman.</p>
        </div>
      </div>
    );
  }

  const renderSlides = (isPrinting = false) => {
    if (!data || !assets) return [];

    const MotionDiv = isPrinting ? 'div' : motion.div;
    const MotionImg = isPrinting ? 'img' : motion.img;
    const MotionH1 = isPrinting ? 'h1' : motion.h1;
    const MotionH2 = isPrinting ? 'h2' : motion.h2;
    const MotionP = isPrinting ? 'p' : motion.p;
    const MotionLi = isPrinting ? 'li' : motion.li;

    const animationProps = isPrinting ? {} : {
      variants: contentVariants,
      initial: "hidden",
      animate: "visible"
    };

    return [
      // Slide 1: Cover
      <div key="cover" className="flex flex-col items-center justify-center h-full text-center relative">
        <div className="absolute inset-0 bg-radial-gradient from-accent-5 to-transparent opacity-50" />
        <MotionImg 
          {...animationProps}
          custom={0}
          src={assets.logo} 
          className="w-56 h-56 object-contain mb-12 relative z-10" 
        />
        <div className="relative z-10">
          <MotionH1 
            {...animationProps}
            custom={1}
            className="text-6xl md:text-8xl font-display font-bold text-primary mb-8 leading-[0.85] tracking-tighter text-balance"
          >
            {data.meta.title}
          </MotionH1>
          <MotionH2 
            {...animationProps}
            custom={2}
            className="text-2xl md:text-3xl font-display font-medium text-accent uppercase tracking-[0.25em] mb-16"
          >
            {data.meta.subtitle}
          </MotionH2>
          <MotionP 
            {...animationProps}
            custom={3}
            className="text-slate-400 font-bold uppercase tracking-widest text-sm"
          >
            {data.meta.date}
          </MotionP>
        </div>
      </div>,

      // Slide 2: Executive Summary
      <div key="summary" className="h-full flex flex-col">
        <div className="mb-4">
          <span className="slide-subtitle">Overview</span>
          <MotionH2 {...animationProps} custom={0} className="section-title">Executive Summary</MotionH2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 flex-grow items-center">
          <div className="md:col-span-7">
            <ul className="space-y-6">
              {data.executiveSummary.map((item, i) => (
                <MotionLi 
                  key={i}
                  {...animationProps}
                  custom={i + 1}
                  className="flex items-start gap-4 text-xl text-slate-700 leading-relaxed"
                >
                  <div className="w-8 h-8 rounded-full bg-accent-10 flex items-center justify-center flex-shrink-0 mt-1">
                    <ChevronRight className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-balance">{item}</span>
                </MotionLi>
              ))}
            </ul>
          </div>
          <MotionDiv 
            {...animationProps}
            custom={3}
            className="md:col-span-5"
          >
            <div className="bg-primary rounded-[3rem] p-12 text-white text-center shadow-2xl border-t-8 border-accent relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
              <TrendingUp className="w-20 h-20 text-accent mx-auto mb-6" />
              <div className="text-8xl font-display font-bold text-accent mb-2 tracking-tighter">{data.traction.impact.farmers}</div>
              <div className="text-lg font-bold uppercase tracking-[0.3em] opacity-60">Petani & Nelayan Binaan</div>
            </div>
          </MotionDiv>
        </div>
      </div>,

      // Slide 3: Management Team
      <div key="team" className="h-full flex flex-col">
        <div className="mb-4">
          <span className="slide-subtitle">Leadership</span>
          <MotionH2 {...animationProps} custom={0} className="section-title">Management & Supervision</MotionH2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 flex-grow items-center">
          {data.meta.office.managementTeam.map((member, i) => (
            <MotionDiv 
              key={i}
              {...animationProps}
              custom={i + 1}
              className="card-glass p-8 flex items-center gap-8 border-l-[12px] border-accent shadow-xl hover:shadow-2xl transition-all duration-500 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-accent rounded-full scale-110 opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                <img 
                  src={assets.managementPhotos[i]} 
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg relative z-10" 
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary mb-2">{member.name}</h3>
                <p className="text-slate-500 font-medium leading-relaxed text-lg">{member.title}</p>
              </div>
            </MotionDiv>
          ))}
        </div>
      </div>,

      // Slide 4: Problem & Solution
      <div key="problem-solution" className="h-full flex flex-col">
        <div className="mb-4">
          <span className="slide-subtitle">Market Gaps</span>
          <MotionH2 {...animationProps} custom={0} className="section-title">Problem & Solution</MotionH2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 flex-grow items-stretch">
          <MotionDiv {...animationProps} custom={1} className="bg-slate-100-50 p-10 rounded-[2.5rem] border-l-[12px] border-red-500-30 flex flex-col">
            <h3 className="text-3xl font-bold text-primary mb-8 flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-red-500" />
              {data.problemStatement.title}
            </h3>
            <ul className="space-y-6 flex-grow">
              {data.problemStatement.points.slice(0, 4).map((point, i) => (
                <li key={i} className="flex items-start gap-4 text-lg text-slate-600 leading-relaxed">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2.5 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </MotionDiv>
          <MotionDiv {...animationProps} custom={2} className="card-glass p-10 border-l-[12px] border-emerald-500 shadow-2xl flex flex-col">
            <h3 className="text-3xl font-bold text-primary mb-8 flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              {data.solution.title}
            </h3>
            <div className="grid grid-cols-1 gap-6 flex-grow">
              {data.solution.pillars.map((pillar, i) => (
                <div key={i} className="bg-white-50 p-4 rounded-2xl border border-emerald-500-10">
                  <span className="font-bold text-primary text-lg block mb-1">{pillar.name}</span>
                  <p className="text-slate-600 text-sm leading-relaxed">{pillar.description}</p>
                </div>
              ))}
            </div>
          </MotionDiv>
        </div>
      </div>,

      // Slide 5: Competitive Advantages
      <div key="advantages" className="h-full flex flex-col">
        <div className="mb-4">
          <span className="slide-subtitle">Our Edge</span>
          <MotionH2 {...animationProps} custom={0} className="section-title">Competitive Advantages</MotionH2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-grow">
          {data.competitiveAdvantages.map((adv, i) => {
            const icons = [<ShieldCheck />, <Link />, <Cpu />, <Zap />, <Award />, <Globe />];
            const icon = icons[i % icons.length];
            return (
              <MotionDiv 
                key={i}
                {...animationProps}
                custom={i + 1}
                className="card-glass p-10 shadow-xl border-b-8 border-accent flex flex-col items-center text-center hover:-translate-y-4 transition-all duration-500 group"
              >
                <div className="w-24 h-24 bg-primary-5 rounded-[2rem] flex items-center justify-center text-accent mb-8 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                  {React.cloneElement(icon as React.ReactElement, { className: "w-10 h-10" })}
                </div>
                <p className="text-xl font-bold text-primary leading-tight text-balance">{adv}</p>
              </MotionDiv>
            );
          })}
        </div>
      </div>,

      // Slide 6: Sektor Sawit
      <div key="sawit" className="h-full flex flex-col">
        <div className="mb-4">
          <span className="slide-subtitle">Sector 01</span>
          <MotionH2 {...animationProps} custom={0} className="section-title">Kelapa Sawit</MotionH2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 flex-grow">
          <MotionDiv {...animationProps} custom={1} className="md:col-span-7 flex flex-col">
            <div className="bg-primary rounded-[2.5rem] p-10 mb-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-20 rounded-full -mr-16 -mt-16" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold block mb-4">Value Chain Strategy</span>
              <p className="text-3xl font-bold leading-tight text-balance">{data.sectors.sawit.valueChain}</p>
            </div>
            <div className="grid grid-cols-2 gap-6 flex-grow">
              {data.sectors.sawit.operations.map((op, i) => (
                <div key={i} className="flex items-start gap-4 p-5 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-8 h-8 rounded-xl bg-accent text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    {i + 1}
                  </div>
                  <span className="text-base text-slate-700 font-semibold leading-snug">{op}</span>
                </div>
              ))}
            </div>
          </MotionDiv>
          <MotionDiv {...animationProps} custom={2} className="md:col-span-5 grid grid-cols-1 gap-6">
            <ImageWithEdit imageKey="sawitPlantation" src={assets.portfolio.sawitPlantation} className="h-full" />
            <ImageWithEdit imageKey="sawitMill" src={assets.portfolio.sawitMill} className="h-full" />
          </MotionDiv>
        </div>
      </div>,

      // Slide 7: Sektor Perikanan
      <div key="perikanan" className="h-full flex flex-col">
        <div className="mb-4">
          <span className="slide-subtitle">Sector 02</span>
          <MotionH2 {...animationProps} custom={0} className="section-title">Perikanan</MotionH2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 flex-grow">
          <MotionDiv {...animationProps} custom={1} className="md:col-span-7 flex flex-col">
            <div className="bg-blue-500 rounded-[2.5rem] p-10 mb-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white-20 rounded-full -mr-16 -mt-16" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-blue-100 font-bold block mb-4">Value Chain Strategy</span>
              <p className="text-3xl font-bold leading-tight text-balance">{data.sectors.perikanan.valueChain}</p>
            </div>
            <div className="grid grid-cols-2 gap-6 flex-grow">
              {data.sectors.perikanan.operations.map((op, i) => (
                <div key={i} className="flex items-start gap-4 p-5 bg-blue-50-50 rounded-3xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-8 h-8 rounded-xl bg-blue-500 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    {i + 1}
                  </div>
                  <span className="text-base text-slate-700 font-semibold leading-snug">{op}</span>
                </div>
              ))}
            </div>
          </MotionDiv>
          <MotionDiv {...animationProps} custom={2} className="md:col-span-5 grid grid-cols-1 gap-6">
            <ImageWithEdit imageKey="fisheryOcean" src={assets.portfolio.fisheryOcean} className="h-full" />
            <ImageWithEdit imageKey="fisheryColdStorage" src={assets.portfolio.fisheryColdStorage} className="h-full" />
          </MotionDiv>
        </div>
      </div>,

      // Slide 8: Sektor Pertanian
      <div key="pertanian" className="h-full flex flex-col">
        <div className="mb-4">
          <span className="slide-subtitle">Sector 03</span>
          <MotionH2 {...animationProps} custom={0} className="section-title">Pertanian</MotionH2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 flex-grow">
          <MotionDiv {...animationProps} custom={1} className="md:col-span-7 flex flex-col">
            <div className="bg-emerald-500 rounded-[2.5rem] p-10 mb-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white-20 rounded-full -mr-16 -mt-16" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-emerald-100 font-bold block mb-4">Value Chain Strategy</span>
              <p className="text-3xl font-bold leading-tight text-balance">{data.sectors.pertanian.valueChain}</p>
            </div>
            <div className="grid grid-cols-2 gap-6 flex-grow">
              {data.sectors.pertanian.operations.map((op, i) => (
                <div key={i} className="flex items-start gap-4 p-5 bg-emerald-50-50 rounded-3xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    {i + 1}
                  </div>
                  <span className="text-base text-slate-700 font-semibold leading-snug">{op}</span>
                </div>
              ))}
            </div>
          </MotionDiv>
          <MotionDiv {...animationProps} custom={2} className="md:col-span-5 grid grid-cols-1 gap-6">
            <ImageWithEdit imageKey="farmVegetables" src={assets.portfolio.farmVegetables} className="h-full" />
            <ImageWithEdit imageKey="farmDistribution" src={assets.portfolio.farmDistribution} className="h-full" />
          </MotionDiv>
        </div>
      </div>,

      // Slide 9: Roadmap
      <div key="roadmap" className="h-full flex flex-col">
        <div className="mb-4">
          <span className="slide-subtitle">Execution</span>
          <MotionH2 {...animationProps} custom={0} className="section-title">Strategic Roadmap</MotionH2>
        </div>
        <div className="relative flex-grow flex items-center">
          {/* Timeline Connector Line */}
          <div className="absolute top-1/2 left-0 w-full h-1.5 bg-primary-10 -translate-y-1/2 hidden md:block" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full relative z-10">
            {[
              { ...data.roadmap.phase1, icon: <Rocket className="w-10 h-10" /> },
              { ...data.roadmap.phase2, icon: <Target className="w-10 h-10" /> },
              { ...data.roadmap.phase3, icon: <Flag className="w-10 h-10" /> }
            ].map((phase, i) => (
              <MotionDiv 
                key={i} 
                {...animationProps}
                custom={i + 1}
                className="relative"
              >
                {/* Phase Marker */}
                <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white border-4 border-primary rounded-full items-center justify-center z-20 shadow-2xl transition-transform hover:scale-125 duration-500">
                  <div className="w-6 h-6 bg-accent rounded-full animate-pulse" />
                </div>

                <div className="card-glass p-10 shadow-2xl border border-primary-5 relative z-10 hover:-translate-y-4 transition-all duration-500 group">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="p-4 bg-primary-5 rounded-[1.5rem] text-accent group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                      {phase.icon}
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Phase {i + 1}</span>
                      <h3 className="text-2xl font-bold text-primary">{phase.title}</h3>
                    </div>
                  </div>
                  <ul className="space-y-4">
                    {phase.milestones.map((ms, j) => (
                      <li key={j} className="text-base text-slate-600 flex items-start gap-4">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" />
                        <span className="leading-tight font-medium">{ms}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </MotionDiv>
            ))}
          </div>
        </div>
      </div>,

      // Slide 10: Investment Ask
      <div key="investment" className="h-full flex flex-col">
        <div className="mb-4">
          <span className="slide-subtitle">Future Outlook</span>
          <MotionH2 {...animationProps} custom={0} className="section-title">Investment Proposition</MotionH2>
        </div>
        <div className="grid grid-cols-3 gap-8 flex-grow">
          {[
            { title: 'Penggunaan Dana', data: data.investmentAsk.useOfFunds, color: 'border-primary', icon: <TrendingUp className="w-6 h-6" /> },
            { title: 'Rationale', data: data.investmentAsk.rationale, color: 'border-accent', icon: <CheckCircle2 className="w-6 h-6" /> },
            { title: 'Return & Exit', data: data.investmentAsk.investorReturn, color: 'border-secondary', icon: <Users className="w-6 h-6" /> }
          ].map((box, i) => (
            <MotionDiv 
              key={i}
              {...animationProps}
              custom={i + 1}
              className={`card-glass p-8 shadow-xl border-b-8 ${box.color} flex flex-col hover:-translate-y-2 transition-transform duration-300`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-slate-100 rounded-lg text-primary">
                  {box.icon}
                </div>
                <h3 className="text-xl font-bold text-primary uppercase tracking-wider">{box.title}</h3>
              </div>
              <ul className="space-y-4 text-slate-600 flex-grow">
                {box.data.map((item, j) => (
                  <li key={j} className="flex gap-3 text-sm leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </MotionDiv>
          ))}
        </div>
        <MotionDiv 
          {...animationProps}
          custom={4}
          className="mt-12 p-10 bg-primary rounded-[2.5rem] text-white text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-accent-5 opacity-50" />
          <p className="text-2xl italic font-medium mb-6 relative z-10">"{data.closing}"</p>
          <div className="flex justify-center gap-12 text-sm font-bold uppercase tracking-[0.2em] opacity-60 relative z-10">
            <span className="flex items-center gap-2"><Globe className="w-5 h-5 text-accent" /> {data.meta.office.website}</span>
            <span className="flex items-center gap-2"><Phone className="w-5 h-5 text-accent" /> {data.meta.office.phone}</span>
            <span className="flex items-center gap-2"><Mail className="w-5 h-5 text-accent" /> {data.meta.office.email}</span>
          </div>
        </MotionDiv>
      </div>
    ];
  };

  const slides = renderSlides(false);
  const printSlides = renderSlides(true);

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-[#FCFAF7] p-6 rounded-2xl shadow-sm border border-primary-5">
            <div className="flex items-center gap-4">
              <img src={assets.logo} className="w-12 h-12 object-contain" />
              <div>
                <h1 className="text-xl font-display font-bold text-primary tracking-tight">KSIM STRATEGIC DECK</h1>
                <p className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold">Investor Presentation Generator v8.0</p>
              </div>
            </div>
          <div className="flex gap-3">
            <button 
              onClick={handleGenerateAIImages}
              disabled={generatingImages}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all shadow-lg hover:-translate-y-1 border ${
                generatingImages 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : 'bg-emerald-500 text-white hover:bg-emerald-600 border-emerald-400'
              }`}
            >
              <Sparkles className={`w-5 h-5 ${generatingImages ? 'animate-pulse' : ''}`} />
              <span className="tracking-widest text-xs uppercase">
                {generatingImages ? 'Generating...' : 'Generate AI Visuals'}
              </span>
            </button>
            <button 
              onClick={generatePPTX}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-bold hover:bg-primary-90 transition-all shadow-lg hover:-translate-y-1 border border-white-10"
            >
              <Presentation className="w-5 h-5 text-accent" />
              <span className="tracking-widest text-xs uppercase">PPTX</span>
            </button>
            <button 
              onClick={generatePDF}
              className="flex items-center gap-2 px-6 py-3 bg-white text-primary rounded-full font-bold hover:bg-slate-50 transition-all shadow-lg hover:-translate-y-1 border border-primary-10"
            >
              <FileText className="w-5 h-5 text-accent" />
              <span className="tracking-widest text-xs uppercase">PDF</span>
            </button>
          </div>
        </div>

        {/* Slide Viewer */}
        <div className="relative group overflow-hidden rounded-2xl shadow-2xl">
          <div ref={deckRef} className="slide-page !mb-0">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentSlide}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="h-full"
              >
                {slides[currentSlide]}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <button 
            onClick={() => paginate(-1)}
            disabled={currentSlide === 0}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-white-80 backdrop-blur-sm rounded-full shadow-xl text-primary disabled:opacity-30 hover:bg-primary hover:text-white transition-all group-hover:scale-110 z-10 border border-primary-10"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button 
            onClick={() => paginate(1)}
            disabled={currentSlide === slides.length - 1}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white-80 backdrop-blur-sm rounded-full shadow-xl text-primary disabled:opacity-30 hover:bg-primary hover:text-white transition-all group-hover:scale-110 z-10 border border-primary-10"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {slides.map((_, i) => (
            <button 
              key={i}
              onClick={() => {
                setDirection(i > currentSlide ? 1 : -1);
                setCurrentSlide(i);
              }}
              className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === i ? 'w-12 bg-accent' : 'w-3 bg-primary-20 hover:bg-primary-40'}`}
            />
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center text-slate-400 text-[10px] uppercase tracking-[0.2em] font-medium">
          <p>© 2026 Koperasi Syarikat Islam Mandiri. All Rights Reserved.</p>
          <p className="mt-4 flex items-center justify-center gap-2 text-primary-60"><MapPin className="w-3 h-3" /> {data.meta.office.address}</p>
        </div>
      </div>

      {/* Hidden Print Version for PDF Export */}
      <div id="print-version" className="absolute left-[-9999px] top-0 w-[1200px] bg-white" style={{ boxSizing: 'border-box' }}>
        {printSlides.map((slide, i) => (
          <div 
            key={i} 
            className="slide-page !mb-0 !shadow-none !rounded-none border-none overflow-hidden !p-12" 
            style={{ 
              height: '675px', 
              width: '1200px', 
              pageBreakAfter: 'always', 
              position: 'relative',
              boxSizing: 'border-box'
            }}
          >
            <div className="w-full h-full flex flex-col border-4 border-primary-5">
              {slide}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
