class AddFriendlyIdSlugs < ActiveRecord::Migration[7.0]
  def up
    Tournament.all.each do |tournament|
      execute "insert into friendly_id_slugs (slug, sluggable_id, sluggable_type, created_at) values ('#{tournament.slug}', #{tournament.id}, 'Tournament', now())"
    end
  end

  def down
    execute 'delete from friendly_id_slugs'
  end
end
