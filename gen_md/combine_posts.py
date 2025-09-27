import os
import re
from datetime import datetime

# Get all markdown files in _posts directory
posts_dir = "_posts"
output_file = "all_posts_combined.md"

# Get all .md files sorted by date
files = []
for filename in os.listdir(posts_dir):
    if filename.endswith(".md"):
        filepath = os.path.join(posts_dir, filename)
        # Extract date from filename (YYYY-MM-DD format)
        date_match = re.match(r"(\d{4}-\d{2}-\d{2})", filename)
        if date_match:
            date_str = date_match.group(1)
            files.append((date_str, filepath, filename))

# Sort by date
files.sort()

# Combine all posts
with open(output_file, "w", encoding="utf-8") as outfile:
    outfile.write("# AlphaCode Blog Posts Collection\n\n")
    outfile.write(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    outfile.write(f"Total posts: {len(files)}\n\n")
    outfile.write("---\n\n")
    
    for date_str, filepath, filename in files:
        print(f"Processing: {filename}")
        
        with open(filepath, "r", encoding="utf-8") as infile:
            content = infile.read()
            
            # Extract title from front matter
            title_match = re.search(r"title:\s*[\"']?([^\"'\n]+)[\"']?", content)
            title = title_match.group(1) if title_match else filename
            
            # Remove front matter (between ---)
            content_parts = content.split("---")
            if len(content_parts) >= 3:
                # Skip first two parts (empty and front matter)
                main_content = "---".join(content_parts[2:]).strip()
            else:
                main_content = content.strip()
            
            # Write to combined file
            outfile.write(f"## [{date_str}] {title}\n\n")
            outfile.write(main_content)
            outfile.write("\n\n---\n\n")

print(f"Combined {len(files)} posts into {output_file}")
