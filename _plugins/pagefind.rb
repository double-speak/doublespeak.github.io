Jekyll::Hooks.register :site, :post_write do |site|
  system("pagefind --source '_site'")
end