json.tournaments @tournaments do |tournament|
  json.(tournament, :id, :name, :start_date, :end_date, :location, :test, :slug, :cancelled)
  json.club tournament.club, :logo_url if tournament.club
end
