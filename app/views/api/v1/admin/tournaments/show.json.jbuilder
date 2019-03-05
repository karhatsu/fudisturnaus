json.(@tournament, :id, :name, :start_date, :end_date, :days, :location, :address)

json.age_groups @tournament.age_groups, :id, :name, :calculate_group_tables

json.fields @tournament.fields, :id, :name
