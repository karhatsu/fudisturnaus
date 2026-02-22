class AddPremiumToContacts < ActiveRecord::Migration[8.1]
  def change
    add_column :contacts, :premium, :boolean
  end
end
