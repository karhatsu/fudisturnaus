json.(tournament, :id, :name, :start_date, :end_date, :days, :location, :address, :match_minutes, :access_key, :results_access_key, :equal_points_rule, :visibility, :club_id, :slug, :cancelled, :info, :test, :premium)
json.club @tournament.club, :logo_url, :name if @tournament.club_id
