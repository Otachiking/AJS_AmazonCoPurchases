import json

# Read graph_data.json
with open('graph_data.json', 'r', encoding='utf-8') as f:
    graph_data = json.load(f)

# Read graph_genre.json  
with open('graph_genre.json', 'r', encoding='utf-8') as f:
    genre_graph = json.load(f)

# Read current data.js
with open('data.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Check if GRAPH_DATA already exists
if 'const GRAPH_DATA' in content:
    print('GRAPH_DATA already exists in data.js')
else:
    # Append GRAPH_DATA and GENRE_GRAPH_DATA to data.js
    with open('data.js', 'a', encoding='utf-8') as f:
        f.write('\n\n// Embedded co-purchase graph data\n')
        f.write('const GRAPH_DATA = ')
        json.dump(graph_data, f, ensure_ascii=False)
        f.write(';\n')
        
        f.write('\n// Embedded genre correlation graph data\n')
        f.write('const GENRE_GRAPH_DATA = ')
        json.dump(genre_graph, f, ensure_ascii=False)
        f.write(';\n')
    
    print('Successfully added GRAPH_DATA and GENRE_GRAPH_DATA to data.js')
    print(f'Graph nodes: {len(graph_data["nodes"])}, edges: {len(graph_data["edges"])}')
    print(f'Genre graph nodes: {len(genre_graph["nodes"])}, edges: {len(genre_graph["edges"])}')
