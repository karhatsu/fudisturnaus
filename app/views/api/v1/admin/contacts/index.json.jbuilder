json.contacts @contacts do |contact|
  json.(contact,
    :handled_at,
    :person_name,
    :email,
    :message,
    :tournament_club,
    :tournament_name,
    :tournament_start_date,
    :tournament_days,
    :tournament_location,
    :created_at
  )
end
