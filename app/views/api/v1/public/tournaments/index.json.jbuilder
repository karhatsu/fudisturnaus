json.tournaments @tournaments do |tournament|
  json.(tournament, :id, :name, :start_date, :end_date, :dates, :location, :test, :slug, :cancelled)
  json.club tournament.club, :name, :logo_url if tournament.club
end
