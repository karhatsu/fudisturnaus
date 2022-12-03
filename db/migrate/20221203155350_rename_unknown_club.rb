class RenameUnknownClub < ActiveRecord::Migration[7.0]
  def change
    Club.find_by_name('- Tuntematon -').update_attribute(:name, '- Ei virallista seuraa -')
  end
end
