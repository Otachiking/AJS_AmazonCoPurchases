/**
 * ============================================
 * AMAZON CO-PURCHASE NETWORK PRESENTATION
 * JavaScript Controller
 * ============================================
 * 
 * Features:
 * - Horizontal slide navigation (keyboard only: left/right arrows)
 * - Network graph visualization using Vis.js
 * - Community detection visualization
 * - Information diffusion simulation
 * - Integration ready for Google Colab data
 */

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    totalSlides: 11,
    transitionDuration: 600,
    graphDataPath: 'graph_data.json',
    graphDataXPath: 'graph_data_X.json',
    genreDataPath: 'genre_data.json',
    genreCorrelationPath: 'genre_correlation.json'
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
    'Art & International': '#0EA5E9',
    'Religion & Spirituality': '#D946EF',
    'General': '#71717A',
    'Adult': '#BE123C',
    'Travel': '#0D9488',
    'Other': '#94A3B8'
};

// Community colors (distinct palette)
const COMMUNITY_COLORS = [
    '#EF4444', '#F97316', '#F59E0B', '#84CC16', '#22C55E',
    '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6',
    '#6366F1', '#8B5CF6', '#A855F7', '#D946EF', '#EC4899',
    '#F43F5E', '#78716C', '#71717A', '#64748B', '#475569'
];

// ============================================
// STATE
// ============================================

let state = {
    currentSlide: 0,
    networkInstanceA: null,
    networkInstanceB: null,
    communityNetworkInstance: null,
    diffusionNetworkInstance: null,
    genreNetworkInstance: null,
    graphData: null,
    graphDataX: null,
    physicsEnabled: true,
    physicsEnabledA: true,
    physicsEnabledB: true,
    
    // Diffusion state
    selectedSeeds: [],
    diffusionRunning: false,
    activatedNodes: new Set(),
    diffusionStep: 0
};

// ============================================
// SLIDE NAVIGATION
// ============================================

function goToSlide(index) {
    if (index < 0 || index >= CONFIG.totalSlides) return;
    
    state.currentSlide = index;
    
    const wrapper = document.querySelector('.slides-wrapper');
    wrapper.style.transform = `translateX(-${index * 100}vw)`;
    
    document.querySelectorAll('.nav-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    
    document.querySelectorAll('.slide').forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    
    // Initialize graphs based on slide
    if (index === 4 && !state.networkInstanceA) {
        initNetworkGraphA();
    }
    if (index === 5 && !state.networkInstanceB) {
        initNetworkGraphB();
    }
    if (index === 6 && !state.communityNetworkInstance) {
        initCommunityGraph();
    }
    if (index === 7 && state.graphData) {
        populateInfluentialTable();
    }
    if (index === 8 && !state.genreNetworkInstance) {
        initGenreGraph();
    }
    if (index === 9 && !state.diffusionNetworkInstance) {
        initDiffusionGraph();
    }
}

function nextSlide() {
    goToSlide(state.currentSlide + 1);
}

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
            case 'Escape':
                closeModal();
                break;
        }
    });
}

// ============================================
// CLICK NAVIGATION
// ============================================

function initClickNavigation() {
    document.querySelectorAll('.nav-dot').forEach((dot) => {
        dot.addEventListener('click', () => {
            const slideIndex = parseInt(dot.dataset.slide);
            goToSlide(slideIndex);
        });
    });
}

// ============================================
// GRAPH DATA LOADING
// ============================================

async function loadGraphData() {
    try {
        const response = await fetch(CONFIG.graphDataPath);
        if (!response.ok) throw new Error('Graph data not found');
        
        const data = await response.json();
        state.graphData = data;
        return data;
    } catch (error) {
        console.log('Using dummy data. To use real data, export graph_data.json from your Colab notebook.');
        const dummyData = generateDummyData();
        state.graphData = dummyData;
        return dummyData;
    }
}

function generateDummyData() {
    const genres = Object.keys(GENRE_COLORS).slice(0, 8);
    const nodes = [];
    const edges = [];
    
    for (let i = 1; i <= 100; i++) {
        const genre = genres[Math.floor(Math.random() * genres.length)];
        nodes.push({
            id: i,
            title: `Product ${i}`,
            genre: genre,
            community: Math.floor(i / 10)
        });
    }
    
    for (let i = 1; i <= 100; i++) {
        const communityStart = Math.floor((i - 1) / 10) * 10 + 1;
        const target = communityStart + Math.floor(Math.random() * 10);
        if (target !== i && target <= 100) {
            edges.push({ source: i, target: target });
        }
        if (Math.random() > 0.8) {
            const randomTarget = Math.floor(Math.random() * 100) + 1;
            if (randomTarget !== i) {
                edges.push({ source: i, target: randomTarget });
            }
        }
    }
    
    return { nodes, edges };
}

// ============================================
// NETWORK GRAPH A (Slide 5 - graph_data.json)
// ============================================

async function initNetworkGraphA() {
    const container = document.getElementById('network-graph-a');
    if (!container) return;
    
    const data = await loadGraphData();
    
    const visNodes = data.nodes.map(node => ({
        id: node.id,
        label: '',
        title: `${node.title}\nGenre: ${node.genre}\nCommunity: ${node.community}`,
        color: GENRE_COLORS[node.genre] || GENRE_COLORS['Other'],
        group: node.genre,
        value: 1
    }));
    
    const visEdges = data.edges.map((edge, idx) => ({
        id: idx,
        from: edge.source,
        to: edge.target,
        arrows: 'to',
        color: { color: '#CBD5E1', opacity: 0.5 }
    }));
    
    const options = {
        nodes: {
            shape: 'dot',
            size: 8,
            font: { face: 'Plus Jakarta Sans', size: 12, color: '#333' },
            borderWidth: 2,
            borderWidthSelected: 3
        },
        edges: {
            width: 0.5,
            smooth: { type: 'continuous' }
        },
        physics: {
            enabled: true,
            stabilization: { enabled: true, iterations: 200, updateInterval: 25 },
            barnesHut: {
                gravitationalConstant: -3000,
                centralGravity: 0.5,
                springLength: 100,
                springConstant: 0.04,
                damping: 0.09
            }
        },
        interaction: { hover: true, tooltipDelay: 100, zoomView: true, dragView: true }
    };
    
    state.networkInstanceA = new vis.Network(
        container,
        { nodes: new vis.DataSet(visNodes), edges: new vis.DataSet(visEdges) },
        options
    );
    
    updateStatistics(data, 'a');
    populateLegend(data.nodes, 'a');
    populateInfluentialNodes(data.nodes, 'a');
    setupNetworkControlsA();
}

// ============================================
// NETWORK GRAPH B (Slide 6 - graph_data_X.json)
// ============================================

async function initNetworkGraphB() {
    const container = document.getElementById('network-graph-b');
    if (!container) return;
    
    // Load graph_data_X.json
    try {
        const response = await fetch(CONFIG.graphDataXPath);
        if (!response.ok) throw new Error('Failed to load graph_data_X.json');
        state.graphDataX = await response.json();
    } catch (error) {
        console.log('Using graph_data.json as fallback for graph B');
        state.graphDataX = state.graphData;
    }
    
    const data = state.graphDataX;
    
    const visNodes = data.nodes.map(node => ({
        id: node.id,
        label: '',
        title: `${node.title}\nGenre: ${node.genre}\nCommunity: ${node.community}`,
        color: GENRE_COLORS[node.genre] || GENRE_COLORS['Other'],
        group: node.genre,
        value: 1
    }));
    
    const visEdges = data.edges.map((edge, idx) => ({
        id: idx,
        from: edge.source,
        to: edge.target,
        arrows: 'to',
        color: { color: '#CBD5E1', opacity: 0.5 }
    }));
    
    const options = {
        nodes: {
            shape: 'dot',
            size: 8,
            font: { face: 'Plus Jakarta Sans', size: 12, color: '#333' },
            borderWidth: 2,
            borderWidthSelected: 3
        },
        edges: {
            width: 0.5,
            smooth: { type: 'continuous' }
        },
        physics: {
            enabled: true,
            stabilization: { enabled: true, iterations: 200, updateInterval: 25 },
            barnesHut: {
                gravitationalConstant: -3000,
                centralGravity: 0.5,
                springLength: 100,
                springConstant: 0.04,
                damping: 0.09
            }
        },
        interaction: { hover: true, tooltipDelay: 100, zoomView: true, dragView: true }
    };
    
    state.networkInstanceB = new vis.Network(
        container,
        { nodes: new vis.DataSet(visNodes), edges: new vis.DataSet(visEdges) },
        options
    );
    
    updateStatistics(data, 'b');
    populateLegend(data.nodes, 'b');
    populateInfluentialNodes(data.nodes, 'b');
    setupNetworkControlsB();
}

function updateStatistics(data, suffix = '') {
    const nodes = data.nodes;
    const edges = data.edges;
    const communities = new Set(nodes.map(n => n.community));
    
    const degreeMap = {};
    edges.forEach(e => {
        degreeMap[e.source] = (degreeMap[e.source] || 0) + 1;
        degreeMap[e.target] = (degreeMap[e.target] || 0) + 1;
    });
    const avgDegree = Object.values(degreeMap).reduce((a, b) => a + b, 0) / nodes.length;
    const maxEdges = nodes.length * (nodes.length - 1);
    const density = edges.length / maxEdges;
    
    const s = suffix ? `-${suffix}` : '';
    document.getElementById(`stat-nodes${s}`).textContent = nodes.length;
    document.getElementById(`stat-edges${s}`).textContent = edges.length;
    document.getElementById(`stat-communities${s}`).textContent = communities.size;
    document.getElementById(`stat-degree${s}`).textContent = avgDegree.toFixed(2);
    document.getElementById(`stat-density${s}`).textContent = density.toFixed(4);
}

function populateLegend(nodes, suffix = '') {
    const s = suffix ? `-${suffix}` : '';
    const legendContainer = document.getElementById(`legend-items${s}`);
    if (!legendContainer) return;
    
    const genres = [...new Set(nodes.map(n => n.genre))].slice(0, 8);
    
    legendContainer.innerHTML = genres.map(genre => `
        <div class="legend-item">
            <span class="legend-color" style="background: ${GENRE_COLORS[genre] || GENRE_COLORS['Other']}"></span>
            <span>${genre}</span>
        </div>
    `).join('');
}

function populateInfluentialNodes(nodes, suffix = '') {
    const s = suffix ? `-${suffix}` : '';
    const container = document.getElementById(`influential-nodes${s}`);
    if (!container) return;
    
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

function setupNetworkControlsA() {
    document.getElementById('resetZoomA')?.addEventListener('click', () => {
        if (state.networkInstanceA) {
            state.networkInstanceA.fit({ animation: { duration: 500, easingFunction: 'easeInOutQuad' } });
        }
    });
    
    document.getElementById('togglePhysicsA')?.addEventListener('click', () => {
        if (state.networkInstanceA) {
            state.physicsEnabledA = !state.physicsEnabledA;
            state.networkInstanceA.setOptions({ physics: { enabled: state.physicsEnabledA } });
        }
    });
}

function setupNetworkControlsB() {
    document.getElementById('resetZoomB')?.addEventListener('click', () => {
        if (state.networkInstanceB) {
            state.networkInstanceB.fit({ animation: { duration: 500, easingFunction: 'easeInOutQuad' } });
        }
    });
    
    document.getElementById('togglePhysicsB')?.addEventListener('click', () => {
        if (state.networkInstanceB) {
            state.physicsEnabledB = !state.physicsEnabledB;
            state.networkInstanceB.setOptions({ physics: { enabled: state.physicsEnabledB } });
        }
    });
}

// ============================================
// COMMUNITY GRAPH (Slide 6)
// ============================================

async function initCommunityGraph() {
    const container = document.getElementById('community-graph');
    if (!container) return;
    
    if (!state.graphData) {
        await loadGraphData();
    }
    const data = state.graphData;
    
    // Color nodes by community
    const visNodes = data.nodes.map(node => ({
        id: node.id,
        label: '',
        title: `${node.title}\nCommunity: ${node.community}\nGenre: ${node.genre}`,
        color: COMMUNITY_COLORS[node.community % COMMUNITY_COLORS.length],
        group: node.community,
        value: 1
    }));
    
    const visEdges = data.edges.map((edge, idx) => ({
        id: idx,
        from: edge.source,
        to: edge.target,
        arrows: 'to',
        color: { color: '#CBD5E1', opacity: 0.3 }
    }));
    
    const options = {
        nodes: {
            shape: 'dot',
            size: 10,
            font: { face: 'Plus Jakarta Sans', size: 12 },
            borderWidth: 2
        },
        edges: { width: 0.5, smooth: { type: 'continuous' } },
        physics: {
            enabled: true,
            stabilization: { enabled: true, iterations: 200 },
            barnesHut: { gravitationalConstant: -2000, centralGravity: 0.3, springLength: 120 }
        },
        interaction: { hover: true, tooltipDelay: 100 }
    };
    
    state.communityNetworkInstance = new vis.Network(
        container,
        { nodes: new vis.DataSet(visNodes), edges: new vis.DataSet(visEdges) },
        options
    );
    
    setupCommunityControls();
    populateCommunityStats();
}

function setupCommunityControls() {
    document.getElementById('resetCommunityZoom')?.addEventListener('click', () => {
        if (state.communityNetworkInstance) {
            state.communityNetworkInstance.fit({ animation: { duration: 500 } });
        }
    });
    
    document.getElementById('highlightCommunities')?.addEventListener('click', () => {
        if (state.communityNetworkInstance) {
            state.communityNetworkInstance.fit({ animation: { duration: 500 } });
        }
    });
    
    // Modal controls
    document.getElementById('openCommunityStats')?.addEventListener('click', () => {
        document.getElementById('communityModal').classList.add('active');
    });
    
    document.getElementById('closeCommunityModal')?.addEventListener('click', closeModal);
    
    document.getElementById('communityModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'communityModal') closeModal();
    });
}

function closeModal() {
    document.getElementById('communityModal')?.classList.remove('active');
}

function populateCommunityStats() {
    const container = document.getElementById('communityStatsTable');
    if (!container || !state.graphData) return;
    
    // Calculate community stats
    const communityMap = {};
    state.graphData.nodes.forEach(node => {
        if (!communityMap[node.community]) {
            communityMap[node.community] = {
                nodes: [],
                genres: new Set()
            };
        }
        communityMap[node.community].nodes.push(node);
        communityMap[node.community].genres.add(node.genre);
    });
    
    // Calculate degrees
    const degreeMap = {};
    state.graphData.edges.forEach(e => {
        degreeMap[e.source] = (degreeMap[e.source] || 0) + 1;
        degreeMap[e.target] = (degreeMap[e.target] || 0) + 1;
    });
    
    // Sort by node count
    const sortedCommunities = Object.entries(communityMap)
        .map(([id, data]) => ({
            id: parseInt(id),
            nodeCount: data.nodes.length,
            genreCount: data.genres.size,
            nodes: data.nodes
        }))
        .sort((a, b) => b.nodeCount - a.nodeCount)
        .slice(0, 15);
    
    container.innerHTML = sortedCommunities.map(comm => {
        const bestNode = comm.nodes.reduce((best, node) => {
            const deg = degreeMap[node.id] || 0;
            return deg > (degreeMap[best.id] || 0) ? node : best;
        }, comm.nodes[0]);
        
        return `
            <tr>
                <td>${comm.id}</td>
                <td>${comm.nodeCount}</td>
                <td>${comm.genreCount}</td>
                <td title="${bestNode.title}">${bestNode.title.substring(0, 30)}...</td>
                <td>${degreeMap[bestNode.id] || 0}</td>
            </tr>
        `;
    }).join('');
}

// ============================================
// INFLUENTIAL PRODUCTS TABLE (Slide 7)
// ============================================

function populateInfluentialTable() {
    const container = document.getElementById('influentialTable');
    if (!container || !state.graphData) return;
    
    // Calculate degrees
    const degreeMap = {};
    state.graphData.edges.forEach(e => {
        degreeMap[e.source] = (degreeMap[e.source] || 0) + 1;
        degreeMap[e.target] = (degreeMap[e.target] || 0) + 1;
    });
    
    // Sort nodes by degree
    const sortedNodes = state.graphData.nodes
        .map(node => ({
            ...node,
            degree: degreeMap[node.id] || 0,
            pageRank: (Math.random() * 0.01).toFixed(6) // Placeholder
        }))
        .sort((a, b) => b.degree - a.degree)
        .slice(0, 15);
    
    container.innerHTML = sortedNodes.map((node, idx) => `
        <tr>
            <td>${idx + 1}</td>
            <td title="${node.title}">${node.title.substring(0, 35)}${node.title.length > 35 ? '...' : ''}</td>
            <td>${node.genre}</td>
            <td>${node.degree}</td>
            <td>${node.pageRank}</td>
        </tr>
    `).join('');
}

// ============================================
// GENRE CORRELATION GRAPH (Slide 8)
// ============================================

async function initGenreGraph() {
    const container = document.getElementById('genre-graph');
    if (!container) return;
    
    try {
        const response = await fetch(CONFIG.genreCorrelationPath);
        const genreData = await response.json();
        
        // Extract unique genres for nodes
        const genres = new Set();
        genreData.edges.forEach(edge => {
            genres.add(edge.from);
            genres.add(edge.to);
        });
        
        // Calculate degree for each genre (sum of edge weights)
        const genreDegree = {};
        genreData.edges.forEach(edge => {
            genreDegree[edge.from] = (genreDegree[edge.from] || 0) + edge.count;
            genreDegree[edge.to] = (genreDegree[edge.to] || 0) + edge.count;
        });
        
        const maxDegree = Math.max(...Object.values(genreDegree));
        
        // Create nodes
        const visNodes = Array.from(genres).map(genre => ({
            id: genre,
            label: genre.length > 15 ? genre.substring(0, 12) + '...' : genre,
            title: `${genre}\nTotal co-purchases: ${genreDegree[genre] || 0}`,
            color: GENRE_COLORS[genre] || GENRE_COLORS['Other'],
            size: 10 + ((genreDegree[genre] || 0) / maxDegree) * 30,
            font: { size: 10, color: '#333' }
        }));
        
        // Find max count for edge width normalization
        const maxCount = Math.max(...genreData.edges.map(e => e.count));
        
        // Create edges (filter out very low counts)
        const visEdges = genreData.edges
            .filter(edge => edge.count >= 5)
            .map((edge, idx) => ({
                id: idx,
                from: edge.from,
                to: edge.to,
                width: 1 + (edge.count / maxCount) * 8,
                title: `${edge.from} → ${edge.to}: ${edge.count} co-purchases`,
                color: { color: '#94A3B8', opacity: 0.5 + (edge.count / maxCount) * 0.5 }
            }));
        
        const options = {
            nodes: {
                shape: 'dot',
                font: { face: 'Plus Jakarta Sans', size: 10 },
                borderWidth: 2
            },
            edges: {
                smooth: { type: 'continuous' }
            },
            physics: {
                enabled: true,
                stabilization: { enabled: true, iterations: 150 },
                barnesHut: {
                    gravitationalConstant: -2000,
                    centralGravity: 0.5,
                    springLength: 150
                }
            },
            interaction: { hover: true, tooltipDelay: 100 }
        };
        
        state.genreNetworkInstance = new vis.Network(
            container,
            { nodes: new vis.DataSet(visNodes), edges: new vis.DataSet(visEdges) },
            options
        );
        
    } catch (error) {
        console.log('Genre correlation data not found:', error);
        container.innerHTML = '<p style="text-align:center;padding:50px;color:#666">Genre correlation data not available</p>';
    }
}

// ============================================
// DIFFUSION SIMULATION (Slide 9)
// ============================================

async function initDiffusionGraph() {
    const container = document.getElementById('diffusion-graph');
    if (!container) return;
    
    if (!state.graphData) {
        await loadGraphData();
    }
    const data = state.graphData;
    
    const visNodes = data.nodes.map(node => ({
        id: node.id,
        label: '',
        title: `${node.title}\nClick to select as seed`,
        color: { background: '#CBD5E1', border: '#94A3B8' },
        group: 'inactive',
        value: 1
    }));
    
    const visEdges = data.edges.map((edge, idx) => ({
        id: idx,
        from: edge.source,
        to: edge.target,
        arrows: 'to',
        color: { color: '#E2E8F0', opacity: 0.5 }
    }));
    
    const nodesDataSet = new vis.DataSet(visNodes);
    const edgesDataSet = new vis.DataSet(visEdges);
    
    const options = {
        nodes: {
            shape: 'dot',
            size: 12,
            font: { face: 'Plus Jakarta Sans', size: 12 },
            borderWidth: 2
        },
        edges: { width: 0.5, smooth: { type: 'continuous' } },
        physics: {
            enabled: true,
            stabilization: { enabled: true, iterations: 150 },
            barnesHut: { gravitationalConstant: -2500, centralGravity: 0.4, springLength: 100 }
        },
        interaction: { hover: true, tooltipDelay: 100 }
    };
    
    state.diffusionNetworkInstance = new vis.Network(
        container,
        { nodes: nodesDataSet, edges: edgesDataSet },
        options
    );
    
    // Store datasets for manipulation
    state.diffusionNodes = nodesDataSet;
    state.diffusionEdges = edgesDataSet;
    
    // Click to select seeds
    state.diffusionNetworkInstance.on('click', (params) => {
        if (params.nodes.length > 0 && !state.diffusionRunning) {
            const nodeId = params.nodes[0];
            toggleSeed(nodeId);
        }
    });
    
    setupDiffusionControls();
}

function toggleSeed(nodeId) {
    const idx = state.selectedSeeds.indexOf(nodeId);
    
    if (idx > -1) {
        // Remove seed
        state.selectedSeeds.splice(idx, 1);
        state.diffusionNodes.update({
            id: nodeId,
            color: { background: '#CBD5E1', border: '#94A3B8' }
        });
    } else {
        // Add seed
        state.selectedSeeds.push(nodeId);
        state.diffusionNodes.update({
            id: nodeId,
            color: { background: '#10B981', border: '#059669' }
        });
    }
    
    updateSeedList();
    updateDiffusionStats();
}

function updateSeedList() {
    const container = document.getElementById('seedList');
    
    if (state.selectedSeeds.length === 0) {
        container.innerHTML = '<p class="no-seeds">No seeds selected. Click nodes to add.</p>';
    } else {
        const nodeMap = {};
        state.graphData.nodes.forEach(n => nodeMap[n.id] = n);
        
        container.innerHTML = state.selectedSeeds.map(id => {
            const node = nodeMap[id];
            return `
                <span class="seed-tag">
                    ${node ? node.title.substring(0, 15) + '...' : 'Node ' + id}
                    <button class="seed-remove" onclick="toggleSeed(${id})">×</button>
                </span>
            `;
        }).join('');
    }
}

function setupDiffusionControls() {
    // Slider values
    document.getElementById('propProbability')?.addEventListener('input', (e) => {
        document.getElementById('propValue').textContent = e.target.value;
    });
    
    document.getElementById('animSpeed')?.addEventListener('input', (e) => {
        document.getElementById('speedValue').textContent = e.target.value + 'ms';
    });
    
    // Control buttons
    document.getElementById('startDiffusion')?.addEventListener('click', startDiffusion);
    document.getElementById('resetDiffusion')?.addEventListener('click', resetDiffusion);
    document.getElementById('clearSeeds')?.addEventListener('click', clearSeeds);
}

function clearSeeds() {
    state.selectedSeeds.forEach(id => {
        state.diffusionNodes.update({
            id: id,
            color: { background: '#CBD5E1', border: '#94A3B8' }
        });
    });
    state.selectedSeeds = [];
    updateSeedList();
    updateDiffusionStats();
}

function resetDiffusion() {
    state.diffusionRunning = false;
    state.activatedNodes = new Set();
    state.diffusionStep = 0;
    
    // Reset all nodes except seeds
    state.graphData.nodes.forEach(node => {
        const isSeed = state.selectedSeeds.includes(node.id);
        state.diffusionNodes.update({
            id: node.id,
            color: isSeed 
                ? { background: '#10B981', border: '#059669' }
                : { background: '#CBD5E1', border: '#94A3B8' }
        });
    });
    
    updateDiffusionStats();
}

async function startDiffusion() {
    if (state.selectedSeeds.length === 0) {
        alert('Please select at least one seed node by clicking on the graph!');
        return;
    }
    
    if (state.diffusionRunning) return;
    state.diffusionRunning = true;
    
    const probability = parseFloat(document.getElementById('propProbability').value);
    const speed = parseInt(document.getElementById('animSpeed').value);
    
    // Build adjacency list
    const adjacency = {};
    state.graphData.edges.forEach(e => {
        if (!adjacency[e.source]) adjacency[e.source] = [];
        adjacency[e.source].push(e.target);
    });
    
    // Initialize with seeds
    state.activatedNodes = new Set(state.selectedSeeds);
    let frontier = [...state.selectedSeeds];
    state.diffusionStep = 0;
    
    while (frontier.length > 0 && state.diffusionRunning) {
        state.diffusionStep++;
        const newFrontier = [];
        
        for (const nodeId of frontier) {
            const neighbors = adjacency[nodeId] || [];
            
            for (const neighbor of neighbors) {
                if (!state.activatedNodes.has(neighbor) && Math.random() < probability) {
                    state.activatedNodes.add(neighbor);
                    newFrontier.push(neighbor);
                    
                    // Animate activation
                    state.diffusionNodes.update({
                        id: neighbor,
                        color: { background: '#F59E0B', border: '#D97706' }
                    });
                }
            }
        }
        
        frontier = newFrontier;
        updateDiffusionStats();
        
        // Wait for animation
        await new Promise(resolve => setTimeout(resolve, speed));
    }
    
    state.diffusionRunning = false;
}

function updateDiffusionStats() {
    document.getElementById('diffSeeds').textContent = state.selectedSeeds.length;
    document.getElementById('diffActivated').textContent = state.activatedNodes.size;
    
    const total = state.graphData ? state.graphData.nodes.length : 0;
    const reach = total > 0 ? ((state.activatedNodes.size / total) * 100).toFixed(1) : 0;
    document.getElementById('diffReach').textContent = reach + '%';
    document.getElementById('diffSteps').textContent = state.diffusionStep;
}

// ============================================
// INITIALIZATION
// ============================================

function init() {
    initKeyboardNavigation();
    initClickNavigation();
    goToSlide(0);
    document.querySelector('.slide')?.classList.add('active');
    
    console.log('🚀 Presentation initialized!');
    console.log('📌 Use ← → arrow keys to navigate');
    console.log('📊 10 slides available');
}

document.addEventListener('DOMContentLoaded', init);

// Make toggleSeed global for onclick
window.toggleSeed = toggleSeed;
