json.tournaments @tournaments do |tournament|
  json.(tournament, :id, :name, :start_date, :end_date, :location, :test)
  json.club tournament.club, :logo_url if tournament.club
end
