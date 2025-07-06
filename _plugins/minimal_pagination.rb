Jekyll::Hooks.register :site, :post_write do |site|
  # Process pagination pages to create minimal versions
  Dir.glob(File.join(site.dest, 'page*/index.html')).each do |file|
    content = File.read(file)
    
    # Extract just the post list items
    if match = content.match(/<ul class="post-list">(.*?)<\/ul>/m)
      post_list_content = match[1]
      
      # Extract pagination info
      pagination_info = ""
      if paginator_match = content.match(/<span class="indicator">\s*(\d+)\/(\d+)\s*<\/span>/)
        pagination_info = "<!--P:#{paginator_match[1]}/#{paginator_match[2]}-->"
      end
      
      # Compact the HTML by removing unnecessary whitespace
      compacted_content = post_list_content
        .gsub(/\n\s*\n/, "\n")           # Remove blank lines
        .gsub(/>\s+</, "><")             # Remove spaces between tags
        .gsub(/\s+/, " ")                # Collapse multiple spaces to single space
        .gsub(/>\s+/, ">")               # Remove spaces after tags
        .gsub(/\s+</, "<")               # Remove spaces before tags
        .gsub(/\s+class=/, " class=")   # Keep single space before attributes
        .gsub(/\s+href=/, " href=")
        .gsub(/\s+<\//, "</")            # Remove spaces before closing tags
        .strip
      
      # Create minimal version with pagination info
      minimal_content = compacted_content + pagination_info
      
      # Save as separate file
      minimal_file = file.sub('.html', '-posts.html')
      File.write(minimal_file, minimal_content)
      
      # Log file size reduction
      original_size = post_list_content.length
      compressed_size = minimal_content.length
      reduction = ((original_size - compressed_size) * 100.0 / original_size).round(1)
      
      puts "Created minimal pagination: #{minimal_file} (#{reduction}% smaller)"
    end
  end
end