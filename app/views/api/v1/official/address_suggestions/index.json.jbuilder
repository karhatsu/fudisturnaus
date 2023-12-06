json.array!(@tournaments) do |tournament|
  json.(tournament, :id, :location, :address)
end
