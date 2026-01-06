# 🛒 Amazon Product Co-Purchasing Network Analysis

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.8+-green.svg)](https://www.python.org/)
[![Open in Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/drive/1kx0L_GyVSyd4fVy1vJxFy5H2pQO2agtl?usp=sharing)

> **Analisis Jaringan Sosial (AJS)** pada Amazon Product Co-Purchasing Network dengan fokus kategori DVD  
> S-1 Informatika, Telkom University

[🔗 Live Demo](https://ajs-amazon-co-purchases.vercel.app/) | [📓 Google Colab Notebook](https://colab.research.google.com/drive/1kx0L_GyVSyd4fVy1vJxFy5H2pQO2agtl?usp=sharing)

---

## 📖 Overview

Proyek ini melakukan **Analisis Jaringan Sosial (AJS)** pada Amazon Product Co-Purchasing Network dengan fokus khusus pada kategori DVD untuk memahami struktur hubungan antarproduk dan perilaku konsumen melalui dataset dari **Stanford Network Analysis Project (SNAP)**. 

Melalui tahapan pre-processing yang sistematis, inferensi genre, dan optimasi graf, penelitian ini mengeksplorasi **dinamika mikro-komunitas yang heterogen** serta mengidentifikasi produk-produk paling berpengaruh menggunakan berbagai metrik sentralitas seperti **PageRank**, **degree centrality**, dan **K-Core analysis**. 

Hasil penelitian ini tidak hanya memvisualisasikan kompleksitas hubungan **"pelanggan yang membeli ini juga membeli itu"**, tetapi juga memberikan wawasan strategis mengenai pola rekomendasi lintas genre dan simulasi difusi informasi yang krusial bagi pengembangan sistem rekomendasi e-commerce yang lebih cerdas dan tersegmentasi.

### 🎯 Key Findings
- **19,828 DVD products** dianalisis dari 548K+ total produk
- **17,992 produk** memiliki minimal satu koneksi co-purchase
- **Inferensi genre** menggunakan rule-based classification dari hirarki kategori
- **Deteksi komunitas** mengidentifikasi pola clustering berdasarkan genre
- **Visualisasi interaktif** dengan network graph berbasis web

---

## 📁 Project Structure

```
AJS_AmazonCoPurchases/
│
├── amazon_work/                           # 🔧 Google Colab Workspace
│   ├── TUBES_AJS_KEL_6_V5.ipynb          # Main analysis notebook
│   ├── preprocessing.py                   # Data extraction & cleaning script
│   ├── tubes_ajs_kel_6_v5.py             # Python export of notebook
│   │
│   ├── amazon0302_DVD_optimized.csv      # 📊 Final processed dataset
│   ├── amazon0302_DVD_optimized_edgelist.txt  # Edge list format
│   │
│   ├── report_community_detection.csv    # Community detection results
│   ├── report_community_summary.csv      # Community statistics
│   ├── report_genre_correlation.csv      # Genre correlation matrix
│   ├── report_genre_influence.csv        # Genre influence metrics
│   ├── report_nodes_influential.csv      # Most influential nodes
│   ├── report_nodes_k-core.csv           # K-core decomposition
│   ├── report_nodes_ultimate.csv         # Comprehensive node metrics
│   │
│   ├── ic_seedX.gif                      # 🎬 Information Cascade simulation X
│   └── ic_seedY.gif                      # Information Cascade simulation Y
│
├── web/                                   # 🌐 Interactive Visualization
│   ├── index.html                        # Main presentation page
│   ├── styles.css                        # Styling
│   ├── presentation.js                   # Presentation logic
│   ├── data.js                           # Data loader
│   ├── graph_data.json                   # Network graph data
│   ├── graph_genre.json                  # Genre-colored graph
│   ├── nodes.json                        # Node metadata
│   └── edges.json                        # Edge connections
│
├── images/                               # 📸 Project images/diagrams
├── vercel.json                           # Vercel deployment config
└── README.md                             # This file
```

### 📦 `amazon_work/` Folder
Folder ini merupakan **workspace utama** yang digunakan saat eksekusi di **Google Colab**. Semua output dari program seperti file `.csv`, `.txt`, dan `.gif` disimpan di folder ini untuk kemudahan akses dan analisis lebih lanjut.

---

## 🔄 Data & Pre-Processing Pipeline

### 📊 Data Source
- **Primary**: Stanford Network Analysis Project (SNAP)  
  Dataset: Amazon Product Co-Purchasing Network (March 2003)
- **Metadata**: `amazon-meta.txt` (548,552 products)
- **Graph**: `amazon0302.txt` (262,111 nodes, 1,234,877 edges)

### 🛠️ Pre-Processing Steps

#### **1. Ekstraksi & Filtrasi Subset** 🎬
- **Focus**: DVD Category
- **Filter Produk**: Identifikasi produk dengan `group: DVD` dari 548.552 produk metadata
- **Ekstraksi Subgraph**: Mengambil hubungan co-purchasing hanya jika kedua produk (sumber & tujuan) adalah DVD
- **Hasil**: 19.828 produk DVD, 17.992 memiliki minimal satu koneksi
- **Data Point**: ~548K (Meta) / ~262K (Graph) → **19,828 nodes**

#### **2. Inferensi Genre** 🏷️
- **Metode**: Rule-based Classification
- **Sumber Data**: Struktur hirarki kategori dari SNAP `amazon-meta.txt` (bukan mapping Kaggle)
- **Algoritma**: 
  - Deteksi token setelah keyword `Genres`
  - Weighting: Bobot 2× untuk path yang mengandung kata "General"
  - Handling khusus: Special Interests, Westerns, Cult Movies
- **Fallback**: Keyword matching pada judul (misal: "Action" untuk "shooting")

#### **3. Optimasi & Reduksi Graf** 📉
- **Genre Cleaning**: Menghapus produk `UNCATEGORIZED`, merging genre (Anime → Animation)
- **Degree Filtering**: **Low-Degree Removal** (bukan K-core decomposition)
- **Kriteria**: Hapus semua node dengan **Total Degree < 3** (koneksi masuk + keluar)
- **Tujuan**: Menghilangkan noise dan node periferal untuk struktur komunitas yang lebih padat (dense)

#### 📌 Output
File akhir: **`amazon0302_DVD_optimized.csv`** berisi jaringan DVD yang bersih, terklasifikasi berdasarkan genre yang divalidasi, dan memiliki konektivitas kuat untuk analisis komunitas.

---

## 🚀 Installation & Usage

### ⚡ Recommended: Google Colab (Easiest!)

**Cara paling mudah** untuk menjalankan analisis ini adalah menggunakan **Google Colab**:

1. **Klik link berikut**: [![Open in Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/drive/1kx0L_GyVSyd4fVy1vJxFy5H2pQO2agtl?usp=sharing)
2. **Mount Google Drive** anda (untuk akses dataset)
3. **Run All Cells** untuk melihat analisis lengkap
4. Semua dependencies sudah tersedia di Colab!

### 🖥️ Local Installation (Advanced)

Jika ingin menjalankan secara lokal:

```bash
# Clone repository
git clone https://github.com/yourusername/AJS_AmazonCoPurchases.git
cd AJS_AmazonCoPurchases

# Install dependencies
pip install -r requirements.txt
```

**Requirements**:
- Python 3.8+
- pandas
- numpy
- networkx
- matplotlib
- seaborn
- plotly
- python-louvain
- scikit-learn

```bash
# Run Jupyter Notebook
cd amazon_work
jupyter notebook TUBES_AJS_KEL_6_V5.ipynb
```

### 🌐 Web Visualization

Untuk melihat visualisasi interaktif:

1. **Live Demo**: [https://ajs-amazon-co-purchases.vercel.app/](https://ajs-amazon-co-purchases.vercel.app/)
2. **Local**: Buka `web/index.html` di browser

---

## 📊 Analysis Methods

### 1. **Community Detection**
- **Louvain Algorithm**: Deteksi komunitas optimal dengan modularity maximization
- **Analisis Komposisi Genre**: Menilai homogenitas genre dalam komunitas

### 2. **Centrality Analysis**
- **PageRank**: Identifikasi produk paling berpengaruh
- **Degree Centrality**: In-degree dan out-degree analysis
- **K-Core Decomposition**: Struktur core-periphery network

### 3. **Genre Analysis**
- **Correlation Matrix**: Hubungan antar-genre dalam co-purchase
- **Genre Influence**: Analisis dominasi genre dalam network

### 4. **Information Cascade Simulation**
- **Independent Cascade Model**: Simulasi difusi informasi
- **Seed Node Selection**: Strategi pemilihan influencer optimal

---

## 🎨 Interactive Visualization Features

Website presentasi interaktif (`web/index.html`) menyediakan:

- 📍 **Network Graph Visualization**: Vis.js powered interactive graph
- 🎨 **Genre Color-coding**: Visual clustering by genre
- 🔍 **Node Search**: Find products by name or ID
- 📊 **Real-time Statistics**: Network metrics dashboard
- 🎯 **Physics Simulation**: Toggle physics for exploration
- 📱 **Responsive Design**: Works on mobile and desktop

---

## 📈 Key Results & Insights

### Network Statistics
- **Nodes**: 503 (visualization sample)
- **Edges**: 922
- **Density**: 0.003651
- **Directed**: Yes
- **Connected Components**: 162
- **Largest Component**: 13 nodes
- **Diameter**: 3

### Top Genres
1. Drama
2. Action & Adventure
3. Comedy
4. Documentary
5. Horror & Suspense

### Influential Products
Lihat file `report_nodes_influential.csv` untuk daftar lengkap produk berpengaruh berdasarkan berbagai metrik sentralitas.

---

## 👥 Team

**Research Team - Kelompok 6**:

| Name | Role |
|------|------|
| **Rafi Suwargana Putra** | Data Analysis & Visualization |
| **Muhammad Iqbal Rasyid** | Network Analysis & Algorithm |
| **Marcel Epafroditus Hutahaean** | Pre-processing & Genre Inference |

**Program Studi**: S-1 Informatika  
**Universitas**: Telkom University  
**Mata Kuliah**: Analisis Jaringan Sosial

---

## 📚 References & Related Work

1. **Leskovec et al. (2007)** - Graph Mining, Community Detection on Amazon Network
2. **Huang et al. (2004)** - Association Rules with Co-purchase Data
3. **Yang & Leskovec (2015)** - Overlapping Community Detection (BIGCLAM)
4. **Clauset et al. (2004)** - Modularity-based Clustering
5. **Blondel et al. (2008)** - Louvain Algorithm for Community Detection

### Dataset Credits
- **Stanford Network Analysis Project (SNAP)**  
  [https://snap.stanford.edu/data/amazon0302.html](https://snap.stanford.edu/data/amazon0302.html)
- **Amazon Product Metadata**  
  [https://www.kaggle.com/datasets/amazon-reviews](https://www.kaggle.com/datasets/amazon-reviews)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Stanford Network Analysis Project (SNAP) for providing the dataset
- Telkom University for academic support
- All contributors and researchers whose work inspired this analysis

---

## 📧 Contact

For questions or collaborations:
- 🐱 GitHub Issues: [Open an issue](https://github.com/yourusername/AJS_AmazonCoPurchases/issues)
- 📧 Email: [Your Email]

---

<div align="center">
Made with ❤️ by Kelompok 6 - Analisis Jaringan Sosial<br>
S-1 Informatika, Telkom University
</div>
