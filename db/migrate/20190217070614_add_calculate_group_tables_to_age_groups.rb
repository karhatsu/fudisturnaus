class AddCalculateGroupTablesToAgeGroups < ActiveRecord::Migration[5.2]
  def change
    add_column :age_groups, :calculate_group_tables, :boolean, default: false, null: false
  end
end
