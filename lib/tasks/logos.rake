desc "Fetch logo to local repo: rake 'logo[Team name, https://url.to.the/logo.png]'"
task :logo, [:club_name, :logo_url] => :environment do |t, args|
  club = Club.find_by_name args[:club_name]
  unless club
    puts "Club not found: #{args[:club_name]}"
    return
  end
  puts "Fetching #{args[:logo_url]}..."
  local_file = "public/logos/#{club.name_to_file_name}.png"
  system "curl #{args[:logo_url].gsub('.webp', '.png')} -o #{local_file}"
  club.update_attribute :logo_url, "/logos/#{club.name_to_file_name}.png"
end
