import express from "express";
import { createServer as createViteServer } from "vite";
import axios from "axios";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper to fetch image as base64
  const fetchImageAsBase64 = async (url: string) => {
    try {
      let finalUrl = url;
      if (url.includes('drive.google.com')) {
        const match = url.match(/[-\w]{25,}/);
        if (match) {
          const fileId = match[0];
          finalUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
        }
      }

      const response = await axios.get(finalUrl, {
        responseType: 'arraybuffer',
        timeout: 10000,
        headers: {
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      
      const mimeType = response.headers['content-type'];
      const base64 = Buffer.from(response.data, 'binary').toString('base64');
      return `data:${mimeType};base64,${base64}`;
    } catch (e) {
      console.error('Failed to fetch image:', url);
      // Return a placeholder SVG
      return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiB2aWV3Qm94PSIwIDAgODAwIDYwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzBBMjY0NyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iTW9udHNlcnJhdCIgZm9udC1zaXplPSIzMiIgZmlsbD0iI0Q0QUYzNyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+S1NJTSBTVFJBVEVHSUMgREVDSzwvdGV4dD48L3N2Zz4=';
    }
  };

  const getInvestorPreset = () => {
    const currentDate = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });
    const officeInfo = {
      address: 'Gedung Tempo Scan Lt.32, Jl. H. R. Rasuna Said, Kuningan Timur, Setiabudi, Jakarta Selatan 12950',
      phone: '+62 821-4898-8520',
      email: 'corporate@ksim.co.id',
      website: 'www.ksimholding.co.id',
      logoUrl: 'https://drive.google.com/uc?export=view&id=1X5Vu5s9o4wu0oIsxM3GVLY-OzyI-tz7i',
      managementTeam: [
        {
          name: 'Nunung Suhudiah, S.E.',
          title: 'Ketua Umum Koperasi Syarikat Islam Mandiri',
          photoUrl: 'https://drive.google.com/uc?export=view&id=1bdgKzkInNbZXE6YRF_aNpZo2FpscPcLj'
        },
        {
          name: 'Dr. Hamdan Zoelva, S.H., M.H.',
          title: 'Ketua Dewan Pengawas Koperasi Syarikat Islam Mandiri',
          photoUrl: 'https://drive.google.com/uc?export=view&id=1bdgKzkInNbZXE6YRF_aNpZo2FpscPcLj'
        }
      ]
    };
    return {
      meta: {
        title: 'KOPERASI SYARIKAT ISLAM MANDIRI',
        subtitle: 'Holding Ekonomi Umat Nasional',
        date: currentDate,
        office: officeInfo
      },
      executiveSummary: [
        'Holding koperasi modern yang mengintegrasikan tiga sektor strategis nasional: kelapa sawit, perikanan, dan pertanian hortikultura',
        'Model offtaker eksklusif yang menjamin harga layak dan pasar pasti bagi 15.000+ petani dan nelayan binaan',
        'Infrastruktur pasca panen terintegrasi: mini plant CPO, cold storage, dan pusat sortasi berbasis teknologi',
        'Platform digital untuk transparansi rantai pasok dan akses pasar langsung ke ritel modern & ekspor',
        'Dikelola oleh tim manajemen profesional dengan pengawasan Dewan Pakar terkemuka'
      ],
      problemStatement: {
        title: 'Tantangan Struktural Agromaritim',
        points: [
          'Petani sawit swadaya hanya menikmati 30-40% dari harga jual CPO akibat dominasi tengkulak',
          'Nelayan tradisional di Maluku menjual ikan 50% lebih rendah dari harga pasar karena ketiadaan cold storage',
          'Susut pasca panen sayuran mencapai 25% akibat tidak ada fasilitas sortasi dan grading',
          'Fragmentasi lahan (<2 hektar) dan operasi individual tanpa skala ekonomi',
          'Akses terbatas ke pembiayaan dan pasar modern'
        ],
        opportunity: 'Dengan struktur yang tepat, potensi ekonomi umat di tiga sektor ini dapat meningkatkan kontribusi PDB nasional secara signifikan'
      },
      solution: {
        title: 'Solusi KSIM: Ekosistem Terintegrasi',
        pillars: [
          { name: 'Model Offtaker', description: 'Menjadi pembeli tunggal yang menjamin harga layak dan pasar pasti' },
          { name: 'Infrastruktur Pasca Panen', description: 'Mini plant, cold storage, pusat sortasi di sentra produksi' },
          { name: 'Teknologi Digital', description: 'Platform prediksi panen, marketplace, dan traceability' },
          { name: 'Pendampingan Petani', description: 'Pelatihan teknis, sertifikasi, dan akses input produksi berkualitas' }
        ],
        differentiators: [
          'Menggabungkan kekuatan kolektivitas koperasi dengan profesionalisme korporasi',
          'Fokus pada infrastruktur fisik sebagai fondasi ekosistem',
          'Pendekatan berbasis kemitraan setara, bukan eksploitasi',
          'Diawasi oleh Dewan Pengawas dengan rekam jejak nasional'
        ]
      },
      marketOverview: {
        title: 'Lanskap Pasar & Tren Industri',
        sawit: 'Permintaan global CPO tumbuh 4-5% per tahun. Kebijakan B35 menciptakan pasar domestik stabil.',
        perikanan: 'Konsumsi ikan per kapita Indonesia mencapai 62 kg/tahun. Ekspor tuna dan cakalang tumbuh pesat.',
        pertanian: 'Urbanisasi meningkatkan permintaan sayuran berkualitas untuk ritel modern.',
        tam: 'Nilai ekonomi ketiga sektor mencapai triliunan rupiah dengan jutaan petani/nelayan di 34 provinsi',
        sam: 'Fokus sentra produksi utama: Sumatra/Kalimantan, Maluku, Jawa Barat - 40% potensi nasional',
        som: 'Target 5% pangsa pasar di setiap sektor dalam 3 tahun melalui kemitraan eksklusif'
      },
      businessModel: {
        title: 'Model Bisnis & Pendapatan',
        revenueStreams: [
          'Margin trading komoditas - pembelian dari petani, penjualan ke industri/eksportir',
          'Fee-based income - storage fee, logistics, quality certification',
          'Bagi hasil pembiayaan - pendampingan modal kerja petani'
        ],
        costStructure: [
          'Investasi infrastruktur pasca panen (depresiasi 10-15 tahun)',
          'Biaya operasional: tenaga kerja, energi, transportasi',
          'Teknologi: pengembangan platform digital',
          'Pendampingan petani: pelatihan, sertifikasi'
        ],
        scalability: 'Model mobile dan modular - mini plant bisa dipindah, platform multi-tenant, skema kemitraan standar'
      },
      sectors: {
        sawit: {
          name: 'Ekosistem Sawit Terpadu',
          valueChain: 'Pembibitan → Budidaya → Panen → Pengangkutan → Mini Plant CPO → Penjualan',
          operations: [
            'Kemitraan dengan kelompok tani sawit swadaya di Riau dan Kalimantan',
            'Penyediaan bibit unggul dan pupuk',
            'Pengangkutan TBS menggunakan armada sendiri',
            'Mini plant CPO statis (5 ton/jam) dan mobile'
          ],
          partners: ['GAPKI', 'Pabrik refinery nasional', '10.000 KK Petani Plasma'],
          capacity: '20 unit mini plant (5 ton/jam per unit)',
          locations: ['Riau', 'Kalimantan Barat', 'Kalimantan Tengah'],
          photos: ['sawitPlantation', 'sawitMill']
        },
        perikanan: {
          name: 'Model Offtaker Perikanan',
          valueChain: 'Penangkapan → Pengumpulan → Cold Storage → Pengolahan → Distribusi',
          operations: [
            'Kemitraan dengan 2.000 nelayan tradisional di Maluku',
            'Kapal pengumpul membeli langsung di laut (eliminasi tengkulak)',
            'Cold storage blast freezing (-40°C)',
            'Pengolahan & Ekspor tuna grade A ke Jepang'
          ],
          partners: ['Kementerian Kelautan', 'Asosiasi Nelayan', 'Trading house Jepang'],
          capacity: 'Cold storage 500 ton, 5 kapal pengumpul',
          locations: ['Ambon', 'Seram', 'Buru'],
          photos: ['fisheryOcean', 'fisheryColdStorage']
        },
        pertanian: {
          name: 'Supply Chain Pertanian',
          valueChain: 'Budidaya → Panen → Sortasi → Packing → Distribusi',
          operations: [
            'Kemitraan dengan 5.000 petani di Cianjur & Karawang',
            'Jadwal tanam terkoordinasi',
            'Pusat sortasi dengan AI grading',
            'Pengepakan ritel & Distribusi armada berpendingin'
          ],
          partners: ['Kementan', 'Asosiasi Petani', 'Ritel modern nasional'],
          capacity: 'Sortasi 50 ton/hari, cold storage 300 ton',
          locations: ['Cianjur', 'Karawang', 'Bandung'],
          photos: ['farmVegetables', 'farmDistribution']
        }
      },
      competitiveAdvantages: [
        'Model hybrid: kekuatan koperasi + profesionalisme korporasi',
        'Infrastruktur fisik sebagai entry barrier',
        'Jejaring historis yang mengakar',
        'Fokus nilai tambah di hilir',
        'Transparansi rantai pasok digital',
        'Dewan Pengawas kredibel'
      ],
      swot: {
        strengths: 'Model hybrid, infrastruktur fisik, jejaring umat, fokus hilirisasi',
        weaknesses: 'Modal awal besar, pengembangan SDM daerah',
        opportunities: 'Tren ESG, program ketahanan pangan, digitalisasi',
        threats: 'Fluktuasi harga, perubahan iklim, kompetitor'
      },
      traction: {
        partnerships: [
          'MOU Gapoktan Sawit Riau (5.000 petani, 12.000 ha)',
          'Kerjasama DKP Maluku untuk cold storage',
          'LOI Hypermart untuk sayuran 50 ton/bulan'
        ],
        infrastructure: [
          'Mini plant CPO Kampar - tahap konstruksi',
          'Cold storage Ambon - izin selesai',
          'Pusat sortasi Cianjur - akuisisi lahan'
        ],
        technology: [
          'Super app koperasi (500 petani tester)',
          'Sistem SCM berbasis IoT'
        ],
        impact: {
          farmers: '15.000+', employment: '8.000', income: '30-40%'
        }
      },
      roadmap: {
        phase1: { title: 'Foundation (Bulan 1-12)', milestones: ['Mini plant CPO Riau', 'Cold storage Ambon', 'Pusat sortasi Cianjur', 'Peluncuran super app'] },
        phase2: { title: 'Scaling (Bulan 13-24)', milestones: ['3 unit mini plant Kalimantan', 'Cold storage Buru', 'Pusat sortasi Karawang', 'Ekspor tuna & CPO'] },
        phase3: { title: 'Expansion (Bulan 25-36)', milestones: ['10 unit mini plant', 'Cold storage Papua Barat', 'Pusat sortasi 3 provinsi Jawa', 'Persiapan IPO Koperasi'] }
      },
      risks: [
        { risk: 'Fluktuasi harga', mitigation: 'Diversifikasi 3 sektor, kontrak jangka panjang' },
        { risk: 'Gagal panen', mitigation: 'Pendampingan teknis, asuransi, varietas unggul' },
        { risk: 'Infrastruktur', mitigation: 'Pemeliharaan rutin, teknisi lokal' },
        { risk: 'Regulasi', mitigation: 'Kepatuhan penuh, kerjasama asosiasi' }
      ],
      investmentAsk: {
        title: 'Kemitraan Strategis',
        useOfFunds: ['Pembangunan infrastruktur fisik', 'Pengembangan teknologi digital', 'Modal kerja pembelian panen', 'Ekspansi sentra produksi baru'],
        rationale: ['Investasi pada aset nyata', 'Arus kas berulang margin terprediksi', 'Diversifikasi mengurangi risiko', 'Dukungan pemerintah'],
        investorReturn: ['Bagi hasil kompetitif', 'Dampak sosial terukur', 'Insentif pajak', 'Potensi exit IPO']
      },
      closing: 'Koperasi Syarikat Islam Mandiri: Menjembatani potensi umat dengan pasar global melalui ekosistem yang adil, transparan, dan berkelanjutan. Bersama membangun peradaban ekonomi umat.'
    };
  };

  const getPortfolioImages = () => {
    return {
      sawitPlantation: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
      sawitMill: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=1200&q=80',
      fisheryOcean: 'https://images.unsplash.com/photo-1534951009808-dfd00613984d?auto=format&fit=crop&w=1200&q=80',
      fisheryColdStorage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
      farmVegetables: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1200&q=80',
      farmDistribution: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?auto=format&fit=crop&w=1200&q=80'
    };
  };

  // API Route
  app.get("/api/deck-data", async (req, res) => {
    try {
      const preset = getInvestorPreset();
      const portfolioImages = getPortfolioImages();
      
      const logoBase64 = await fetchImageAsBase64(preset.meta.office.logoUrl);
      const managementPhotos = await Promise.all(
        preset.meta.office.managementTeam.map(m => fetchImageAsBase64(m.photoUrl))
      );
      
      const portfolioBase64 = {
        sawitPlantation: await fetchImageAsBase64(portfolioImages.sawitPlantation),
        sawitMill: await fetchImageAsBase64(portfolioImages.sawitMill),
        fisheryOcean: await fetchImageAsBase64(portfolioImages.fisheryOcean),
        fisheryColdStorage: await fetchImageAsBase64(portfolioImages.fisheryColdStorage),
        farmVegetables: await fetchImageAsBase64(portfolioImages.farmVegetables),
        farmDistribution: await fetchImageAsBase64(portfolioImages.farmDistribution)
      };

      res.json({
        status: 'success',
        data: preset,
        assets: {
          logo: logoBase64,
          managementPhotos: managementPhotos,
          portfolio: portfolioBase64
        }
      });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.toString() });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
