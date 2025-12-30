/**
 * ============================================
 * AMAZON CO-PURCHASE NETWORK PRESENTATION
 * JavaScript Controller
 * ============================================
 * 
 * Features:
 * - Horizontal slide navigation (keyboard only: left/right arrows)
 * - Network graph visualization using Vis.js
 * - Integration ready for Google Colab data
 * 
 * To integrate with your Colab data:
 * 1. Export your graph_data.json from Python
 * 2. Place it in the same folder as this file
 * 3. The script will automatically load it
 */

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    totalSlides: 5,
    transitionDuration: 600,
    graphDataPath: 'graph_data.json',
    genreDataPath: 'genre_data.json'
};

// Genre color mapping
const GENRE_COLORS = {
    'Drama': '#EF4444',
    'Comedy': '#F59E0B',
    'Action & Adventure': '#10B981',
    'Horror': '#6366F1',
    'Kids & Family': '#EC4899',
    'Science Fiction & Fantasy': '#8B5CF6',
    'Mystery & Suspense': '#06B6D4',
    'Documentary': '#84CC16',
    'Television': '#F97316',
    'Music Video & Concerts': '#14B8A6',
    'Musicals & Performing Arts': '#A855F7',
    'Classics': '#78716C',
    'Animation': '#FB7185',
    'Sports': '#22C55E',
    'Military & War': '#64748B',
    'Other': '#94A3B8'
};

// ============================================
// STATE
// ============================================

let state = {
    currentSlide: 0,
    networkInstance: null,
    graphData: null,
    physicsEnabled: true
};

// ============================================
// SLIDE NAVIGATION
// ============================================

/**
 * Navigate to a specific slide
 * @param {number} index - Slide index (0-based)
 */
function goToSlide(index) {
    if (index < 0 || index >= CONFIG.totalSlides) return;
    
    state.currentSlide = index;
    
    // Update wrapper transform
    const wrapper = document.querySelector('.slides-wrapper');
    wrapper.style.transform = `translateX(-${index * 100}vw)`;
    
    // Update navigation dots
    document.querySelectorAll('.nav-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    
    // Update slide counter
    document.querySelector('.slide-counter').textContent = `${index + 1} / ${CONFIG.totalSlides}`;
    
    // Update arrow states
    document.querySelector('.nav-arrow.prev').disabled = index === 0;
    document.querySelector('.nav-arrow.next').disabled = index === CONFIG.totalSlides - 1;
    
    // Mark active slide
    document.querySelectorAll('.slide').forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    
    // Initialize network graph when reaching slide 5
    if (index === 4 && !state.networkInstance) {
        initNetworkGraph();
    }
}

/**
 * Go to next slide
 */
function nextSlide() {
    goToSlide(state.currentSlide + 1);
}

/**
 * Go to previous slide
 */
function prevSlide() {
    goToSlide(state.currentSlide - 1);
}

// ============================================
// KEYBOARD NAVIGATION
// ============================================

function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
            case ' ':
                e.preventDefault();
                nextSlide();
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                prevSlide();
                break;
            case 'Home':
                e.preventDefault();
                goToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                goToSlide(CONFIG.totalSlides - 1);
                break;
        }
    });
}

// ============================================
// CLICK NAVIGATION
// ============================================

function initClickNavigation() {
    // Arrow buttons
    document.querySelector('.nav-arrow.prev').addEventListener('click', prevSlide);
    document.querySelector('.nav-arrow.next').addEventListener('click', nextSlide);
    
    // Dots
    document.querySelectorAll('.nav-dot').forEach((dot) => {
        dot.addEventListener('click', () => {
            const slideIndex = parseInt(dot.dataset.slide);
            goToSlide(slideIndex);
        });
    });
}

// ============================================
// NETWORK GRAPH
// ============================================

/**
 * Load graph data from JSON file
 * Falls back to dummy data if file not found
 */
async function loadGraphData() {
    try {
        const response = await fetch(CONFIG.graphDataPath);
        if (!response.ok) throw new Error('Graph data not found');
        
        const data = await response.json();
        state.graphData = data;
        return data;
    } catch (error) {
        console.log('Using dummy data. To use real data, export graph_data.json from your Colab notebook.');
        return generateDummyData();
    }
}

/**
 * Generate dummy data for demonstration
 */
function generateDummyData() {
    const genres = Object.keys(GENRE_COLORS).slice(0, 8);
    const nodes = [];
    const edges = [];
    
    // Create dummy nodes
    for (let i = 1; i <= 100; i++) {
        const genre = genres[Math.floor(Math.random() * genres.length)];
        nodes.push({
            id: i,
            title: `Product ${i}`,
            genre: genre,
            community: Math.floor(i / 10)
        });
    }
    
    // Create dummy edges (clusters)
    for (let i = 1; i <= 100; i++) {
        // Connect within community
        const communityStart = Math.floor((i - 1) / 10) * 10 + 1;
        const target = communityStart + Math.floor(Math.random() * 10);
        if (target !== i && target <= 100) {
            edges.push({ source: i, target: target });
        }
        
        // Occasional cross-community edge
        if (Math.random() > 0.8) {
            const randomTarget = Math.floor(Math.random() * 100) + 1;
            if (randomTarget !== i) {
                edges.push({ source: i, target: randomTarget });
            }
        }
    }
    
    return { nodes, edges };
}

/**
 * Initialize the network visualization
 */
async function initNetworkGraph() {
    const container = document.getElementById('network-graph');
    if (!container) return;
    
    const data = await loadGraphData();
    
    // Transform nodes for Vis.js
    const visNodes = data.nodes.map(node => ({
        id: node.id,
        label: '', // No label for cleaner look
        title: `${node.title}\nGenre: ${node.genre}\nCommunity: ${node.community}`,
        color: GENRE_COLORS[node.genre] || GENRE_COLORS['Other'],
        group: node.genre,
        value: 1
    }));
    
    // Transform edges for Vis.js
    const visEdges = data.edges.map((edge, idx) => ({
        id: idx,
        from: edge.source,
        to: edge.target,
        arrows: 'to',
        color: { color: '#CBD5E1', opacity: 0.5 }
    }));
    
    // Vis.js options
    const options = {
        nodes: {
            shape: 'dot',
            size: 8,
            font: {
                face: 'Plus Jakarta Sans',
                size: 12,
                color: '#333'
            },
            borderWidth: 2,
            borderWidthSelected: 3
        },
        edges: {
            width: 0.5,
            smooth: {
                type: 'continuous'
            }
        },
        physics: {
            enabled: true,
            stabilization: {
                enabled: true,
                iterations: 200,
                updateInterval: 25
            },
            barnesHut: {
                gravitationalConstant: -3000,
                centralGravity: 0.5,
                springLength: 100,
                springConstant: 0.04,
                damping: 0.09
            }
        },
        interaction: {
            hover: true,
            tooltipDelay: 100,
            zoomView: true,
            dragView: true
        }
    };
    
    // Create network
    state.networkInstance = new vis.Network(
        container,
        { nodes: new vis.DataSet(visNodes), edges: new vis.DataSet(visEdges) },
        options
    );
    
    // Update statistics
    updateStatistics(data);
    
    // Populate legend
    populateLegend(data.nodes);
    
    // Populate influential nodes
    populateInfluentialNodes(data.nodes);
    
    // Setup control buttons
    setupNetworkControls();
}

/**
 * Update network statistics in the panel
 */
function updateStatistics(data) {
    const nodes = data.nodes;
    const edges = data.edges;
    
    // Count unique communities
    const communities = new Set(nodes.map(n => n.community));
    
    // Calculate average degree
    const degreeMap = {};
    edges.forEach(e => {
        degreeMap[e.source] = (degreeMap[e.source] || 0) + 1;
        degreeMap[e.target] = (degreeMap[e.target] || 0) + 1;
    });
    const avgDegree = Object.values(degreeMap).reduce((a, b) => a + b, 0) / nodes.length;
    
    // Calculate density
    const maxEdges = nodes.length * (nodes.length - 1);
    const density = edges.length / maxEdges;
    
    // Update DOM
    document.getElementById('stat-nodes').textContent = nodes.length;
    document.getElementById('stat-edges').textContent = edges.length;
    document.getElementById('stat-communities').textContent = communities.size;
    document.getElementById('stat-degree').textContent = avgDegree.toFixed(2);
    document.getElementById('stat-density').textContent = density.toFixed(4);
}

/**
 * Populate the genre legend
 */
function populateLegend(nodes) {
    const legendContainer = document.getElementById('legend-items');
    const genres = [...new Set(nodes.map(n => n.genre))].slice(0, 8);
    
    legendContainer.innerHTML = genres.map(genre => `
        <div class="legend-item">
            <span class="legend-color" style="background: ${GENRE_COLORS[genre] || GENRE_COLORS['Other']}"></span>
            <span>${genre}</span>
        </div>
    `).join('');
}

/**
 * Populate the influential nodes list
 */
function populateInfluentialNodes(nodes) {
    const container = document.getElementById('influential-nodes');
    
    // In a real scenario, you'd sort by PageRank or degree centrality
    // For now, just show first 5 nodes
    const topNodes = nodes.slice(0, 5);
    
    container.innerHTML = topNodes.map((node, idx) => `
        <div class="influential-item">
            <span class="influential-rank">${idx + 1}</span>
            <div class="influential-info">
                <div class="influential-title">${node.title}</div>
                <div class="influential-genre">${node.genre}</div>
            </div>
        </div>
    `).join('');
}

/**
 * Setup network control buttons
 */
function setupNetworkControls() {
    // Reset zoom button
    document.getElementById('resetZoom')?.addEventListener('click', () => {
        if (state.networkInstance) {
            state.networkInstance.fit({
                animation: {
                    duration: 500,
                    easingFunction: 'easeInOutQuad'
                }
            });
        }
    });
    
    // Toggle physics button
    document.getElementById('togglePhysics')?.addEventListener('click', () => {
        if (state.networkInstance) {
            state.physicsEnabled = !state.physicsEnabled;
            state.networkInstance.setOptions({
                physics: { enabled: state.physicsEnabled }
            });
        }
    });
}

// ============================================
// INITIALIZATION
// ============================================

function init() {
    // Initialize navigation
    initKeyboardNavigation();
    initClickNavigation();
    
    // Set initial slide
    goToSlide(0);
    
    // Mark first slide as active
    document.querySelector('.slide')?.classList.add('active');
    
    console.log('🚀 Presentation initialized!');
    console.log('📌 Use ← → arrow keys to navigate');
    console.log('📊 Network graph will load on slide 5');
}

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', init);

// ============================================
// COLAB INTEGRATION HELPER
// ============================================

/**
 * Helper function to integrate with Google Colab
 * 
 * In your Colab notebook, you can export the graph data like this:
 * 
 * ```python
 * import networkx as nx
 * import json
 * 
 * # Assuming 'G' is your NetworkX graph with node attributes
 * data = nx.node_link_data(G)
 * 
 * # Add custom attributes if needed
 * for node in data['nodes']:
 *     node['title'] = G.nodes[node['id']].get('title', f"Node {node['id']}")
 *     node['genre'] = G.nodes[node['id']].get('genre', 'Other')
 *     node['community'] = G.nodes[node['id']].get('community', 0)
 * 
 * # Save to JSON
 * with open('graph_data.json', 'w') as f:
 *     json.dump(data, f)
 * 
 * # Download the file
 * from google.colab import files
 * files.download('graph_data.json')
 * ```
 * 
 * Then place the downloaded JSON file in the same folder as index.html
 */
