class AddHideGroupTablesToAgeGroups < ActiveRecord::Migration[7.0]
  def change
    add_column :age_groups, :hide_group_tables, :boolean, null: false, default: false
  end
end
