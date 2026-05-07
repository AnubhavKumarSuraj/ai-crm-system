import os
from pathlib import Path
from pyvis.network import Network

def create_codebase_graph(root_dir):
    # Initialize an interactive dark-mode graph
    net = Network(height="100vh", width="100%", bgcolor="#1e1e1e", font_color="white", directed=True)
    net.force_atlas_2based()

    root_path = Path(root_dir)
    net.add_node(str(root_path.name), label=root_path.name, color="#ff5722", size=30)

    # Walk through the directories
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Ignore annoying folders
        if any(ignored in dirpath for ignored in ["node_modules", ".git", ".claude", "__pycache__"]):
            continue

        current_dir = Path(dirpath)
        
        # Add folders
        for d in dirnames:
            if d in ["node_modules", ".git", ".claude", "__pycache__"]: continue
            d_path = current_dir / d
            net.add_node(str(d_path), label=d, color="#42a5f5", size=20)
            net.add_edge(str(current_dir.name if current_dir == root_path else current_dir), str(d_path))

        # Add files
        for f in filenames:
            if f.endswith(('.js', '.py', '.html', '.css', '.md', '.sql', '.json')):
                f_path = current_dir / f
                net.add_node(str(f_path), label=f, color="#66bb6a", size=15)
                net.add_edge(str(current_dir.name if current_dir == root_path else current_dir), str(f_path))

    # Generate the HTML file
    output_file = "crm_architecture.html"
    net.show(output_file, notebook=False)
    print(f"✅ Success! Open {output_file} in your web browser to see your interactive graph.")

if __name__ == "__main__":
    create_codebase_graph(".")