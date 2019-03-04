json.(@tournament, :id, :name, :start_date, :end_date, :days, :location, :address, :calculate_group_tables)

json.age_groups @tournament.age_groups, :id, :name

json.fields @tournament.fields, :id, :name
