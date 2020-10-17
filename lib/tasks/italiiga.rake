task :italiiga => :environment do
  DATA = <<-HEREDOC
P14;2020-11-21,2021-04-10
T12-13;2020-11-14,2020-12-12,2021-01-23,2021-02-13,2021-03-13,2021-04-03
P13;2020-11-07,2020-12-05,2021-01-16,2021-02-06,2021-02-27,2021-03-27
P12;2020-11-28,2021-01-09,2021-01-30,2021-02-20,2021-03-20
T11;2020-11-14,2021-01-23,2021-02-13,2021-03-13
T10;2020-11-21,2021-01-09,2021-03-20
P11;2020-10-31,2020-11-28,2021-01-16,2021-02-27,2021-03-27
P10;2020-11-07,2020-05-12,2021-01-30,2021-02-20,2021-04-03
P09;2020-12-12,2021-02-06,2021-04-10
HEREDOC
  kontu = Club.find_by_name 'FC Kontu'
  raise 'No Kontu!' unless kontu
  log = []
  location = 'Jakomäki-Areena'
  address = 'Huokotie 5, 00770 Helsinki'
  match_minutes = 30
  domain = Rails.env.development? ? 'http://localhost:3002' : 'https://www.fudisturnaus.com'
  DATA.split("\n").each do |line|
    age_group = line.strip.split(';')[0]
    dates = line.strip.split(';')[1].split(',')
    log << age_group
    dates.each do |date|
      month = date[5, 2]
      year = date[2, 2]
      name = "Itäliiga #{age_group} #{month}/#{year}"
      t = Tournament.create! club: kontu, start_date: date, days: 1, name: name, location: location,
                             address: address, match_minutes: match_minutes, visibility: Tournament::VISIBILITY_TEAMS
      log << "#{t.name}, #{date}"
      log << "#{domain}/official/#{t.access_key}"
    end
    log << ''
  end

  message = log.join("\n")
  p message
  ContactMailer.system_email('Itäliiga', message).deliver_now
end
